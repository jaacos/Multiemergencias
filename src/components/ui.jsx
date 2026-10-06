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
export const IconHeart = () => <Svg size="w-7 h-7"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" /><path d="M3.5 12h4l2-3 3 6 2-3h6" /></Svg>;
export const IconUsers = () => <Svg size="w-7 h-7"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></Svg>;
export const IconBrainSm = () => <Svg size="w-7 h-7"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /></Svg>;
export const IconChevronRight = () => <Svg size="w-5 h-5"><polyline points="9 18 15 12 9 6" /></Svg>;
export const IconOps = () => <Svg size="w-8 h-8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Svg>;

// Botón grande de selección (apto para guantes)
export const OptionBtn = ({ label, value, selectedValue, onClick }) => {
  const on = value === selectedValue;
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onClick(value)}
      className={`w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-2xl border-2 min-h-[60px] font-semibold leading-snug ${
        on
          ? 'border-blue-500 bg-blue-50 text-blue-950 shadow-sm shadow-blue-500/10 dark:bg-blue-500/15 dark:text-blue-50 dark:border-blue-400'
          : 'border-slate-200 bg-white text-slate-700 shadow-sm active:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:shadow-none dark:active:bg-slate-700/70'
      }`}
    >
      <span className={`shrink-0 w-6 h-6 rounded-full border-2 grid place-items-center ${on ? 'border-blue-500 dark:border-blue-400' : 'border-slate-300 dark:border-slate-600'}`}>
        {on && <span className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400" />}
      </span>
      <span className="flex-1">{label}</span>
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
  <div role="tablist" className="flex gap-1 p-1 bg-slate-200/70 dark:bg-slate-800/90 rounded-2xl ring-1 ring-inset ring-slate-300/50 dark:ring-slate-700/60">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        role="tab"
        aria-selected={value === o.value}
        onClick={() => onChange(o.value)}
        className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm leading-tight ${
          value === o.value
            ? 'bg-white text-slate-900 shadow-md shadow-slate-900/10 dark:bg-slate-600 dark:text-white dark:shadow-black/30'
            : 'text-slate-500 dark:text-slate-400'
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
    <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{title}</div>
    {hint && <div className="text-xs text-slate-500 dark:text-slate-400">{hint}</div>}
    <div className={`grid gap-2 mt-2 ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          aria-pressed={value === o.v}
          onClick={() => onChange(o.v)}
          className={`p-3 rounded-2xl text-xs font-semibold border-2 min-h-[92px] leading-snug break-words hyphens-auto ${
            value === o.v
              ? 'border-blue-500 bg-blue-50 text-blue-950 shadow-sm dark:bg-blue-500/15 dark:text-blue-50 dark:border-blue-400'
              : 'border-slate-200 bg-white text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:shadow-none'
          }`}
        >
          <span className="block text-3xl font-black mb-0.5 tabular-nums">{o.display ?? o.v}</span>
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
  const base = 'rounded-xl font-black select-none flex items-center justify-center';
  const fast = `${base} h-12 w-16 text-base bg-slate-100 text-slate-600 active:bg-slate-200 dark:bg-slate-700/70 dark:text-slate-200 dark:active:bg-slate-600`;
  return (
    <div className="bg-white dark:bg-slate-800/70 p-4 rounded-3xl border border-slate-200 dark:border-slate-700/70 shadow-sm dark:shadow-none">
      <div className="text-center font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase text-[11px] tracking-[0.14em]">{label}</div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          <button type="button" aria-label={`${label} menos ${fastStep}`} onClick={() => set(value - fastStep)} className={fast}>−{fastStep}</button>
          <button type="button" aria-label={`${label} menos ${step}`} onClick={() => set(value - step)} className={`${base} h-16 w-16 text-3xl bg-slate-200 text-slate-700 active:bg-slate-300 dark:bg-slate-600 dark:text-white dark:active:bg-slate-500`}>−</button>
        </div>
        <div className="min-w-0 text-center" aria-live="polite">
          <div className="text-5xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight leading-none">{value.toFixed(decimals)}</div>
          {unit && <div className="mt-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">{unit}</div>}
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" aria-label={`${label} más ${fastStep}`} onClick={() => set(value + fastStep)} className={fast}>+{fastStep}</button>
          <button type="button" aria-label={`${label} más ${step}`} onClick={() => set(value + step)} className={`${base} h-16 w-16 text-3xl bg-blue-600 text-white shadow-md shadow-blue-600/30 active:bg-blue-700`}>+</button>
        </div>
      </div>
    </div>
  );
};

export const Section = ({ title, desc, children }) => (
  <div className="mb-6">
    <h3 className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-slate-50 mb-1 text-lg leading-tight">
      <span className="w-1 h-5 rounded-full bg-blue-500 shrink-0" />{title}
    </h3>
    {desc && <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 pl-3">{desc}</p>}
    <div className="space-y-3 mt-3">{children}</div>
  </div>
);

// Resultado con gravedad por color. Se mantienen las clases bg-* de uso por las herramientas.
const RESULT_TONES = {
  'bg-red-600': ['from-red-600 to-rose-700', 'text-white', '⚠', 'shadow-red-600/30'],
  'bg-green-600': ['from-emerald-600 to-green-700', 'text-white', '✓', 'shadow-emerald-600/30'],
  'bg-orange-500': ['from-orange-500 to-amber-600', 'text-white', '!', 'shadow-orange-500/30'],
  'bg-orange-600': ['from-orange-500 to-orange-700', 'text-white', '!', 'shadow-orange-600/30'],
  'bg-yellow-500': ['from-yellow-300 to-amber-400', 'text-slate-900', '!', 'shadow-amber-400/30'],
  'bg-sky-600': ['from-sky-500 to-blue-700', 'text-white', 'i', 'shadow-sky-600/30'],
  'bg-slate-500': ['from-slate-500 to-slate-700', 'text-white', '·', 'shadow-slate-600/30'],
};
export const ResultCard = ({ title, value, subtitle, colorClass }) => {
  const [grad, text, glyph, shadow] = RESULT_TONES[colorClass] || [colorClass, 'text-white', '·', ''];
  return (
    <div className={`p-5 rounded-3xl bg-gradient-to-br ${grad} ${text} shadow-xl ${shadow} mt-6 animate-pop`} role="status">
      <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] opacity-80 pb-2 mb-2 border-b border-current/20">
        <span className="w-5 h-5 rounded-full border-2 border-current grid place-items-center text-[11px] leading-none">{glyph}</span>
        {title}
      </div>
      <div className="text-4xl sm:text-5xl font-black my-2 break-words leading-[1.05] tracking-tight">{value}</div>
      {subtitle && <div className="text-base font-semibold leading-snug opacity-95">{subtitle}</div>}
    </div>
  );
};

const TONES = {
  blue: 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-500/10 dark:text-blue-100',
  sky: 'bg-sky-50 border-sky-500 text-sky-900 dark:bg-sky-500/10 dark:text-sky-100',
  orange: 'bg-orange-50 border-orange-500 text-orange-900 dark:bg-orange-500/10 dark:text-orange-100',
  yellow: 'bg-amber-50 border-amber-500 text-amber-900 dark:bg-amber-500/10 dark:text-amber-100',
  pink: 'bg-pink-50 border-pink-500 text-pink-900 dark:bg-pink-500/10 dark:text-pink-100',
  red: 'bg-red-50 border-red-500 text-red-900 dark:bg-red-500/10 dark:text-red-100',
  green: 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100',
  slate: 'bg-slate-100 border-slate-400 text-slate-700 dark:bg-slate-800/70 dark:border-slate-500 dark:text-slate-300',
};
export const InfoBox = ({ tone = 'blue', children }) => (
  <div className={`px-4 py-3 rounded-2xl border-l-4 text-sm font-medium leading-relaxed ${TONES[tone]}`}>{children}</div>
);

export const Btn = ({ children, className = '', ...p }) => (
  <button type="button" className={`w-full py-4 rounded-2xl font-bold ${className}`} {...p}>{children}</button>
);

// Mensaje estándar de herramienta orientativa
export const Caveat = ({ children }) => (
  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 mt-4 px-1">{children}</p>
);

// Tarjeta genérica
export const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800/70 rounded-3xl border border-slate-200 dark:border-slate-700/70 shadow-sm dark:shadow-none ${className}`}>{children}</div>
);

// Etiqueta de estado (↓ / normal / ↑)
const CHIP = {
  ok: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  warn: 'bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300',
  bad: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
  info: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
};
export const Chip = ({ tone = 'info', children }) => (
  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide ${CHIP[tone]}`}>{children}</span>
);
