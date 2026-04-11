import React from 'react';
import { Upload, File as FileIcon, Download, RefreshCw, AlertCircle, CheckCircle, Trash2, Zap, Shield, Settings, X } from 'lucide-react';
import mammoth from 'mammoth';
import html2pdf from 'html2pdf.js';

export default function WordToPdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [convertedBlob, setConvertedBlob] = React.useState<Blob | null>(null);
  const [extractedHtml, setExtractedHtml] = React.useState<string | null>(null);
  
  const [pageSize, setPageSize] = React.useState('a4');
  const [orientation, setOrientation] = React.useState('portrait');
  const [preserveFormatting, setPreserveFormatting] = React.useState(true);

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
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (!['doc', 'docx'].includes(extension || '')) {
        setError('❌ Unsupported file type. Please upload a Word document (.doc or .docx).');
        return;
      }
      if (selectedFile.size > 15 * 1024 * 1024) {
        setError(`❌ File too large (max 15MB). Current: ${formatBytes(selectedFile.size)}`);
        return;
      }

      try {
        setError(null);
        setSuccess(false);
        setConvertedBlob(null);
        setFile(selectedFile);
        
        // Initial extraction for preview/readiness
        await processFile(selectedFile, preserveFormatting);
        setError(null);
      } catch (err: any) {
        console.error('Error loading document:', err);
        setError(`❌ Failed to read document: ${err.message}`);
      }
    }
  };

  const processFile = async (selectedFile: File, preserve: boolean) => {
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    let htmlContent = '';
    
    if (extension === 'docx') {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const options = {
        styleMap: preserve ? [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "r[style-name='Strong'] => strong",
          "r[style-name='Emphasis'] => em"
        ] : []
      };
      const result = await mammoth.convertToHtml({ arrayBuffer }, options);
      htmlContent = result.value;
    } else {
      // .doc fallback - simple text extraction
      htmlContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const paragraphs = text.split(/\r?\n/).filter(p => p.trim().length > 0);
          const html = paragraphs.map(p => `<p>${p.substring(0, 500)}</p>`).join('');
          resolve(html || '<p>Document content extracted (limited formatting).</p>');
        };
        reader.onerror = reject;
        reader.readAsText(selectedFile, 'UTF-8');
      });
    }
    setExtractedHtml(htmlContent);
    return htmlContent;
  };

  const convertToPdf = async () => {
    if (!file || !extractedHtml) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      // Re-extract if settings changed
      const currentHtml = await processFile(file, preserveFormatting);

      const container = document.createElement('div');
      container.style.padding = '40px';
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.lineHeight = '1.5';
      container.style.backgroundColor = 'white';
      container.innerHTML = currentHtml;
      
      const style = document.createElement('style');
      style.textContent = `
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.5; }
        h1 { font-size: 24px; margin-top: 20px; margin-bottom: 10px; }
        h2 { font-size: 20px; margin-top: 16px; margin-bottom: 8px; }
        h3 { font-size: 18px; margin-top: 14px; margin-bottom: 6px; }
        p { margin-bottom: 10px; }
        ul, ol { margin-left: 20px; margin-bottom: 10px; }
        li { margin-bottom: 5px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      `;
      container.appendChild(style);

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: file.name.replace(/\.(doc|docx)$/i, '.pdf'),
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in' as const, format: pageSize, orientation: orientation as 'portrait' | 'landscape' }
      };

      const pdfBlob = await html2pdf().set(opt).from(container).outputPdf('blob');
      setConvertedBlob(pdfBlob);
      setSuccess(true);
    } catch (err: any) {
      console.error('Conversion error:', err);
      setError(`❌ Conversion failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!convertedBlob || !file) return;
    const url = URL.createObjectURL(convertedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name.replace(/\.(doc|docx)$/i, '.pdf');
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setConvertedBlob(null);
    setExtractedHtml(null);
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
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
            <div className="flex flex-col items-center gap-2">
              <div className="bg-blue-50 p-3 rounded-full">
                <Upload className="h-7 w-7 text-[#0274be]" />
              </div>
              <p className="text-lg font-medium text-gray-800">Drag & drop Word document or <span className="text-[#0274be] underline underline-offset-2 font-semibold">browse</span></p>
              <p className="text-sm text-gray-500">Supports .DOC and .DOCX • max 15MB</p>
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
                  <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
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
                <label className="text-sm font-medium text-gray-700 block mb-2">Page size</label>
                <select 
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#0274be] focus:border-[#0274be] outline-none bg-white"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Orientation</label>
                <select 
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#0274be] focus:border-[#0274be] outline-none bg-white"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preserveFormatting}
                  onChange={(e) => setPreserveFormatting(e.target.checked)}
                  className="rounded border-gray-300 text-[#0274be] focus:ring-[#0274be]" 
                />
                Preserve original formatting (bold, italics, lists, headings)
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={convertToPdf}
                disabled={isProcessing || !extractedHtml}
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
                    <span>Convert to PDF</span>
                  </>
                )}
              </button>
              <button 
                onClick={downloadPdf}
                disabled={!convertedBlob || isProcessing}
                className="bg-white border-2 border-[#0274be] text-[#0274be] font-semibold px-6 py-3.5 rounded-xl hover:bg-[#0274be]/5 transition disabled:opacity-40 disabled:border-gray-300 disabled:text-gray-400 flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                <Download className="h-5 w-5" />
                Download PDF
              </button>
            </div>
          </div>
        )}

        {/* STATUS */}
        {(error || success) && (
          <div className={`mt-5 text-sm p-3 rounded-xl flex items-center gap-2 ${error?.startsWith('❌') || error?.startsWith('⚠️') ? 'bg-red-100 text-red-700' : success ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {success ? <CheckCircle className="h-5 w-5" /> : error?.startsWith('❌') ? <AlertCircle className="h-5 w-5" /> : null}
            <span>{success ? `✅ Conversion successful! Click Download PDF.` : error}</span>
          </div>
        )}
      </div>

      <div className="bg-white py-10 border-t border-gray-100 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Why choose DocToolHubPK?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-[#0274be]" />}
            title="Instant conversion"
            description="Convert Word to PDF in seconds, no server waiting."
          />
          <FeatureCard 
            icon={<Settings className="h-6 w-6 text-[#0274be]" />}
            title="Preserve formatting"
            description="Bold, italics, lists, headings — all maintained."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your documents stay on your device."
          />
          <FeatureCard 
            icon={<FileIcon className="h-6 w-6 text-[#0274be]" />}
            title="Browser‑based tool"
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
