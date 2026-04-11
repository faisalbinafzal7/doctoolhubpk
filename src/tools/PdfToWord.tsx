import React from 'react';
import * as pdfjs from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { Upload, File as FileIcon, Download, RefreshCw, AlertCircle, CheckCircle, Trash2, Zap, Shield, List, Copy, FileText, X } from 'lucide-react';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export default function PdfToWord() {
  const [file, setFile] = React.useState<File | null>(null);
  const [numPages, setNumPages] = React.useState(0);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [pageRange, setPageRange] = React.useState<'all' | 'custom'>('all');
  const [customRange, setCustomRange] = React.useState('');
  const [formatting, setFormatting] = React.useState<'basic' | 'simple'>('basic');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [convertedBlob, setConvertedBlob] = React.useState<Blob | null>(null);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setError('❌ Invalid file type. Please select a PDF document.');
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError(`❌ File too large (max 50MB). Current: ${formatBytes(selectedFile.size)}`);
        return;
      }

      try {
        setError(null);
        setSuccess(false);
        setConvertedBlob(null);
        const arrayBuffer = await selectedFile.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        setNumPages(pdf.numPages);
        setFile(selectedFile);
        setError(null);
      } catch (err: any) {
        console.error('Error loading PDF:', err);
        setError(`❌ Failed to load PDF: ${err.message}`);
      }
    }
  };

  const parsePageRange = (input: string, maxPage: number) => {
    if (!input.trim()) return [];
    const parts = input.split(',').map(s => s.trim());
    const pages = new Set<number>();
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= maxPage && start <= end) {
          for (let i = start; i <= end; i++) pages.add(i);
        }
      } else {
        const page = Number(part);
        if (!isNaN(page) && page >= 1 && page <= maxPage) {
          pages.add(page);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const convertToWord = async () => {
    if (!file) return;

    let pageNumbers: number[] = [];
    if (pageRange === 'all') {
      pageNumbers = Array.from({ length: numPages }, (_, i) => i + 1);
    } else {
      if (!customRange.trim()) {
        setError('❌ Please enter a custom page range.');
        return;
      }
      pageNumbers = parsePageRange(customRange, numPages);
      if (pageNumbers.length === 0) {
        setError('❌ Invalid page range. Please use format like: 1-3,5,7-9');
        return;
      }
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      for (const pageNum of pageNumbers) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
        
        if (formatting === 'basic') {
          fullText += `\n\n--- Page ${pageNum} ---\n\n${pageText}`;
        } else {
          fullText += pageText + '\n\n';
        }
      }

      const trimmedText = fullText.trim();
      if (!trimmedText) {
        throw new Error('No text could be extracted from this PDF. It may be a scanned image.');
      }

      // Generate DOCX using docx library
      const paragraphs = trimmedText.split(/\n\n+/);
      const docChildren = paragraphs.map(para => {
        if (para.match(/^--- Page \d+ ---$/)) {
          return new Paragraph({
            children: [new TextRun({ text: para, bold: true })],
            spacing: { before: 400, after: 200 }
          });
        } else {
          return new Paragraph({
            children: [new TextRun(para)],
            spacing: { after: 200 }
          });
        }
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: docChildren,
        }],
      });

      const blob = await Packer.toBlob(doc);
      setConvertedBlob(blob);
      setSuccess(true);
    } catch (err: any) {
      console.error('Conversion error:', err);
      setError(`❌ Conversion failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadDocx = () => {
    if (!convertedBlob) return;
    const url = URL.createObjectURL(convertedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file?.name.replace(/\.pdf$/i, '')}.docx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setNumPages(0);
    setConvertedBlob(null);
    setPageRange('all');
    setCustomRange('');
    setFormatting('basic');
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white premium-card rounded-3xl border border-gray-200/70 p-6 md:p-8 mb-12 shadow-sm w-full">
        {/* UPLOAD AREA */}
        {!file ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-[#0274be] transition bg-gray-50/20 mb-6 relative">
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
            <div className="flex flex-col items-center gap-2">
              <div className="bg-blue-50 p-3 rounded-full">
                <Upload className="h-7 w-7 text-[#0274be]" />
              </div>
              <p className="text-lg font-medium text-gray-800">Drag & drop PDF or <span className="text-[#0274be] underline underline-offset-2 font-semibold">browse</span></p>
              <p className="text-sm text-gray-500">Upload a PDF to convert to Word • max 50MB</p>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-3 truncate">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FileIcon className="h-5 w-5 text-[#0274be]" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800 truncate max-w-[200px] md:max-w-xs">{file.name}</p>
                  <p className="text-xs text-gray-500">{numPages} pages • {formatBytes(file.size)}</p>
                </div>
              </div>
              <button 
                onClick={reset}
                className="text-gray-500 hover:text-[#0274be] bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition"
              >
                <X className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        )}

        {/* CONTROLS */}
        {file && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Page range</label>
                <select 
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value as 'all' | 'custom')}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#0274be] focus:border-[#0274be] outline-none bg-white"
                >
                  <option value="all">All pages</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>
              {pageRange === 'custom' && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Custom pages (e.g., 1-3,5,7-9)</label>
                  <input 
                    type="text" 
                    value={customRange}
                    onChange={(e) => setCustomRange(e.target.value)}
                    placeholder="1-3,5,7-9" 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#0274be] focus:border-[#0274be] outline-none" 
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Preserve formatting</label>
                <select 
                  value={formatting}
                  onChange={(e) => setFormatting(e.target.value as 'basic' | 'simple')}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#0274be] focus:border-[#0274be] outline-none bg-white"
                >
                  <option value="basic">Basic (paragraphs preserved)</option>
                  <option value="simple">Simple (plain text)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={convertToWord}
                disabled={isProcessing}
                className="bg-[#0274be] text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 flex-1"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5" />
                    <span>Convert to Word</span>
                  </>
                )}
              </button>
              <button 
                onClick={downloadDocx}
                disabled={!convertedBlob || isProcessing}
                className="bg-white border-2 border-[#0274be] text-[#0274be] font-semibold px-6 py-3.5 rounded-xl hover:bg-[#0274be]/5 transition disabled:opacity-40 disabled:border-gray-300 disabled:text-gray-400 flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                <Download className="h-5 w-5" />
                Download DOCX
              </button>
            </div>
          </div>
        )}

        {/* STATUS */}
        {(error || success) && (
          <div className={`mt-5 text-sm p-3 rounded-xl flex items-center gap-2 ${error?.startsWith('❌') || error?.startsWith('⚠️') ? 'bg-red-100 text-red-700' : success ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {success ? <CheckCircle className="h-5 w-5" /> : error?.startsWith('❌') ? <AlertCircle className="h-5 w-5" /> : null}
            <span>{success ? `✅ Conversion complete! Click Download DOCX.` : error}</span>
          </div>
        )}
      </div>

      <div className="bg-white py-10 border-t border-gray-100 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Why choose DocToolHubPK?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-[#0274be]" />}
            title="Fast conversion"
            description="Convert PDF to Word in seconds, client‑side."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="Accurate extraction"
            description="Preserves text layout and paragraph structure."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your PDF stays on your device."
          />
          <FeatureCard 
            icon={<FileText className="h-6 w-6 text-[#0274be]" />}
            title="Editable output"
            description="Resulting DOCX is fully editable in Microsoft Word."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
