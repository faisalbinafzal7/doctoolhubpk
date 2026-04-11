import React, { useState, useRef } from 'react';
import { 
  Upload, 
  RotateCw, 
  RotateCcw, 
  FlipHorizontal, 
  FlipVertical, 
  Download, 
  RefreshCw, 
  X, 
  CheckCircle, 
  AlertCircle,
  Image as ImageIcon,
  Shield,
  Zap,
  Clock,
  Settings,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ImageRotator() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [transformedImageUrl, setTransformedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [format, setFormat] = useState<'original' | 'jpeg' | 'png' | 'webp'>('original');
  const [quality, setQuality] = useState(90);
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const [transformedDims, setTransformedDims] = useState({ w: 0, h: 0 });
  const [transformedSize, setTransformedSize] = useState<string>('');
  const [showCustomAngle, setShowCustomAngle] = useState(false);
  const [customAngle, setCustomAngle] = useState<number | ''>('');
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
    setTransformedImageUrl(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const img = new Image();
    img.onload = () => {
      setOriginalDims({ w: img.width, h: img.height });
    };
    img.src = url;
  };

  const handleRotate = (angle: number) => {
    setRotation((prev) => (prev + angle) % 360);
    setSuccess(false);
  };

  const applyTransformation = async () => {
    if (!imageUrl || !file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      const is90Or270 = Math.abs(rotation) % 180 !== 0;
      const canvasWidth = is90Or270 ? img.height : img.width;
      const canvasHeight = is90Or270 ? img.width : img.height;

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context.');

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      let outputFormat = format;
      let mimeType;
      if (outputFormat === 'original') {
        mimeType = file.type;
      } else {
        mimeType = `image/${outputFormat}`;
      }

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), mimeType, quality / 100);
      });

      if (!blob) throw new Error('Could not generate image blob.');

      const url = URL.createObjectURL(blob);
      setTransformedImageUrl(url);
      setTransformedSize(formatBytes(blob.size));
      setTransformedDims({ w: canvas.width, h: canvas.height });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to transform image.');
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
    if (!transformedImageUrl || !file) return;
    let ext = format === 'original' ? file.name.split('.').pop() : format;
    if (ext === 'jpeg') ext = 'jpg';
    const link = document.createElement('a');
    link.href = transformedImageUrl;
    link.download = `transformed_${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setFile(null);
    setImageUrl(null);
    setTransformedImageUrl(null);
    setSuccess(false);
    setError(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setFormat('original');
    setQuality(90);
    setShowCustomAngle(false);
    setCustomAngle('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetTransformation = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setSuccess(false);
    setTransformedImageUrl(null);
  };

  const sizeDiff = file && transformedSize ? ((file.size - (transformedImageUrl ? 0 : 0)) / file.size * 100).toFixed(1) : '0';

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
              <RotateCw className="w-8 h-8 text-sky-500" />
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
                  <span className="text-xs font-bold text-slate-400 uppercase mb-3 block">Original Preview</span>
                  <div className="bg-white rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center min-h-[200px] p-4 relative">
                    <div 
                      className="transition-transform duration-300 ease-in-out"
                      style={{ 
                        transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})` 
                      }}
                    >
                      <img 
                        src={imageUrl} 
                        alt="Original" 
                        className="max-w-full max-h-[300px] object-contain"
                      />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {success && transformedImageUrl && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-sky-50 p-4 rounded-2xl border border-sky-200"
                    >
                      <span className="text-xs font-bold text-sky-400 uppercase mb-3 block">Transformed Result</span>
                      <div className="bg-white rounded-xl overflow-hidden border border-sky-100 flex items-center justify-center min-h-[200px] p-4">
                        <img 
                          src={transformedImageUrl} 
                          alt="Transformed" 
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
                      <label className="text-sm font-bold text-slate-700 block mb-3">Rotate Image</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleRotate(90)}
                          className="px-4 py-3 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-sky-400 hover:text-sky-500 transition-all flex items-center justify-center gap-2"
                        >
                          <RotateCw className="w-4 h-4" />
                          90° CW
                        </button>
                        <button 
                          onClick={() => handleRotate(-90)}
                          className="px-4 py-3 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-sky-400 hover:text-sky-500 transition-all flex items-center justify-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          90° CCW
                        </button>
                        <button 
                          onClick={() => handleRotate(180)}
                          className="px-4 py-3 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-sky-400 hover:text-sky-500 transition-all flex items-center justify-center gap-2"
                        >
                          <RotateCw className="w-4 h-4" />
                          180°
                        </button>
                        <button 
                          onClick={() => setShowCustomAngle(!showCustomAngle)}
                          className={`px-4 py-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${showCustomAngle ? 'bg-sky-500 text-white border-sky-500' : 'bg-white border-slate-200 text-slate-600 hover:border-sky-400'}`}
                        >
                          <Plus className="w-4 h-4" />
                          Custom
                        </button>
                      </div>
                      
                      <AnimatePresence>
                        {showCustomAngle && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-3"
                          >
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex gap-2">
                              <input 
                                type="number" 
                                value={customAngle}
                                onChange={(e) => setCustomAngle(e.target.value === '' ? '' : parseInt(e.target.value))}
                                placeholder="Angle (0-360)"
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                              />
                              <button 
                                onClick={() => {
                                  if (typeof customAngle === 'number') {
                                    setRotation(customAngle % 360);
                                    setShowCustomAngle(false);
                                  }
                                }}
                                className="px-4 py-2 bg-sky-500 text-white text-xs font-bold rounded-lg hover:bg-sky-600 transition-colors"
                              >
                                Apply
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-3">Flip Image</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setFlipH(!flipH)}
                          className={`px-4 py-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${flipH ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-100' : 'bg-white border-slate-200 text-slate-600 hover:border-sky-400'}`}
                        >
                          <FlipHorizontal className="w-4 h-4" />
                          Horizontal
                        </button>
                        <button 
                          onClick={() => setFlipV(!flipV)}
                          className={`px-4 py-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${flipV ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-100' : 'bg-white border-slate-200 text-slate-600 hover:border-sky-400'}`}
                        >
                          <FlipVertical className="w-4 h-4" />
                          Vertical
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
                        <option value="original">Same as original</option>
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
                        disabled={format === 'png'}
                        className={`w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-500 ${format === 'png' ? 'opacity-30 cursor-not-allowed' : ''}`}
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                        <span>Small File</span>
                        <span>High Quality</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                  <button 
                    onClick={applyTransformation}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 flex items-center justify-center space-x-3 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Apply Transformation</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={resetTransformation}
                    className="px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">Transformation Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Current Rotation</span>
                    <span className="text-sm font-bold text-slate-700">{rotation}°</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">New Dimensions</span>
                    <span className="text-sm font-bold text-slate-700">{transformedDims.w ? `${transformedDims.w}x${transformedDims.h}px` : '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">New Size</span>
                    <span className="text-sm font-bold text-sky-500">{transformedSize || '-'}</span>
                  </div>
                </div>
                
                <AnimatePresence>
                  {success && transformedImageUrl && (
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleDownload}
                      className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 flex items-center justify-center space-x-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Transformed Image</span>
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
                  All rotation and flipping happens locally in your browser. Your images are never uploaded to our servers, ensuring total privacy.
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
          { icon: RotateCw, title: "Flexible rotation", desc: "Rotate by 90°, 180°, 270°, or custom angles." },
          { icon: FlipHorizontal, title: "Flip options", desc: "Flip horizontally or vertically instantly." },
          { icon: Shield, title: "100% secure", desc: "No upload — your images stay in your browser." },
          { icon: Settings, title: "Quality control", desc: "Adjust output format and compression quality." }
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
