import React, { useState } from 'react';
import { ScoreRow, ResultCard, InfoBox } from '../components/ui.jsx';

const ITEMS = [
  ['a', 'Apariencia (color)', ['Azul / pálido', 'Cuerpo rosado, extremidades azules', 'Totalmente rosado']],
  ['p', 'Pulso (frecuencia cardíaca)', ['Ausente', '< 100 lpm', '≥ 100 lpm']],
  ['g', 'Gesto (respuesta refleja)', ['Sin respuesta', 'Mueca', 'Llanto, tos o estornudo']],
  ['ac', 'Actividad (tono)', ['Flácido', 'Cierta flexión', 'Movimiento activo']],
  ['r', 'Respiración', ['Ausente', 'Lenta / irregular', 'Llanto vigoroso']],
];

export default function Apgar() {
  const [s, setS] = useState({ a: null, p: null, g: null, ac: null, r: null });
  const complete = Object.values(s).every((v) => v !== null);
  const total = Object.values(s).reduce((a, b) => a + (b || 0), 0);

  return (
    <div className="space-y-2">
      <InfoBox tone="slate">Puntuar al minuto 1 y 5. No esperar al Apgar para reanimar: si no respira o FC &lt; 100, actuar (secar, calentar, estimular, ventilar).</InfoBox>
      <div className="pt-3" />
      {ITEMS.map(([k, title, labels]) => (
        <ScoreRow key={k} title={title} value={s[k]} onChange={(v) => setS({ ...s, [k]: v })} options={labels.map((label, v) => ({ v, label }))} />
      ))}
      {complete && (
        <ResultCard
          title="Puntuación Apgar"
          value={total}
          subtitle={total >= 7 ? 'Adaptación normal (7-10)' : total >= 4 ? 'Depresión moderada (4-6): estimular, valorar ventilación' : 'Depresión grave (0-3): reanimación neonatal'}
          colorClass={total >= 7 ? 'bg-green-600' : total >= 4 ? 'bg-yellow-500' : 'bg-red-600'}
        />
      )}
    </div>
  );
}
