import React from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { Upload, File as FileIcon, Download, RefreshCw, AlertCircle, CheckCircle, Trash2, Zap, Shield, RotateCw, X } from 'lucide-react';

export default function RotatePdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [numPages, setNumPages] = React.useState(0);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [rotateMode, setRotateMode] = React.useState<'all' | 'specific'>('all');
  const [specificPages, setSpecificPages] = React.useState('');
  const [selectedAngle, setSelectedAngle] = React.useState(90);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);

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
        setDownloadUrl(null);
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setNumPages(pdfDoc.getPageCount());
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

  const rotatePdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      let pagesToRotate: number[] = [];
      if (rotateMode === 'all') {
        for (let i = 0; i < pageCount; i++) pagesToRotate.push(i);
      } else {
        if (!specificPages.trim()) {
          throw new Error('Please enter page numbers to rotate.');
        }
        const pageNumbers = parsePageRange(specificPages, pageCount);
        if (pageNumbers.length === 0) {
          throw new Error('Invalid page range. Please use format like: 1,3,5-7');
        }
        pagesToRotate = pageNumbers.map(p => p - 1);
      }
      
      for (const pageIndex of pagesToRotate) {
        const page = pdfDoc.getPage(pageIndex);
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + selectedAngle));
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setSuccess(true);
    } catch (err: any) {
      console.error('Rotation error:', err);
      setError(`❌ Rotation failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setNumPages(0);
    setDownloadUrl(null);
    setSuccess(false);
    setRotateMode('all');
    setSpecificPages('');
    setSelectedAngle(90);
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
              accept="application/pdf" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
            <div className="flex flex-col items-center gap-2">
              <div className="bg-blue-50 p-3 rounded-full">
                <Upload className="h-7 w-7 text-[#0274be]" />
              </div>
              <p className="text-lg font-medium text-gray-800">Drag & drop PDF or <span className="text-[#0274be] underline underline-offset-2 font-semibold">browse</span></p>
              <p className="text-sm text-gray-500">Upload a PDF to rotate pages • max 50MB</p>
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
            <div>
              <span className="text-sm font-medium text-gray-700 block mb-3">Rotation mode</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`flex items-start p-3 border rounded-xl transition cursor-pointer ${rotateMode === 'all' ? 'border-[#0274be] bg-blue-50/30' : 'bg-gray-50/50 border-gray-200 hover:border-[#0274be]'}`}
                  onClick={() => setRotateMode('all')}
                >
                  <input 
                    type="radio" 
                    name="rotateMode" 
                    checked={rotateMode === 'all'} 
                    onChange={() => setRotateMode('all')}
                    className="mt-1 mr-3 accent-[#0274be]" 
                  />
                  <div>
                    <label className="font-medium text-gray-800 cursor-pointer">Rotate all pages</label>
                    <p className="text-xs text-gray-500">Apply same rotation to every page</p>
                  </div>
                </div>
                <div 
                  className={`flex items-start p-3 border rounded-xl transition cursor-pointer ${rotateMode === 'specific' ? 'border-[#0274be] bg-blue-50/30' : 'bg-gray-50/50 border-gray-200 hover:border-[#0274be]'}`}
                  onClick={() => setRotateMode('specific')}
                >
                  <input 
                    type="radio" 
                    name="rotateMode" 
                    checked={rotateMode === 'specific'} 
                    onChange={() => setRotateMode('specific')}
                    className="mt-1 mr-3 accent-[#0274be]" 
                  />
                  <div className="w-full">
                    <label className="font-medium text-gray-800 cursor-pointer">Rotate specific pages</label>
                    <p className="text-xs text-gray-500">Apply rotation to selected page numbers</p>
                    <input 
                      type="text" 
                      value={specificPages}
                      onChange={(e) => setSpecificPages(e.target.value)}
                      disabled={rotateMode !== 'specific'}
                      placeholder="e.g. 1,3,5-7" 
                      className="mt-2 w-full text-sm p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0274be] focus:border-[#0274be] outline-none disabled:opacity-50" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-700 block mb-3">Rotation angle</span>
              <div className="flex flex-wrap gap-3">
                {[90, 180, 270].map((angle) => (
                  <button 
                    key={angle}
                    onClick={() => setSelectedAngle(angle)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium border transition ${selectedAngle === angle ? 'bg-[#0274be] text-white border-[#0274be]' : 'border-gray-300 bg-white text-gray-700 hover:border-[#0274be] hover:text-[#0274be]'}`}
                  >
                    {angle === 90 ? '90° clockwise' : angle === 180 ? '180°' : '90° counter-clockwise'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={rotatePdf}
                disabled={isProcessing}
                className="bg-[#0274be] text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 flex-1"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Rotating PDF...</span>
                  </>
                ) : (
                  <>
                    <RotateCw className="h-5 w-5" />
                    <span>Rotate PDF</span>
                  </>
                )}
              </button>
              <a 
                href={downloadUrl || '#'} 
                download={file?.name.replace(/\.pdf$/i, '_rotated.pdf')}
                onClick={(e) => !downloadUrl && e.preventDefault()}
                className={`bg-white border-2 border-[#0274be] text-[#0274be] font-semibold px-6 py-3.5 rounded-xl hover:bg-[#0274be]/5 transition flex items-center justify-center gap-2 flex-1 sm:flex-none ${!downloadUrl ? 'opacity-40 border-gray-300 text-gray-400 cursor-not-allowed' : ''}`}
              >
                <Download className="h-5 w-5" />
                Download Rotated PDF
              </a>
            </div>
          </div>
        )}

        {/* STATUS */}
        {(error || success) && (
          <div className={`mt-5 text-sm p-3 rounded-xl flex items-center gap-2 ${error?.startsWith('❌') || error?.startsWith('⚠️') ? 'bg-red-100 text-red-700' : success ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {success ? <CheckCircle className="h-5 w-5" /> : error?.startsWith('❌') ? <AlertCircle className="h-5 w-5" /> : null}
            <span>{success ? `✅ Rotation complete! Click Download.` : error}</span>
          </div>
        )}
      </div>

      <div className="bg-white py-10 border-t border-gray-100 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Why choose DocToolHubPK?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<RotateCw className="h-6 w-6 text-[#0274be]" />}
            title="Flexible rotation"
            description="Rotate all pages or specific pages with ease."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="Preserve quality"
            description="Original PDF quality maintained after rotation."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your PDF stays on your device."
          />
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-[#0274be]" />}
            title="Fast processing"
            description="Client‑side rotation, instant download."
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
