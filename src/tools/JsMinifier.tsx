import React from 'react';
import { Upload, X, Copy, Info, Zap, Shield, FileText, Check, RotateCcw, Download, Code } from 'lucide-react';
import { minify } from 'terser';

export default function JsMinifier() {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [options, setOptions] = React.useState({
    removeComments: true,
    compressCode: true,
    mangleNames: false
  });
  const [status, setStatus] = React.useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Paste JavaScript code, select options, and click Minify JS.',
    type: 'info'
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const stats = React.useMemo(() => {
    const originalBytes = new Blob([input]).size;
    const minifiedBytes = new Blob([output]).size;
    const saved = originalBytes > 0 ? ((originalBytes - minifiedBytes) / originalBytes * 100).toFixed(1) : '0';
    const originalLines = input.split(/\r?\n/).length;
    const minifiedLines = output.split(/\r?\n/).length;

    return {
      originalSize: formatSize(originalBytes),
      minifiedSize: formatSize(minifiedBytes),
      savedPercent: saved + '%',
      linesRemoved: input ? Math.max(0, originalLines - minifiedLines) : 0
    };
  }, [input, output]);

  function formatSize(bytes: number) {
    if (bytes === 0) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(2) + ' KB';
    return (kb / 1024).toFixed(2) + ' MB';
  }

  const minifyJS = React.useCallback(async () => {
    if (!input) {
      setStatus({ message: '⚠️ No JavaScript code to minify.', type: 'error' });
      return;
    }

    setStatus({ message: '⏳ Minifying JavaScript...', type: 'info' });

    try {
      const result = await minify(input, {
        compress: options.compressCode,
        mangle: options.mangleNames,
        format: {
          comments: options.removeComments ? false : /^!|@preserve|@license|@cc_on/i,
          beautify: false
        }
      });

      if (result.code) {
        setOutput(result.code);
        const originalBytes = new Blob([input]).size;
        const minifiedBytes = new Blob([result.code]).size;
        const originalSizeKB = (originalBytes / 1024).toFixed(2);
        const minifiedSizeKB = (minifiedBytes / 1024).toFixed(2);
        setStatus({ 
          message: `✅ JavaScript minified successfully! Reduced from ${originalSizeKB} KB to ${minifiedSizeKB} KB.`, 
          type: 'success' 
        });
      }
    } catch (error) {
      console.error(error);
      setStatus({ message: `❌ Minification failed: ${(error as Error).message}`, type: 'error' });
    }
  }, [input, options]);

  const resetOptions = () => {
    setOptions({
      removeComments: true,
      compressCode: true,
      mangleNames: false
    });
    setStatus({ message: '🔄 Options reset to default.', type: 'info' });
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setStatus({ message: '🗑️ All cleared.', type: 'info' });
  };

  const copyToClipboard = () => {
    if (!output) {
      setStatus({ message: '⚠️ No minified JavaScript to copy.', type: 'error' });
      return;
    }
    navigator.clipboard.writeText(output).then(() => {
      setStatus({ message: '✅ Minified JavaScript copied to clipboard!', type: 'success' });
      setTimeout(() => setStatus({ message: 'Ready. Paste JS and click Minify.', type: 'info' }), 2000);
    });
  };

  const downloadJS = () => {
    if (!output) {
      setStatus({ message: '⚠️ No minified JavaScript to download.', type: 'error' });
      return;
    }
    const blob = new Blob([output], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'minified.js';
    link.click();
    URL.revokeObjectURL(url);
    setStatus({ message: '✅ Minified JavaScript downloaded successfully!', type: 'success' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatus({ message: '❌ File too large. Maximum size is 5MB.', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      setStatus({ message: `✅ Successfully loaded "${file.name}". Click Minify to process.`, type: 'success' });
    };
    reader.onerror = () => {
      setStatus({ message: '❌ Failed to read file.', type: 'error' });
    };
    reader.readAsText(file, 'UTF-8');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  React.useEffect(() => {
    if (input) {
      minifyJS();
    }
  }, [options, input, minifyJS]);

  return (
    <div className="space-y-8">
      <div className="bg-white premium-card rounded-3xl border border-gray-200/70 p-6 md:p-8 mb-12 shadow-sm w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">JavaScript Minifier</h2>
            <p className="text-sm text-gray-500 mt-1">Remove unnecessary spaces, line breaks, and comments to reduce JS file size</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".js,text/javascript"
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload JS
            </button>
            <button 
              onClick={clearAll}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
            <button 
              onClick={copyToClipboard}
              className="bg-white border-2 border-[#0274be] text-[#0274be] font-medium px-4 py-2 rounded-xl text-sm hover:bg-[#0274be]/5 transition flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Minified
            </button>
          </div>
        </div>

        {/* INPUT & OUTPUT SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Input Section */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#0274be]" />
              Input JavaScript
            </label>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-[250px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition font-mono text-sm resize-y" 
              placeholder="Paste your JavaScript code here...&#10;&#10;Example:&#10;function hello() {&#10;  console.log(&quot;Hello World!&quot;);&#10;}&#10;&#10;const sum = (a, b) => {&#10;  return a + b;&#10;}"
            />
          </div>

          {/* Output Section */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
              <Check className="h-4 w-4 text-[#0274be]" />
              Minified JavaScript
            </label>
            <textarea 
              value={output}
              readOnly
              className="w-full h-[250px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition font-mono text-sm bg-gray-50/50 resize-y" 
              placeholder="Minified JavaScript will appear here..."
            />
          </div>
        </div>

        {/* MINIFICATION OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <OptionCard 
            id="removeComments"
            label="Remove comments"
            description="Removes // and /* */ comments"
            checked={options.removeComments}
            onChange={(checked) => setOptions(prev => ({ ...prev, removeComments: checked }))}
          />
          <OptionCard 
            id="compressCode"
            label="Compress code"
            description="Remove extra spaces and line breaks"
            checked={options.compressCode}
            onChange={(checked) => setOptions(prev => ({ ...prev, compressCode: checked }))}
          />
          <OptionCard 
            id="mangleNames"
            label="Mangle variable names"
            description="Shorten variable and function names"
            checked={options.mangleNames}
            onChange={(checked) => setOptions(prev => ({ ...prev, mangleNames: checked }))}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            onClick={minifyJS}
            className="bg-[#0274be] text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            <Zap className="h-5 w-5" />
            Minify JS
          </button>
          <button 
            onClick={resetOptions}
            className="bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-xl hover:bg-gray-100 transition flex items-center gap-2"
          >
            <RotateCcw className="h-5 w-5" />
            Reset Options
          </button>
          <button 
            onClick={downloadJS}
            className="bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-xl hover:bg-gray-100 transition flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Download Minified
          </button>
        </div>

        {/* STATISTICS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatBox label="Original Size" value={stats.originalSize} />
          <StatBox label="Minified Size" value={stats.minifiedSize} accent />
          <StatBox label="Saved" value={stats.savedPercent} success />
          <StatBox label="Lines Removed" value={stats.linesRemoved} />
        </div>

        {/* INFORMATION NOTE */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-[#0274be] mt-0.5 shrink-0" />
            <div className="text-sm text-gray-600">
              <strong className="font-semibold text-gray-800">About JavaScript Minification:</strong> Minifying JS removes unnecessary characters without changing functionality. This reduces file size, improves page load times, and saves bandwidth. The original code structure and logic remain intact. Uses Terser for safe minification.
            </div>
          </div>
        </div>

        {/* STATUS / FEEDBACK */}
        <div className="min-h-[50px]">
          <div className={`text-sm p-3 rounded-xl flex items-center gap-2 ${
            status.type === 'error' ? 'bg-red-100 text-red-700' : 
            status.type === 'success' ? 'bg-green-100 text-green-700' : 
            'bg-gray-100 text-gray-700'
          }`}>
            <Info className="h-4 w-4" />
            {status.message}
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="bg-white py-10 border-t border-gray-100 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Why choose DocToolHubPK?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-[#0274be]" />}
            title="Instant minification"
            description="Reduce JS file size in milliseconds."
          />
          <FeatureCard 
            icon={<Code className="h-6 w-6 text-[#0274be]" />}
            title="Terser engine"
            description="Professional minification with Terser."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your code stays in your browser."
          />
          <FeatureCard 
            icon={<Download className="h-6 w-6 text-[#0274be]" />}
            title="Download & copy"
            description="Save minified JS or copy to clipboard."
          />
        </div>
      </div>
    </div>
  );
}

function OptionCard({ id, label, description, checked, onChange }: { id: string, label: string, description: string, checked: boolean, onChange: (checked: boolean) => void }) {
  return (
    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <input 
          type="checkbox" 
          id={id} 
          className="rounded border-gray-300 text-[#0274be] focus:ring-[#0274be] w-4 h-4" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer">{label}</label>
      </div>
      <p className="text-xs text-gray-500 ml-6">{description}</p>
    </div>
  );
}

function StatBox({ label, value, accent, success }: { label: string; value: string | number; accent?: boolean; success?: boolean }) {
  return (
    <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-200 text-center">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-xl font-bold ${accent ? 'text-[#0274be]' : success ? 'text-green-600' : 'text-gray-800'}`}>{value}</div>
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
