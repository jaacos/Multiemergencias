import React, { useState } from 'react';
import { Section, OptionBtn, InfoBox } from '../components/ui.jsx';
import { usePersisted } from '../hooks/usePersisted.js';

const R = (color, text) => ({ result: { color, text } });
const TREE = {
  walk: { q: '1. ¿Puede caminar?', opts: [['SÍ, camina', R('VERDE', 'Demorado. Lesiones leves.')], ['NO camina', { next: 'breath' }]] },
  breath: { q: '2. ¿Respira espontáneamente?', opts: [['SÍ respira', { next: 'rr' }], ['NO respira', { next: 'airway' }]] },
  airway: { q: '3. Apertura de la vía aérea: ¿respira ahora?', opts: [['SÍ', R('ROJO', 'Inmediato. Respira tras abrir la vía aérea.')], ['NO', R('NEGRO', 'Fallecido / expectante. No respira tras apertura de la vía aérea.')]] },
  rr: { q: '4. Frecuencia respiratoria', opts: [['> 30 rpm', R('ROJO', 'Inmediato. Alteración respiratoria (> 30 rpm).')], ['≤ 30 rpm', { next: 'perf' }]] },
  perf: { q: '5. Perfusión', opts: [['Relleno capilar > 2 s o sin pulso radial', R('ROJO', 'Inmediato. Alteración hemodinámica.')], ['Relleno ≤ 2 s o pulso radial presente', { next: 'mental' }]] },
  mental: { q: '6. Estado mental', opts: [['No obedece órdenes simples', R('ROJO', 'Inmediato. Alteración neurológica.')], ['Obedece órdenes simples', R('AMARILLO', 'Urgente. Sin riesgo vital inmediato.')]] },
};
const BG = { VERDE: 'bg-green-600', AMARILLO: 'bg-yellow-500', ROJO: 'bg-red-600', NEGRO: 'bg-slate-900 border border-slate-500' };
const ZERO = { VERDE: 0, AMARILLO: 0, ROJO: 0, NEGRO: 0 };

export default function TriageSTART() {
  const [node, setNode] = useState('walk');
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [counts, setCounts] = usePersisted('triage-counts', ZERO);

  const choose = (o) => {
    setHistory([...history, node]);
    if (o.result) setResult(o.result); else setNode(o.next);
  };
  const back = () => {
    if (result) setResult(null);
    else { setNode(history[history.length - 1]); setHistory(history.slice(0, -1)); }
  };
  const next = (register) => {
    if (register) setCounts((c) => ({ ...c, [result.color]: (c[result.color] || 0) + 1 }));
    setResult(null); setNode('walk'); setHistory([]);
  };
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <InfoBox tone="slate">Triaje START para adultos con múltiples víctimas. En niños usar JumpSTART u otro método pediátrico.</InfoBox>

      {!result && (
        <div className="animate-fade-in space-y-3">
          <Section title={TREE[node].q}>
            {TREE[node].opts.map(([label, o]) => <OptionBtn key={label} label={label} value={label} selectedValue="" onClick={() => choose(o)} />)}
          </Section>
          {history.length > 0 && <button type="button" onClick={back} className="w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-800 dark:text-white font-bold">← Paso anterior</button>}
        </div>
      )}

      {result && (
        <div className="space-y-5 animate-fade-in text-center mt-4">
          <div className={`p-8 rounded-3xl font-black text-5xl text-white shadow-xl ${BG[result.color]}`} role="status">{result.color}</div>
          <p className="font-bold text-slate-600 dark:text-slate-300 text-lg">{result.text}</p>
          <button type="button" onClick={() => next(true)} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">Registrar y siguiente paciente</button>
          <button type="button" onClick={() => next(false)} className="w-full py-3 bg-slate-200 dark:bg-slate-800 dark:text-white rounded-xl font-bold">Siguiente sin registrar</button>
          <button type="button" onClick={back} className="w-full py-3 text-slate-500 font-bold">← Corregir última respuesta</button>
        </div>
      )}

      <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-black text-slate-700 dark:text-slate-300">Recuento ({total})</h4>
          <button type="button" onClick={() => setCounts(ZERO)} className="text-sm font-bold text-red-500 px-2 py-1">Poner a 0</button>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-white font-black">
          {Object.keys(ZERO).map((c) => (
            <div key={c} className={`rounded-xl py-3 ${BG[c]}`}><div className="text-3xl">{counts[c] || 0}</div><div className="text-[10px] tracking-wide">{c}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
