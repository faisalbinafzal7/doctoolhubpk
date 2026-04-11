import React, { useState } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  RefreshCw, 
  X, 
  Zap, 
  Shield, 
  Settings, 
  Plus, 
  FileText, 
  Info,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LongTailKeywordGenerator() {
  const [seedKeywords, setSeedKeywords] = useState('');
  const [modifiers, setModifiers] = useState('');
  const [combinationMode, setCombinationMode] = useState<'prefix' | 'suffix' | 'both'>('prefix');
  const [maxKeywords, setMaxKeywords] = useState(500);
  const [results, setResults] = useState<string[]>([]);
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' | 'warning' }>({
    message: 'Enter seed keywords, add optional modifiers, and click Generate.',
    type: 'info'
  });
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSingle, setCopiedSingle] = useState<number | null>(null);

  const showStatus = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setStatus({ message, type });
    if (type === 'success') {
      setTimeout(() => {
        setStatus({ message: 'Ready. Enter keywords and click Generate.', type: 'info' });
      }, 3000);
    }
  };

  const generateKeywords = () => {
    const seeds = seedKeywords.split(/\r?\n/).filter(line => line.trim().length > 0).map(line => line.trim().toLowerCase());
    const mods = modifiers.split(/\r?\n/).filter(line => line.trim().length > 0).map(line => line.trim().toLowerCase());
    
    if (seeds.length === 0) {
      showStatus('Please enter at least one seed keyword.', 'error');
      return;
    }

    const keywords = new Set<string>();
    const limit = Math.min(maxKeywords, 2000);

    if (mods.length === 0) {
      seeds.forEach(seed => {
        if (keywords.size < limit) keywords.add(seed);
      });
    } else {
      if (combinationMode === 'prefix' || combinationMode === 'both') {
        for (const mod of mods) {
          for (const seed of seeds) {
            if (keywords.size >= limit) break;
            keywords.add(`${mod} ${seed}`);
          }
          if (keywords.size >= limit) break;
        }
      }
      
      if (combinationMode === 'suffix' || (combinationMode === 'both' && keywords.size < limit)) {
        for (const seed of seeds) {
          for (const mod of mods) {
            if (keywords.size >= limit) break;
            keywords.add(`${seed} ${mod}`);
          }
          if (keywords.size >= limit) break;
        }
      }
    }

    const finalResults = Array.from(keywords);
    setResults(finalResults);
    setCopiedAll(false);
    showStatus(`Generated ${finalResults.length} long tail keywords!`, 'success');
  };

  const copyAll = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
    showStatus(`Copied ${results.length} keywords to clipboard!`, 'success');
  };

  const copySingle = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSingle(index);
    setTimeout(() => setCopiedSingle(null), 2000);
  };

  const clearAll = () => {
    setSeedKeywords('');
    setModifiers('');
    setCombinationMode('prefix');
    setMaxKeywords(500);
    setResults([]);
    showStatus('Cleared all inputs.', 'info');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Long Tail Keyword Generator</h2>
            <p className="text-sm text-slate-500 mt-1">Generate hundreds of SEO-friendly long tail keywords instantly</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={copyAll}
              disabled={results.length === 0}
              className="flex-1 sm:flex-none bg-white border-2 border-sky-500 text-sky-500 font-bold px-4 py-2 rounded-xl text-sm hover:bg-sky-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy All
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-500" />
              Seed Keywords (one per line)
            </label>
            <textarea 
              rows={4} 
              value={seedKeywords}
              onChange={(e) => setSeedKeywords(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm font-medium sm:rows-5" 
              placeholder="Enter seed keywords...&#10;digital marketing&#10;SEO tools&#10;content writing"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-500" />
              Modifiers (optional, one per line)
            </label>
            <textarea 
              rows={4} 
              value={modifiers}
              onChange={(e) => setModifiers(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm font-medium sm:rows-5" 
              placeholder="Enter modifiers...&#10;best&#10;cheap&#10;affordable&#10;top&#10;guide"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Settings className="w-4 h-4 text-sky-500" />
              Combination Mode
            </label>
            <select 
              value={combinationMode}
              onChange={(e) => setCombinationMode(e.target.value as any)}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 outline-none bg-white text-slate-700 appearance-none"
            >
              <option value="prefix">Modifier + Seed</option>
              <option value="suffix">Seed + Modifier</option>
              <option value="both">Both Combinations</option>
            </select>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {combinationMode === 'prefix' ? 'e.g., best digital marketing' : 
               combinationMode === 'suffix' ? 'e.g., digital marketing best' : 
               'Generates both variations'}
            </p>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-500" />
              Max Keywords
            </label>
            <input 
              type="number" 
              value={maxKeywords}
              onChange={(e) => setMaxKeywords(parseInt(e.target.value) || 0)}
              min={10} 
              max={2000} 
              className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 outline-none" 
            />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Limit: 2000 keywords</p>
          </div>
        </div>

        <button 
          onClick={generateKeywords}
          className="w-full bg-sky-500 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-sky-100 hover:bg-sky-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Generate Keywords
        </button>

        <AnimatePresence>
          {results.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-sky-500" />
                  Results
                </h3>
                <span className="text-xs bg-sky-50 text-sky-600 px-3 py-1.5 rounded-full font-bold">
                  {results.length} keywords
                </span>
              </div>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-1">
                  {results.map((kw, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-white rounded-xl transition-all group">
                      <span className="text-sm text-slate-700 font-medium break-all pr-4">{kw}</span>
                      <button 
                        onClick={() => copySingle(kw, idx)}
                        className={`transition-all px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          copiedSingle === idx 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-sky-500 text-white hover:bg-sky-600 lg:opacity-0 lg:group-hover:opacity-100'
                        }`}
                      >
                        {copiedSingle === idx ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100">
          <div className="flex items-start gap-4">
            <div className="bg-sky-100 p-2 rounded-lg">
              <Info className="w-5 h-5 text-sky-600" />
            </div>
            <div className="text-sm text-sky-800 leading-relaxed">
              <strong className="font-bold block mb-1">What are Long Tail Keywords?</strong>
              Long tail keywords are longer, more specific phrases that visitors use when they're closer to making a purchase or finding specific information. They typically have lower search volume but higher conversion rates and less competition.
            </div>
          </div>
        </div>

        <div className={`text-sm p-4 rounded-2xl flex items-center gap-3 transition-all ${
          status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' :
          status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
          status.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
          'bg-slate-50 text-slate-600 border border-slate-100'
        }`}>
          {status.type === 'success' ? <Check className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          <span className="font-medium">{status.message}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Zap, title: "Bulk generation", desc: "Generate hundreds of keywords instantly." },
          { icon: Settings, title: "Custom modifiers", desc: "Add your own prefixes and suffixes." },
          { icon: Shield, title: "100% secure", desc: "No upload — your data stays in your browser." },
          { icon: Copy, title: "Copy & export", desc: "Copy all keywords with one click." }
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
