import React from 'react';
import { Upload, File as FileIcon, Download, RefreshCw, AlertCircle, CheckCircle, Trash2, Zap, Shield, FileSpreadsheet, Table, Layout, X } from 'lucide-react';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

export default function WordToExcel() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [convertedBlob, setConvertedBlob] = React.useState<Blob | null>(null);
  const [extractedData, setExtractedData] = React.useState<{ tables: string[][][], paragraphs: string[] } | null>(null);
  
  const [extractionMode, setExtractionMode] = React.useState<'tables' | 'text' | 'combined'>('tables');
  const [sheetName, setSheetName] = React.useState('Converted Data');
  const [firstRowHeader, setFirstRowHeader] = React.useState(true);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (!['doc', 'docx'].includes(extension || '')) {
        setError('❌ Unsupported file type. Please upload a Word document (.doc or .docx).');
        return;
      }
      if (selectedFile.size > 15 * 1024 * 1024) {
        setError(`❌ File too large (max 15MB). Current: ${formatBytes(selectedFile.size)}`);
        return;
      }

      try {
        setError(null);
        setSuccess(false);
        setConvertedBlob(null);
        setFile(selectedFile);
        
        await processFile(selectedFile);
        setError(null);
      } catch (err: any) {
        console.error('Error loading document:', err);
        setError(`❌ Failed to read document: ${err.message}`);
      }
    }
  };

  const processFile = async (selectedFile: File) => {
    const arrayBuffer = await selectedFile.arrayBuffer();
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    let tables: string[][][] = [];
    let paragraphs: string[] = [];

    if (extension === 'docx') {
      // Extract HTML to find tables
      const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlResult.value, 'text/html');
      tables = Array.from(doc.querySelectorAll('table')).map(table => {
        return Array.from(table.querySelectorAll('tr')).map(tr => {
          return Array.from(tr.querySelectorAll('th, td')).map(cell => cell.textContent?.trim() || '');
        }).filter(row => row.length > 0);
      }).filter(table => table.length > 0);

      // Extract raw text for paragraphs
      const textResult = await mammoth.extractRawText({ arrayBuffer });
      paragraphs = textResult.value.split(/\r?\n/).filter(p => p.trim().length > 0);
    } else {
      // .doc fallback - simple text extraction
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(selectedFile, 'UTF-8');
      });
      paragraphs = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      tables = [];
    }

    setExtractedData({ tables, paragraphs });
  };

  const convertToExcel = async () => {
    if (!extractedData || !file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const workbook = XLSX.utils.book_new();
      const name = sheetName.trim() || 'Converted Data';
      
      if (extractionMode === 'tables' && extractedData.tables.length > 0) {
        extractedData.tables.forEach((table, idx) => {
          let sheetData = [...table];
          if (firstRowHeader && sheetData.length > 0) {
            const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
            const sheetTitle = extractedData.tables.length === 1 ? name : `${name}_Table${idx + 1}`;
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle.substring(0, 31));
          } else {
            const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
            const sheetTitle = extractedData.tables.length === 1 ? name : `${name}_Table${idx + 1}`;
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle.substring(0, 31));
          }
        });
      } else if (extractionMode === 'text' && extractedData.paragraphs.length > 0) {
        const sheetData = extractedData.paragraphs.map((p, idx) => [idx + 1, p]);
        const worksheet = XLSX.utils.aoa_to_sheet([['Line #', 'Content'], ...sheetData]);
        XLSX.utils.book_append_sheet(workbook, worksheet, name.substring(0, 31));
      } else if (extractionMode === 'combined') {
        const summaryData = [['Extraction Summary', '']];
        summaryData.push(['Total paragraphs', extractedData.paragraphs.length.toString()]);
        summaryData.push(['Tables found', extractedData.tables.length.toString()]);
        extractedData.tables.forEach((table, idx) => {
          summaryData.push([`Table ${idx + 1} rows`, table.length.toString()]);
          summaryData.push([`Table ${idx + 1} columns`, (table[0]?.length || 0).toString()]);
        });
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
        
        extractedData.tables.forEach((table, idx) => {
          const worksheet = XLSX.utils.aoa_to_sheet(table);
          XLSX.utils.book_append_sheet(workbook, worksheet, `Table_${idx + 1}`.substring(0, 31));
        });
      }

      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      setConvertedBlob(blob);
      setSuccess(true);
    } catch (err: any) {
      console.error('Conversion error:', err);
      setError(`❌ Conversion failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadExcel = () => {
    if (!convertedBlob || !file) return;
    const url = URL.createObjectURL(convertedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name.replace(/\.(doc|docx)$/i, '.xlsx');
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setConvertedBlob(null);
    setExtractedData(null);
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white premium-card rounded-3xl border border-gray-200/70 p-6 md:p-8 mb-12 shadow-sm w-full">
        {/* UPLOAD AREA */}
        {!file ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-[#0274be] transition bg-gray-50/20 mb-6 relative">
            <input 
              type="file" 
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
            <div className="flex flex-col items-center gap-2">
              <div className="bg-blue-50 p-3 rounded-full">
                <FileSpreadsheet className="h-7 w-7 text-[#0274be]" />
              </div>
              <p className="text-lg font-medium text-gray-800">Drag & drop Word document or <span className="text-[#0274be] underline underline-offset-2 font-semibold">browse</span></p>
              <p className="text-sm text-gray-500">Supports .DOC and .DOCX • max 15MB</p>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-3 truncate">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FileIcon className="h-5 w-5 text-[#0274be]" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800 truncate max-w-[200px] md:max-w-xs">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                </div>
              </div>
              <button 
                onClick={reset}
                className="text-gray-500 hover:text-[#0274be] bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition"
              >
                <X className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        )}

        {/* PREVIEW */}
        {file && extractedData && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Layout className="h-4 w-4 text-[#0274be]" />
              Extracted content preview
            </h3>
            <div className="max-h-[300px] overflow-y-auto bg-gray-50/50 rounded-xl p-4 border border-gray-200 text-sm">
              {extractedData.tables.length > 0 ? (
                <div className="space-y-4">
                  <p className="font-medium text-gray-700 flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    Found {extractedData.tables.length} table(s)
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-xs">
                      <tbody>
                        {extractedData.tables[0].slice(0, 5).map((row, ridx) => (
                          <tr key={ridx}>
                            {row.map((cell, cidx) => (
                              <td key={cidx} className="border border-gray-200 p-2 bg-white">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {extractedData.tables[0].length > 5 && (
                      <p className="text-xs text-gray-400 mt-2 italic">... and {extractedData.tables[0].length - 5} more rows</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-4">No tables detected. {extractedData.paragraphs.length} paragraphs available for extraction.</p>
              )}
            </div>
          </div>
        )}

        {/* CONTROLS */}
        {file && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Extraction mode</label>
                <select 
                  value={extractionMode}
                  onChange={(e) => setExtractionMode(e.target.value as any)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#0274be] focus:border-[#0274be] outline-none bg-white"
                >
                  <option value="tables">Extract tables only</option>
                  <option value="text">Extract all text (paragraphs as rows)</option>
                  <option value="combined">Tables + Text summary</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Sheet name</label>
                <input 
                  type="text" 
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  placeholder="Converted Data"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#0274be] focus:border-[#0274be] outline-none" 
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={firstRowHeader}
                  onChange={(e) => setFirstRowHeader(e.target.checked)}
                  className="rounded border-gray-300 text-[#0274be] focus:ring-[#0274be]" 
                />
                Use first row as column headers (for tables)
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={convertToExcel}
                disabled={isProcessing || !extractedData}
                className="bg-[#0274be] text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 flex-1"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5" />
                    <span>Convert to Excel</span>
                  </>
                )}
              </button>
              <button 
                onClick={downloadExcel}
                disabled={!convertedBlob || isProcessing}
                className="bg-white border-2 border-[#0274be] text-[#0274be] font-semibold px-6 py-3.5 rounded-xl hover:bg-[#0274be]/5 transition disabled:opacity-40 disabled:border-gray-300 disabled:text-gray-400 flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                <Download className="h-5 w-5" />
                Download XLSX
              </button>
            </div>
          </div>
        )}

        {/* STATUS */}
        {(error || success) && (
          <div className={`mt-5 text-sm p-3 rounded-xl flex items-center gap-2 ${error?.startsWith('❌') || error?.startsWith('⚠️') ? 'bg-red-100 text-red-700' : success ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {success ? <CheckCircle className="h-5 w-5" /> : error?.startsWith('❌') ? <AlertCircle className="h-5 w-5" /> : null}
            <span>{success ? `✅ Conversion successful! Click Download XLSX.` : error}</span>
          </div>
        )}
      </div>

      <div className="bg-white py-10 border-t border-gray-100 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Why choose DocToolHubPK?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-[#0274be]" />}
            title="Smart extraction"
            description="Automatically detects tables and structured data from Word documents."
          />
          <FeatureCard 
            icon={<Table className="h-6 w-6 text-[#0274be]" />}
            title="Preserve structure"
            description="Maintains table layout, rows, and column alignment."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="100% secure"
            description="No upload — your documents stay on your device."
          />
          <FeatureCard 
            icon={<FileSpreadsheet className="h-6 w-6 text-[#0274be]" />}
            title="Browser‑based"
            description="Works offline, no installation required."
          />
        </div>
      </div>
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
