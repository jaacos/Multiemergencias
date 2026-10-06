import React, { useState } from 'react';
import { usePersisted } from '../hooks/usePersisted.js';

const ROWS = [
  ['activacion', '1. Activación', 'bg-blue-600'],
  ['llegada', '2. Llegada a escena', 'bg-purple-600'],
  ['contacto', '3. Contacto con paciente', 'bg-orange-500'],
  ['salida', '4. Salida de escena', 'bg-amber-600'],
  ['hospital', '5. Llegada al hospital', 'bg-green-600'],
];
const EMPTY = { activacion: null, llegada: null, contacto: null, salida: null, hospital: null };

const clock = (t) => (t ? new Date(t).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--');
const diff = (a, b) => {
  if (!a || !b) return '-';
  const s = Math.max(0, Math.round((b - a) / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export default function TimeLogger() {
  const [t, setT] = usePersisted('time-logger', EMPTY);
  const [confirm, setConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const summary = [
    ...ROWS.map(([k, label]) => `${label.slice(3)}: ${clock(t[k])}`),
    `Respuesta: ${diff(t.activacion, t.llegada)} min`,
    `En escena: ${diff(t.llegada, t.salida)} min`,
    `Traslado: ${diff(t.salida, t.hospital)} min`,
  ].join('\n');

  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* sin permiso */ }
  };

  return (
    <div className="space-y-3">
      <div className="bg-slate-200 dark:bg-slate-800 p-2 rounded-lg text-center font-bold text-slate-600 dark:text-slate-400 uppercase text-xs tracking-widest">Cronología de la intervención (se guarda en el dispositivo)</div>
      {ROWS.map(([k, label, color]) => (
        <div key={k} className="flex items-center justify-between gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">{label}</div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono tabular-nums">{clock(t[k])}</div>
            <button type="button" onClick={() => setT({ ...t, [k]: Date.now() })} className={`px-4 py-3 rounded-lg font-bold text-white shadow-sm active:scale-95 ${color}`}>{t[k] ? 'Reiniciar' : 'Fijar'}</button>
          </div>
        </div>
      ))}

      <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700">
        <h4 className="font-black text-slate-700 dark:text-slate-300 mb-3 border-b border-slate-300 dark:border-slate-700 pb-2">Tiempos calculados (min:s)</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[['Respuesta', t.activacion, t.llegada], ['En escena', t.llegada, t.salida], ['Traslado', t.salida, t.hospital]].map(([l, a, b]) => (
            <div key={l}><div className="text-xs font-bold text-slate-500 uppercase">{l}</div><div className="text-xl font-black text-slate-800 dark:text-white tabular-nums">{diff(a, b)}</div></div>
          ))}
        </div>
      </div>

      <button type="button" onClick={copy} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">{copied ? '✓ Copiado' : 'Copiar resumen'}</button>
      {!confirm
        ? <button type="button" onClick={() => setConfirm(true)} className="w-full py-4 bg-slate-200 dark:bg-slate-800 rounded-xl font-bold text-red-500">Resetear tiempos</button>
        : (
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { setT(EMPTY); setConfirm(false); }} className="py-4 bg-red-600 text-white rounded-xl font-bold">Confirmar borrado</button>
            <button type="button" onClick={() => setConfirm(false)} className="py-4 bg-slate-200 dark:bg-slate-700 dark:text-white rounded-xl font-bold">Cancelar</button>
          </div>
        )}
    </div>
  );
}
