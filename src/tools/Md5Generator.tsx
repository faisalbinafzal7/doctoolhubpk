import React from 'react';
import CryptoJS from 'crypto-js';
import { Upload, X, Copy, Info, Zap, Shield, FileText, Check, Search, Hash } from 'lucide-react';

export default function Md5Generator() {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [status, setStatus] = React.useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Enter text or upload a file, then click Generate MD5 Hash.',
    type: 'info'
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const stats = React.useMemo(() => {
    const text = input || '';
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    return {
      inputLength: text.length,
      hashLength: output ? output.length : 0,
      wordCount: words
    };
  }, [input, output]);

  const generateMD5 = React.useCallback(() => {
    if (!input) {
      setOutput('');
      setStatus({ message: '⚠️ No text to hash. Please enter some text.', type: 'error' });
      return;
    }
    try {
      const hash = CryptoJS.MD5(input).toString();
      setOutput(hash);
      setStatus({ message: '✅ MD5 hash generated successfully!', type: 'success' });
    } catch (e) {
      setStatus({ message: `❌ Hash generation failed: ${(e as Error).message}`, type: 'error' });
    }
  }, [input]);

  const clearInput = () => {
    setInput('');
    setOutput('');
    setStatus({ message: '🗑️ Input cleared.', type: 'info' });
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setStatus({ message: '🗑️ All cleared.', type: 'info' });
  };

  const copyToClipboard = () => {
    if (!output) {
      setStatus({ message: '⚠️ No hash to copy. Generate a hash first.', type: 'error' });
      return;
    }
    navigator.clipboard.writeText(output).then(() => {
      setStatus({ message: '✅ MD5 hash copied to clipboard!', type: 'success' });
      setTimeout(() => setStatus({ message: 'Ready. Enter text and generate MD5 hash.', type: 'info' }), 2000);
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
      // Auto generate hash after upload
      const hash = CryptoJS.MD5(content).toString();
      setOutput(hash);
      setStatus({ message: `✅ Successfully loaded "${file.name}". MD5 hash generated.`, type: 'success' });
    };
    reader.onerror = () => {
      setStatus({ message: '❌ Failed to read file.', type: 'error' });
    };
    reader.readAsText(file, 'UTF-8');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Update hash on input change (optional, but user's code had onInputChange)
  React.useEffect(() => {
    if (input) {
      const hash = CryptoJS.MD5(input).toString();
      setOutput(hash);
    } else {
      setOutput('');
    }
  }, [input]);

  return (
    <div className="space-y-8">
      <div className="bg-white premium-card rounded-3xl border border-gray-200/70 p-6 md:p-8 mb-12 shadow-sm w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">MD5 Hash Generator</h2>
            <p className="text-sm text-gray-500 mt-1">Generate MD5 hash from text or files (32-character hexadecimal)</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.doc,.docx,application/json,text/plain"
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
              className="bg-white border-2 border-[#0274be] text-[#0274be] font-medium px-4 py-2 rounded-xl text-sm hover:bg-[#0274be]/5 transition flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Hash
            </button>
          </div>
        </div>

        {/* INPUT SECTION */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#0274be]" />
            Input Text
          </label>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-[150px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition font-mono text-sm resize-y" 
            placeholder="Enter text to generate MD5 hash...&#10;&#10;Example:&#10;Hello World&#10;password123&#10;https://www.doctoolhubpk.com"
          />
        </div>

        {/* OUTPUT SECTION */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
            <Hash className="h-4 w-4 text-[#0274be]" />
            MD5 Hash (32 characters)
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={output}
              readOnly
              className="w-full p-4 pr-24 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition bg-gray-50/50 font-mono text-sm" 
              placeholder="MD5 hash will appear here..."
            />
            <button 
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0274be] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#02609e] transition flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            onClick={generateMD5}
            className="bg-[#0274be] text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            <Check className="h-5 w-5" />
            Generate MD5 Hash
          </button>
          <button 
            onClick={clearInput}
            className="bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-xl hover:bg-gray-100 transition flex items-center gap-2"
          >
            <X className="h-5 w-5" />
            Clear Input
          </button>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatBox label="Input Length" value={stats.inputLength} />
          <StatBox label="Hash Length" value={stats.hashLength} />
          <StatBox label="Words" value={stats.wordCount} />
          <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-200 text-center flex flex-col justify-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Hash Format</div>
            <div className="text-sm font-bold text-[#0274be] mt-1 uppercase tracking-tight">MD5 (32-char)</div>
          </div>
        </div>

        {/* INFO NOTE */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-[#0274be] mt-0.5 shrink-0" />
            <div className="text-sm text-gray-600">
              <strong className="font-semibold text-gray-800">About MD5:</strong> MD5 is a 128-bit cryptographic hash function that produces a 32-character hexadecimal string. While commonly used for checksums and data integrity verification, it's no longer considered secure for cryptographic purposes due to known collision vulnerabilities.
            </div>
          </div>
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
            title="Instant hashing"
            description="Generate MD5 hash in milliseconds."
          />
          <FeatureCard 
            icon={<Search className="h-6 w-6 text-[#0274be]" />}
            title="Standard MD5"
            description="Produces 32-character hexadecimal hash."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your data stays in your browser."
          />
          <FeatureCard 
            icon={<FileText className="h-6 w-6 text-[#0274be]" />}
            title="File support"
            description="Upload files to generate their MD5 hash."
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
