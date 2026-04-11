import React from 'react';
import { X, Copy, Type, CaseUpper, CaseLower, CaseSensitive, Baseline, ArrowLeftRight, Sparkles, Info, Zap, Shield, Layout, BarChart3 } from 'lucide-react';

export default function CaseConverter() {
  const [text, setText] = React.useState('');
  const [status, setStatus] = React.useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Type or paste text, then click any case button to convert',
    type: 'info'
  });

  const stats = React.useMemo(() => {
    if (!text || text.trim() === '') {
      return { chars: 0, words: 0, lines: 0, paragraphs: 0 };
    }
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const lines = text.split(/\r?\n/).filter(line => line.length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    return {
      chars: text.length,
      words: words.length,
      lines: lines.length,
      paragraphs: paragraphs.length
    };
  }, [text]);

  const showStatus = (message: string, type: 'info' | 'success' | 'error') => {
    setStatus({ message, type });
    if (type === 'success') {
      setTimeout(() => {
        setStatus({ message: 'Ready. Click any case button to convert.', type: 'info' });
      }, 2000);
    }
  };

  const toUpperCase = () => {
    if (!text.trim()) return showStatus('⚠️ No text to convert.', 'error');
    setText(text.toUpperCase());
    showStatus('✅ Converted to UPPERCASE', 'success');
  };

  const toLowerCase = () => {
    if (!text.trim()) return showStatus('⚠️ No text to convert.', 'error');
    setText(text.toLowerCase());
    showStatus('✅ Converted to lowercase', 'success');
  };

  const toTitleCase = () => {
    if (!text.trim()) return showStatus('⚠️ No text to convert.', 'error');
    const result = text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    setText(result);
    showStatus('✅ Converted to Title Case', 'success');
  };

  const toSentenceCase = () => {
    if (!text.trim()) return showStatus('⚠️ No text to convert.', 'error');
    const lower = text.toLowerCase();
    const result = lower.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    setText(result);
    showStatus('✅ Converted to Sentence case', 'success');
  };

  const toToggleCase = () => {
    if (!text.trim()) return showStatus('⚠️ No text to convert.', 'error');
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === char.toUpperCase()) {
        result += char.toLowerCase();
      } else {
        result += char.toUpperCase();
      }
    }
    setText(result);
    showStatus('✅ Converted to tOGGLE cASE', 'success');
  };

  const toCapitalize = () => {
    if (!text.trim()) return showStatus('⚠️ No text to convert.', 'error');
    const result = text.replace(/\b\w/g, (c) => c.toUpperCase());
    setText(result);
    showStatus('✅ Capitalized each word', 'success');
  };

  const clearText = () => {
    if (text.trim() === '') return showStatus('⚠️ Text area is already empty.', 'info');
    setText('');
    showStatus('🗑️ Text cleared.', 'info');
  };

  const copyToClipboard = () => {
    if (!text.trim()) return showStatus('⚠️ No text to copy.', 'error');
    navigator.clipboard.writeText(text).then(() => {
      showStatus('✅ Text copied to clipboard!', 'success');
    }).catch(() => {
      showStatus('❌ Failed to copy text.', 'error');
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white premium-card rounded-3xl border border-gray-200/70 p-6 md:p-8 mb-12 shadow-sm w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Text Case Converter</h2>
            <p class="text-sm text-gray-500 mt-1">Transform text between different case formats instantly</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={clearText}
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

        {/* TEXT INPUT */}
        <div className="mb-6">
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[250px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition font-mono text-sm resize-y" 
            placeholder="Type or paste your text here...&#10;&#10;Example:&#10;hello world&#10;THIS IS SAMPLE TEXT&#10;convert me to different cases"
          />
        </div>

        {/* CASE BUTTONS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <CaseButton onClick={toUpperCase} primary icon={<CaseUpper className="h-4 w-4" />} label="UPPERCASE" />
          <CaseButton onClick={toLowerCase} outline icon={<CaseLower className="h-4 w-4" />} label="lowercase" />
          <CaseButton onClick={toTitleCase} icon={<CaseSensitive className="h-4 w-4" />} label="Title Case" />
          <CaseButton onClick={toSentenceCase} icon={<Baseline className="h-4 w-4" />} label="Sentence case" />
          <CaseButton onClick={toToggleCase} icon={<ArrowLeftRight className="h-4 w-4" />} label="tOGGLE cASE" />
          <CaseButton onClick={toCapitalize} icon={<Sparkles className="h-4 w-4" />} label="Capitalize" />
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatBox label="Characters" value={stats.chars} />
          <StatBox label="Words" value={stats.words} />
          <StatBox label="Lines" value={stats.lines} />
          <StatBox label="Paragraphs" value={stats.paragraphs} />
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
            description="Convert text case in real-time with one click."
          />
          <FeatureCard 
            icon={<Type className="h-6 w-6 text-[#0274be]" />}
            title="6 case formats"
            description="UPPERCASE, lowercase, Title Case, Sentence case, tOGGLE cASE, Capitalize."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your text never leaves your browser."
          />
          <FeatureCard 
            icon={<BarChart3 className="h-6 w-6 text-[#0274be]" />}
            title="Copy & statistics"
            description="Copy result instantly and view text statistics."
          />
        </div>
      </div>
    </div>
  );
}

function CaseButton({ onClick, label, icon, primary, outline }: { onClick: () => void, label: string, icon: React.ReactNode, primary?: boolean, outline?: boolean }) {
  let className = "flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:-translate-y-0.5 ";
  if (primary) {
    className += "bg-[#0274be] text-white shadow-sm hover:shadow-md";
  } else if (outline) {
    className += "bg-white border-2 border-[#0274be] text-[#0274be] hover:bg-[#0274be]/5";
  } else {
    className += "bg-white border border-gray-300 text-gray-700 hover:border-[#0274be] hover:text-[#0274be]";
  }

  return (
    <button onClick={onClick} className={className}>
      {icon}
      {label}
    </button>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-200 text-center">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="text-xl font-bold text-[#0274be]">{value}</div>
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
