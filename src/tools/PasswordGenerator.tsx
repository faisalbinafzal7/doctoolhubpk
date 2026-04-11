import React from 'react';
import { Copy, RefreshCw, Shield, Zap, Lock, Check, Info, Layout, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = React.useState('');
  const [length, setLength] = React.useState(16);
  const [options, setOptions] = React.useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
  });
  const [status, setStatus] = React.useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Customize your password options and click Generate.',
    type: 'info'
  });

  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const similarChars = 'il1Lo0O';

  const generatePassword = React.useCallback(() => {
    let charset = '';
    if (options.uppercase) charset += uppercaseChars;
    if (options.lowercase) charset += lowercaseChars;
    if (options.numbers) charset += numberChars;
    if (options.symbols) charset += symbolChars;

    if (charset === '') {
      setPassword('Select at least one character type');
      setStatus({ message: '⚠️ Please select at least one character type.', type: 'error' });
      return;
    }

    let charsetArray = charset.split('');
    if (options.excludeSimilar) {
      charsetArray = charsetArray.filter(char => !similarChars.includes(char));
      if (charsetArray.length === 0) {
        setPassword('No characters available after exclusion');
        setStatus({ message: '⚠️ No characters available after excluding similar characters.', type: 'error' });
        return;
      }
    }

    let newPassword = '';
    const randomArray = new Uint32Array(length);
    window.crypto.getRandomValues(randomArray);

    for (let i = 0; i < length; i++) {
      newPassword += charsetArray[randomArray[i] % charsetArray.length];
    }

    // Ensure at least one character from each selected type (simple retry logic)
    const hasUpper = !options.uppercase || /[A-Z]/.test(newPassword);
    const hasLower = !options.lowercase || /[a-z]/.test(newPassword);
    const hasNumber = !options.numbers || /[0-9]/.test(newPassword);
    const hasSymbol = !options.symbols || /[^A-Za-z0-9]/.test(newPassword);

    if (!(hasUpper && hasLower && hasNumber && hasSymbol) && length >= 4) {
      // If missing required types, just try again (usually takes 1-2 tries)
      generatePassword();
      return;
    }

    setPassword(newPassword);
  }, [length, options]);

  React.useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const calculateStrength = (pwd: string) => {
    if (!pwd || pwd.includes(' ')) return { level: '-', color: 'bg-gray-200', width: '0%' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (pwd.length >= 20) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { level: 'Very Weak', color: 'bg-red-500', width: '25%' };
    if (score <= 4) return { level: 'Weak', color: 'bg-orange-500', width: '50%' };
    if (score <= 6) return { level: 'Medium', color: 'bg-yellow-500', width: '75%' };
    return { level: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = calculateStrength(password);

  const copyToClipboard = () => {
    if (!password || password.length < 4 || password.includes(' ')) {
      setStatus({ message: '⚠️ No password to copy. Generate a password first.', type: 'error' });
      return;
    }
    navigator.clipboard.writeText(password).then(() => {
      setStatus({ message: '✅ Password copied to clipboard!', type: 'success' });
      setTimeout(() => setStatus({ message: 'Ready. Customize options and generate passwords.', type: 'info' }), 2000);
    });
  };

  const applyPreset = (l: number, u: boolean, lo: boolean, n: boolean, s: boolean) => {
    setLength(l);
    setOptions({
      uppercase: u,
      lowercase: lo,
      numbers: n,
      symbols: s,
      excludeSimilar: options.excludeSimilar
    });
    setStatus({ message: `✅ Preset applied: ${l} characters.`, type: 'success' });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white premium-card rounded-3xl border border-gray-200/70 p-6 md:p-8 mb-12 shadow-sm w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Password Generator</h2>
            <p className="text-sm text-gray-500 mt-1">Generate strong, secure passwords with custom options</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={copyToClipboard}
              className="bg-white border-2 border-[#0274be] text-[#0274be] font-medium px-4 py-2 rounded-xl text-sm hover:bg-[#0274be]/5 transition flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Password
            </button>
            <button 
              onClick={generatePassword}
              className="bg-[#0274be] text-white font-medium px-4 py-2 rounded-xl text-sm hover:bg-[#02609e] transition flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Generate New
            </button>
          </div>
        </div>

        {/* PASSWORD DISPLAY */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2">Generated Password</label>
          <div className="relative">
            <input 
              type="text" 
              readOnly 
              value={password}
              className="w-full p-4 pr-24 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition bg-gray-50/50 font-mono text-lg tracking-wider" 
            />
            <button 
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0274be] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#02609e] transition flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
          </div>
        </div>

        {/* STRENGTH INDICATOR */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Password Strength</span>
            <span className={`text-sm font-semibold ${strength.level === 'Strong' ? 'text-green-600' : strength.level === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
              {strength.level}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${strength.color}`} 
              style={{ width: strength.width }}
            />
          </div>
        </div>

        {/* OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Password Length: <span className="text-[#0274be] font-bold">{length}</span>
              </label>
              <input 
                type="range" 
                min="6" 
                max="32" 
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full accent-[#0274be] bg-gray-200 rounded-lg h-2 cursor-pointer" 
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>6 (Weak)</span>
                <span>16 (Strong)</span>
                <span>32 (Very Strong)</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <OptionCheckbox 
                label="Uppercase (A-Z)" 
                checked={options.uppercase} 
                onChange={() => setOptions(prev => ({ ...prev, uppercase: !prev.uppercase }))} 
              />
              <OptionCheckbox 
                label="Lowercase (a-z)" 
                checked={options.lowercase} 
                onChange={() => setOptions(prev => ({ ...prev, lowercase: !prev.lowercase }))} 
              />
              <OptionCheckbox 
                label="Numbers (0-9)" 
                checked={options.numbers} 
                onChange={() => setOptions(prev => ({ ...prev, numbers: !prev.numbers }))} 
              />
              <OptionCheckbox 
                label="Symbols (!@#$%^&*)" 
                checked={options.symbols} 
                onChange={() => setOptions(prev => ({ ...prev, symbols: !prev.symbols }))} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Exclude similar characters</label>
              <OptionCheckbox 
                label="Exclude il1Lo0O (ambiguous)" 
                checked={options.excludeSimilar} 
                onChange={() => setOptions(prev => ({ ...prev, excludeSimilar: !prev.excludeSimilar }))} 
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Quick Presets</label>
              <div className="grid grid-cols-3 gap-2">
                <PresetButton label="Easy" onClick={() => applyPreset(8, true, true, true, false)} />
                <PresetButton label="Strong" onClick={() => applyPreset(16, true, true, true, true)} />
                <PresetButton label="Very Strong" onClick={() => applyPreset(24, true, true, true, true)} />
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs text-gray-500 leading-relaxed">
                💡 Tip: Use at least 12 characters with a mix of uppercase, lowercase, numbers, and symbols for maximum security.
              </p>
            </div>
          </div>
        </div>

        {/* GENERATE BUTTON */}
        <div className="flex gap-3 mb-6">
          <button 
            onClick={generatePassword}
            className="flex-1 bg-[#0274be] text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Generate Password
          </button>
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
            icon={<ShieldCheck className="h-6 w-6 text-[#0274be]" />}
            title="Strong encryption"
            description="Cryptographically secure random generation."
          />
          <FeatureCard 
            icon={<Layout className="h-6 w-6 text-[#0274be]" />}
            title="Customizable options"
            description="Include/exclude character types as needed."
          />
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-[#0274be]" />}
            title="Instant generation"
            description="Generate strong passwords in milliseconds."
          />
          <FeatureCard 
            icon={<Copy className="h-6 w-6 text-[#0274be]" />}
            title="Copy & use"
            description="One-click copy to clipboard for easy use."
          />
        </div>
      </div>
    </div>
  );
}

function OptionCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange}
        className="rounded border-gray-300 text-[#0274be] focus:ring-[#0274be] w-4 h-4" 
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function PresetButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-gray-100 text-gray-700 text-sm px-3 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
    >
      {label}
    </button>
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
