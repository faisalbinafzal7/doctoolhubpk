import React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, File as FileIcon, X, ArrowUp, ArrowDown, Download, RefreshCw, AlertCircle, CheckCircle, Trash2, Zap, Shield, List } from 'lucide-react';

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function MergePdf() {
  const [files, setFiles] = React.useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
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

  const validateFile = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return { valid: false, error: 'Invalid file type. Please select a PDF document.' };
    }
    if (file.size > 50 * 1024 * 1024) {
      return { valid: false, error: `File too large (max 50MB). ${file.name}: ${formatBytes(file.size)}` };
    }
    return { valid: true };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []) as File[];
    const validFiles: FileItem[] = [];
    const errors: string[] = [];

    selectedFiles.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          name: file.name,
          size: file.size
        });
      } else {
        errors.push(validation.error || 'Invalid file');
      }
    });

    if (errors.length > 0) {
      setError(`⚠️ ${errors[0]}`);
    } else {
      setError(null);
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      setSuccess(false);
      setDownloadUrl(null);
    }
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setDownloadUrl(null);
    setSuccess(false);
    setError('🗑️ File removed.');
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      setFiles(newFiles);
      setDownloadUrl(null);
      setSuccess(false);
      setError(direction === 'up' ? '⬆️ Order updated.' : '⬇️ Order updated.');
    }
  };

  const mergePdfs = async () => {
    if (files.length === 0) {
      setError('📂 No PDFs to merge.');
      return;
    }
    if (files.length < 2) {
      setError('Please select at least two PDF files to merge.');
      return;
    }
    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const mergedPdf = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const fileItem = files[i];
        const arrayBuffer = await fileItem.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pageIndices = pdfDoc.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setSuccess(true);
    } catch (err: any) {
      console.error('Merge error:', err);
      setError(`❌ Merge failed: ${err.message || 'Invalid or corrupted PDF'}.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFiles([]);
    setDownloadUrl(null);
    setSuccess(false);
    setError('🔄 All files cleared. Upload PDFs to start merging.');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white premium-card rounded-3xl border border-gray-200/70 p-6 md:p-8 mb-12 shadow-sm w-full">
        {/* UPLOAD AREA */}
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-[#0274be] transition bg-gray-50/20 mb-6 relative">
          <input 
            type="file" 
            multiple 
            accept="application/pdf" 
            onChange={handleFileChange} 
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
          <div className="flex flex-col items-center gap-2">
            <div className="bg-blue-50 p-3 rounded-full">
              <Upload className="h-7 w-7 text-[#0274be]" />
            </div>
            <p className="text-lg font-medium text-gray-800">Drag & drop PDFs here or <span className="text-[#0274be] underline underline-offset-2 font-semibold">browse</span></p>
            <p className="text-sm text-gray-500">Select multiple PDF files to merge • max 50MB each</p>
          </div>
        </div>

        {/* FILE LIST */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <List className="h-5 w-5 text-[#0274be]" />
              Selected PDFs
            </h3>
            <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-medium">{files.length} files</span>
          </div>
          <div className="file-list-scroll bg-gray-50/70 rounded-xl border border-gray-200 p-2 min-h-[120px] max-h-[320px] overflow-y-auto">
            {files.length === 0 ? (
              <div className="flex justify-center items-center h-20 text-gray-400 text-sm">📄 No PDFs selected — drop or browse</div>
            ) : (
              files.map((f, idx) => (
                <div key={f.id} className="flex items-center justify-between bg-white p-3 mb-2 rounded-lg border border-gray-200 shadow-sm hover:border-[#0274be]/30 transition group">
                  <div className="flex items-center space-x-3 truncate max-w-[50%] sm:max-w-xs">
                    <div className="bg-blue-50 p-2 rounded-lg shrink-0">
                      <FileIcon className="h-5 w-5 text-[#0274be]" />
                    </div>
                    <div className="truncate text-left">
                      <p className="font-medium text-gray-800 truncate">{f.name}</p>
                      <p className="text-xs text-gray-500">{formatBytes(f.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => moveFile(idx, 'up')} 
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-600 transition"
                    >
                      <ArrowUp className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => moveFile(idx, 'down')} 
                      disabled={idx === files.length - 1}
                      className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-600 transition"
                    >
                      <ArrowDown className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => removeFile(f.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button 
            id="mergeBtn"
            onClick={mergePdfs}
            disabled={files.length < 2 || isProcessing}
            className="bg-[#0274be] text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 flex-1"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Merging PDFs...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5" />
                <span>Merge PDFs</span>
              </>
            )}
          </button>
          <button 
            id="resetBtn"
            onClick={reset}
            className="bg-white border border-gray-300 text-gray-700 font-medium px-6 py-3.5 rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2 flex-1 sm:flex-none"
          >
            <RefreshCw className="h-5 w-5" />
            Reset
          </button>
          <a 
            href={downloadUrl || '#'} 
            download="merged_document.pdf"
            onClick={(e) => !downloadUrl && e.preventDefault()}
            className={`bg-white border-2 border-[#0274be] text-[#0274be] font-semibold px-6 py-3.5 rounded-xl hover:bg-[#0274be]/5 transition flex items-center justify-center gap-2 flex-1 sm:flex-none ${!downloadUrl ? 'opacity-40 border-gray-300 text-gray-400 cursor-not-allowed' : ''}`}
          >
            <Download className="h-5 w-5" />
            Download merged.pdf
          </a>
        </div>

        {/* STATUS */}
        {(error || success) && (
          <div className={`text-sm p-3 rounded-xl flex items-center gap-2 ${error?.startsWith('❌') || error?.startsWith('⚠️') ? 'bg-red-100 text-red-700' : success ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {success ? <CheckCircle className="h-5 w-5" /> : error?.startsWith('❌') ? <AlertCircle className="h-5 w-5" /> : null}
            <span>{success ? '✅ Merge complete! click Download' : error}</span>
          </div>
        )}
      </div>

      <div className="bg-white py-10 border-t border-gray-100 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Why choose DocToolHubPK?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-[#0274be]" />}
            title="Fast merging"
            description="Combine multiple PDFs in seconds, client‑side."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="Preserve quality"
            description="Original PDF quality maintained in merged file."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your PDFs stay on your device."
          />
          <FeatureCard 
            icon={<List className="h-6 w-6 text-[#0274be]" />}
            title="Reorder files"
            description="Arrange PDF order with up/down controls."
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
