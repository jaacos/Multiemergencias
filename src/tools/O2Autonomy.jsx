import React, { useState } from 'react';
import { GloveInput, Section, ResultCard, InfoBox } from '../components/ui.jsx';

const RESERVE = 20; // bar de reserva de seguridad

export default function O2Autonomy() {
  const [pressure, setPressure] = useState(200);
  const [volume, setVolume] = useState(10);
  const [flow, setFlow] = useState(15);

  const minutes = Math.max(0, Math.floor(((pressure - RESERVE) * volume) / flow));
  const h = Math.floor(minutes / 60);

  return (
    <div className="space-y-6">
      <InfoBox tone="sky">Autonomía = (presión − {RESERVE} bar de reserva) × litros de agua de la botella ÷ flujo. Un litro de gas a 1 bar ≈ 1 L de O₂.</InfoBox>
      <GloveInput label="Presión actual" value={pressure} min={0} max={300} step={10} fastStep={50} onChange={setPressure} unit="bar" />
      <Section title="Capacidad de la botella (litros de agua)">
        <div className="grid grid-cols-4 gap-2">
          {[2, 3, 5, 10].map((v) => (
            <button key={v} type="button" aria-pressed={volume === v} onClick={() => setVolume(v)} className={`p-4 rounded-xl font-bold ${volume === v ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 dark:text-white'}`}>{v} L</button>
          ))}
        </div>
      </Section>
      <GloveInput label="Flujo administrado" value={flow} min={1} max={30} step={1} fastStep={5} onChange={setFlow} unit="L/min" />
      <ResultCard
        title="Autonomía estimada"
        value={h > 0 ? `${h} h ${minutes % 60} min` : `${minutes} min`}
        subtitle={`Se mantienen ${RESERVE} bar de reserva. Tiempo orientativo: restar el margen del traslado.`}
        colorClass={minutes < 15 ? 'bg-red-600' : minutes < 30 ? 'bg-orange-500' : 'bg-green-600'}
      />
    </div>
  );
}
