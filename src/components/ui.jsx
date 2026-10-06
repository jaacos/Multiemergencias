import React from 'react';

const Svg = ({ children, size = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={size} aria-hidden="true">{children}</svg>
);

export const IconChevronLeft = () => <Svg><polyline points="15 18 9 12 15 6" /></Svg>;
export const IconMoon = () => <Svg><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></Svg>;
export const IconSun = () => (
  <Svg><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></Svg>
);
export const IconBrain = () => <Svg size="w-8 h-8"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /></Svg>;
export const IconTrauma = () => <Svg size="w-8 h-8"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></Svg>;
export const IconBaby = () => <Svg size="w-8 h-8"><path d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5M22.5 10c-1 3-3.5 5.5-6.5 6.5a8.5 8.5 0 0 1-8 0C5 15.5 2.5 13 1.5 10c3-1 5.5-3.5 6.5-6.5a8.5 8.5 0 0 1 8 0c1 3 3.5 5.5 6.5 6.5Z" /></Svg>;
export const IconLungs = () => <Svg size="w-8 h-8"><path d="M12 2v7M9 9a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0v-7M15 9a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0v-7" /></Svg>;
export const IconOps = () => <Svg size="w-8 h-8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Svg>;

// Botón grande de selección (apto para guantes)
export const OptionBtn = ({ label, value, selectedValue, onClick }) => {
  const isSelected = value === selectedValue;
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onClick(value)}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all font-bold min-h-[60px] ${
        isSelected
          ? 'border-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-100 text-blue-900 shadow-md'
          : 'border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 text-slate-700 active:bg-slate-100 dark:active:bg-slate-700'
      }`}
    >
      {label}
    </button>
  );
};

// Selector SÍ / NO (tri-estado: null = sin responder)
export const YesNo = ({ value, onChange, yesLabel = 'SÍ', noLabel = 'NO' }) => (
  <div className="grid grid-cols-2 gap-2">
    <OptionBtn label={yesLabel} value={true} selectedValue={value} onClick={onChange} />
    <OptionBtn label={noLabel} value={false} selectedValue={value} onClick={onChange} />
  </div>
);

// Pestañas / interruptor de modo
export const Segmented = ({ options, value, onChange }) => (
  <div role="tablist" className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        role="tab"
        aria-selected={value === o.value}
        onClick={() => onChange(o.value)}
        className={`flex-1 py-3 rounded-lg font-bold text-sm ${
          value === o.value ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

// Fila de puntuación: cada opción muestra su valor y su descripción
export const ScoreRow = ({ title, hint, options, value, onChange }) => (
  <div className="mb-5">
    <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">{title}</div>
    {hint && <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{hint}</div>}
    <div className={`grid gap-2 mt-2 ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          aria-pressed={value === o.v}
          onClick={() => onChange(o.v)}
          className={`p-3 rounded-xl text-xs font-bold border-2 min-h-[84px] ${
            value === o.v
              ? 'border-blue-600 bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
              : 'border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 text-slate-700'
          }`}
        >
          <span className="block text-2xl font-black">{o.v}</span>
          {o.label}
        </button>
      ))}
    </div>
  </div>
);

const fix = (n, d) => Number(n.toFixed(d));

// Input numérico apto para guantes (sin teclado)
export const GloveInput = ({ label, value, min = 0, max = 300, step = 1, fastStep = 10, decimals = 0, onChange, unit = '' }) => {
  const set = (v) => onChange(fix(Math.min(max, Math.max(min, v)), decimals));
  const btn = 'rounded-lg font-black dark:text-white active:bg-slate-300 dark:active:bg-slate-500';
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="text-center font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase text-sm tracking-wider">{label}</div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          <button type="button" aria-label={`${label} menos ${fastStep}`} onClick={() => set(value - fastStep)} className={`w-14 h-12 bg-slate-100 dark:bg-slate-700 text-xl ${btn}`}>-{fastStep}</button>
          <button type="button" aria-label={`${label} menos ${step}`} onClick={() => set(value - step)} className={`w-14 h-16 bg-slate-200 dark:bg-slate-600 text-2xl ${btn}`}>-</button>
        </div>
        <div className="text-4xl font-black text-slate-800 dark:text-white tabular-nums text-center" aria-live="polite">
          {value.toFixed(decimals)} <span className="text-lg font-normal text-slate-500">{unit}</span>
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" aria-label={`${label} más ${fastStep}`} onClick={() => set(value + fastStep)} className={`w-14 h-12 bg-slate-100 dark:bg-slate-700 text-xl ${btn}`}>+{fastStep}</button>
          <button type="button" aria-label={`${label} más ${step}`} onClick={() => set(value + step)} className={`w-14 h-16 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-2xl ${btn}`}>+</button>
        </div>
      </div>
    </div>
  );
};

export const Section = ({ title, desc, children }) => (
  <div className="mb-6">
    <h3 className="font-black text-slate-800 dark:text-slate-100 mb-1 text-lg">{title}</h3>
    {desc && <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{desc}</p>}
    <div className="space-y-3">{children}</div>
  </div>
);

export const ResultCard = ({ title, value, subtitle, colorClass }) => (
  <div className={`p-6 rounded-2xl text-white shadow-lg mt-6 ${colorClass} animate-fade-in`} role="status">
    <div className="text-sm font-semibold opacity-90 uppercase tracking-wide border-b border-white/20 pb-2 mb-2">{title}</div>
    <div className="text-4xl sm:text-5xl font-black my-2 break-words">{value}</div>
    {subtitle && <div className="text-lg font-bold">{subtitle}</div>}
  </div>
);

const TONES = {
  blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  sky: 'bg-sky-50 dark:bg-sky-900/30 text-sky-800 dark:text-sky-200',
  orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
  yellow: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
  pink: 'bg-pink-50 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200',
  red: 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200',
  green: 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
};
export const InfoBox = ({ tone = 'blue', children }) => (
  <div className={`p-4 rounded-xl text-sm font-medium ${TONES[tone]}`}>{children}</div>
);

export const Btn = ({ children, className = '', ...p }) => (
  <button type="button" className={`w-full py-4 rounded-xl font-bold ${className}`} {...p}>{children}</button>
);

// Mensaje estándar de herramienta orientativa
export const Caveat = ({ children }) => (
  <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">{children}</p>
);
