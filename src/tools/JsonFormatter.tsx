import React from 'react';
import { Upload, X, Copy, Check, Info, Zap, Shield, Layout, FileJson, Download, Braces, Minimize2, Search } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [status, setStatus] = React.useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Paste JSON data, then click Format & Beautify or Minify.',
    type: 'info'
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const stats = React.useMemo(() => {
    const text = output || input;
    if (!text) return { chars: 0, lines: 0, size: '0 KB', valid: '-' };
    
    const chars = text.length;
    const lines = text.split(/\r?\n/).filter(l => l.length > 0 || l === '').length;
    const size = (chars / 1024).toFixed(2) + ' KB';
    
    let valid = '-';
    try {
      if (input.trim()) {
        JSON.parse(input);
        valid = '✓ Valid';
      }
    } catch (e) {
      valid = '✗ Invalid';
    }
    
    return { chars, lines, size, valid };
  }, [input, output]);

  const getDetailedErrorMessage = (error: Error, text: string) => {
    const message = error.message;
    
    // Common JSON error patterns
    if (message.includes('Unexpected token') || message.includes('Unexpected character')) {
      if (message.includes('in JSON at position')) {
        const posMatch = message.match(/at position (\d+)/);
        const pos = posMatch ? parseInt(posMatch[1]) : -1;
        
        if (pos !== -1) {
          const char = text[pos];
          const context = text.substring(Math.max(0, pos - 10), Math.min(text.length, pos + 10));
          
          if (char === undefined && pos === text.length) {
            return `❌ Syntax Error: Unexpected end of JSON input. Check for missing closing brackets "}" or "]".`;
          }
          
          if (char === "'") {
            return `❌ Syntax Error: JSON requires double quotes (") for strings, not single quotes ('). Found at position ${pos}.`;
          }
          
          if (char === ',') {
            return `❌ Syntax Error: Unexpected comma at position ${pos}. Check for trailing commas in objects or arrays.`;
          }

          return `❌ Syntax Error: Unexpected character "${char}" at position ${pos}. Context: "...${context}..."`;
        }
      }
    }

    if (message.includes('Unexpected end of JSON input')) {
      return `❌ Syntax Error: Incomplete JSON. Check for missing closing brackets "}" or "]".`;
    }

    if (message.includes('Expected property name or \'}')) {
      return `❌ Syntax Error: Expected a property name or a closing brace "}". Check for missing quotes around keys or trailing commas.`;
    }

    if (message.includes('Expected \',\' or \']\' after array element')) {
      return `❌ Syntax Error: Missing comma or closing bracket "]" in array.`;
    }

    if (message.includes('Expected \',\' or \'}\' after property value')) {
      return `❌ Syntax Error: Missing comma or closing brace "}" in object.`;
    }

    return `❌ Invalid JSON: ${message}`;
  };

  const formatJSON = () => {
    if (!input.trim()) {
      setStatus({ message: '⚠️ No JSON data to format.', type: 'error' });
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setStatus({ message: '✅ JSON formatted and beautified successfully!', type: 'success' });
    } catch (e) {
      setStatus({ message: getDetailedErrorMessage(e as Error, input), type: 'error' });
      setOutput('');
    }
  };

  const minifyJSON = () => {
    if (!input.trim()) {
      setStatus({ message: '⚠️ No JSON data to minify.', type: 'error' });
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setStatus({ message: '✅ JSON minified successfully!', type: 'success' });
    } catch (e) {
      setStatus({ message: getDetailedErrorMessage(e as Error, input), type: 'error' });
      setOutput('');
    }
  };

  const validateOnly = () => {
    if (!input.trim()) {
      setStatus({ message: '⚠️ No JSON data to validate.', type: 'error' });
      return;
    }
    try {
      JSON.parse(input);
      setStatus({ message: '✅ JSON is valid!', type: 'success' });
    } catch (e) {
      setStatus({ message: getDetailedErrorMessage(e as Error, input), type: 'error' });
    }
  };

  const downloadJSON = () => {
    const text = output || input;
    if (!text.trim()) {
      setStatus({ message: '⚠️ No JSON to download.', type: 'error' });
      return;
    }
    try {
      JSON.parse(text);
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'formatted.json';
      link.click();
      URL.revokeObjectURL(url);
      setStatus({ message: '✅ JSON file downloaded successfully!', type: 'success' });
    } catch (e) {
      setStatus({ message: `❌ Cannot download invalid JSON: ${(e as Error).message}`, type: 'error' });
    }
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
      try {
        JSON.parse(content);
        setStatus({ message: `✅ Successfully loaded "${file.name}". Click Format to beautify.`, type: 'success' });
      } catch (err) {
        setStatus({ message: `⚠️ File loaded but contains invalid JSON: ${(err as Error).message}`, type: 'error' });
      }
    };
    reader.readAsText(file, 'UTF-8');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setStatus({ message: '🗑️ All cleared.', type: 'info' });
  };

  const copyToClipboard = () => {
    const text = output || input;
    if (!text.trim()) {
      setStatus({ message: '⚠️ No JSON to copy.', type: 'error' });
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      setStatus({ message: '✅ JSON copied to clipboard!', type: 'success' });
      setTimeout(() => setStatus({ message: 'Ready. Paste JSON and click Format.', type: 'info' }), 2000);
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white premium-card rounded-3xl border border-gray-200/70 p-6 md:p-8 mb-12 shadow-sm w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">JSON Formatter & Validator</h2>
            <p className="text-sm text-gray-500 mt-1">Format, validate, beautify, and minify JSON data</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,application/json"
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload JSON
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
              <Braces className="h-4 w-4 text-[#0274be]" />
              Input JSON
            </label>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full h-[300px] p-4 border rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition font-mono text-sm resize-y ${status.type === 'error' && input ? 'border-red-300 bg-red-50/30' : 'border-gray-300'}`} 
              placeholder='{"name":"John","age":30,"city":"New York"}'
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
              <Layout className="h-4 w-4 text-[#0274be]" />
              Formatted JSON (Result)
            </label>
            <textarea 
              value={output}
              readOnly
              className="w-full h-[300px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition font-mono text-sm bg-gray-50/50 resize-y" 
              placeholder="Formatted JSON will appear here..."
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            onClick={formatJSON}
            className="bg-[#0274be] text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            <Check className="h-5 w-5" />
            Format & Beautify
          </button>
          <button 
            onClick={minifyJSON}
            className="bg-white border-2 border-[#0274be] text-[#0274be] font-semibold px-6 py-2.5 rounded-xl hover:bg-[#0274be]/5 transition flex items-center gap-2"
          >
            <Minimize2 className="h-5 w-5" />
            Minify
          </button>
          <button 
            onClick={validateOnly}
            className="bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-xl hover:bg-gray-100 transition flex items-center gap-2"
          >
            <Search className="h-5 w-5" />
            Validate Only
          </button>
          <button 
            onClick={downloadJSON}
            className="bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-xl hover:bg-gray-100 transition flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Download JSON
          </button>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatBox label="Characters" value={stats.chars} />
          <StatBox label="Lines" value={stats.lines} />
          <StatBox label="Size" value={stats.size} />
          <StatBox label="Status" value={stats.valid} highlight={stats.valid === '✓ Valid'} error={stats.valid === '✗ Invalid'} />
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
            title="Instant formatting"
            description="Format and beautify JSON in one click."
          />
          <FeatureCard 
            icon={<Search className="h-6 w-6 text-[#0274be]" />}
            title="Validation"
            description="Check JSON syntax and fix errors."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your JSON stays in your browser."
          />
          <FeatureCard 
            icon={<FileJson className="h-6 w-6 text-[#0274be]" />}
            title="Download & Copy"
            description="Save formatted JSON or copy to clipboard."
          />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, highlight, error }: { label: string; value: string | number, highlight?: boolean, error?: boolean }) {
  return (
    <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-200 text-center">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-xl font-bold ${highlight ? 'text-green-600' : error ? 'text-red-600' : 'text-gray-800'}`}>{value}</div>
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
