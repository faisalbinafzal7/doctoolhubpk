import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Copy, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Image as ImageIcon,
  FileText,
  Zap,
  Shield,
  RefreshCw,
  Search,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ImageToBase64() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64, setBase64] = useState<string>('');
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [outputFormat, setOutputFormat] = useState<'data' | 'raw' | 'css' | 'html'>('data');
  const [quality, setQuality] = useState(85);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateBase64Size = (base64String: string) => {
    return new Blob([base64String]).size;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File too large. Max size is 10MB.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(false);
    setBase64('');
    
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
    };
    img.src = url;
  };

  const handleConvert = async () => {
    if (!file || !previewUrl) return;

    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();
      const result = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      let finalBase64 = result.split(',')[1];
      const mimeType = file.type;

      // Re-compress if JPEG and quality < 100
      if (quality < 100 && mimeType === 'image/jpeg') {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = result;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
        finalBase64 = compressedDataUrl.split(',')[1];
      }

      setBase64(finalBase64);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to convert image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFormattedOutput = () => {
    if (!base64 || !file) return '';
    const mimeType = file.type;
    switch (outputFormat) {
      case 'data': return `data:${mimeType};base64,${base64}`;
      case 'raw': return base64;
      case 'css': return `url(data:${mimeType};base64,${base64})`;
      case 'html': return `<img src="data:${mimeType};base64,${base64}" alt="Base64 Image">`;
      default: return base64;
    }
  };

  const handleCopy = async () => {
    const text = getFormattedOutput();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard.');
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setBase64('');
    setDimensions(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const base64Size = base64 ? calculateBase64Size(getFormattedOutput()) : 0;
  const sizeIncrease = file && base64Size ? ((base64Size - file.size) / file.size * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!file ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer relative bg-slate-50/50 ${isDragging ? 'border-sky-500 bg-sky-50/50' : 'border-slate-200 hover:border-sky-400'}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) processFile(droppedFile);
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*" 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <div className="text-slate-400">
            <div className="bg-sky-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-sky-500" />
            </div>
            <p className="text-xl font-bold text-slate-700 mb-2">Drag & drop image or click to browse</p>
            <p className="text-sm">Supports JPG, PNG, WebP, GIF, SVG, BMP • max 10MB</p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-sky-50 p-2 rounded-lg">
                <ImageIcon className="w-5 h-5 text-sky-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-700 block truncate max-w-[200px] sm:max-w-md">{file.name}</span>
                <span className="text-xs text-slate-400">{formatSize(file.size)} • {file.type}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button 
                onClick={reset} 
                className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
              {base64 && (
                <button 
                  onClick={handleCopy}
                  className="flex-1 sm:flex-none px-4 py-2 bg-sky-500 text-white rounded-xl text-sm font-bold hover:bg-sky-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-100"
                >
                  <Copy className="w-4 h-4" />
                  {success ? 'Copied!' : 'Copy Base64'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase mb-3 self-start">Preview</span>
                    <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-full flex items-center justify-center min-h-[150px]">
                      {previewUrl && (
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="max-w-full max-h-[200px] rounded-lg object-contain"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <span className="text-xs font-bold text-slate-400 uppercase block">File Information</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Dimensions</span>
                        <span className="text-sm font-bold text-slate-700">
                          {dimensions ? `${dimensions.width} x ${dimensions.height} px` : '-'}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">MIME Type</span>
                        <span className="text-sm font-bold text-slate-700">{file.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-slate-700 block mb-3">Output Format</label>
                    <select 
                      value={outputFormat} 
                      onChange={(e) => setOutputFormat(e.target.value as any)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-white font-medium text-slate-700"
                    >
                      <option value="data">Data URL (image/png;base64,...)</option>
                      <option value="raw">Raw Base64 String</option>
                      <option value="css">CSS Background (url(data:...))</option>
                      <option value="html">HTML Image (img src="data:...")</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-700 block mb-3">
                      Image Quality (JPEG only): <span className="text-sky-500">{quality}%</span>
                    </label>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={quality}
                      disabled={file.type !== 'image/jpeg'}
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-500 disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                    <p className="text-[10px] text-slate-400 mt-2">Only applies when converting to JPEG format</p>
                  </div>
                </div>

                <button 
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full py-4 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Converting...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Convert to Base64</span>
                    </>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {base64 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-sky-500" />
                        Base64 Output
                      </label>
                      <button 
                        onClick={handleCopy}
                        className="text-xs font-bold text-sky-500 hover:text-sky-600 transition-colors"
                      >
                        {success ? 'Copied!' : 'Copy to Clipboard'}
                      </button>
                    </div>
                    <textarea 
                      readOnly 
                      value={getFormattedOutput()}
                      className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs break-all focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">Conversion Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Original Size</span>
                    <span className="text-sm font-bold text-slate-700">{formatSize(file.size)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Base64 Size</span>
                    <span className="text-sm font-bold text-sky-500">{base64 ? formatSize(base64Size) : '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Size Increase</span>
                    <span className={`text-sm font-bold ${parseFloat(sizeIncrease) > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {base64 ? `+${sizeIncrease}%` : '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 space-y-4">
                <div className="flex items-center space-x-3 text-sky-800">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-bold">About Base64</span>
                </div>
                <p className="text-xs text-sky-700 leading-relaxed">
                  Base64 encoding converts binary image data to ASCII text. Base64 images are about 33% larger than original, but can be embedded directly into HTML, CSS, or JSON files. Perfect for email signatures, data URIs, and API responses.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-amber-800 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-slate-100">
        {[
          { icon: Zap, title: "Instant conversion", desc: "Real-time processing in your browser." },
          { icon: ImageIcon, title: "Multiple formats", desc: "Support for JPG, PNG, WebP, GIF, SVG." },
          { icon: Shield, title: "100% secure", desc: "No upload — your images stay private." },
          { icon: Copy, title: "Copy & Use", desc: "One-click copy for HTML/CSS/JSON." }
        ].map((feature, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="bg-sky-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
              <feature.icon className="w-5 h-5 text-sky-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">{feature.title}</h3>
            <p className="text-xs text-slate-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
