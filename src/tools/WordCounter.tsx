import React from 'react';
import { Upload, X, FileText, Zap, Shield, Layout, Clock, BarChart3, Info } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = React.useState('');
  const [status, setStatus] = React.useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Start typing or paste text to see statistics',
    type: 'info'
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const stats = React.useMemo(() => {
    if (!text || text.trim() === '') {
      return {
        words: 0,
        chars: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        speakingTime: 0,
        letters: 0
      };
    }

    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const charCount = text.length;
    const charNoSpaceCount = text.replace(/\s/g, '').length;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const sentenceCount = sentences.length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphs.length;
    
    // Reading time: average 225 words per minute
    const readingTimeSeconds = Math.ceil((wordCount / 225) * 60);
    const readingTimeMin = Math.floor(readingTimeSeconds / 60);
    const readingTimeSec = readingTimeSeconds % 60;
    const readingTimeFormatted = readingTimeMin > 0 
      ? `${readingTimeMin}m ${readingTimeSec}s` 
      : `${readingTimeSec}s`;
    
    // Speaking time: average 150 words per minute
    const speakingTimeSeconds = Math.ceil((wordCount / 150) * 60);
    const speakingTimeMin = Math.floor(speakingTimeSeconds / 60);
    const speakingTimeSec = speakingTimeSeconds % 60;
    const speakingTimeFormatted = speakingTimeMin > 0 
      ? `${speakingTimeMin}m ${speakingTimeSec}s` 
      : `${speakingTimeSec}s`;
    
    // Letter count (only A-Z, a-z)
    const letters = (text.match(/[A-Za-z]/g) || []).length;

    return {
      words: wordCount,
      chars: charCount,
      charsNoSpaces: charNoSpaceCount,
      sentences: sentenceCount,
      paragraphs: paragraphCount,
      readingTime: readingTimeFormatted,
      speakingTime: speakingTimeFormatted,
      letters
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
      
      // Sanitize content from file
      const sanitizedContent = content.replace(/[^\p{L}\p{N}\p{P}\p{Z}\p{M}\p{S}\n\r\t]/gu, '');
      const hadInvalidChars = content !== sanitizedContent;

      if (extension === 'doc' || extension === 'docx') {
        setStatus({ 
          message: `⚠️ For best results with Word documents, please copy and paste the content directly.${hadInvalidChars ? ' Some invalid characters were removed.' : ''}`, 
          type: 'info' 
        });
        setText(sanitizedContent + '\n\n[Note: Extracted text may have limited formatting]');
      } else {
        setText(sanitizedContent);
        setStatus({ 
          message: `✅ Successfully loaded "${file.name}".${hadInvalidChars ? ' (Some invalid characters were removed)' : ''}`, 
          type: hadInvalidChars ? 'info' : 'success' 
        });
      }
    };
    reader.onerror = () => {
      setStatus({ message: '❌ Failed to read file.', type: 'error' });
    };
    reader.readAsText(file, 'UTF-8');
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearText = () => {
    setText('');
    setStatus({ message: 'Text cleared. Start typing or paste new text.', type: 'info' });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // Filter out non-printable control characters while allowing standard text, symbols, and whitespace
    // Using Unicode property escapes for broad language support
    const sanitizedValue = newValue.replace(/[^\p{L}\p{N}\p{P}\p{Z}\p{M}\p{S}\n\r\t]/gu, '');
    
    if (newValue !== sanitizedValue) {
      setStatus({ 
        message: '⚠️ Some non-printable or invalid characters were automatically removed.', 
        type: 'error' 
      });
      
      // Clear the error message after 3 seconds
      setTimeout(() => {
        setStatus(prev => prev.message.includes('removed') ? { message: 'Start typing or paste text to see statistics', type: 'info' } : prev);
      }, 3000);
    }
    
    setText(sanitizedValue);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white premium-card rounded-3xl border border-gray-200/70 p-6 md:p-8 mb-12 shadow-sm w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Text Analysis & Word Counter</h2>
            <p className="text-sm text-gray-500 mt-1">Type, paste, or upload a file to analyze</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.doc,.docx,.pdf,text/plain"
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
          </div>
        </div>

        {/* TEXT INPUT */}
        <div className="mb-6">
          <textarea 
            value={text}
            onChange={handleTextChange}
            className="w-full min-h-[250px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition font-mono text-sm resize-y" 
            placeholder="Type or paste your text here...&#10;&#10;The word counter will automatically analyze:&#10;• Word count&#10;• Character count (with and without spaces)&#10;• Sentence count&#10;• Paragraph count&#10;• Reading time&#10;• Speaking time"
          />
        </div>

        {/* STATISTICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <StatBox label="Words" value={stats.words} />
          <StatBox label="Characters" value={stats.chars} />
          <StatBox label="Chars (no spaces)" value={stats.charsNoSpaces} />
          <StatBox label="Sentences" value={stats.sentences} />
          <StatBox label="Paragraphs" value={stats.paragraphs} />
        </div>

        {/* EXTRA METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-[#0274be]" />
              <span className="text-sm font-medium text-gray-700">Reading Time</span>
            </div>
            <div className="text-2xl font-semibold text-gray-800">{stats.readingTime}</div>
            <div className="text-xs text-gray-500 mt-1">average 225 words per minute</div>
          </div>
          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-[#0274be]" />
              <span className="text-sm font-medium text-gray-700">Speaking Time</span>
            </div>
            <div className="text-2xl font-semibold text-gray-800">{stats.speakingTime}</div>
            <div className="text-xs text-gray-500 mt-1">average 150 words per minute</div>
          </div>
          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-[#0274be]" />
              <span className="text-sm font-medium text-gray-700">Letter Count</span>
            </div>
            <div className="text-2xl font-semibold text-gray-800">{stats.letters}</div>
            <div className="text-xs text-gray-500 mt-1">alphabet characters only (A-Z, a-z)</div>
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
            title="Real-time analysis"
            description="Instant word and character counting as you type."
          />
          <FeatureCard 
            icon={<BarChart3 className="h-6 w-6 text-[#0274be]" />}
            title="Multiple metrics"
            description="Words, characters, sentences, paragraphs, reading time."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your text never leaves your browser."
          />
          <FeatureCard 
            icon={<Layout className="h-6 w-6 text-[#0274be]" />}
            title="File upload support"
            description="Upload TXT, DOC, DOCX, PDF files for analysis."
          />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-gray-100 shadow-sm text-center transition-transform hover:-translate-y-1 hover:shadow-md">
      <div className="text-2xl font-bold text-[#0274be]">{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">{label}</div>
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
