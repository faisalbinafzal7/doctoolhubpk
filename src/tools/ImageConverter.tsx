import React, { useState, useRef } from 'react';
import { 
  Upload, 
  RefreshCw, 
  Download, 
  X, 
  CheckCircle, 
  AlertCircle,
  Image as ImageIcon,
  ArrowRight,
  Shield,
  Zap,
  Clock,
  Settings,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [targetFormat, setTargetFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [quality, setQuality] = useState(85);
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const [convertedSize, setConvertedSize] = useState<string>('');
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
    setError(null);
    setSuccess(false);
    setConvertedImageUrl(null);
    
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const img = new Image();
    img.onload = () => {
      setOriginalDims({ w: img.width, h: img.height });
    };
    img.src = url;
  };

  const handleConvert = async () => {
    if (!imageUrl) return;

    setIsProcessing(true);
    setError(null);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context.');

      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      canvas.width = img.width;
      canvas.height = img.height;
      
      if (targetFormat === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${targetFormat}`;
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), mimeType, quality / 100);
      });

      if (!blob) throw new Error('Could not generate image blob.');

      const url = URL.createObjectURL(blob);
      setConvertedImageUrl(url);
      setConvertedSize(formatBytes(blob.size));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to convert image.');
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
    if (!convertedImageUrl || !file) return;
    const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
    const link = document.createElement('a');
    link.href = convertedImageUrl;
    link.download = `converted_${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setFile(null);
    setImageUrl(null);
    setConvertedImageUrl(null);
    setSuccess(false);
    setError(null);
    setTargetFormat('jpeg');
    setQuality(85);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sizeDiff = file && convertedSize ? ((file.size - (convertedImageUrl ? 0 : 0)) / file.size * 100).toFixed(1) : '0';

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
              <RefreshCw className="w-8 h-8 text-sky-500" />
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
                <span className="text-xs text-slate-400">{formatBytes(file?.size || 0)} • {originalDims.w}x{originalDims.h}px</span>
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
                  <span className="text-xs font-bold text-slate-400 uppercase mb-3 block">Original Image</span>
                  <div className="bg-white rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center min-h-[200px] p-4">
                    <img 
                      src={imageUrl} 
                      alt="Original" 
                      className="max-w-full max-h-[300px] object-contain"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {success && convertedImageUrl && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-sky-50 p-4 rounded-2xl border border-sky-200"
                    >
                      <span className="text-xs font-bold text-sky-400 uppercase mb-3 block">Converted Preview</span>
                      <div className="bg-white rounded-xl overflow-hidden border border-sky-100 flex items-center justify-center min-h-[200px] p-4">
                        <img 
                          src={convertedImageUrl} 
                          alt="Converted" 
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
                      <label className="text-sm font-bold text-slate-700 block mb-3">Convert To Format</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'JPEG', val: 'jpeg' },
                          { label: 'PNG', val: 'png' },
                          { label: 'WebP', val: 'webp' }
                        ].map(fmt => (
                          <button 
                            key={fmt.val}
                            onClick={() => setTargetFormat(fmt.val as any)}
                            className={`px-4 py-3 text-xs font-bold rounded-xl border transition-all ${targetFormat === fmt.val ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-100' : 'bg-white text-slate-600 border-slate-200 hover:border-sky-400'}`}
                          >
                            {fmt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

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
                        disabled={targetFormat === 'png'}
                        className={`w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-500 ${targetFormat === 'png' ? 'opacity-30 cursor-not-allowed' : ''}`}
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                        <span>Small File</span>
                        <span>High Quality</span>
                      </div>
                      {targetFormat === 'png' && (
                        <p className="text-[10px] text-slate-400 mt-2 italic">Quality setting only applies to JPEG and WebP.</p>
                      )}
                    </div>
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
                      <RefreshCw className="w-5 h-5" />
                      <span>Convert Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">Conversion Result</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Target Format</span>
                    <span className="text-sm font-bold text-slate-700 uppercase">{targetFormat === 'jpeg' ? 'JPG' : targetFormat}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">New Size</span>
                    <span className="text-sm font-bold text-sky-500">{convertedSize || '-'}</span>
                  </div>
                  {success && file && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Size Change</span>
                      <span className={`text-sm font-bold ${parseFloat(sizeDiff) > 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {parseFloat(sizeDiff) > 0 ? `-${sizeDiff}%` : `+${Math.abs(parseFloat(sizeDiff))}%`}
                      </span>
                    </div>
                  )}
                </div>
                
                <AnimatePresence>
                  {success && convertedImageUrl && (
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleDownload}
                      className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 flex items-center justify-center space-x-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Converted Image</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 space-y-4">
                <div className="flex items-center space-x-3 text-sky-800">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-bold">100% Secure</span>
                </div>
                <p className="text-xs text-sky-700 leading-relaxed">
                  All conversion happens locally in your browser. Your images are never uploaded to our servers, ensuring total privacy.
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
          { icon: Zap, title: "Instant conversion", desc: "Convert images between formats in seconds." },
          { icon: ImageIcon, title: "Multiple formats", desc: "JPG, PNG, WebP conversion supported." },
          { icon: Shield, title: "100% secure", desc: "No upload — your images stay in your browser." },
          { icon: Settings, title: "Quality control", desc: "Adjust JPEG/WebP compression quality." }
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
