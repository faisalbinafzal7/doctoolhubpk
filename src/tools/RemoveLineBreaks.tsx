import React from 'react';
import { Upload, X, Copy, RefreshCw, ArrowLeftRight, Check, Info, Zap, Shield, Layout, FileText, Scissors, Trash2 } from 'lucide-react';

export default function RemoveLineBreaks() {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [options, setOptions] = React.useState({
    removeAllLineBreaks: true,
    removeDoubleSpaces: true,
    trimSpaces: true
  });
  const [status, setStatus] = React.useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Paste text with line breaks, select options, and click Process to clean.',
    type: 'info'
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const stats = React.useMemo(() => {
    const inputLines = input.split(/\r?\n/).filter(line => line.length > 0 || line === '').length;
    const outputLines = output.split(/\r?\n/).filter(line => line.length > 0 || line === '').length;
    return {
      beforeChars: input.length,
      afterChars: output.length,
      beforeLines: input ? inputLines : 0,
      afterLines: output ? outputLines : 0
    };
  }, [input, output]);

  const processText = React.useCallback(() => {
    let text = input;
    if (!text) {
      setOutput('');
      setStatus({ message: '⚠️ No text to process. Please paste some text.', type: 'error' });
      return;
    }

    const originalText = text;

    if (options.removeAllLineBreaks) {
      text = text.replace(/\r?\n/g, ' ');
    }

    if (options.removeDoubleSpaces) {
      text = text.replace(/\s+/g, ' ');
    }

    if (options.trimSpaces) {
      text = text.trim();
    }

    setOutput(text);
    
    const linesRemoved = originalText.split(/\r?\n/).length - text.split(/\r?\n/).length;
    const spacesRemoved = (originalText.match(/\s+/g) || []).length - (text.match(/\s+/g) || []).length;
    
    setStatus({ 
      message: `✅ Processing complete! Removed ${linesRemoved} line break(s) and cleaned ${spacesRemoved} extra space(s).`, 
      type: 'success' 
    });
  }, [input, options]);

  // Auto-process when options change if there is input
  React.useEffect(() => {
    if (input) {
      processText();
    }
  }, [options, processText]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setStatus({ message: '❌ File too large. Maximum size is 10MB.', type: 'error' });
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      setStatus({ message: '⚠️ PDF files require text extraction. Please copy and paste text from PDF manually.', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (extension === 'doc' || extension === 'docx') {
        setStatus({ message: '⚠️ For best results with Word documents, please copy and paste the content directly.', type: 'info' });
        setInput(content + '\n\n[Note: Extracted text may have limited formatting]');
      } else {
        setInput(content);
        setStatus({ message: `✅ Successfully loaded "${file.name}". Click Process to clean.`, type: 'success' });
      }
    };
    reader.readAsText(file, 'UTF-8');
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    setStatus({ message: '🗑️ All text cleared.', type: 'info' });
  };

  const copyToClipboard = () => {
    if (!output.trim()) {
      setStatus({ message: '⚠️ No output text to copy.', type: 'error' });
      return;
    }
    navigator.clipboard.writeText(output).then(() => {
      setStatus({ message: '✅ Cleaned text copied to clipboard!', type: 'success' });
      setTimeout(() => setStatus({ message: 'Ready. Paste text and click Process.', type: 'info' }), 2000);
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white premium-card rounded-3xl border border-gray-200/70 p-6 md:p-8 mb-12 shadow-sm w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Remove Line Breaks & Clean Text</h2>
            <p className="text-sm text-gray-500 mt-1">Remove line breaks, extra spaces, and normalize text formatting</p>
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
              <Trash2 className="h-4 w-4" />
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
              <FileText className="h-4 w-4 text-[#0274be]" />
              Original Text
            </label>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-[200px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition font-mono text-sm resize-y" 
              placeholder="Paste your text with line breaks here..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
              <Check className="h-4 w-4 text-[#0274be]" />
              Cleaned Text (Result)
            </label>
            <textarea 
              value={output}
              readOnly
              className="w-full h-[200px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition font-mono text-sm bg-gray-50/50 resize-y" 
              placeholder="Cleaned text will appear here..."
            />
          </div>
        </div>

        {/* OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <OptionCard 
            id="removeAllLineBreaks"
            label="Remove all line breaks"
            description="Convert entire text to a single line"
            checked={options.removeAllLineBreaks}
            onChange={(checked) => setOptions(prev => ({ ...prev, removeAllLineBreaks: checked }))}
          />
          <OptionCard 
            id="removeDoubleSpaces"
            label="Remove extra spaces"
            description="Replace multiple spaces with single space"
            checked={options.removeDoubleSpaces}
            onChange={(checked) => setOptions(prev => ({ ...prev, removeDoubleSpaces: checked }))}
          />
          <OptionCard 
            id="trimSpaces"
            label="Trim leading/trailing spaces"
            description="Remove spaces from beginning and end"
            checked={options.trimSpaces}
            onChange={(checked) => setOptions(prev => ({ ...prev, trimSpaces: checked }))}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button 
            onClick={processText}
            className="bg-[#0274be] text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 flex-1"
          >
            <Check className="h-5 w-5" />
            Process & Clean Text
          </button>
          <button 
            onClick={swapText}
            className="bg-white border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            <ArrowLeftRight className="h-5 w-5" />
            Swap (Input ↔ Output)
          </button>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatBox label="Before (Chars)" value={stats.beforeChars} />
          <StatBox label="After (Chars)" value={stats.afterChars} highlight />
          <StatBox label="Before (Lines)" value={stats.beforeLines} />
          <StatBox label="After (Lines)" value={stats.afterLines} highlight />
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
            title="Instant cleaning"
            description="Remove line breaks and normalize text in seconds."
          />
          <FeatureCard 
            icon={<Scissors className="h-6 w-6 text-[#0274be]" />}
            title="Multiple options"
            description="Remove line breaks, extra spaces, and trim text."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your text never leaves your browser."
          />
          <FeatureCard 
            icon={<Layout className="h-6 w-6 text-[#0274be]" />}
            title="File upload"
            description="Upload TXT, DOC, DOCX files for processing."
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
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-gray-300 text-[#0274be] focus:ring-[#0274be] cursor-pointer" 
        />
        <label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer">{label}</label>
      </div>
      <p className="text-xs text-gray-500 ml-6">{description}</p>
    </div>
  );
}

function StatBox({ label, value, highlight }: { label: string; value: number, highlight?: boolean }) {
  return (
    <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-200 text-center">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-xl font-bold ${highlight ? 'text-[#0274be]' : 'text-gray-800'}`}>{value}</div>
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
