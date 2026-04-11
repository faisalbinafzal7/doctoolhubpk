import React, { useState, useRef, useEffect } from 'react';
import { 
  QrCode, 
  Download, 
  X, 
  Zap, 
  Shield, 
  Settings, 
  Info,
  Link,
  Mail,
  Phone,
  MessageSquare,
  Wifi,
  UserCircle,
  RefreshCw,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';

type DataType = 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard';

export default function QrCodeGenerator() {
  const [type, setType] = useState<DataType>('text');
  const [text, setText] = useState('');
  const [email, setEmail] = useState({ address: '', subject: '', body: '' });
  const [phone, setPhone] = useState('');
  const [sms, setSms] = useState({ number: '', message: '' });
  const [wifi, setWifi] = useState({ ssid: '', password: '', encryption: 'WPA' });
  const [vcard, setVcard] = useState({ first: '', last: '', phone: '', email: '', company: '' });
  
  const [options, setOptions] = useState({
    size: 250,
    errorCorrection: 'M' as 'L' | 'M' | 'Q' | 'H',
    fgColor: '#000000',
    bgColor: '#FFFFFF'
  });

  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Select data type, enter information, and click Generate QR Code.',
    type: 'info'
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerated, setIsGenerated] = useState(false);

  const showStatus = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setStatus({ message, type });
    if (type === 'success') {
      setTimeout(() => {
        setStatus({ message: 'Ready. Select data type and enter information.', type: 'info' });
      }, 3000);
    }
  };

  const buildDataString = () => {
    switch(type) {
      case 'text':
        return text.trim();
      case 'email':
        if (!email.address.trim()) return '';
        const mailto = `mailto:${email.address.trim()}`;
        const params = [];
        if (email.subject.trim()) params.push(`subject=${encodeURIComponent(email.subject.trim())}`);
        if (email.body.trim()) params.push(`body=${encodeURIComponent(email.body.trim())}`);
        return params.length > 0 ? `${mailto}?${params.join('&')}` : mailto;
      case 'phone':
        return phone.trim() ? `tel:${phone.trim()}` : '';
      case 'sms':
        if (!sms.number.trim()) return '';
        return sms.message.trim() ? `smsto:${sms.number.trim()}:${sms.message.trim()}` : `sms:${sms.number.trim()}`;
      case 'wifi':
        if (!wifi.ssid.trim()) return '';
        if (wifi.encryption === 'nopass') return `WIFI:S:${wifi.ssid.trim()};T:nopass;;`;
        return `WIFI:S:${wifi.ssid.trim()};T:${wifi.encryption};P:${wifi.password};;`;
      case 'vcard':
        const fullName = `${vcard.first} ${vcard.last}`.trim();
        if (!fullName && !vcard.phone && !vcard.email) return '';
        let vc = 'BEGIN:VCARD\nVERSION:3.0\n';
        if (fullName) vc += `FN:${fullName}\n`;
        if (vcard.first || vcard.last) vc += `N:${vcard.last};${vcard.first};;;\n`;
        if (vcard.phone.trim()) vc += `TEL:${vcard.phone.trim()}\n`;
        if (vcard.email.trim()) vc += `EMAIL:${vcard.email.trim()}\n`;
        if (vcard.company.trim()) vc += `ORG:${vcard.company.trim()}\n`;
        vc += 'END:VCARD';
        return vc;
      default:
        return '';
    }
  };

  const generateQR = async () => {
    const data = buildDataString();
    if (!data) {
      showStatus('Please enter the required information.', 'error');
      return;
    }

    if (!canvasRef.current) return;

    try {
      await QRCode.toCanvas(canvasRef.current, data, {
        width: options.size,
        margin: 2,
        errorCorrectionLevel: options.errorCorrection,
        color: {
          dark: options.fgColor,
          light: options.bgColor
        }
      });
      setIsGenerated(true);
      showStatus('QR Code generated successfully!', 'success');
    } catch (err: any) {
      showStatus(`Failed to generate QR Code: ${err.message}`, 'error');
    }
  };

  const downloadQR = () => {
    if (!canvasRef.current || !isGenerated) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    showStatus('QR Code downloaded successfully!', 'success');
  };

  const clearAll = () => {
    setText('');
    setEmail({ address: '', subject: '', body: '' });
    setPhone('');
    setSms({ number: '', message: '' });
    setWifi({ ssid: '', password: '', encryption: 'WPA' });
    setVcard({ first: '', last: '', phone: '', email: '', company: '' });
    setIsGenerated(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    showStatus('All fields cleared.', 'info');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">QR Code Generator</h2>
            <p className="text-sm text-slate-500 mt-1">Generate custom QR codes for various data types</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={downloadQR}
              disabled={!isGenerated}
              className="flex-1 sm:flex-none bg-white border-2 border-sky-500 text-sky-500 font-bold px-4 py-2 rounded-xl text-sm hover:bg-sky-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Download PNG
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Data Type</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: 'text', icon: Link, label: 'Text' },
                  { id: 'email', icon: Mail, label: 'Email' },
                  { id: 'phone', icon: Phone, label: 'Phone' },
                  { id: 'sms', icon: MessageSquare, label: 'SMS' },
                  { id: 'wifi', icon: Wifi, label: 'Wi-Fi' },
                  { id: 'vcard', icon: UserCircle, label: 'vCard' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setType(item.id as DataType)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                      type === item.id 
                        ? 'bg-sky-50 border-sky-500 text-sky-600' 
                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {type === 'text' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Text or URL</label>
                  <input 
                    type="text" 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm" 
                  />
                </div>
              )}

              {type === 'email' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      value={email.address}
                      onChange={(e) => setEmail({ ...email, address: e.target.value })}
                      placeholder="hello@example.com"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                    <input 
                      type="text" 
                      value={email.subject}
                      onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                      placeholder="Hello there!"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Body</label>
                    <textarea 
                      rows={3}
                      value={email.body}
                      onChange={(e) => setEmail({ ...email, body: e.target.value })}
                      placeholder="Message content..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm" 
                    />
                  </div>
                </div>
              )}

              {type === 'phone' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm" 
                  />
                </div>
              )}

              {type === 'sms' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                    <input 
                      type="tel" 
                      value={sms.number}
                      onChange={(e) => setSms({ ...sms, number: e.target.value })}
                      placeholder="+1234567890"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Message</label>
                    <textarea 
                      rows={3}
                      value={sms.message}
                      onChange={(e) => setSms({ ...sms, message: e.target.value })}
                      placeholder="Type your message..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm" 
                    />
                  </div>
                </div>
              )}

              {type === 'wifi' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">SSID (Network Name)</label>
                    <input 
                      type="text" 
                      value={wifi.ssid}
                      onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                      placeholder="My Home WiFi"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                      <input 
                        type="password" 
                        value={wifi.password}
                        onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Encryption</label>
                      <select 
                        value={wifi.encryption}
                        onChange={(e) => setWifi({ ...wifi, encryption: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">No Password</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {type === 'vcard' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
                      <input 
                        type="text" 
                        value={vcard.first}
                        onChange={(e) => setVcard({ ...vcard, first: e.target.value })}
                        placeholder="John"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
                      <input 
                        type="text" 
                        value={vcard.last}
                        onChange={(e) => setVcard({ ...vcard, last: e.target.value })}
                        placeholder="Doe"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                    <input 
                      type="tel" 
                      value={vcard.phone}
                      onChange={(e) => setVcard({ ...vcard, phone: e.target.value })}
                      placeholder="+1234567890"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                    <input 
                      type="email" 
                      value={vcard.email}
                      onChange={(e) => setVcard({ ...vcard, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Company</label>
                    <input 
                      type="text" 
                      value={vcard.company}
                      onChange={(e) => setVcard({ ...vcard, company: e.target.value })}
                      placeholder="Acme Corp"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm" 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Settings className="w-4 h-4 text-sky-500" />
                QR Options
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Size (px)</label>
                  <select 
                    value={options.size}
                    onChange={(e) => setOptions({ ...options, size: parseInt(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {[150, 200, 250, 300, 400, 500].map(s => (
                      <option key={s} value={s}>{s} x {s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Error Correction</label>
                  <select 
                    value={options.errorCorrection}
                    onChange={(e) => setOptions({ ...options, errorCorrection: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Foreground Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={options.fgColor}
                      onChange={(e) => setOptions({ ...options, fgColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer bg-transparent"
                    />
                    <input 
                      type="text" 
                      value={options.fgColor}
                      onChange={(e) => setOptions({ ...options, fgColor: e.target.value })}
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Background Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={options.bgColor}
                      onChange={(e) => setOptions({ ...options, bgColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer bg-transparent"
                    />
                    <input 
                      type="text" 
                      value={options.bgColor}
                      onChange={(e) => setOptions({ ...options, bgColor: e.target.value })}
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={generateQR}
              className="w-full bg-sky-500 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Generate QR Code
            </button>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner flex items-center justify-center min-h-[300px] w-full">
              <canvas 
                ref={canvasRef} 
                className={`max-w-full h-auto rounded-lg shadow-sm transition-opacity duration-300 ${isGenerated ? 'opacity-100' : 'opacity-0'}`}
              />
              {!isGenerated && (
                <div className="absolute flex flex-col items-center text-slate-300">
                  <QrCode className="w-20 h-20 mb-2" />
                  <span className="text-sm font-bold uppercase tracking-widest">Preview</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium text-center">
              Scan this QR code with your mobile device camera or a QR reader app.
            </p>
          </div>
        </div>

        <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100">
          <div className="flex items-start gap-4">
            <div className="bg-sky-100 p-2 rounded-lg">
              <Info className="w-5 h-5 text-sky-600" />
            </div>
            <div className="text-sm text-sky-800 leading-relaxed">
              <strong className="font-bold block mb-1">About QR Codes:</strong>
              QR (Quick Response) codes are two-dimensional barcodes that can store various types of information. They are widely used for URLs, contact information, Wi-Fi credentials, and more. Our generator allows you to create high-quality, customizable QR codes instantly in your browser.
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
          { icon: Zap, title: "Instant generation", desc: "Generate QR codes instantly in your browser." },
          { icon: Settings, title: "Multiple types", desc: "URLs, emails, phone, Wi-Fi, vCard, and more." },
          { icon: Shield, title: "100% secure", desc: "No upload — your data stays in your browser." },
          { icon: Download, title: "Download & customize", desc: "Customize colors, size, and download as PNG." }
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
