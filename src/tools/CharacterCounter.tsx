import React from 'react';
import { Upload, X, Copy, Info, Zap, Shield, Layout, BarChart3, FileText, Hash, Type, Space, Baseline, Clock, List } from 'lucide-react';

export default function CharacterCounter() {
  const [text, setText] = React.useState('');
  const [status, setStatus] = React.useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Start typing or paste text to see detailed character analysis',
    type: 'info'
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const stats = React.useMemo(() => {
    if (!text || text.trim() === '') {
      return {
        chars: 0,
        charsNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        letters: 0,
        digits: 0,
        spaces: 0,
        punctuation: 0,
        readingTime: 0,
        speakingTime: 0,
        lines: 0,
        frequency: [] as [string, number][]
      };
    }

    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const letters = (text.match(/[A-Za-z]/g) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/ /g) || []).length;
    const punctuation = (text.match(/[.,!?;:"'()\-]/g) || []).length;
    const readingTime = Math.ceil(words / 225);
    const speakingTime = Math.ceil(words / 150);
    const lines = text.split(/\r?\n/).filter(line => line.length > 0).length;

    // Frequency
    const freq: Record<string, number> = {};
    for (const char of text) {
      if (char.trim()) {
        freq[char] = (freq[char] || 0) + 1;
      }
    }
    const frequency = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      chars,
      charsNoSpaces,
      words,
      sentences,
      paragraphs,
      letters,
      digits,
      spaces,
      punctuation,
      readingTime,
      speakingTime,
      lines,
      frequency
    };
  }, [text]);

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
        setText(content + '\n\n[Note: Extracted text may have limited formatting]');
      } else {
        setText(content);
        setStatus({ message: `✅ Successfully loaded "${file.name}".`, type: 'success' });
      }
    };
    reader.onerror = () => {
      setStatus({ message: '❌ Failed to read file.', type: 'error' });
    };
    reader.readAsText(file, 'UTF-8');
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearText = () => {
    setText('');
    setStatus({ message: '🗑️ Text cleared.', type: 'info' });
  };

  const copyToClipboard = () => {
    if (!text.trim()) {
      setStatus({ message: '⚠️ No text to copy.', type: 'error' });
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      setStatus({ message: '✅ Text copied to clipboard!', type: 'success' });
      setTimeout(() => setStatus({ message: 'Ready. Type or paste text to analyze.', type: 'info' }), 2000);
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white premium-card rounded-3xl border border-gray-200/70 p-6 md:p-8 mb-12 shadow-sm w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Character Counter & Text Analyzer</h2>
            <p className="text-sm text-gray-500 mt-1">Count characters, words, sentences, and analyze text in real-time</p>
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
              Copy Text
            </button>
          </div>
        </div>

        {/* TEXT INPUT */}
        <div className="mb-6">
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[250px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition font-mono text-sm resize-y" 
            placeholder="Type or paste your text here...&#10;&#10;The character counter will automatically analyze:&#10;• Character count (with and without spaces)&#10;• Word count&#10;• Sentence count&#10;• Paragraph count&#10;• Letter count (A-Z, a-z)&#10;• Digit count (0-9)&#10;• Space count&#10;• Punctuation count&#10;• Character frequency"
          />
        </div>

        {/* MAIN STATISTICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatBox label="Characters" value={stats.chars} />
          <StatBox label="Chars (no spaces)" value={stats.charsNoSpaces} />
          <StatBox label="Words" value={stats.words} />
          <StatBox label="Sentences" value={stats.sentences} />
          <StatBox label="Paragraphs" value={stats.paragraphs} />
          <StatBox label="Letters (A-Z)" value={stats.letters} />
          <StatBox label="Digits (0-9)" value={stats.digits} />
          <StatBox label="Spaces" value={stats.spaces} />
        </div>

        {/* EXTRA METRICS & FREQUENCY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Additional Metrics */}
          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Baseline className="h-5 w-5 text-[#0274be]" />
              <span className="text-sm font-medium text-gray-700">Additional Metrics</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MetricItem label="Punctuation Count" value={stats.punctuation} />
              <MetricItem label="Reading Time" value={`${stats.readingTime} min`} />
              <MetricItem label="Speaking Time" value={`${stats.speakingTime} min`} />
              <MetricItem label="Line Count" value={stats.lines} />
            </div>
          </div>

          {/* Character Frequency */}
          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-[#0274be]" />
              <span className="text-sm font-medium text-gray-700">Character Frequency (Top 10)</span>
            </div>
            <div className="max-h-[200px] overflow-y-auto space-y-1">
              {stats.frequency.length > 0 ? (
                stats.frequency.map(([char, count], i) => (
                  <div key={i} className="flex items-center justify-between text-sm p-1 hover:bg-gray-100 rounded">
                    <span className="font-mono font-medium">{char === ' ' ? '[Space]' : char === '\n' ? '[Newline]' : char}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">{count} time{count !== 1 ? 's' : ''}</span>
                      <span className="text-xs text-gray-400">({((count / text.length) * 100).toFixed(1)}%)</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">Type or paste text to see character frequency</p>
              )}
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
            title="Real-time counting"
            description="Instant character and word count as you type."
          />
          <FeatureCard 
            icon={<BarChart3 className="h-6 w-6 text-[#0274be]" />}
            title="Detailed analysis"
            description="Characters, words, sentences, paragraphs, and frequency."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your text never leaves your browser."
          />
          <FeatureCard 
            icon={<FileText className="h-6 w-6 text-[#0274be]" />}
            title="File upload"
            description="Upload TXT, DOC, DOCX files for analysis."
          />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-gray-100 shadow-sm text-center transition-transform hover:-translate-y-1 hover:shadow-md">
      <div className="text-2xl font-bold text-[#0274be]">{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-semibold text-gray-800">{value}</div>
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
