import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Maximize, 
  Download, 
  RefreshCw, 
  X, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Image as ImageIcon,
  Lock,
  Unlock,
  Zap,
  Shield,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [resizedImageUrl, setResizedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('webp');
  const [quality, setQuality] = useState(85);
  const [maxDimension, setMaxDimension] = useState<number | ''>('');
  const [resizedSize, setResizedSize] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const widthInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      loadFile(selectedFile);
    }
  };

  const loadFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max size is 10MB.');
      return;
    }

    setFile(file);
    setError(null);
    setSuccess(false);
    setResizedImageUrl(null);
    
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
      setOriginalDimensions({ width: img.width, height: img.height });
    };
    img.src = url;
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    setMaxDimension('');
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setDimensions({ width: newWidth, height: Math.round(newWidth * ratio) });
    } else {
      setDimensions(prev => ({ ...prev, width: newWidth }));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    setMaxDimension('');
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setDimensions({ width: Math.round(newHeight * ratio), height: newHeight });
    } else {
      setDimensions(prev => ({ ...prev, height: newHeight }));
    }
  };

  const handleMaxDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? '' : parseInt(e.target.value) || 0;
    setMaxDimension(val);
    
    if (typeof val === 'number' && val > 0 && originalDimensions.width > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      if (ratio > 1) {
        // Width is larger
        setDimensions({ width: val, height: Math.round(val / ratio) });
      } else {
        // Height is larger or equal
        setDimensions({ width: Math.round(val * ratio), height: val });
      }
      setMaintainAspectRatio(true);
    }
  };

  const applyPercentage = (percent: number) => {
    if (originalDimensions.width === 0) return;
    setMaxDimension('');
    const w = Math.round(originalDimensions.width * percent / 100);
    const h = Math.round(originalDimensions.height * percent / 100);
    setDimensions({ width: w, height: h });
  };

  const handleResize = async () => {
    if (!imageUrl || dimensions.width <= 0 || dimensions.height <= 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context.');

      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

      const mimeType = `image/${format}`;
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), mimeType, quality / 100);
      });

      if (!blob) throw new Error('Could not generate image blob.');

      const url = URL.createObjectURL(blob);
      setResizedImageUrl(url);
      setResizedSize(formatBytes(blob.size));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to resize image.');
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
    if (!resizedImageUrl || !file) return;
    const ext = format === 'jpeg' ? 'jpg' : format;
    const link = document.createElement('a');
    link.href = resizedImageUrl;
    link.download = `resized_${dimensions.width}x${dimensions.height}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setFile(null);
    setImageUrl(null);
    setResizedImageUrl(null);
    setSuccess(false);
    setError(null);
    setDimensions({ width: 0, height: 0 });
    setOriginalDimensions({ width: 0, height: 0 });
    setMaxDimension('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sizeSaved = file && resizedSize ? ((file.size - (resizedImageUrl ? calculateBlobSize(resizedImageUrl) : 0)) / file.size * 100).toFixed(1) : '0';

  function calculateBlobSize(url: string) {
    // This is a rough estimate since we don't have the blob directly here easily without state
    // But we have resizedSize string. Let's just use the state we set.
    return 0; // Placeholder, we'll use the formatted string for display
  }

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
              <Upload className="w-8 h-8 text-sky-500" />
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
                <span className="text-xs text-slate-400">{originalDimensions.width} x {originalDimensions.height} px • {formatBytes(file?.size || 0)}</span>
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
                  {success && resizedImageUrl && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-sky-50 p-4 rounded-2xl border border-sky-200"
                    >
                      <span className="text-xs font-bold text-sky-400 uppercase mb-3 block">Resized Preview</span>
                      <div className="bg-white rounded-xl overflow-hidden border border-sky-100 flex items-center justify-center min-h-[200px] p-4">
                        <img 
                          src={resizedImageUrl} 
                          alt="Resized" 
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
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-bold text-slate-700">Dimensions</label>
                        <button 
                          onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                          className={`flex items-center space-x-1 text-xs font-bold transition-colors ${maintainAspectRatio ? 'text-sky-500' : 'text-slate-400'}`}
                        >
                          {maintainAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          <span>{maintainAspectRatio ? 'Ratio Locked' : 'Ratio Free'}</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Width (px)</span>
                          <input 
                            type="number" 
                            ref={widthInputRef}
                            value={dimensions.width} 
                            onChange={handleWidthChange}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Height (px)</span>
                          <input 
                            type="number" 
                            value={dimensions.height} 
                            onChange={handleHeightChange}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-3">Max Dimension (px)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={maxDimension} 
                          onChange={handleMaxDimensionChange}
                          placeholder="e.g. 1200"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none font-medium pr-10"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Maximize className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-medium italic">
                        Resizes image to fit within this size while maintaining aspect ratio.
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-bold text-slate-700 block mb-3">Quick Resize</span>
                      <div className="flex flex-wrap gap-2">
                        {[25, 50, 75].map(p => (
                          <button 
                            key={p}
                            onClick={() => applyPercentage(p)}
                            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:border-sky-400 hover:text-sky-500 transition-all bg-white"
                          >
                            {p}%
                          </button>
                        ))}
                        <button 
                          onClick={() => widthInputRef.current?.focus()}
                          className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:border-sky-400 hover:text-sky-500 transition-all bg-white"
                        >
                          Custom
                        </button>
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
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>

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
                  </div>
                </div>

                <button 
                  onClick={handleResize}
                  disabled={isProcessing}
                  className="w-full py-4 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Resizing...</span>
                    </>
                  ) : (
                    <>
                      <Maximize className="w-5 h-5" />
                      <span>Resize Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">Result Info</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">New Dimensions</span>
                    <span className="text-sm font-bold text-slate-700">
                      {dimensions.width > 0 ? `${dimensions.width} x ${dimensions.height}` : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Estimated Size</span>
                    <span className="text-sm font-bold text-sky-500">{resizedSize || '-'}</span>
                  </div>
                </div>
                
                <AnimatePresence>
                  {success && resizedImageUrl && (
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleDownload}
                      className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 flex items-center justify-center space-x-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Resized Image</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 space-y-4">
                <div className="flex items-center space-x-3 text-sky-800">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-bold">Secure Processing</span>
                </div>
                <p className="text-xs text-sky-700 leading-relaxed">
                  All resizing happens locally in your browser. Your images are never uploaded to our servers, ensuring 100% privacy and security.
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
          { icon: Zap, title: "Fast resizing", desc: "Instant canvas-based resizing, no server delays." },
          { icon: ImageIcon, title: "Quality preservation", desc: "Fine control over output format and compression." },
          { icon: Shield, title: "Secure processing", desc: "No upload — images stay on your device." },
          { icon: FileDown, title: "Browser-based", desc: "Works offline, no installation required." }
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
