import React, { useState } from 'react';

function randomBytes(size) {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint8Array(size);
    window.crypto.getRandomValues(arr);
    return arr;
  }
  const arr = new Uint8Array(size);
  for (let i = 0; i < size; i++) arr[i] = Math.floor(Math.random() * 256);
  return arr;
}

function generatePassword({ length, upper, lower, numbers, symbols, avoidAmbiguous, basePhrase, preserveBase }) {
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()-_=+[]{};:,.<>?';
  // contiene caracteres considerados "ambiguos" que la gente suele evitar
  const ambiguous = "Il1O0`\"'\\/|";

  let charset = '';
  if (lower) charset += lowerChars;
  if (upper) charset += upperChars;
  if (numbers) charset += numberChars;
  if (symbols) charset += symbolChars;

  if (!charset) return '';
  // Si hay una frase base y queremos preservarla, "mejoramos" esa frase en lugar de crear una aleatoria pura
  if (basePhrase && preserveBase) {
    let base = String(basePhrase).trim();
    if (!base) return '';

    // si el usuario solicitó evitar ambigüedades, quitamos caracteres ambiguos del charset, pero no borraremos la frase base
    // Aplicaremos transformaciones ligeras que preserven la memorabilidad
    const leetMap = { a: '@', s: '$', o: '0', i: '!', l: '1', e: '3', t: '7' };

    // Min length must be at least base length
    const minLen = Math.max(length, base.length);

    // Start with base, apply capitalization if upper is requested
    if (upper) {
      base = base.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    // Replace a small number of characters using leetMap to increase entropy but keep readability
    const baseChars = base.split('');
    const bytes = randomBytes(8);
    let replacements = Math.max(1, Math.floor(base.length / 6));
    for (let i = 0; i < bytes.length && replacements > 0; i++) {
      const idx = bytes[i] % baseChars.length;
      const c = baseChars[idx].toLowerCase();
      if (leetMap[c]) {
        baseChars[idx] = leetMap[c];
        replacements--;
      }
    }

    let result = baseChars.join('');

    // Insert a small memorable token: symbol + two digits (or digits only) placed between words or appended
    const rand = randomBytes(4);
    const twoDigits = String((rand[0] * 256 + rand[1]) % 90 + 10); // 10..99
    const chosenSymbol = (symbols ? symbolChars[rand[2] % symbolChars.length] : numberChars[rand[2] % numberChars.length]);
    const token = `${chosenSymbol}${twoDigits}`;

    if (result.includes(' ')) {
      // insert token after first word to remain memorable
      const parts = result.split(' ');
      parts.splice(1, 0, token);
      result = parts.join('');
    } else {
      // append token keeping the base visible
      result = result + token;
    }

    // Ensure required character classes exist
    if (numbers && !/[0-9]/.test(result)) result += String((rand[3] % 90) + 10);
    if (symbols && !/[!@#$%^&*()\-_=+\[\]{};:,.<>?]/.test(result)) result += (symbols ? chosenSymbol : '!');

    // Remove ambiguous characters if requested from appended parts (but not from the user's base)
    if (avoidAmbiguous) {
      // we won't strip ambiguous from the core base to preserve memorability, only from appended tail
      // (simple approach: replace ambiguous in tail)
      result = result.split('').map(ch => ambiguous.includes(ch) ? (leetMap[ch.toLowerCase()] || ch) : ch).join('');
    }

    // If still shorter than desired, append random chars from charset
    while (result.length < minLen) {
      const b = randomBytes(1)[0];
      result += charset[b % charset.length];
    }

    return result;
  }
  if (avoidAmbiguous) charset = charset.split('').filter(c => !ambiguous.includes(c)).join('');

  const required = [];
  if (lower) required.push(lowerChars.replace(new RegExp('[' + ambiguous + ']', 'g'), ''));
  if (upper) required.push(upperChars.replace(new RegExp('[' + ambiguous + ']', 'g'), ''));
  if (numbers) required.push(numberChars.replace(new RegExp('[' + ambiguous + ']', 'g'), ''));
  if (symbols) required.push(symbolChars.replace(new RegExp('[' + ambiguous + ']', 'g'), ''));

  const bytes = randomBytes(length + 8);
  let pwd = [];

  required.forEach((set, i) => {
    if (!set) return;
    const idx = bytes[i] % set.length;
    pwd.push(set[idx]);
  });

  for (let i = pwd.length; i < length; i++) {
    const idx = bytes[i] % charset.length;
    pwd.push(charset[idx]);
  }

  const shuffleBytes = randomBytes(pwd.length);
  for (let i = pwd.length - 1; i > 0; i--) {
    const j = shuffleBytes[i] % (i + 1);
    [pwd[i], pwd[j]] = [pwd[j], pwd[i]];
  }

  return pwd.join('');
}

function entropyBits(password, charsetSize) {
  if (!password || charsetSize <= 1) return 0;
  return Math.round(Math.log2(Math.pow(charsetSize, password.length)));
}

export default function PasswordBot({ onClose }) {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(true);
  const [basePhrase, setBasePhrase] = useState('');
  const [preserveBase, setPreserveBase] = useState(true);
  const [password, setPassword] = useState('');
  const [variants, setVariants] = useState([]);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hola — soy tu asistente de contraseñas. Dime cómo quieres tu contraseña segura.' }
  ]);

  const handleGenerate = () => {
    let pwd = '';
    if (basePhrase && preserveBase) {
      const opts = { length, upper, lower, numbers, symbols, avoidAmbiguous };
      const vs = generateVariants(basePhrase, opts);
      setVariants(vs);
      pwd = vs.length ? vs[0] : '';
    } else {
      pwd = generatePassword({ length, upper, lower, numbers, symbols, avoidAmbiguous });
    }
    setPassword(pwd);

    const charsetSize = (lower ? 26 : 0) + (upper ? 26 : 0) + (numbers ? 10 : 0) + (symbols ? 28 : 0);
    const bits = entropyBits(pwd, charsetSize);

    const explanation = `He generado una contraseña de ${length} caracteres. Entropía aprox: ${bits} bits.`;
    const advice = bits >= 80 ? 'Muy segura — más que suficiente para la mayoría de usos.' : (bits >= 60 ? 'Segura — considera aumentar longitud o incluir símbolos.' : 'Débil — aumenta longitud o añade más tipos de caracteres.');

    setMessages(prev => [
      ...prev,
      { from: 'user', text: `${basePhrase && preserveBase ? `Mejora mi frase: "${basePhrase}" — ` : 'Genera una contraseña de '} ${length} con${upper ? ' mayúsculas,' : ''}${lower ? ' minúsculas,' : ''}${numbers ? ' números,' : ''}${symbols ? ' símbolos,' : ''}${avoidAmbiguous ? ' evitando caracteres ambiguos' : ''}` },
      { from: 'bot', text: explanation },
      { from: 'bot', text: advice }
    ]);
  };

  function generateVariants(rawBase, { length, upper, lower, numbers, symbols, avoidAmbiguous }) {
    const base = String(rawBase || '').trim();
    if (!base) return [];

    const leadingMatch = base.match(/^\d+/);
    const leading = leadingMatch ? leadingMatch[0] : '';
    const core = base.slice(leading.length) || base;

    const symbolChars = '!@#$%^&*()-_=+[]{};:,.<>?';
    const numberChars = '0123456789';

    const r = randomBytes(6);
    const twoDigits = String((r[0] * 256 + r[1]) % 90 + 10);
    const sym = symbols ? symbolChars[r[2] % symbolChars.length] : '';
    const digit = String(r[3] % 9 + 1);

    const opts = [];

    opts.push(`${leading}${core}.${twoDigits}`);
    opts.push(`${leading}${digit}.${core}-${twoDigits}`);
    const cap = core.charAt(0).toUpperCase() + core.slice(1);
    opts.push(`${leading}${cap}${twoDigits}`);
    opts.push(`${leading}${core}-${sym || ''}${twoDigits}`);
    const leet = core.replace(/a/i, '@');
    opts.push(`${leading}${leet}.${twoDigits}`);

    if (!leading) {
      opts.push(`${digit}${core}-${(r[4] % 90) + 10}`);
    } else {
      opts.push(`${leading}.${core}${(r[4] % 90) + 10}`);
    }

    const unique = Array.from(new Set(opts));
    const final = unique.map(v => {
      let out = v;
      if (avoidAmbiguous) out = out.replace(/[Il1O0`"'\\/|]/g, ch => ch);
      if (length && out.length > length) {
        const excess = out.length - length;
        out = out.slice(0, out.length - excess);
      }
      return out;
    });

    return final.slice(0, 6);
  }

  const selectVariant = (v) => {
    setPassword(v);
    setMessages(prev => [...prev, { from: 'user', text: `Seleccioné: ${v}` }, { from: 'bot', text: 'Perfecto — cópiala y úsala donde necesites.' }]);
  };

  const handleExplain = () => {
    setMessages(prev => [
      ...prev,
      { from: 'user', text: 'Explícame por qué esto es seguro.' },
      { from: 'bot', text: 'La seguridad de una contraseña depende de la longitud y la variedad de caracteres. Cada caracter aporta log2(charset) bits; más bits = más combinaciones y más difícil de romper por fuerza bruta.' }
    ]);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setMessages(prev => [...prev, { from: 'bot', text: 'Contraseña copiada al portapapeles.' }]);
    } catch (e) {
      setMessages(prev => [...prev, { from: 'bot', text: 'No pude copiar automáticamente — selecciona y copia manualmente.' }]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 font-bold text-2xl">✕</button>
        <h3 className="text-2xl font-black mb-2">Chatbot Generador de Contraseñas</h3>
        <p className="text-sm text-gray-600 mb-4">Simulado — nada sale del navegador. Te ayudo a crear contraseñas seguras y te explico por qué.</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">Frase base (opcional):</label>
            <input
              className="w-full p-2 border rounded-md"
              placeholder="Ej: 123pajaro"
              value={basePhrase}
              onChange={e => setBasePhrase(e.target.value)}
            />
            <label className="flex items-center gap-2 mt-2"><input type="checkbox" checked={preserveBase} onChange={e => setPreserveBase(e.target.checked)} /> Mejorar mi frase, no quitarla</label>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-semibold mb-1">Longitud: <span className="font-black">{length}</span></label>
            <input type="range" min="8" max="64" value={length} onChange={e => setLength(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-2">
            <label className="flex items-center gap-2"><input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} /> Mayúsculas</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={lower} onChange={e => setLower(e.target.checked)} /> Minúsculas</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={numbers} onChange={e => setNumbers(e.target.checked)} /> Números</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={symbols} onChange={e => setSymbols(e.target.checked)} /> Símbolos</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={avoidAmbiguous} onChange={e => setAvoidAmbiguous(e.target.checked)} /> Evitar caracteres ambiguos (I,l,1,O,0)</label>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <button onClick={handleGenerate} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md font-bold">Generar</button>
            <button onClick={handleExplain} className="px-4 py-2 border rounded-md font-semibold">Explicar</button>
            <button onClick={copyToClipboard} disabled={!password} className="px-4 py-2 border rounded-md font-semibold">Copiar</button>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <div className="font-mono break-words text-lg font-black text-gray-900">{password || 'Aquí aparecerá la contraseña generada'}</div>
        </div>

        {variants && variants.length > 0 && (
          <div className="mb-4 max-h-64 overflow-y-auto">
            <h4 className="font-bold mb-2">Opciones memorables:</h4>
            <div className="grid grid-cols-1 gap-2">
              {variants.map((v, i) => (
                <div key={i} className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-md">
                  <div className="font-mono break-words">{v}</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => selectVariant(v)} className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm">Seleccionar</button>
                    <button onClick={async () => { await navigator.clipboard.writeText(v); setMessages(prev => [...prev, { from: 'bot', text: 'Contraseña copiada al portapapeles.' }]); }} className="px-3 py-1 border rounded-md text-sm">Copiar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-48 overflow-y-auto p-3 bg-white border rounded-md">
          {messages.map((m, i) => (
            <div key={i} className={`mb-3 ${m.from === 'bot' ? 'text-gray-800' : 'text-gray-600 text-right'}`}>
              <div className={`inline-block p-2 rounded ${m.from === 'bot' ? 'bg-purple-50' : 'bg-gray-100'}`}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
