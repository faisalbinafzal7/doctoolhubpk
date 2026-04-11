import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  RefreshCw, 
  X, 
  Zap, 
  Shield, 
  Settings, 
  Info,
  Link as LinkIcon,
  Type,
  Hash,
  Scissors
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TextToSlug() {
  const [inputText, setInputText] = useState('');
  const [slugOutput, setSlugOutput] = useState('');
  const [options, setOptions] = useState({
    lowercase: true,
    replaceSpaces: true,
    removeSpecial: true,
    trimDashes: true
  });
  const [stats, setStats] = useState({
    originalLength: 0,
    slugLength: 0,
    wordsRemoved: 0,
    specialRemoved: 0
  });
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Enter text, customize options, and click Generate Slug.',
    type: 'info'
  });
  const [copied, setCopied] = useState(false);

  const showStatus = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setStatus({ message, type });
    if (type === 'success') {
      setTimeout(() => {
        setStatus({ message: 'Ready. Enter text and click Generate Slug.', type: 'info' });
      }, 3000);
    }
  };

  const generateSlug = () => {
    if (!inputText.trim()) {
      setSlugOutput('');
      setStats({ originalLength: 0, slugLength: 0, wordsRemoved: 0, specialRemoved: 0 });
      showStatus('Please enter some text to convert.', 'error');
      return;
    }

    let slug = inputText;
    const originalText = inputText;

    // Remove special characters
    if (options.removeSpecial) {
      slug = slug.replace(/[^a-zA-Z0-9\s]/g, ' ');
    }

    // Replace spaces with hyphens
    if (options.replaceSpaces) {
      slug = slug.replace(/\s+/g, '-');
    } else {
      slug = slug.replace(/\s+/g, '');
    }

    // Remove multiple consecutive hyphens
    slug = slug.replace(/-+/g, '-');

    // Convert to lowercase
    if (options.lowercase) {
      slug = slug.toLowerCase();
    }

    // Trim leading/trailing hyphens
    if (options.trimDashes) {
      slug = slug.replace(/^-+|-+$/g, '');
    }

    // Final cleanup for URL safety
    slug = slug.replace(/[^a-z0-9-]/gi, '');
    slug = slug.replace(/-+/g, '-');
    if (options.trimDashes) {
      slug = slug.replace(/^-+|-+$/g, '');
    }

    if (!slug) slug = 'invalid-text';

    setSlugOutput(slug);
    
    // Update stats
    const originalWords = originalText.trim().split(/\s+/).filter(w => w.length > 0).length;
    const slugWords = slug.split('-').filter(w => w.length > 0).length;
    const specialChars = originalText.match(/[^a-zA-Z0-9\s]/g) || [];

    setStats({
      originalLength: originalText.length,
      slugLength: slug.length,
      wordsRemoved: Math.max(0, originalWords - slugWords),
      specialRemoved: specialChars.length
    });

    showStatus('Slug generated successfully!', 'success');
  };

  const copyToClipboard = async () => {
    if (!slugOutput) {
      showStatus('No slug to copy. Generate a slug first.', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(slugOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showStatus('Slug copied to clipboard!', 'success');
    } catch (err) {
      showStatus('Failed to copy slug.', 'error');
    }
  };

  const clearAll = () => {
    setInputText('');
    setSlugOutput('');
    setStats({ originalLength: 0, slugLength: 0, wordsRemoved: 0, specialRemoved: 0 });
    showStatus('All cleared.', 'info');
  };

  // Auto-generate on input or option change
  useEffect(() => {
    if (inputText.trim()) {
      generateSlug();
    } else {
      setSlugOutput('');
      setStats({ originalLength: 0, slugLength: 0, wordsRemoved: 0, specialRemoved: 0 });
    }
  }, [inputText, options]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Text to Slug Generator</h2>
            <p className="text-sm text-slate-500 mt-1">Convert any text to SEO-friendly URL slug instantly</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={copyToClipboard}
              className="flex-1 sm:flex-none bg-white border-2 border-sky-500 text-sky-500 font-bold px-4 py-2 rounded-xl text-sm hover:bg-sky-50 transition-all flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy Slug
            </button>
            <button 
              onClick={clearAll}
              className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Type className="w-4 h-4 text-sky-500" />
            Enter Text to Convert
          </label>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm font-medium min-h-[150px] font-mono" 
            placeholder="Enter your text here...&#10;&#10;Example: This is a Sample Title!&#10;Will become: this-is-a-sample-title"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'lowercase', label: 'Lowercase', icon: Type },
            { id: 'replaceSpaces', label: 'Hyphenate', icon: Scissors },
            { id: 'removeSpecial', label: 'Clean Chars', icon: Zap },
            { id: 'trimDashes', label: 'Trim Dashes', icon: Hash }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setOptions(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof options] }))}
              className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                options[opt.id as keyof typeof options] 
                  ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-100' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-sky-400'
              }`}
            >
              <opt.icon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{opt.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-sky-500" />
            Generated Slug (URL Friendly)
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={slugOutput}
              readOnly
              className="w-full p-4 pr-24 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold font-mono text-sky-600 outline-none" 
              placeholder="Slug will appear here..."
            />
            <button 
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-sky-600 transition-all shadow-md shadow-sky-100"
            >
              COPY
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Original Length', value: stats.originalLength, color: 'text-slate-700' },
            { label: 'Slug Length', value: stats.slugLength, color: 'text-sky-500' },
            { label: 'Words Removed', value: stats.wordsRemoved, color: 'text-slate-700' },
            { label: 'Special Chars', value: stats.specialRemoved, color: 'text-slate-700' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{stat.label}</div>
              <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100">
          <div className="flex items-start gap-4">
            <div className="bg-sky-100 p-2 rounded-lg">
              <Info className="w-5 h-5 text-sky-600" />
            </div>
            <div className="text-sm text-sky-800 leading-relaxed">
              <strong className="font-bold block mb-1">What is a URL Slug?</strong>
              A slug is the part of a URL that identifies a particular page in a human-readable form. It should be short, descriptive, and contain only lowercase letters, numbers, and hyphens.
            </div>
          </div>
        </div>

        <div className={`text-sm p-4 rounded-2xl flex items-center gap-3 transition-all ${
          status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' :
          status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
          'bg-slate-50 text-slate-600 border border-slate-100'
        }`}>
          {status.type === 'success' ? <Check className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          <span className="font-medium">{status.message}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Zap, title: "Instant conversion", desc: "Generate SEO-friendly slugs in real-time." },
          { icon: Settings, title: "Customizable", desc: "Control lowercase, hyphens, and special chars." },
          { icon: Shield, title: "100% secure", desc: "No upload — your text stays in your browser." },
          { icon: Copy, title: "Copy & stats", desc: "One-click copy and detailed length statistics." }
        ].map((feature, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="bg-sky-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
              <feature.icon className="w-5 h-5 text-sky-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">{feature.title}</h3>
            <p className="text-xs text-slate-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
