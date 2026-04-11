import React, { useRef, useState, useEffect } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { 
  Upload, 
  Crop, 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Download, 
  X, 
  CheckCircle, 
  AlertCircle,
  Maximize,
  Square,
  RectangleHorizontal,
  Layout,
  Scissors,
  Zap,
  Shield,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [aspectRatio, setAspectRatio] = useState<number | typeof NaN>(NaN);
  const [customRatio, setCustomRatio] = useState({ w: 2, h: 1 });
  const [quality, setQuality] = useState(90);
  const [croppedSize, setCroppedSize] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imageUrl && imageRef.current) {
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }

      cropperRef.current = new Cropper(imageRef.current, {
        aspectRatio: aspectRatio,
        viewMode: 1,
        dragMode: 'crop',
        autoCropArea: 0.8,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
      });
    }

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
    };
  }, [imageUrl, aspectRatio]);

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
    setCroppedImageUrl(null);
    
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      loadFile(droppedFile);
    }
  };

  const handleCrop = async () => {
    if (!cropperRef.current) return;

    setIsProcessing(true);
    setError(null);

    try {
      const canvas = cropperRef.current.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });

      if (!canvas) throw new Error('Could not generate cropped canvas.');

      const mimeType = `image/${format}`;
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), mimeType, quality / 100);
      });

      if (!blob) throw new Error('Could not generate image blob.');

      const url = URL.createObjectURL(blob);
      setCroppedImageUrl(url);
      setCroppedSize(formatBytes(blob.size));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to crop image.');
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
    if (!croppedImageUrl || !file) return;
    const ext = format === 'jpeg' ? 'jpg' : format;
    const link = document.createElement('a');
    link.href = croppedImageUrl;
    link.download = `cropped_${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setFile(null);
    setImageUrl(null);
    setCroppedImageUrl(null);
    setSuccess(false);
    setError(null);
    setAspectRatio(NaN);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!imageUrl ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer relative bg-slate-50/50 ${isDragging ? 'border-sky-500 bg-sky-50/50' : 'border-slate-200 hover:border-sky-400'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
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
                <Layout className="w-5 h-5 text-sky-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-700 block truncate max-w-[200px] sm:max-w-md">{file?.name}</span>
                <span className="text-xs text-slate-400">{formatBytes(file?.size || 0)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => cropperRef.current?.reset()}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
              <button 
                onClick={reset} 
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 min-h-[400px] flex items-center justify-center relative shadow-inner">
                <img 
                  ref={imageRef} 
                  src={imageUrl} 
                  alt="To crop" 
                  className="max-w-full block"
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <button onClick={() => cropperRef.current?.zoom(0.1)} className="p-3 hover:bg-sky-50 rounded-xl transition-all text-slate-600 hover:text-sky-600 flex flex-col items-center gap-1 group" title="Zoom In">
                  <ZoomIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Zoom In</span>
                </button>
                <button onClick={() => cropperRef.current?.zoom(-0.1)} className="p-3 hover:bg-sky-50 rounded-xl transition-all text-slate-600 hover:text-sky-600 flex flex-col items-center gap-1 group" title="Zoom Out">
                  <ZoomOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Zoom Out</span>
                </button>
                <div className="w-px h-10 bg-slate-100 mx-1" />
                <button onClick={() => cropperRef.current?.rotate(-90)} className="p-3 hover:bg-sky-50 rounded-xl transition-all text-slate-600 hover:text-sky-600 flex flex-col items-center gap-1 group" title="Rotate Left">
                  <RotateCcw className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">-90°</span>
                </button>
                <button onClick={() => cropperRef.current?.rotate(90)} className="p-3 hover:bg-sky-50 rounded-xl transition-all text-slate-600 hover:text-sky-600 flex flex-col items-center gap-1 group" title="Rotate Right">
                  <RotateCw className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">+90°</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-3">Aspect Ratio</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Free', value: NaN, icon: Maximize },
                      { label: '1:1', value: 1, icon: Square },
                      { label: '16:9', value: 16/9, icon: RectangleHorizontal },
                      { label: '4:3', value: 4/3, icon: RectangleHorizontal }
                    ].map((ratio) => (
                      <button 
                        key={ratio.label}
                        onClick={() => setAspectRatio(ratio.value)}
                        className={`px-4 py-2.5 text-sm font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${
                          (isNaN(aspectRatio) && isNaN(ratio.value)) || aspectRatio === ratio.value 
                            ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-100' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-sky-400'
                        }`}
                      >
                        <ratio.icon className="w-4 h-4" /> {ratio.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <input 
                      type="number" 
                      value={customRatio.w} 
                      onChange={(e) => setCustomRatio(prev => ({ ...prev, w: parseFloat(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                      placeholder="W"
                    />
                    <span className="text-slate-400 font-bold">:</span>
                    <input 
                      type="number" 
                      value={customRatio.h} 
                      onChange={(e) => setCustomRatio(prev => ({ ...prev, h: parseFloat(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                      placeholder="H"
                    />
                    <button 
                      onClick={() => setAspectRatio(customRatio.w / customRatio.h)}
                      className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors"
                    >
                      Set
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
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
                  </div>
                </div>

                <button 
                  onClick={handleCrop}
                  disabled={isProcessing}
                  className="w-full py-4 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Applying Crop...</span>
                    </>
                  ) : (
                    <>
                      <Crop className="w-5 h-5" />
                      <span>Apply Crop</span>
                    </>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {success && croppedImageUrl && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 space-y-4"
                  >
                    <div className="flex items-center space-x-3 text-emerald-800">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-bold">Cropped successfully!</span>
                    </div>
                    <div className="aspect-video rounded-xl overflow-hidden border border-emerald-200 bg-white flex items-center justify-center shadow-sm">
                      <img src={croppedImageUrl} alt="Cropped preview" className="max-h-full object-contain" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs text-slate-500 font-bold uppercase">Output Size</span>
                        <span className="text-sm font-bold text-emerald-600">{croppedSize}</span>
                      </div>
                      <button 
                        onClick={handleDownload}
                        className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 flex items-center justify-center space-x-2 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Cropped Image</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
          { icon: Scissors, title: "Precision cropping", desc: "Interactive crop area with pixel-perfect control." },
          { icon: ImageIcon, title: "High quality output", desc: "Choose format & quality, lossless extraction." },
          { icon: Shield, title: "Secure & private", desc: "No upload – everything runs in your browser." },
          { icon: Zap, title: "Fast performance", desc: "Optimized engine with instant feedback." }
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
