import React from 'react';
import { Upload, File as FileIcon, Download, RefreshCw, AlertCircle, CheckCircle, Trash2, Zap, Shield, FileSpreadsheet, Table, Layout, X } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PdfToExcel() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [excelBlob, setExcelBlob] = React.useState<Blob | null>(null);
  const [numPages, setNumPages] = React.useState(0);
  const [pdfDoc, setPdfDoc] = React.useState<any>(null);

  // Options
  const [extractionMode, setExtractionMode] = React.useState<'text' | 'pages' | 'combined'>('text');
  const [sheetName, setSheetName] = React.useState('PDF Data');
  const [includePageNumbers, setIncludePageNumbers] = React.useState(true);

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
      if (selectedFile.type !== 'application/pdf') {
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
        setExcelBlob(null);
        
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        setFile(selectedFile);
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
      } catch (err: any) {
        console.error('Error loading PDF:', err);
        setError(`❌ Failed to load PDF: ${err.message}`);
      }
    }
  };

  const extractPageText = async (pdf: any, pageNum: number) => {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    return textContent.items.map((item: any) => item.str).join(' ').trim();
  };

  const convertToExcel = async () => {
    if (!pdfDoc || !file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const pageTexts = [];
      for (let i = 1; i <= numPages; i++) {
        const text = await extractPageText(pdfDoc, i);
        pageTexts.push({
          pageNum: i,
          text: text || `[Page ${i} - No extractable text]`
        });
      }

      const workbook = XLSX.utils.book_new();
      const baseSheetName = sheetName.trim() || 'PDF Data';
      
      if (extractionMode === 'text') {
        const allText = pageTexts.map(p => p.text).join('\n\n');
        const paragraphs = allText.split(/\n+/).filter(p => p.trim().length > 0);
        const sheetData = paragraphs.map((p, idx) => [idx + 1, p]);
        const worksheet = XLSX.utils.aoa_to_sheet([['Line #', 'Content'], ...sheetData]);
        XLSX.utils.book_append_sheet(workbook, worksheet, baseSheetName.substring(0, 31));
      } 
      else if (extractionMode === 'pages') {
        for (const page of pageTexts) {
          const paragraphs = page.text.split(/\n+/).filter(p => p.trim().length > 0);
          let sheetData;
          if (includePageNumbers) {
            sheetData = [['Page', page.pageNum], ['Line #', 'Content'], ...paragraphs.map((p, idx) => [idx + 1, p])];
          } else {
            sheetData = [['Line #', 'Content'], ...paragraphs.map((p, idx) => [idx + 1, p])];
          }
          const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
          const sName = `${baseSheetName}_Page${page.pageNum}`.substring(0, 31);
          XLSX.utils.book_append_sheet(workbook, worksheet, sName);
        }
      }
      else if (extractionMode === 'combined') {
        let allRows: any[][] = [];
        if (includePageNumbers) {
          allRows.push(['Page', 'Line #', 'Content']);
        } else {
          allRows.push(['Line #', 'Content']);
        }
        
        let lineCounter = 1;
        for (const page of pageTexts) {
          const paragraphs = page.text.split(/\n+/).filter(p => p.trim().length > 0);
          if (paragraphs.length > 0) {
            for (const p of paragraphs) {
              if (includePageNumbers) {
                allRows.push([page.pageNum, lineCounter++, p]);
              } else {
                allRows.push([lineCounter++, p]);
              }
            }
          }
        }
        const worksheet = XLSX.utils.aoa_to_sheet(allRows);
        XLSX.utils.book_append_sheet(workbook, worksheet, baseSheetName.substring(0, 31));
      }

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      setExcelBlob(blob);
      setSuccess(true);
    } catch (err: any) {
      console.error('Conversion error:', err);
      setError(`❌ Conversion failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadExcel = () => {
    if (!excelBlob || !file) return;
    const url = URL.createObjectURL(excelBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name.replace(/\.pdf$/i, '') + '.xlsx';
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setPdfDoc(null);
    setNumPages(0);
    setExcelBlob(null);
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white premium-card rounded-3xl border border-gray-200/70 p-6 md:p-8 mb-12 shadow-sm w-full">
        {/* UPLOAD AREA */}
        {!file ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-[#0274be] transition bg-gray-50/20 mb-6 relative">
            <input 
              type="file" 
              accept=".pdf,application/pdf" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
            <div className="flex flex-col items-center gap-2">
              <div className="bg-blue-50 p-3 rounded-full">
                <Upload className="h-7 w-7 text-[#0274be]" />
              </div>
              <p className="text-lg font-medium text-gray-800">Drag & drop PDF or <span className="text-[#0274be] underline underline-offset-2 font-semibold">browse</span></p>
              <p className="text-sm text-gray-500">Upload a PDF to convert to Excel • max 50MB</p>
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
                <label className="text-sm font-medium text-gray-700 block mb-2">Extraction mode</label>
                <select 
                  value={extractionMode}
                  onChange={(e) => setExtractionMode(e.target.value as any)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#0274be] focus:border-[#0274be] outline-none bg-white"
                >
                  <option value="text">Extract all text (paragraphs as rows)</option>
                  <option value="pages">One sheet per page</option>
                  <option value="combined">Combined (all pages in one sheet)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Sheet name</label>
                <input 
                  type="text" 
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  placeholder="PDF Data"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#0274be] focus:border-[#0274be] outline-none" 
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includePageNumbers}
                  onChange={(e) => setIncludePageNumbers(e.target.checked)}
                  className="rounded border-gray-300 text-[#0274be] focus:ring-[#0274be]" 
                />
                Include page numbers in extracted content
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={convertToExcel}
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
                    <span>Convert to Excel</span>
                  </>
                )}
              </button>
              <button 
                onClick={downloadExcel}
                disabled={!excelBlob || isProcessing}
                className="bg-white border-2 border-[#0274be] text-[#0274be] font-semibold px-6 py-3.5 rounded-xl hover:bg-[#0274be]/5 transition disabled:opacity-40 disabled:border-gray-300 disabled:text-gray-400 flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                <Download className="h-5 w-5" />
                Download XLSX
              </button>
            </div>
          </div>
        )}

        {/* STATUS */}
        {(error || success) && (
          <div className={`mt-5 text-sm p-3 rounded-xl flex items-center gap-2 ${error?.startsWith('❌') || error?.startsWith('⚠️') ? 'bg-red-100 text-red-700' : success ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {success ? <CheckCircle className="h-5 w-5" /> : error?.startsWith('❌') ? <AlertCircle className="h-5 w-5" /> : null}
            <span>{success ? `✅ Conversion complete! Click Download XLSX.` : error}</span>
          </div>
        )}
      </div>

      <div className="bg-white py-10 border-t border-gray-100 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Why choose DocToolHubPK?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-[#0274be]" />}
            title="Smart extraction"
            description="Extract text and data from PDF with intelligent parsing."
          />
          <FeatureCard 
            icon={<Layout className="h-6 w-6 text-[#0274be]" />}
            title="Preserve structure"
            description="Maintains page hierarchy and text organization."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your PDF stays on your device."
          />
          <FeatureCard 
            icon={<FileSpreadsheet className="h-6 w-6 text-[#0274be]" />}
            title="Browser‑based"
            description="Works offline, no installation required."
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
