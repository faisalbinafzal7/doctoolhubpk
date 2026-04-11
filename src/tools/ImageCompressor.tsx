import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { 
  Upload, 
  Zap, 
  Download, 
  RefreshCw, 
  X, 
  CheckCircle, 
  AlertCircle,
  Image as ImageIcon,
  ArrowDownToLine,
  Info,
  Shield,
  Clock,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [compressedImageUrl, setCompressedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [quality, setQuality] = useState(80);
  const [maxDimension, setMaxDimension] = useState<number | ''>('');
  const [format, setFormat] = useState<'original' | 'jpeg' | 'png' | 'webp'>('original');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const [compressedDims, setCompressedDims] = useState({ w: 0, h: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      loadFile(selectedFile);
    }
  };

  const loadFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File too large (max 10MB).');
      return;
    }

    setFile(file);
    setOriginalSize(file.size);
    setError(null);
    setSuccess(false);
    setCompressedImageUrl(null);
    
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const img = new Image();
    img.onload = () => {
      setOriginalDims({ w: img.width, h: img.height });
    };
    img.src = url;
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: maxDimension || undefined,
        useWebWorker: true,
        initialQuality: quality / 100,
        fileType: format === 'original' ? file.type : `image/${format}`,
      };

      const compressedFile = await imageCompression(file, options);
      
      const url = URL.createObjectURL(compressedFile);
      setCompressedImageUrl(url);
      setCompressedSize(compressedFile.size);
      
      const img = new Image();
      img.onload = () => {
        setCompressedDims({ w: img.width, h: img.height });
      };
      img.src = url;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to compress image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (!compressedImageUrl || !file) return;
    let ext = format === 'original' ? file.name.split('.').pop() : format;
    if (ext === 'jpeg') ext = 'jpg';
    const link = document.createElement('a');
    link.href = compressedImageUrl;
    link.download = `compressed_${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setFile(null);
    setImageUrl(null);
    setCompressedImageUrl(null);
    setSuccess(false);
    setError(null);
    setQuality(80);
    setMaxDimension('');
    setFormat('original');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const compressionRatio = originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!imageUrl ? (
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
            if (droppedFile) loadFile(droppedFile);
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
              <Zap className="w-8 h-8 text-sky-500" />
            </div>
            <p className="text-xl font-bold text-slate-700 mb-2">Drag & drop image or click to browse</p>
            <p className="text-sm">Supports JPG, PNG, WebP • max 10MB</p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="bg-sky-50 p-2 rounded-lg">
                <ImageIcon className="w-5 h-5 text-sky-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-700 block truncate max-w-[200px] sm:max-w-md">{file?.name}</span>
                <span className="text-xs text-slate-400">{formatBytes(originalSize)} • {originalDims.w}x{originalDims.h}px</span>
              </div>
            </div>
            <button 
              onClick={reset} 
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase mb-3 block">Original</span>
                  <div className="bg-white rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center min-h-[200px] p-4">
                    <img 
                      src={imageUrl} 
                      alt="Original" 
                      className="max-w-full max-h-[300px] object-contain"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {success && compressedImageUrl && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-sky-50 p-4 rounded-2xl border border-sky-200"
                    >
                      <span className="text-xs font-bold text-sky-400 uppercase mb-3 block">Compressed Preview</span>
                      <div className="bg-white rounded-xl overflow-hidden border border-sky-100 flex items-center justify-center min-h-[200px] p-4">
                        <img 
                          src={compressedImageUrl} 
                          alt="Compressed" 
                          className="max-w-full max-h-[300px] object-contain"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-3">
                        Quality: <span className="text-sky-500">{quality}%</span>
                      </label>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                        <span>Small File</span>
                        <span>High Quality</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-bold text-slate-700 block mb-3">Compression Presets</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: 'Low', val: 90 },
                          { label: 'Medium', val: 70 },
                          { label: 'High', val: 40 }
                        ].map(preset => (
                          <button 
                            key={preset.label}
                            onClick={() => setQuality(preset.val)}
                            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${quality === preset.val ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-100' : 'bg-white text-slate-600 border-slate-200 hover:border-sky-400'}`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-3">Output Format</label>
                      <select 
                        value={format} 
                        onChange={(e) => setFormat(e.target.value as any)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-white font-medium text-slate-700"
                      >
                        <option value="original">Same as original</option>
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-3">Resize (Max Dimension)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={maxDimension}
                          onChange={(e) => setMaxDimension(e.target.value === '' ? '' : parseInt(e.target.value))}
                          placeholder="Optional (e.g. 1200)"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none font-medium pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">px</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full py-4 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Compressing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Compress Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">Compression Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Original Size</span>
                    <span className="text-sm font-bold text-slate-700">{formatBytes(originalSize)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">New Size</span>
                    <span className="text-sm font-bold text-sky-500">{compressedSize ? formatBytes(compressedSize) : '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Reduction</span>
                    <span className={`text-sm font-bold ${compressionRatio > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {compressionRatio > 0 ? `-${compressionRatio}%` : '-'}
                    </span>
                  </div>
                </div>
                
                <AnimatePresence>
                  {success && compressedImageUrl && (
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleDownload}
                      className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 flex items-center justify-center space-x-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Compressed Image</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 space-y-4">
                <div className="flex items-center space-x-3 text-sky-800">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-bold">Secure & Private</span>
                </div>
                <p className="text-xs text-sky-700 leading-relaxed">
                  All processing happens in your browser. Your images are never uploaded to our servers, ensuring 100% privacy.
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
          { icon: Zap, title: "Smart compression", desc: "Advanced algorithm reduces size while keeping visual quality." },
          { icon: Settings, title: "Quality control", desc: "Fine-tune compression with slider or one-click presets." },
          { icon: Clock, title: "Fast processing", desc: "Optimized engine with instant preview in your browser." },
          { icon: Shield, title: "100% secure", desc: "No upload – your images stay on your device." }
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
