import React, { useState, useRef } from 'react';
import { 
  FileJson, 
  Upload, 
  Copy, 
  Download, 
  X, 
  FileText, 
  Settings, 
  Zap, 
  Shield, 
  Info,
  Check,
  RefreshCw,
  Table
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';

export default function CsvToJsonConverter() {
  const [csvInput, setCsvInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [options, setOptions] = useState({
    firstRowHeader: true,
    prettyPrint: true,
    delimiter: 'auto'
  });
  const [stats, setStats] = useState({
    rows: 0,
    cols: 0,
    csvSize: 0,
    jsonSize: 0
  });
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Paste CSV data, upload a file, or load a sample.',
    type: 'info'
  });
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showStatus = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setStatus({ message, type });
    if (type === 'success') {
      setTimeout(() => {
        setStatus({ message: 'Ready. Paste CSV or upload file.', type: 'info' });
      }, 3000);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const convertCSV = (input: string = csvInput) => {
    if (!input.trim()) {
      showStatus('Please enter CSV data or upload a file.', 'error');
      return;
    }

    let delimiterChar = '';
    if (options.delimiter === 'auto') {
      const firstLine = input.split(/\r?\n/)[0];
      if (firstLine.includes(';')) delimiterChar = ';';
      else if (firstLine.includes('\t')) delimiterChar = '\t';
      else if (firstLine.includes('|')) delimiterChar = '|';
      else delimiterChar = ',';
    } else {
      delimiterChar = options.delimiter === '\\t' ? '\t' : options.delimiter;
    }

    Papa.parse(input, {
      delimiter: delimiterChar,
      header: options.firstRowHeader,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        const json = options.prettyPrint 
          ? JSON.stringify(data, null, 2) 
          : JSON.stringify(data);
        
        setJsonOutput(json);
        
        const rows = Array.isArray(data) ? data.length : 0;
        const cols = rows > 0 ? Object.keys(data[0] as object).length : 0;
        const csvBytes = new Blob([input]).size;
        const jsonBytes = new Blob([json]).size;

        setStats({
          rows,
          cols,
          csvSize: csvBytes,
          jsonSize: jsonBytes
        });

        showStatus(`Converted ${rows} records successfully!`, 'success');
      },
      error: (error) => {
        showStatus(`Parse error: ${error.message}`, 'error');
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showStatus('File too large. Maximum size is 10MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvInput(content);
      convertCSV(content);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = async () => {
    if (!jsonOutput) return;
    try {
      await navigator.clipboard.writeText(jsonOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showStatus('JSON copied to clipboard!', 'success');
    } catch (err) {
      showStatus('Failed to copy JSON.', 'error');
    }
  };

  const downloadJSON = () => {
    if (!jsonOutput) return;
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted.json';
    link.click();
    URL.revokeObjectURL(url);
    showStatus('JSON file downloaded!', 'success');
  };

  const loadSample = () => {
    const sample = `name,email,age,city
John Doe,john.doe@example.com,30,New York
Jane Smith,jane.smith@example.com,25,Los Angeles
Bob Johnson,bob.johnson@example.com,35,Chicago
Alice Williams,alice.williams@example.com,28,Houston
Charlie Brown,charlie.brown@example.com,32,Phoenix`;
    setCsvInput(sample);
    convertCSV(sample);
  };

  const clearAll = () => {
    setCsvInput('');
    setJsonOutput('');
    setStats({ rows: 0, cols: 0, csvSize: 0, jsonSize: 0 });
    showStatus('All cleared.', 'info');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">CSV to JSON Converter</h2>
            <p className="text-sm text-slate-500 mt-1">Convert CSV files or data to JSON format instantly</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload CSV
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".csv" 
              className="hidden" 
            />
            <button 
              onClick={copyToClipboard}
              disabled={!jsonOutput}
              className="flex-1 sm:flex-none bg-white border-2 border-sky-500 text-sky-500 font-bold px-4 py-2 rounded-xl text-sm hover:bg-sky-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy JSON
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
              CSV Data
            </label>
            <textarea 
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="w-full h-[300px] p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm font-mono" 
              placeholder="Paste CSV data here...&#10;&#10;Example:&#10;name,email,age&#10;John Doe,john@example.com,30&#10;Jane Smith,jane.smith@example.com,25"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FileJson className="w-4 h-4 text-sky-500" />
              JSON Output
            </label>
            <textarea 
              value={jsonOutput}
              readOnly
              className="w-full h-[300px] p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-mono text-sky-600" 
              placeholder="JSON output will appear here..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="header"
                checked={options.firstRowHeader}
                onChange={(e) => setOptions({ ...options, firstRowHeader: e.target.checked })}
                className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
              />
              <label htmlFor="header" className="text-sm font-bold text-slate-700 cursor-pointer">First row as header</label>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-6">Use first row as object keys</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="pretty"
                checked={options.prettyPrint}
                onChange={(e) => setOptions({ ...options, prettyPrint: e.target.checked })}
                className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
              />
              <label htmlFor="pretty" className="text-sm font-bold text-slate-700 cursor-pointer">Pretty print JSON</label>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-6">Formatted for readability</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <label className="text-sm font-bold text-slate-700">Delimiter</label>
            <select 
              value={options.delimiter}
              onChange={(e) => setOptions({ ...options, delimiter: e.target.value })}
              className="w-full p-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="auto">Auto-detect</option>
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="\t">Tab</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => convertCSV()}
            className="flex-1 bg-sky-500 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Convert to JSON
          </button>
          <button 
            onClick={loadSample}
            className="bg-white border border-slate-200 text-slate-600 font-bold px-6 py-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <Table className="w-5 h-5" />
            Load Sample
          </button>
          <button 
            onClick={downloadJSON}
            disabled={!jsonOutput}
            className="bg-white border border-slate-200 text-slate-600 font-bold px-6 py-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            Download JSON
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'CSV Size', value: formatBytes(stats.csvSize) },
            { label: 'JSON Size', value: formatBytes(stats.jsonSize) },
            { label: 'Records', value: stats.rows },
            { label: 'Columns', value: stats.cols }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</div>
              <div className="text-xl font-bold text-slate-800">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100">
          <div className="flex items-start gap-4">
            <div className="bg-sky-100 p-2 rounded-lg">
              <Info className="w-5 h-5 text-sky-600" />
            </div>
            <div className="text-sm text-sky-800 leading-relaxed">
              <strong className="font-bold block mb-1">About CSV to JSON:</strong>
              CSV (Comma-Separated Values) is a tabular data format, while JSON (JavaScript Object Notation) is a structured data format. Converting CSV to JSON is essential for web development, data analysis, and integrating with modern APIs.
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
          { icon: Zap, title: "Instant conversion", desc: "Convert CSV to JSON in milliseconds." },
          { icon: Settings, title: "Smart parsing", desc: "Auto-detects delimiters and handles quotes." },
          { icon: Shield, title: "100% secure", desc: "No upload — your data stays in your browser." },
          { icon: Download, title: "Download & copy", desc: "Copy JSON or download as file." }
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
