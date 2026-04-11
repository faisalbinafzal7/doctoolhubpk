import React from 'react';
import { Upload, X, Copy, Info, Zap, Shield, FileText, Check, ArrowLeftRight, Binary } from 'lucide-react';

export default function BinaryConverter() {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [status, setStatus] = React.useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Enter text or binary, then click conversion buttons.',
    type: 'info'
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const stats = React.useMemo(() => {
    const isBinaryInput = /^[01\s]+$/.test(input.trim()) && input.trim().length > 0;
    const words = !isBinaryInput ? input.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
    const bitCount = (output.match(/[01]/g) || []).length || (isBinaryInput ? (input.match(/[01]/g) || []).length : 0);
    
    return {
      inputLength: input.length,
      outputLength: output.length,
      wordCount: !isBinaryInput ? words : 'N/A',
      bitCount: bitCount
    };
  }, [input, output]);

  const textToBinary = React.useCallback(() => {
    if (!input) {
      setStatus({ message: '⚠️ No text to convert.', type: 'error' });
      return;
    }
    
    try {
      let binaryResult = '';
      for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i);
        if (charCode > 255) {
          setStatus({ message: '⚠️ Unicode characters detected. Binary conversion supports only ASCII characters (0-255).', type: 'error' });
          return;
        }
        const binaryChar = charCode.toString(2).padStart(8, '0');
        binaryResult += binaryChar + ' ';
      }
      const result = binaryResult.trim();
      setOutput(result);
      setStatus({ message: '✅ Converted text to binary successfully!', type: 'success' });
    } catch (e) {
      setStatus({ message: `❌ Conversion failed: ${(e as Error).message}`, type: 'error' });
    }
  }, [input]);

  const binaryToText = React.useCallback(() => {
    const binary = input.trim();
    if (!binary) {
      setStatus({ message: '⚠️ No binary data to convert.', type: 'error' });
      return;
    }
    
    try {
      const cleanBinary = binary.replace(/\s/g, '');
      if (cleanBinary.length % 8 !== 0) {
        setStatus({ message: '⚠️ Invalid binary length. Binary string length must be a multiple of 8.', type: 'error' });
        return;
      }
      
      let textResult = '';
      for (let i = 0; i < cleanBinary.length; i += 8) {
        const byte = cleanBinary.substr(i, 8);
        if (!/^[01]+$/.test(byte)) {
          setStatus({ message: '⚠️ Invalid binary format. Only 0s and 1s are allowed.', type: 'error' });
          return;
        }
        const charCode = parseInt(byte, 2);
        textResult += String.fromCharCode(charCode);
      }
      
      setOutput(textResult);
      setStatus({ message: '✅ Converted binary to text successfully!', type: 'success' });
    } catch (e) {
      setStatus({ message: `❌ Conversion failed: Invalid binary format. ${(e as Error).message}`, type: 'error' });
    }
  }, [input]);

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
      setTimeout(() => setStatus({ message: 'Ready. Enter text or binary to convert.', type: 'info' }), 2000);
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
      setStatus({ message: `✅ Successfully loaded "${file.name}". Click conversion buttons to process.`, type: 'success' });
    };
    reader.onerror = () => {
      setStatus({ message: '❌ Failed to read file.', type: 'error' });
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
            <h2 className="text-xl font-semibold text-gray-800">Binary Converter</h2>
            <p className="text-sm text-gray-500 mt-1">Convert text to binary (0s and 1s) and binary back to text</p>
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
              className="bg-white border-2 border-[#0274be] text-[#0274be] font-medium px-4 py-2 rounded-xl text-sm hover:bg-[#0274be]/5 transition flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Result
            </button>
          </div>
        </div>

        {/* INPUT & OUTPUT SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Input Section */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#0274be]" />
              Text / Binary Input
            </label>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-[200px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition font-mono text-sm resize-y" 
              placeholder="Enter text to convert to binary...&#10;&#10;Example:&#10;Hello World&#10;&#10;Or enter binary to convert to text:&#10;01001000 01100101 01101100 01101100 01101111"
            />
          </div>

          {/* Output Section */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
              <Check className="h-4 w-4 text-[#0274be]" />
              Converted Result
            </label>
            <textarea 
              value={output}
              readOnly
              className="w-full h-[200px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition font-mono text-sm bg-gray-50/50 resize-y" 
              placeholder="Result will appear here..."
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            onClick={textToBinary}
            className="bg-[#0274be] text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            <Binary className="h-5 w-5" />
            Text → Binary
          </button>
          <button 
            onClick={binaryToText}
            className="bg-white border-2 border-[#0274be] text-[#0274be] font-semibold px-6 py-2.5 rounded-xl hover:bg-[#0274be]/5 transition flex items-center gap-2"
          >
            <Binary className="h-5 w-5" />
            Binary → Text
          </button>
          <button 
            onClick={swapText}
            className="bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-xl hover:bg-gray-100 transition flex items-center gap-2"
          >
            <ArrowLeftRight className="h-5 w-5" />
            Swap (Input ↔ Output)
          </button>
        </div>

        {/* STATISTICS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatBox label="Input Length" value={stats.inputLength} />
          <StatBox label="Output Length" value={stats.outputLength} />
          <StatBox label="Words (Text)" value={stats.wordCount} />
          <StatBox label="Binary Bits" value={stats.bitCount} accent />
        </div>

        {/* INFORMATION NOTE */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-[#0274be] mt-0.5 shrink-0" />
            <div className="text-sm text-gray-600">
              <strong className="font-semibold text-gray-800">About Binary Conversion:</strong> Each character is converted to its 8-bit binary representation (ASCII/UTF-8). For binary input, spaces between bytes are optional. Supports standard ASCII characters (0-255).
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
            title="Instant conversion"
            description="Convert text to binary and back in milliseconds."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="ASCII support"
            description="Handles standard ASCII characters (0-255)."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your data stays in your browser."
          />
          <FeatureCard 
            icon={<Upload className="h-6 w-6 text-[#0274be]" />}
            title="File upload"
            description="Upload TXT files for batch conversion."
          />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-200 text-center">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-xl font-bold ${accent ? 'text-[#0274be]' : 'text-gray-800'}`}>{value}</div>
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
