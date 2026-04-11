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
  Table,
  Braces
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function JsonToCsvConverter() {
  const [jsonInput, setJsonInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');
  const [options, setOptions] = useState({
    includeHeaders: true,
    delimiter: ',',
    quoteChar: '"'
  });
  const [stats, setStats] = useState({
    objects: 0,
    keys: 0,
    jsonSize: 0,
    csvSize: 0
  });
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Paste JSON data, upload a file, or load a sample.',
    type: 'info'
  });
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showStatus = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setStatus({ message, type });
    if (type === 'success') {
      setTimeout(() => {
        setStatus({ message: 'Ready. Paste JSON or upload file.', type: 'info' });
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

  const escapeCSV = (field: any, delimiterChar: string, quoteCharStr: string) => {
    if (field === undefined || field === null) return '';
    const stringField = String(field);
    if (stringField.includes(delimiterChar) || stringField.includes(quoteCharStr) || stringField.includes('\n') || stringField.includes('\r')) {
      return quoteCharStr + stringField.replace(new RegExp(quoteCharStr, 'g'), quoteCharStr + quoteCharStr) + quoteCharStr;
    }
    return stringField;
  };

  const convertJSON = (input: string = jsonInput) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      showStatus('Please enter JSON data or upload a file.', 'error');
      return;
    }

    try {
      let data = JSON.parse(trimmedInput);
      
      // Handle non-array input by wrapping it in an array
      if (!Array.isArray(data)) {
        data = [data];
      }
      
      if (data.length === 0) {
        showStatus('JSON array is empty.', 'error');
        return;
      }

      // Get all unique keys from all objects
      const allKeys = new Set<string>();
      data.forEach((item: any) => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => allKeys.add(key));
        }
      });
      
      const headers = Array.from(allKeys);
      const delimiterChar = options.delimiter === '\\t' ? '\t' : options.delimiter;
      const quoteCharStr = options.quoteChar;
      
      let csvRows = [];
      
      // Add headers if option checked
      if (options.includeHeaders) {
        const headerRow = headers.map(header => escapeCSV(header, delimiterChar, quoteCharStr)).join(delimiterChar);
        csvRows.push(headerRow);
      }
      
      // Add data rows
      data.forEach((item: any) => {
        const row = headers.map(header => {
          let value = item[header];
          if (value === undefined || value === null) value = '';
          if (typeof value === 'object') value = JSON.stringify(value);
          return escapeCSV(value, delimiterChar, quoteCharStr);
        });
        csvRows.push(row.join(delimiterChar));
      });
      
      const csv = csvRows.join('\n');
      setCsvOutput(csv);
      
      const jsonBytes = new Blob([trimmedInput]).size;
      const csvBytes = new Blob([csv]).size;

      setStats({
        objects: data.length,
        keys: headers.length,
        jsonSize: jsonBytes,
        csvSize: csvBytes
      });

      showStatus(`Converted ${data.length} objects successfully!`, 'success');
    } catch (err: any) {
      showStatus(`Invalid JSON: ${err.message}`, 'error');
    }
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
      setJsonInput(content);
      convertJSON(content);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = async () => {
    if (!csvOutput) return;
    try {
      await navigator.clipboard.writeText(csvOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showStatus('CSV copied to clipboard!', 'success');
    } catch (err) {
      showStatus('Failed to copy CSV.', 'error');
    }
  };

  const downloadCSV = () => {
    if (!csvOutput) return;
    const blob = new Blob([csvOutput], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted.csv';
    link.click();
    URL.revokeObjectURL(url);
    showStatus('CSV file downloaded!', 'success');
  };

  const loadSample = () => {
    const sample = `[
  {"name": "John Doe", "email": "john.doe@example.com", "age": 30, "city": "New York"},
  {"name": "Jane Smith", "email": "jane.smith@example.com", "age": 25, "city": "Los Angeles"},
  {"name": "Bob Johnson", "email": "bob.johnson@example.com", "age": 35, "city": "Chicago"},
  {"name": "Alice Williams", "email": "alice.williams@example.com", "age": 28, "city": "Houston"},
  {"name": "Charlie Brown", "email": "charlie.brown@example.com", "age": 32, "city": "Phoenix"}
]`;
    setJsonInput(sample);
    convertJSON(sample);
  };

  const clearAll = () => {
    setJsonInput('');
    setCsvOutput('');
    setStats({ objects: 0, keys: 0, jsonSize: 0, csvSize: 0 });
    showStatus('All cleared.', 'info');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">JSON to CSV Converter</h2>
            <p className="text-sm text-slate-500 mt-1">Convert JSON data to CSV format instantly</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload JSON
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".json" 
              className="hidden" 
            />
            <button 
              onClick={copyToClipboard}
              disabled={!csvOutput}
              className="flex-1 sm:flex-none bg-white border-2 border-sky-500 text-sky-500 font-bold px-4 py-2 rounded-xl text-sm hover:bg-sky-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy CSV
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
              <Braces className="w-4 h-4 text-sky-500" />
              JSON Data
            </label>
            <textarea 
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-[300px] p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm font-mono" 
              placeholder='Paste JSON data here...&#10;&#10;Example:&#10;[&#10;  {"name":"John Doe","email":"john@example.com","age":30},&#10;  {"name":"Jane Smith","email":"jane@example.com","age":25}&#10;]'
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-500" />
              CSV Output
            </label>
            <textarea 
              value={csvOutput}
              readOnly
              className="w-full h-[300px] p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-mono text-sky-600" 
              placeholder="CSV output will appear here..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="header"
                checked={options.includeHeaders}
                onChange={(e) => setOptions({ ...options, includeHeaders: e.target.checked })}
                className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
              />
              <label htmlFor="header" className="text-sm font-bold text-slate-700 cursor-pointer">Include headers</label>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-6">Use JSON keys as CSV headers</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <label className="text-sm font-bold text-slate-700">Delimiter</label>
            <select 
              value={options.delimiter}
              onChange={(e) => setOptions({ ...options, delimiter: e.target.value })}
              className="w-full p-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="\t">Tab</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <label className="text-sm font-bold text-slate-700">Quote Character</label>
            <select 
              value={options.quoteChar}
              onChange={(e) => setOptions({ ...options, quoteChar: e.target.value })}
              className="w-full p-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value='"'>Double quote (")</option>
              <option value="'">Single quote (')</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => convertJSON()}
            className="flex-1 bg-sky-500 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Convert to CSV
          </button>
          <button 
            onClick={loadSample}
            className="bg-white border border-slate-200 text-slate-600 font-bold px-6 py-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <Table className="w-5 h-5" />
            Load Sample
          </button>
          <button 
            onClick={downloadCSV}
            disabled={!csvOutput}
            className="bg-white border border-slate-200 text-slate-600 font-bold px-6 py-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            Download CSV
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'JSON Size', value: formatBytes(stats.jsonSize) },
            { label: 'CSV Size', value: formatBytes(stats.csvSize) },
            { label: 'Objects', value: stats.objects },
            { label: 'Keys', value: stats.keys }
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
              <strong className="font-bold block mb-1">About JSON to CSV:</strong>
              JSON (JavaScript Object Notation) is a lightweight data format, while CSV (Comma-Separated Values) is a simple tabular format. Converting JSON to CSV is useful for data analysis in spreadsheet software like Excel or Google Sheets.
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
          { icon: Zap, title: "Instant conversion", desc: "Convert JSON to CSV in milliseconds." },
          { icon: Settings, title: "Flexible options", desc: "Choose delimiter, quote character, and headers." },
          { icon: Shield, title: "100% secure", desc: "No upload — your data stays in your browser." },
          { icon: Download, title: "Download & copy", desc: "Copy CSV or download as file." }
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
