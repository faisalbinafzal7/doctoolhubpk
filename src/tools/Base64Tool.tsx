import React from 'react';
import { Upload, X, Copy, ArrowLeftRight, Check, Info, Zap, Shield, Layout, FileText, Binary, Lock, Search } from 'lucide-react';

export default function Base64Tool() {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [status, setStatus] = React.useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Enter text, then click Encode to Base64 or Decode from Base64.',
    type: 'info'
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const stats = React.useMemo(() => {
    const text = input || '';
    const chars = text.length;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const lines = text.split(/\r?\n/).filter(l => l.length > 0 || l === '').length;
    const size = (chars / 1024).toFixed(2) + ' KB';
    
    return { chars, words, lines, size };
  }, [input]);

  const encodeBase64 = () => {
    if (!input) {
      setStatus({ message: '⚠️ No text to encode.', type: 'error' });
      return;
    }
    try {
      // Use btoa with UTF-8 support
      const utf8Bytes = unescape(encodeURIComponent(input));
      const encoded = btoa(utf8Bytes);
      setOutput(encoded);
      setStatus({ message: '✅ Encoded to Base64 successfully!', type: 'success' });
    } catch (e) {
      setStatus({ message: `❌ Encoding failed: ${(e as Error).message}`, type: 'error' });
    }
  };

  const decodeBase64 = () => {
    if (!input) {
      setStatus({ message: '⚠️ No Base64 text to decode.', type: 'error' });
      return;
    }
    try {
      const decodedBytes = atob(input);
      const decoded = decodeURIComponent(escape(decodedBytes));
      setOutput(decoded);
      setStatus({ message: '✅ Decoded from Base64 successfully!', type: 'success' });
    } catch (e) {
      setStatus({ message: `❌ Decoding failed: Invalid Base64 string. ${(e as Error).message}`, type: 'error' });
    }
  };

  const swapText = () => {
    if (!input && !output) {
      setStatus({ message: '⚠️ No text to swap.', type: 'error' });
      return;
    }
    const oldInput = input;
    setInput(output);
    setOutput(oldInput);
    setStatus({ message: '🔄 Swapped input and output.', type: 'info' });
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setStatus({ message: '🗑️ All cleared.', type: 'info' });
  };

  const copyToClipboard = () => {
    if (!output) {
      setStatus({ message: '⚠️ No output text to copy.', type: 'error' });
      return;
    }
    navigator.clipboard.writeText(output).then(() => {
      setStatus({ message: '✅ Text copied to clipboard!', type: 'success' });
      setTimeout(() => setStatus({ message: 'Ready. Enter text and click Encode or Decode.', type: 'info' }), 2000);
    });
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
      setStatus({ message: `✅ Successfully loaded "${file.name}". Click Encode or Decode to process.`, type: 'success' });
    };
    reader.readAsText(file, 'UTF-8');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      <div className="bg-white premium-card rounded-3xl border border-gray-200/70 p-6 md:p-8 mb-12 shadow-sm w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Base64 Encoder / Decoder</h2>
            <p className="text-sm text-gray-500 mt-1">Convert text to Base64 format or decode Base64 back to original text</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.doc,.docx,text/plain"
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload File
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
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
          </div>
        </div>

        {/* INPUT & OUTPUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
              <Binary className="h-4 w-4 text-[#0274be]" />
              Input Text / Base64
            </label>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-[200px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition font-mono text-sm resize-y" 
              placeholder="Enter text to encode or Base64 to decode...&#10;&#10;Example for Encode:&#10;Hello World!&#10;&#10;Example for Decode:&#10;SGVsbG8gV29ybGQh"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#0274be]" />
              Result (Encoded / Decoded)
            </label>
            <textarea 
              value={output}
              readOnly
              className="w-full h-[200px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition font-mono text-sm bg-gray-50/50 resize-y" 
              placeholder="Result will appear here..."
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            onClick={encodeBase64}
            className="bg-[#0274be] text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            <Check className="h-5 w-5" />
            Encode to Base64
          </button>
          <button 
            onClick={decodeBase64}
            className="bg-white border-2 border-[#0274be] text-[#0274be] font-semibold px-6 py-2.5 rounded-xl hover:bg-[#0274be]/5 transition flex items-center gap-2"
          >
            <Search className="h-5 w-5" />
            Decode from Base64
          </button>
          <button 
            onClick={swapText}
            className="bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-xl hover:bg-gray-100 transition flex items-center gap-2"
          >
            <ArrowLeftRight className="h-5 w-5" />
            Swap (Input ↔ Output)
          </button>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatBox label="Characters" value={stats.chars} />
          <StatBox label="Words" value={stats.words} />
          <StatBox label="Lines" value={stats.lines} />
          <StatBox label="Size" value={stats.size} />
        </div>

        {/* STATUS */}
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

      {/* FEATURES */}
      <div className="bg-white py-10 border-t border-gray-100 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Why choose DocToolHubPK?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-[#0274be]" />}
            title="Instant conversion"
            description="Encode or decode Base64 with one click."
          />
          <FeatureCard 
            icon={<Binary className="h-6 w-6 text-[#0274be]" />}
            title="Unicode support"
            description="Handles all Unicode characters and special symbols."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your data stays in your browser."
          />
          <FeatureCard 
            icon={<FileText className="h-6 w-6 text-[#0274be]" />}
            title="File upload"
            description="Upload TXT files for batch processing."
          />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-200 text-center">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="text-xl font-bold text-gray-800">{value}</div>
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
