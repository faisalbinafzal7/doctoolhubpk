import React from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Upload, File as FileIcon, Scissors, Download, RefreshCw, AlertCircle, CheckCircle, Trash2, Zap, Shield, FileText, List } from 'lucide-react';

interface SplitResult {
  name: string;
  blob: Blob;
  url: string;
  pageRange: string;
}

export default function SplitPdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [numPages, setNumPages] = React.useState(0);
  const [splitMode, setSplitMode] = React.useState<'every' | 'single' | 'multi'>('every');
  const [singleRange, setSingleRange] = React.useState('');
  const [multiRange, setMultiRange] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [results, setResults] = React.useState<SplitResult[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File too large (max 50MB).');
        return;
      }
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        setNumPages(pdf.getPageCount());
        setFile(selectedFile);
        setError(null);
        setSuccess(false);
        setResults([]);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF. It might be corrupted or password-protected.');
      }
    } else if (selectedFile) {
      setError('Please select a valid PDF file.');
    }
  };

  const parseRanges = (input: string, maxPage: number): number[][] => {
    if (!input.trim()) return [];
    const parts = input.split(',').map(s => s.trim());
    const ranges: number[][] = [];
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= maxPage && start <= end) {
          const pages = [];
          for (let i = start; i <= end; i++) pages.push(i);
          ranges.push(pages);
        }
      } else {
        const page = Number(part);
        if (!isNaN(page) && page >= 1 && page <= maxPage) {
          ranges.push([page]);
        }
      }
    }
    return ranges;
  };

  const splitPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    
    // Revoke old URLs
    results.forEach(res => URL.revokeObjectURL(res.url));
    setResults([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const splitResults: SplitResult[] = [];

      if (splitMode === 'every') {
        for (let i = 0; i < numPages; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
          newPdf.addPage(copiedPage);
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          splitResults.push({
            name: `page_${i + 1}.pdf`,
            blob,
            url,
            pageRange: `${i + 1}`
          });
        }
      } else {
        const rangeInput = splitMode === 'single' ? singleRange : multiRange;
        const ranges = parseRanges(rangeInput, numPages);
        
        if (ranges.length === 0) {
          throw new Error('Please enter a valid page range.');
        }

        for (let idx = 0; idx < ranges.length; idx++) {
          const pageNumbers = ranges[idx];
          const newPdf = await PDFDocument.create();
          const copiedPages = await newPdf.copyPages(originalPdf, pageNumbers.map(p => p - 1));
          copiedPages.forEach(page => newPdf.addPage(page));
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const rangeStr = pageNumbers.length === 1 ? `${pageNumbers[0]}` : `${pageNumbers[0]}-${pageNumbers[pageNumbers.length - 1]}`;
          const url = URL.createObjectURL(blob);
          splitResults.push({
            name: `range_${rangeStr}.pdf`,
            blob,
            url,
            pageRange: rangeStr
          });
        }
      }

      setResults(splitResults);
      setSuccess(true);
    } catch (err: any) {
      console.error('Split error:', err);
      setError(err.message || 'Failed to split PDF. Please check your page ranges.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAllAsZip = async () => {
    if (results.length === 0) return;
    const zip = new JSZip();
    results.forEach(item => {
      zip.file(item.name, item.blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = 'split_pdfs.zip';
    a.click();
    URL.revokeObjectURL(zipUrl);
  };

  const reset = () => {
    results.forEach(res => URL.revokeObjectURL(res.url));
    setFile(null);
    setNumPages(0);
    setResults([]);
    setSuccess(false);
    setError(null);
    setSingleRange('');
    setMultiRange('');
    setSplitMode('every');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm w-full">
        {!file ? (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center cursor-pointer hover:border-[#0274be] transition bg-slate-50/20 relative">
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
            <div className="flex flex-col items-center gap-4">
              <div className="bg-blue-50 p-4 rounded-full">
                <Upload className="w-8 h-8 text-[#0274be]" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">Drag & drop PDF or <span className="text-[#0274be] underline underline-offset-2">browse</span></p>
                <p className="text-sm text-slate-500 mt-1">Upload a PDF to split • max 50MB</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* FILE INFO */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-4 truncate">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FileIcon className="w-6 h-6 text-[#0274be]" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 truncate max-w-[200px] md:max-w-xs">{file.name}</p>
                  <p className="text-xs text-slate-500">{numPages} pages • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={reset} 
                className="text-slate-500 hover:text-red-500 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition"
              >
                <Trash2 className="w-4 h-4" />
                Reset
              </button>
            </div>

            {/* SPLIT MODES */}
            <div className="space-y-4">
              <span className="text-sm font-bold text-slate-700 block">Split mode</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  onClick={() => setSplitMode('every')}
                  className={`flex items-start p-4 border-2 rounded-2xl transition cursor-pointer ${splitMode === 'every' ? 'border-[#0274be] bg-blue-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}
                >
                  <input type="radio" checked={splitMode === 'every'} readOnly className="mt-1 mr-3 accent-[#0274be]" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Split every page</p>
                    <p className="text-xs text-slate-500 mt-1">Each page becomes a separate PDF</p>
                  </div>
                </div>

                <div 
                  onClick={() => setSplitMode('single')}
                  className={`flex flex-col p-4 border-2 rounded-2xl transition cursor-pointer ${splitMode === 'single' ? 'border-[#0274be] bg-blue-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}
                >
                  <div className="flex items-start">
                    <input type="radio" checked={splitMode === 'single'} readOnly className="mt-1 mr-3 accent-[#0274be]" />
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Extract specific pages</p>
                      <p className="text-xs text-slate-500 mt-1">One PDF from page range</p>
                    </div>
                  </div>
                  {splitMode === 'single' && (
                    <input 
                      type="text" 
                      placeholder="e.g. 1-3,5" 
                      value={singleRange}
                      onChange={(e) => setSingleRange(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0274be] outline-none font-medium"
                    />
                  )}
                </div>

                <div 
                  onClick={() => setSplitMode('multi')}
                  className={`flex flex-col p-4 border-2 rounded-2xl transition cursor-pointer ${splitMode === 'multi' ? 'border-[#0274be] bg-blue-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}
                >
                  <div className="flex items-start">
                    <input type="radio" checked={splitMode === 'multi'} readOnly className="mt-1 mr-3 accent-[#0274be]" />
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Custom page ranges</p>
                      <p className="text-xs text-slate-500 mt-1">Each range = separate PDF</p>
                    </div>
                  </div>
                  {splitMode === 'multi' && (
                    <input 
                      type="text" 
                      placeholder="e.g. 1-2,4,6-8" 
                      value={multiRange}
                      onChange={(e) => setMultiRange(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0274be] outline-none font-medium"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={splitPdf}
                disabled={isProcessing}
                className="bg-[#0274be] text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-[#02609e] transition-all flex items-center justify-center gap-3 flex-1 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Splitting PDF...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5" />
                    <span>Split PDF</span>
                  </>
                )}
              </button>
              {results.length > 0 && (
                <button 
                  onClick={downloadAllAsZip}
                  className="bg-white border-2 border-[#0274be] text-[#0274be] font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 flex-1"
                >
                  <Download className="w-5 h-5" />
                  <span>Download all ZIP</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* RESULTS LIST */}
        {results.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <List className="w-5 h-5 text-[#0274be]" />
                Split PDFs ({results.length})
              </h3>
            </div>
            <div className="bg-slate-50/50 rounded-2xl border border-slate-200 p-2 max-h-[300px] overflow-y-auto space-y-2">
              {results.map((res, i) => (
                <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:border-[#0274be]/30 transition group">
                  <div className="flex items-center space-x-3 truncate">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <FileText className="w-4 h-4 text-[#0274be]" />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-slate-800 text-sm truncate">{res.name}</p>
                      <p className="text-[10px] text-slate-500">Pages: {res.pageRange}</p>
                    </div>
                  </div>
                  <a 
                    href={res.url} 
                    download={res.name}
                    className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#0274be] hover:text-white transition flex items-center gap-2"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATUS */}
        {(error || success) && (
          <div className={`mt-6 p-4 rounded-2xl flex items-start gap-3 text-sm ${error ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
            {error ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            <p className="font-medium">{error || `Split complete! ${results.length} PDF files generated.`}</p>
          </div>
        )}
      </div>

      <div className="bg-white py-12 border-t border-slate-100 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-12">Why choose DocToolHubPK?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-[#0274be]" />}
            title="Flexible splitting"
            description="Split by every page, custom ranges, or extract specific pages."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your PDF stays on your device."
          />
          <FeatureCard 
            icon={<CheckCircle className="w-6 h-6 text-[#0274be]" />}
            title="Preserve quality"
            description="Original PDF quality maintained in every split file."
          />
          <FeatureCard 
            icon={<RefreshCw className="w-6 h-6 text-[#0274be]" />}
            title="Fast processing"
            description="Client-side splitting, instant download."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
      <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
