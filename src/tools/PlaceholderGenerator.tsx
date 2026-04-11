import React from 'react';
import { Download, Copy, RefreshCw, Image as ImageIcon, Settings, Palette, Maximize } from 'lucide-react';

export default function PlaceholderGenerator() {
  const [width, setWidth] = React.useState(600);
  const [height, setHeight] = React.useState(400);
  const [text, setText] = React.useState('');
  const [bgColor, setBgColor] = React.useState('cccccc');
  const [textColor, setTextColor] = React.useState('000000');
  const [format, setFormat] = React.useState('png');
  const [copied, setCopied] = React.useState(false);

  const placeholderUrl = React.useMemo(() => {
    const baseUrl = `https://placehold.co/${width}x${height}/${bgColor}/${textColor}/${format}`;
    const params = new URLSearchParams();
    if (text) params.append('text', text);
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }, [width, height, text, bgColor, textColor, format]);

  const handleCopy = () => {
    navigator.clipboard.writeText(placeholderUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(placeholderUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `placeholder-${width}x${height}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-5 w-5 text-sky-500" />
              <h3 className="font-semibold text-gray-800">Image Dimensions</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Custom Text (Optional)</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Hero Image"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-700">Background Color</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={`#${bgColor}`}
                    onChange={(e) => setBgColor(e.target.value.replace('#', ''))}
                    className="h-10 w-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value.replace('#', ''))}
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm font-mono uppercase"
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {['cccccc', '000000', 'ffffff', '3b82f6', 'ef4444', '10b981'].map(c => (
                    <button
                      key={c}
                      onClick={() => setBgColor(c)}
                      className="w-6 h-6 rounded border border-gray-200 shadow-sm"
                      style={{ backgroundColor: `#${c}` }}
                      title={`#${c}`}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-700">Text Color</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={`#${textColor}`}
                    onChange={(e) => setTextColor(e.target.value.replace('#', ''))}
                    className="h-10 w-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value.replace('#', ''))}
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm font-mono uppercase"
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {['000000', 'ffffff', '666666', '3b82f6', 'ef4444', '10b981'].map(c => (
                    <button
                      key={c}
                      onClick={() => setTextColor(c)}
                      className="w-6 h-6 rounded border border-gray-200 shadow-sm"
                      style={{ backgroundColor: `#${c}` }}
                      title={`#${c}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Format</label>
              <div className="flex gap-2">
                {['png', 'jpg', 'webp', 'svg'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                      format === f 
                        ? 'bg-sky-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-inner flex flex-col items-center justify-center min-h-[400px]">
            <div className="mb-4 text-sm font-medium text-gray-500 flex items-center gap-2">
              <Maximize className="h-4 w-4" />
              Preview: {width} x {height}
            </div>
            <div className="relative group max-w-full overflow-hidden rounded-lg shadow-lg bg-white">
              <img
                src={placeholderUrl}
                alt="Placeholder Preview"
                className="max-w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="mt-8 w-full space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  {copied ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Copy className="h-5 w-5" />}
                  {copied ? 'Copied!' : 'Copy URL'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-sky-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-sky-600 transition flex items-center justify-center gap-2 shadow-lg shadow-sky-200"
                >
                  <Download className="h-5 w-5" />
                  Download
                </button>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-xl text-xs font-mono text-gray-500 break-all select-all">
                {placeholderUrl}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
        <h4 className="font-bold text-sky-900 mb-2 flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          How to use this tool
        </h4>
        <p className="text-sm text-sky-800 leading-relaxed">
          This tool generates dynamic placeholder images using the <strong>placehold.co</strong> API. 
          You can customize the dimensions, colors, and text to match your design requirements. 
          The generated URL can be used directly in your HTML/CSS code or downloaded as a file.
        </p>
      </div>
    </div>
  );
}
