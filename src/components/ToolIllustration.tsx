import React from 'react';
import { 
  FileText, 
  FileDown, 
  FileUp, 
  Image as ImageIcon, 
  Code, 
  Search, 
  Type, 
  Zap, 
  Settings,
  ArrowRight,
  Braces,
  Hash,
  Palette,
  Scissors,
  RefreshCw,
  FileDigit,
  CaseSensitive,
  Binary,
  Dices,
  Repeat,
  ShieldCheck,
  Terminal,
  Link as LinkIcon,
  FileCode,
  Pipette,
  Paintbrush,
  QrCode,
  Crop,
  Maximize2,
  Minimize2,
  RotateCw,
  FileJson,
  FileSpreadsheet,
  Lock,
  Presentation,
  Target
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ToolIllustrationProps {
  type: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ToolIllustration: React.FC<ToolIllustrationProps> = ({ type, className, size = 'md' }) => {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-40'
  };

  const renderIllustration = () => {
    switch (type) {
      case 'word-counter':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-amber-500 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-amber-400 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileDigit className="w-10 h-10 text-white/40" />
                </div>
                <span className="text-[10px] font-black tracking-tighter">WORDS</span>
              </div>
              <div className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 shadow-lg flex items-center justify-center text-amber-600 font-black text-xs">
                123
              </div>
            </div>
          </div>
        );
      case 'case-converter':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-amber-500 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-amber-400 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CaseSensitive className="w-10 h-10 text-white/40" />
                </div>
                <span className="text-[10px] font-black tracking-tighter">CASE</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full w-8 h-8 shadow-lg flex items-center justify-center text-amber-600 font-black text-sm">
                Aa
              </div>
            </div>
          </div>
        );
      case 'character-counter':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-amber-500 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-amber-400 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Type className="w-10 h-10 text-white/40" />
                </div>
                <span className="text-[10px] font-black tracking-tighter">CHARS</span>
              </div>
              <div className="absolute -top-2 -left-2 bg-white rounded-full w-8 h-8 shadow-lg flex items-center justify-center text-amber-600 font-black text-xs">
                A
              </div>
            </div>
          </div>
        );
      case 'remove-line-breaks':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-amber-500 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-amber-400 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex flex-col gap-1 items-center justify-center px-3">
                  <div className="w-full h-1 bg-white/40 rounded-full"></div>
                  <div className="w-full h-1 bg-white/40 rounded-full"></div>
                  <div className="w-full h-1 bg-white/40 rounded-full"></div>
                </div>
                <span className="text-[10px] font-black tracking-tighter">CLEAN</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full p-1 shadow-md">
                  <ArrowRight className="w-4 h-4 text-amber-600 rotate-90" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'text-to-slug':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-indigo-500 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-indigo-400 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                  <div className="text-[8px] font-mono opacity-60">Hello World</div>
                  <ArrowRight className="w-3 h-3 my-1" />
                  <div className="text-[8px] font-mono font-bold">hello-world</div>
                </div>
                <span className="text-[10px] font-black tracking-tighter">SLUG</span>
              </div>
            </div>
          </div>
        );
      case 'binary-converter':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-slate-700 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-slate-600 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Binary className="w-10 h-10 text-white/20" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-[10px] font-bold">
                  <div>0101</div>
                  <div>1010</div>
                </div>
                <span className="text-[10px] font-black tracking-tighter">BINARY</span>
              </div>
            </div>
          </div>
        );
      case 'random-number-generator':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-slate-700 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-slate-600 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Dices className="w-10 h-10 text-white/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black italic">?</span>
                </div>
                <span className="text-[10px] font-black tracking-tighter">RANDOM</span>
              </div>
            </div>
          </div>
        );
      case 'json-formatter':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-slate-700 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-slate-600 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Braces className="w-10 h-10 text-white/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xl font-black">
                  {"{ }"}
                </div>
                <span className="text-[10px] font-black tracking-tighter">JSON</span>
              </div>
            </div>
          </div>
        );
      case 'base64-encoder-decoder':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-slate-700 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-slate-600 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-white/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] font-bold px-2 text-center">
                  SGVsbG8=
                </div>
                <span className="text-[10px] font-black tracking-tighter">BASE64</span>
              </div>
            </div>
          </div>
        );
      case 'html-minifier':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-slate-700 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-slate-600 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileCode className="w-10 h-10 text-white/40" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold">
                  {"<html>"}
                </div>
                <span className="text-[10px] font-black tracking-tighter">HTML</span>
              </div>
            </div>
          </div>
        );
      case 'css-minifier':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-slate-700 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-slate-600 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Scissors className="w-10 h-10 text-white/40" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold">
                  {".css { }"}
                </div>
                <span className="text-[10px] font-black tracking-tighter">CSS</span>
              </div>
            </div>
          </div>
        );
      case 'js-minifier':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-slate-700 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-slate-600 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Terminal className="w-10 h-10 text-white/40" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold">
                  {"js( )"}
                </div>
                <span className="text-[10px] font-black tracking-tighter">JS</span>
              </div>
            </div>
          </div>
        );
      case 'rgb-to-hex':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-teal-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-teal-500 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
                  <ArrowRight className="w-3 h-3" />
                  <div className="text-[8px] font-mono font-bold">#FFFFFF</div>
                </div>
                <span className="text-[10px] font-black tracking-tighter">RGB-HEX</span>
              </div>
            </div>
          </div>
        );
      case 'hex-to-rgb':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-teal-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-teal-500 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <div className="text-[8px] font-mono font-bold">#FFFFFF</div>
                  <ArrowRight className="w-3 h-3" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
                </div>
                <span className="text-[10px] font-black tracking-tighter">HEX-RGB</span>
              </div>
            </div>
          </div>
        );
      case 'qr-code-generator':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-slate-800 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-slate-700 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  <QrCode className="w-full h-full text-white" />
                </div>
                <span className="text-[10px] font-black tracking-tighter">QR CODE</span>
              </div>
            </div>
          </div>
        );
      case 'image-to-base64':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-cyan-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-cyan-500 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-white/40" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] font-bold px-2 text-center">
                  data:image...
                </div>
                <span className="text-[10px] font-black tracking-tighter">IMG-B64</span>
              </div>
            </div>
          </div>
        );
      case 'image-cropper':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-cyan-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-cyan-500 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Crop className="w-10 h-10 text-white/40" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-dashed rounded-sm"></div>
                </div>
                <span className="text-[10px] font-black tracking-tighter">CROP</span>
              </div>
            </div>
          </div>
        );
      case 'image-resizer':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-cyan-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-cyan-500 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Maximize2 className="w-10 h-10 text-white/40" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white/20 rounded-sm group-hover:w-10 group-hover:h-10 transition-all duration-500"></div>
                </div>
                <span className="text-[10px] font-black tracking-tighter">RESIZE</span>
              </div>
            </div>
          </div>
        );
      case 'image-compressor':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-cyan-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-cyan-500 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-10 h-10 text-white/40" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-[10px] font-bold">1.2MB</div>
                  <ArrowRight className="w-3 h-3 rotate-90" />
                  <div className="text-[10px] font-bold text-green-300">400KB</div>
                </div>
                <span className="text-[10px] font-black tracking-tighter">COMPRESS</span>
              </div>
            </div>
          </div>
        );
      case 'image-converter':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-cyan-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-cyan-500 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="w-10 h-10 text-white/40" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-[8px] font-bold bg-white/20 px-1 rounded">JPG</div>
                  <ArrowRight className="w-3 h-3" />
                  <div className="text-[8px] font-bold bg-white/20 px-1 rounded">PNG</div>
                </div>
                <span className="text-[10px] font-black tracking-tighter">CONVERT</span>
              </div>
            </div>
          </div>
        );
      case 'image-rotator':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-cyan-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-cyan-500 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <RotateCw className="w-10 h-10 text-white/40 group-hover:rotate-180 transition-transform duration-700" />
                </div>
                <span className="text-[10px] font-black tracking-tighter">ROTATE</span>
              </div>
            </div>
          </div>
        );
      case 'csv-to-json':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-emerald-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-emerald-500 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <FileSpreadsheet className="w-6 h-6" />
                  <ArrowRight className="w-3 h-3" />
                  <FileJson className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black tracking-tighter">CSV-JSON</span>
              </div>
            </div>
          </div>
        );
      case 'json-to-csv':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-emerald-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-emerald-500 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <FileJson className="w-6 h-6" />
                  <ArrowRight className="w-3 h-3" />
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black tracking-tighter">JSON-CSV</span>
              </div>
            </div>
          </div>
        );
      case 'long-tail-keyword-generator':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-purple-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-purple-500 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-10 h-10 text-white/40" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-[8px] font-bold px-1 text-center">
                  keyword + modifier + suffix
                </div>
                <span className="text-[10px] font-black tracking-tighter">SEO</span>
              </div>
            </div>
          </div>
        );
      case 'password-generator':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-slate-700 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-slate-600 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-10 h-10 text-white/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-black tracking-widest">
                  ****
                </div>
                <span className="text-[10px] font-black tracking-tighter">PASS GEN</span>
              </div>
            </div>
          </div>
        );
      case 'url-encoder-decoder':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-slate-700 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-slate-600 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <LinkIcon className="w-10 h-10 text-white/20" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-[8px] font-bold px-1 text-center">
                  %20 %3F
                </div>
                <span className="text-[10px] font-black tracking-tighter">URL ENC</span>
              </div>
            </div>
          </div>
        );
      case 'md5-generator':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-slate-700 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-slate-600 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Hash className="w-10 h-10 text-white/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] font-bold px-1 text-center">
                  d41d8cd9...
                </div>
                <span className="text-[10px] font-black tracking-tighter">MD5 HASH</span>
              </div>
            </div>
          </div>
        );
      case 'pdf-to-word':
      case 'word-to-pdf':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-red-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] font-bold bg-white/20 px-1 rounded">PDF</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-[8px] font-bold bg-blue-500 px-1 rounded">DOC</span>
                  </div>
                </div>
                <span className="text-[10px] font-black tracking-tighter">PDF-WORD</span>
              </div>
            </div>
          </div>
        );
      case 'word-to-excel':
      case 'pdf-to-excel':
      case 'excel-to-pdf':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-red-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-1">
                    <FileText className="w-5 h-5" />
                    <ArrowRight className="w-3 h-3" />
                    <FileSpreadsheet className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <span className="text-[10px] font-black tracking-tighter">PDF-EXCEL</span>
              </div>
            </div>
          </div>
        );
      case 'pdf-to-ppt':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="w-14 h-18 bg-red-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-bl-xl"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-1">
                    <FileText className="w-5 h-5" />
                    <ArrowRight className="w-3 h-3" />
                    <Presentation className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
                <span className="text-[10px] font-black tracking-tighter">PDF-PPT</span>
              </div>
            </div>
          </div>
        );
      case 'merge-pdf':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative flex items-center justify-center">
              {/* Stacked PDF Files */}
              <div className="w-10 h-14 bg-red-400 rounded-lg shadow-md absolute -translate-x-4 -translate-y-2 rotate-[-12deg] opacity-60"></div>
              <div className="w-10 h-14 bg-red-500 rounded-lg shadow-md absolute -translate-x-2 -translate-y-1 rotate-[-6deg] opacity-80"></div>
              <div className="w-12 h-16 bg-red-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-2 text-white relative overflow-hidden group-hover:scale-105 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-bl-lg"></div>
                <span className="text-[10px] font-black tracking-tighter">PDF</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/40 rounded-full flex items-center justify-center">
                    <div className="w-3 h-0.5 bg-white rounded-full"></div>
                    <div className="w-0.5 h-3 bg-white rounded-full absolute"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'split-pdf':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative flex items-center justify-center gap-2">
              {/* Splitting PDF Files */}
              <div className="w-10 h-14 bg-red-600 rounded-lg shadow-lg flex flex-col items-center justify-end pb-2 text-white relative overflow-hidden group-hover:-translate-x-3 group-hover:-rotate-12 transition-all">
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl-md"></div>
                <span className="text-[8px] font-black">PDF</span>
              </div>
              <div className="w-10 h-14 bg-red-600 rounded-lg shadow-lg flex flex-col items-center justify-end pb-2 text-white relative overflow-hidden group-hover:translate-x-3 group-hover:rotate-12 transition-all">
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl-md"></div>
                <span className="text-[8px] font-black">PDF</span>
              </div>
              {/* Scissors Icon in middle */}
              <div className="absolute z-10 bg-white rounded-full p-1.5 shadow-md group-hover:scale-125 transition-transform">
                <Scissors className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </div>
        );
      case 'pdf-to-text':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative flex items-center justify-center gap-4">
              {/* PDF File */}
              <div className="w-12 h-16 bg-red-600 rounded-lg shadow-lg flex flex-col items-center justify-end pb-2 text-white relative overflow-hidden group-hover:-translate-x-2 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-bl-lg"></div>
                <span className="text-[10px] font-black tracking-tighter">PDF</span>
              </div>

              {/* Arrow */}
              <div className="absolute z-10 w-12 h-6 pointer-events-none">
                <ArrowRight className="w-full h-full text-white drop-shadow-md" />
              </div>

              {/* Text File */}
              <div className="w-12 h-16 bg-slate-100 rounded-lg shadow-lg flex flex-col items-center justify-center text-slate-600 relative overflow-hidden group-hover:translate-x-2 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-slate-200 rounded-bl-lg"></div>
                <div className="flex flex-col gap-1 w-full px-2">
                  <div className="h-1 bg-slate-300 rounded-full w-3/4"></div>
                  <div className="h-1 bg-slate-300 rounded-full w-full"></div>
                  <div className="h-1 bg-slate-300 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'rotate-pdf':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative">
              <div className="w-14 h-18 bg-red-600 rounded-lg shadow-xl flex flex-col items-center justify-end pb-3 text-white relative overflow-hidden group-hover:rotate-90 transition-transform duration-500">
                <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-bl-xl"></div>
                <span className="text-xs font-black tracking-tighter">PDF</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-white/30" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg text-red-600">
                <RefreshCw className="w-4 h-4" />
              </div>
            </div>
          </div>
        );
      case 'pdf-to-word':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative flex items-center justify-center gap-4">
              {/* PDF File */}
              <div className="w-12 h-16 bg-red-500 rounded-lg shadow-lg flex flex-col items-center justify-end pb-2 text-white relative overflow-hidden group-hover:-translate-x-2 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-400 rounded-bl-lg"></div>
                <span className="text-[10px] font-black tracking-tighter">PDF</span>
              </div>
              
              {/* Wavy Arrow */}
              <div className="absolute z-10 w-16 h-8 pointer-events-none">
                <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-md">
                  <path 
                    d="M10,20 Q30,5 50,20 T90,20" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className="animate-[dash_2s_linear_infinite]"
                    style={{ strokeDasharray: '10, 5' }}
                  />
                  <path d="M85,15 L95,20 L85,25" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Word File */}
              <div className="w-12 h-16 bg-blue-600 rounded-lg shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden group-hover:translate-x-2 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-bl-lg"></div>
                <span className="text-2xl font-black">W</span>
              </div>
            </div>
          </div>
        );
      case 'word-to-pdf':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative flex items-center justify-center gap-4">
              {/* Word File */}
              <div className="w-12 h-16 bg-blue-600 rounded-lg shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden group-hover:-translate-x-2 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-bl-lg"></div>
                <span className="text-2xl font-black">W</span>
              </div>

              {/* Wavy Arrow */}
              <div className="absolute z-10 w-16 h-8 pointer-events-none">
                <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-md">
                  <path 
                    d="M10,20 Q30,5 50,20 T90,20" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className="animate-[dash_2s_linear_infinite]"
                    style={{ strokeDasharray: '10, 5' }}
                  />
                  <path d="M85,15 L95,20 L85,25" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* PDF File */}
              <div className="w-12 h-16 bg-red-500 rounded-lg shadow-lg flex flex-col items-center justify-end pb-2 text-white relative overflow-hidden group-hover:translate-x-2 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-400 rounded-bl-lg"></div>
                <span className="text-[10px] font-black tracking-tighter">PDF</span>
              </div>
            </div>
          </div>
        );
      case 'word-to-excel':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative flex items-center justify-center gap-4">
              {/* Word File */}
              <div className="w-12 h-16 bg-blue-600 rounded-lg shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden group-hover:-translate-x-2 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-bl-lg"></div>
                <span className="text-2xl font-black">W</span>
              </div>

              {/* Wavy Arrow */}
              <div className="absolute z-10 w-16 h-8 pointer-events-none">
                <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-md">
                  <path 
                    d="M10,20 Q30,5 50,20 T90,20" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                  />
                  <path d="M85,15 L95,20 L85,25" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Excel File */}
              <div className="w-12 h-16 bg-emerald-600 rounded-lg shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden group-hover:translate-x-2 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-bl-lg"></div>
                <span className="text-2xl font-black">X</span>
              </div>
            </div>
          </div>
        );
      case 'excel-to-pdf':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative flex items-center justify-center gap-4">
              {/* Excel File */}
              <div className="w-12 h-16 bg-emerald-600 rounded-lg shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden group-hover:-translate-x-2 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-bl-lg"></div>
                <span className="text-2xl font-black">X</span>
              </div>

              {/* Wavy Arrow */}
              <div className="absolute z-10 w-16 h-8 pointer-events-none">
                <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-md">
                  <path 
                    d="M10,20 Q30,5 50,20 T90,20" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                  />
                  <path d="M85,15 L95,20 L85,25" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* PDF File */}
              <div className="w-12 h-16 bg-red-500 rounded-lg shadow-lg flex flex-col items-center justify-end pb-2 text-white relative overflow-hidden group-hover:translate-x-2 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-400 rounded-bl-lg"></div>
                <span className="text-[10px] font-black tracking-tighter">PDF</span>
              </div>
            </div>
          </div>
        );
      case 'pdf-to-excel':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative flex items-center justify-center gap-4">
              {/* PDF File */}
              <div className="w-12 h-16 bg-red-500 rounded-lg shadow-lg flex flex-col items-center justify-end pb-2 text-white relative overflow-hidden group-hover:-translate-x-2 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-400 rounded-bl-lg"></div>
                <span className="text-[10px] font-black tracking-tighter">PDF</span>
              </div>

              {/* Wavy Arrow */}
              <div className="absolute z-10 w-16 h-8 pointer-events-none">
                <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-md">
                  <path 
                    d="M10,20 Q30,5 50,20 T90,20" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                  />
                  <path d="M85,15 L95,20 L85,25" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Excel File */}
              <div className="w-12 h-16 bg-emerald-600 rounded-lg shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden group-hover:translate-x-2 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-bl-lg"></div>
                <span className="text-2xl font-black">X</span>
              </div>
            </div>
          </div>
        );
      case 'pdf-to-ppt':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative flex items-center justify-center gap-4">
              {/* PDF File */}
              <div className="w-12 h-16 bg-red-500 rounded-lg shadow-lg flex flex-col items-center justify-end pb-2 text-white relative overflow-hidden group-hover:-translate-x-2 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-400 rounded-bl-lg"></div>
                <span className="text-[10px] font-black tracking-tighter">PDF</span>
              </div>

              {/* Wavy Arrow */}
              <div className="absolute z-10 w-16 h-8 pointer-events-none">
                <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-md">
                  <path 
                    d="M10,20 Q30,5 50,20 T90,20" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                  />
                  <path d="M85,15 L95,20 L85,25" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* PPT File */}
              <div className="w-12 h-16 bg-orange-600 rounded-lg shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden group-hover:translate-x-2 transition-transform">
                <div className="absolute top-0 right-0 w-4 h-4 bg-orange-500 rounded-bl-lg"></div>
                <span className="text-2xl font-black">P</span>
              </div>
            </div>
          </div>
        );
      case 'image-tools':
        return (
          <div className="relative flex items-center justify-center group">
            <div className="w-14 h-14 bg-sky-500 rounded-2xl shadow-lg flex items-center justify-center text-white transform group-hover:scale-110 transition-transform">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-sky-500">
              <Scissors className="w-3 h-3" />
            </div>
          </div>
        );
      case 'seo-tools':
        return (
          <div className="relative flex items-center justify-center group">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl shadow-lg flex items-center justify-center text-white transform group-hover:scale-110 transition-transform">
              <Search className="w-8 h-8" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-emerald-500">
              <Zap className="w-3 h-3" />
            </div>
          </div>
        );
      case 'dev-tools':
        return (
          <div className="relative flex items-center justify-center group">
            <div className="w-14 h-14 bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center text-sky-400 transform group-hover:scale-110 transition-transform">
              <Code className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-slate-800">
              <Braces className="w-3 h-3" />
            </div>
          </div>
        );
      case 'text-tools':
        return (
          <div className="relative flex items-center justify-center group">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl shadow-lg flex items-center justify-center text-white transform group-hover:scale-110 transition-transform">
              <Type className="w-8 h-8" />
            </div>
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-amber-500">
              <Hash className="w-3 h-3" />
            </div>
          </div>
        );
      default:
        return (
          <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-500">
            <Settings className="w-8 h-8" />
          </div>
        );
    }
  };

  return (
    <div className={cn("flex items-center justify-center", sizes[size], className)}>
      {renderIllustration()}
    </div>
  );
};
