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
  Pipette,
  Paintbrush,
  Dices
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function HexRgbConverter() {
  const [rgb, setRgb] = useState({ r: 2, g: 116, b: 190 });
  const [hexInput, setHexInput] = useState('#0274BE');
  const [hexResult, setHexResult] = useState('#0274BE');
  const [rgbResult, setRgbResult] = useState('rgb(2, 116, 190)');
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Enter HEX code or RGB values to convert colors.',
    type: 'info'
  });
  const [copied, setCopied] = useState<'hex' | 'rgb' | null>(null);

  const showStatus = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setStatus({ message, type });
    if (type === 'success') {
      setTimeout(() => {
        setStatus({ message: 'Ready. Enter HEX or RGB values to convert.', type: 'info' });
      }, 3000);
    }
  };

  const componentToHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, c)).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  };

  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace(/^#/, '');
    if (cleanHex.length === 3) {
      const r = parseInt(cleanHex[0] + cleanHex[0], 16);
      const g = parseInt(cleanHex[1] + cleanHex[1], 16);
      const b = parseInt(cleanHex[2] + cleanHex[2], 16);
      return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
    }
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
    }
    return null;
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: string) => {
    const val = parseInt(value) || 0;
    const newRgb = { ...rgb, [channel]: Math.max(0, Math.min(255, val)) };
    setRgb(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b).toUpperCase();
    setHexResult(hex);
    setHexInput(hex);
    setRgbResult(`rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`);
  };

  const handleHexInputChange = (value: string) => {
    setHexInput(value);
    const res = hexToRgb(value);
    if (res) {
      setRgb(res);
      setHexResult(rgbToHex(res.r, res.g, res.b).toUpperCase());
      setRgbResult(`rgb(${res.r}, ${res.g}, ${res.b})`);
    }
  };

  const generateRandom = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const newRgb = { r, g, b };
    setRgb(newRgb);
    const hex = rgbToHex(r, g, b).toUpperCase();
    setHexResult(hex);
    setHexInput(hex);
    setRgbResult(`rgb(${r}, ${g}, ${b})`);
    showStatus(`Random color generated: RGB(${r}, ${g}, ${b})`, 'success');
  };

  const copyToClipboard = async (text: string, type: 'hex' | 'rgb') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
      showStatus(`${type.toUpperCase()} copied to clipboard!`, 'success');
    } catch (err) {
      showStatus('Failed to copy color.', 'error');
    }
  };

  const clearAll = () => {
    const defaultRgb = { r: 2, g: 116, b: 190 };
    setRgb(defaultRgb);
    const hex = rgbToHex(defaultRgb.r, defaultRgb.g, defaultRgb.b).toUpperCase();
    setHexInput(hex);
    setHexResult(hex);
    setRgbResult(`rgb(${defaultRgb.r}, ${defaultRgb.g}, ${defaultRgb.b})`);
    showStatus('Reset to default color.', 'info');
  };

  const commonColors = [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Green', hex: '#00FF00' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Magenta', hex: '#FF00FF' },
    { name: 'Cyan', hex: '#00FFFF' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Purple', hex: '#800080' }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">HEX to RGB Converter</h2>
            <p className="text-sm text-slate-500 mt-1">Convert HEX color codes to RGB and vice versa</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={generateRandom}
              className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Dices className="w-4 h-4" />
              Random
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

        <div className="h-32 rounded-2xl shadow-inner border border-slate-200 transition-colors duration-200" style={{ backgroundColor: hexResult }}></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* HEX to RGB Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-sky-500" />
              HEX to RGB
            </h3>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HEX Color</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={hexInput}
                  onChange={(e) => handleHexInputChange(e.target.value)}
                  placeholder="#0274BE"
                  className="w-full p-3 pr-14 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono outline-none focus:ring-2 focus:ring-sky-500" 
                />
                <input 
                  type="color" 
                  value={hexResult}
                  onChange={(e) => handleHexInputChange(e.target.value)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-8 rounded border border-slate-200 cursor-pointer bg-transparent"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RGB Result</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={rgbResult}
                  readOnly
                  className="w-full p-3 pr-24 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono text-sky-600 outline-none" 
                />
                <button 
                  onClick={() => copyToClipboard(rgbResult, 'rgb')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold hover:bg-sky-600 transition-all shadow-md shadow-sky-100"
                >
                  {copied === 'rgb' ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>
          </div>

          {/* RGB to HEX Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Pipette className="w-4 h-4 text-sky-500" />
              RGB to HEX
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(['r', 'g', 'b'] as const).map((channel) => (
                <div key={channel} className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {channel === 'r' ? 'Red' : channel === 'g' ? 'Green' : 'Blue'}
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    max="255" 
                    value={rgb[channel]}
                    onChange={(e) => handleRgbChange(channel, e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm font-bold" 
                  />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HEX Result</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={hexResult}
                  readOnly
                  className="w-full p-3 pr-24 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono text-sky-600 outline-none" 
                />
                <button 
                  onClick={() => copyToClipboard(hexResult, 'hex')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold hover:bg-sky-600 transition-all shadow-md shadow-sky-100"
                >
                  {copied === 'hex' ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Common Colors</label>
          <div className="flex flex-wrap gap-2">
            {commonColors.map((color) => (
              <button
                key={color.hex}
                onClick={() => handleHexInputChange(color.hex)}
                className="px-3 py-1.5 text-[10px] font-bold rounded-full border border-slate-200 hover:border-sky-500 transition-all flex items-center gap-2 group"
              >
                <span 
                  className="w-2 h-2 rounded-full border border-slate-200" 
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-slate-600 group-hover:text-sky-600">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Red Value', value: rgb.r },
            { label: 'Green Value', value: rgb.g },
            { label: 'Blue Value', value: rgb.b },
            { label: 'HEX Code', value: hexResult }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-xl font-black text-slate-700">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100">
          <div className="flex items-start gap-4">
            <div className="bg-sky-100 p-2 rounded-lg">
              <Info className="w-5 h-5 text-sky-600" />
            </div>
            <div className="text-sm text-sky-800 leading-relaxed">
              <strong className="font-bold block mb-1">About HEX and RGB:</strong>
              HEX (hexadecimal) is a 6-digit code representing RGB values. RGB (Red, Green, Blue) uses values from 0-255 for each channel. Both represent the same color, just different formats.
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
          { icon: Zap, title: "Instant conversion", desc: "Convert HEX to RGB and vice versa instantly." },
          { icon: Paintbrush, title: "Color preview", desc: "Live color preview as you adjust values." },
          { icon: Shield, title: "100% secure", desc: "No upload — your data stays in your browser." },
          { icon: Pipette, title: "Color picker", desc: "Built-in color picker for easy selection." }
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
