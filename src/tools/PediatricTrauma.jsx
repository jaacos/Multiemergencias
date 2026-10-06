import React, { useState } from 'react';
import { ScoreRow, ResultCard, InfoBox, Caveat, Btn } from '../components/ui.jsx';
import { SECTIONS, EMPTY, isComplete, score, interpret } from './itpLogic.js';

export default function PediatricTrauma() {
  const [a, setA] = useState(EMPTY);
  const done = isComplete(a);
  const total = score(a);
  const res = interpret(total);
  const answered = Object.values(a).filter((v) => v !== null).length;

  return (
    <div className="space-y-4">
      <InfoBox tone="pink">Índice de Trauma Pediátrico (ITP / Pediatric Trauma Score): 6 parámetros, de −6 a +12. Para triaje de niños con trauma.</InfoBox>
      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1">{answered} de 6 parámetros</div>
      {SECTIONS.map((s) => (
        <ScoreRow key={s.key} title={s.title} hint={s.hint} options={s.options.map((o) => ({ ...o, display: o.v > 0 ? `+${o.v}` : `−${Math.abs(o.v)}` }))} value={a[s.key]} onChange={(v) => setA({ ...a, [s.key]: v })} />
      ))}
      {done && <ResultCard title="Índice de Trauma Pediátrico" value={`${total > 0 ? '+' : ''}${total} / 12`} subtitle={res.text} colorClass={res.color} />}
      {answered > 0 && <Btn onClick={() => setA(EMPTY)} className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white">Reiniciar</Btn>}
      <Caveat>Escala de Tepas (1987). Umbral de derivación ≤ 8. Valora siempre mecanismo lesional y reevalúa de forma seriada: el ITP puede infraestimar lesiones en niños con buena compensación fisiológica.</Caveat>
    </div>
  );
}
