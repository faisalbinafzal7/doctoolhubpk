import React from 'react';
import { Copy, RefreshCw, Info, Zap, Shield, Hash, Settings, LayoutGrid } from 'lucide-react';

export default function RandomNumberGenerator() {
  const [min, setMin] = React.useState(1);
  const [max, setMax] = React.useState(100);
  const [quantity, setQuantity] = React.useState(10);
  const [decimals, setDecimals] = React.useState(0);
  const [allowDuplicates, setAllowDuplicates] = React.useState(true);
  const [sortResults, setSortResults] = React.useState(false);
  const [uniqueOnly, setUniqueOnly] = React.useState(false);
  const [results, setResults] = React.useState<number[]>([]);
  const [status, setStatus] = React.useState<{ message: string; type: 'info' | 'success' | 'error' }>({
    message: 'Set your range and quantity, then click Generate Numbers.',
    type: 'info'
  });

  const stats = React.useMemo(() => {
    if (results.length === 0) return { min: '-', max: '-', avg: '-' };
    const minVal = Math.min(...results);
    const maxVal = Math.max(...results);
    const sum = results.reduce((a, b) => a + b, 0);
    const avg = sum / results.length;
    return {
      min: minVal.toFixed(decimals),
      max: maxVal.toFixed(decimals),
      avg: avg.toFixed(2)
    };
  }, [results, decimals]);

  const getSecureRandomNumber = (minVal: number, maxVal: number, decimalPlaces: number) => {
    const range = maxVal - minVal;
    if (decimalPlaces === 0) {
      const cryptoRandom = new Uint32Array(1);
      window.crypto.getRandomValues(cryptoRandom);
      const normalizedRandom = cryptoRandom[0] / 4294967295;
      return minVal + Math.floor(normalizedRandom * (range + 1));
    } else {
      const cryptoRandom = new Uint32Array(1);
      window.crypto.getRandomValues(cryptoRandom);
      const normalizedRandom = cryptoRandom[0] / 4294967295;
      const randomValue = minVal + (normalizedRandom * range);
      return parseFloat(randomValue.toFixed(decimalPlaces));
    }
  };

  const generateNumbers = React.useCallback(() => {
    if (isNaN(min) || isNaN(max)) {
      setStatus({ message: '❌ Please enter valid min and max values.', type: 'error' });
      return;
    }
    if (min >= max) {
      setStatus({ message: '❌ Min value must be less than max value.', type: 'error' });
      return;
    }
    if (quantity < 1) {
      setStatus({ message: '❌ Quantity must be at least 1.', type: 'error' });
      return;
    }

    const count = Math.min(quantity, 1000);
    if (uniqueOnly) {
      const rangeSize = Math.floor((max - min) * Math.pow(10, decimals)) + 1;
      if (count > rangeSize) {
        setStatus({ message: `⚠️ Cannot generate ${count} unique numbers. Max unique: ${rangeSize}.`, type: 'error' });
        return;
      }
    }

    const newResults: number[] = [];
    const uniqueSet = new Set<string>();
    let attempts = 0;
    const maxAttempts = count * 10;

    while (newResults.length < count && attempts < maxAttempts) {
      const num = getSecureRandomNumber(min, max, decimals);
      const key = num.toFixed(decimals);

      if (uniqueOnly || !allowDuplicates) {
        if (!uniqueSet.has(key)) {
          uniqueSet.add(key);
          newResults.push(num);
        }
      } else {
        newResults.push(num);
      }
      attempts++;
    }

    if (sortResults) {
      newResults.sort((a, b) => a - b);
    }

    setResults(newResults);
    setStatus({ message: `✅ Generated ${newResults.length} random number${newResults.length !== 1 ? 's' : ''}!`, type: 'success' });
  }, [min, max, quantity, decimals, allowDuplicates, sortResults, uniqueOnly]);

  const copyToClipboard = () => {
    if (results.length === 0) {
      setStatus({ message: '⚠️ No numbers to copy. Generate numbers first.', type: 'error' });
      return;
    }
    const text = results.map(n => n.toFixed(decimals)).join(', ');
    navigator.clipboard.writeText(text).then(() => {
      setStatus({ message: '✅ Numbers copied to clipboard!', type: 'success' });
      setTimeout(() => setStatus({ message: 'Ready. Customize options and generate random numbers.', type: 'info' }), 2000);
    });
  };

  const applyPreset = (minVal: number, maxVal: number, qty: number, dec: number) => {
    setMin(minVal);
    setMax(maxVal);
    setQuantity(qty);
    setDecimals(dec);
    // We need to use the values directly as state updates are async
    const count = Math.min(qty, 1000);
    const newResults: number[] = [];
    for (let i = 0; i < count; i++) {
      newResults.push(getSecureRandomNumber(minVal, maxVal, dec));
    }
    setResults(newResults);
    setStatus({ message: `✅ Preset applied: ${minVal} to ${maxVal}`, type: 'success' });
  };

  // Initial generation
  React.useEffect(() => {
    generateNumbers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white premium-card rounded-3xl border border-gray-200/70 p-6 md:p-8 mb-12 shadow-sm w-full">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Random Number Generator</h2>
            <p className="text-sm text-gray-500 mt-1">Generate random numbers with custom range, quantity, and sorting options</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={copyToClipboard}
              className="bg-white border-2 border-[#0274be] text-[#0274be] font-medium px-4 py-2 rounded-xl text-sm hover:bg-[#0274be]/5 transition flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Numbers
            </button>
            <button 
              onClick={generateNumbers}
              className="bg-[#0274be] text-white font-medium px-4 py-2 rounded-xl text-sm hover:bg-[#02609e] transition flex items-center gap-2 shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              Generate Numbers
            </button>
          </div>
        </div>

        {/* GENERATED NUMBERS DISPLAY */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
            <Hash className="h-4 w-4 text-[#0274be]" />
            Generated Numbers
          </label>
          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200 min-h-[120px] max-h-[300px] overflow-y-auto">
            {results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {results.map((num, idx) => (
                  <div key={idx} className="bg-white p-2 rounded-lg border border-gray-200 text-center font-mono text-sm shadow-sm">
                    {num.toFixed(decimals)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Click "Generate Numbers" to start</p>
            )}
          </div>
        </div>

        {/* GENERATION OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Min Value</label>
            <input 
              type="number" 
              value={min} 
              onChange={(e) => setMin(parseFloat(e.target.value))}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Max Value</label>
            <input 
              type="number" 
              value={max} 
              onChange={(e) => setMax(parseFloat(e.target.value))}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Quantity</label>
            <input 
              type="number" 
              value={quantity} 
              min="1" 
              max="1000"
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Decimal Places</label>
            <select 
              value={decimals} 
              onChange={(e) => setDecimals(parseInt(e.target.value))}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0274be] focus:border-[#0274be] outline-none transition bg-white"
            >
              <option value="0">0 (Integers)</option>
              <option value="1">1 decimal</option>
              <option value="2">2 decimals</option>
              <option value="3">3 decimals</option>
              <option value="4">4 decimals</option>
            </select>
          </div>
        </div>

        {/* ADVANCED OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <OptionToggle 
            label="Allow duplicates" 
            description="Allow same number to appear multiple times"
            checked={allowDuplicates}
            onChange={(val) => {
              setAllowDuplicates(val);
              if (val) setUniqueOnly(false);
            }}
          />
          <OptionToggle 
            label="Sort results" 
            description="Sort numbers in ascending order"
            checked={sortResults}
            onChange={setSortResults}
          />
          <OptionToggle 
            label="Unique only" 
            description="Generate only unique numbers"
            checked={uniqueOnly}
            onChange={(val) => {
              setUniqueOnly(val);
              if (val) setAllowDuplicates(false);
            }}
          />
        </div>

        {/* QUICK PRESETS */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
            <Settings className="h-4 w-4 text-[#0274be]" />
            Quick Presets
          </label>
          <div className="flex flex-wrap gap-2">
            <PresetButton label="Coin Flip (1-2)" onClick={() => applyPreset(1, 2, 1, 0)} />
            <PresetButton label="Dice Roll (1-6)" onClick={() => applyPreset(1, 6, 1, 0)} />
            <PresetButton label="Lottery (1-49)" onClick={() => applyPreset(1, 49, 6, 0)} />
            <PresetButton label="Percentage (0-100)" onClick={() => applyPreset(0, 100, 1, 0)} />
            <PresetButton label="Temp (-10 to 40)" onClick={() => applyPreset(-10, 40, 5, 1)} />
          </div>
        </div>

        {/* STATISTICS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatBox label="Numbers Generated" value={results.length} />
          <StatBox label="Min Value" value={stats.min} accent />
          <StatBox label="Max Value" value={stats.max} accent />
          <StatBox label="Average" value={stats.avg} accent />
        </div>

        {/* INFORMATION NOTE */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-[#0274be] mt-0.5 shrink-0" />
            <div className="text-sm text-gray-600">
              <strong className="font-semibold text-gray-800">About Random Number Generation:</strong> Uses cryptographically secure random number generation where available. Perfect for gaming, statistical sampling, lotteries, testing, and any application requiring unpredictable numbers.
            </div>
          </div>
        </div>

        {/* STATUS / FEEDBACK */}
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

      {/* FEATURES SECTION */}
      <div className="bg-white py-10 border-t border-gray-100 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Why choose DocToolHubPK?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-[#0274be]" />}
            title="Instant generation"
            description="Generate random numbers in milliseconds."
          />
          <FeatureCard 
            icon={<LayoutGrid className="h-6 w-6 text-[#0274be]" />}
            title="Full customization"
            description="Range, quantity, decimals, duplicates, sorting."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-[#0274be]" />}
            title="Secure random"
            description="Cryptographically secure generation."
          />
          <FeatureCard 
            icon={<Copy className="h-6 w-6 text-[#0274be]" />}
            title="Copy & statistics"
            description="Copy results and view statistical analysis."
          />
        </div>
      </div>
    </div>
  );
}

function OptionToggle({ label, description, checked, onChange }: { label: string, description: string, checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <input 
          type="checkbox" 
          className="rounded border-gray-300 text-[#0274be] focus:ring-[#0274be] w-4 h-4" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label className="text-sm font-medium text-gray-700 cursor-pointer">{label}</label>
      </div>
      <p className="text-xs text-gray-500 ml-6">{description}</p>
    </div>
  );
}

function PresetButton({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
    >
      {label}
    </button>
  );
}

function StatBox({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-200 text-center">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-xl font-bold ${accent ? 'text-[#0274be]' : 'text-gray-800'}`}>{value}</div>
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
