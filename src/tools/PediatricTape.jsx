import React, { useState } from 'react';
import { GloveInput, Segmented, InfoBox, Caveat } from '../components/ui.jsx';

// Estimación de peso APLS (revisión 2011): lactante, 1-5 años, 6-12 años.
function estimateWeight(unit, v) {
  if (unit === 'months') return 0.5 * v + 4;
  if (v <= 5) return 2 * v + 8;
  return 3 * v + 7;
}

const Card = ({ label, children, sub, accent = 'text-slate-800 dark:text-white' }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow border border-slate-200 dark:border-slate-700 text-center">
    <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">{label}</div>
    <div className={`text-3xl font-black ${accent}`}>{children}</div>
    {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
  </div>
);

export default function PediatricTape() {
  const [unit, setUnit] = useState('years');
  const [years, setYears] = useState(5);
  const [months, setMonths] = useState(6);

  const age = unit === 'years' ? years : months / 12;
  const weight = Math.round(estimateWeight(unit, unit === 'years' ? years : months) * 10) / 10;
  const tubeCuffed = age < 1 ? 3.0 : age / 4 + 3.5;
  const tubeUncuffed = age < 1 ? 3.5 : age / 4 + 4;
  const joules = Math.round(weight * 4);
  const adrenaline = weight * 0.01;
  const fluids = Math.round(weight * 10);

  return (
    <div className="space-y-6">
      <InfoBox tone="pink">Estimación rápida del peso (fórmulas APLS). Si hay cinta Broselow, peso conocido o dato fiable de los padres, <strong>prevalece ese dato</strong>.</InfoBox>

      <Segmented value={unit} onChange={setUnit} options={[{ value: 'months', label: 'Lactante (< 1 año)' }, { value: 'years', label: 'Niño (≥ 1 año)' }]} />

      {unit === 'years'
        ? <GloveInput label="Edad" value={years} min={1} max={14} step={1} fastStep={5} onChange={setYears} unit="años" />
        : <GloveInput label="Edad" value={months} min={1} max={11} step={1} fastStep={3} onChange={setMonths} unit="meses" />}

      <div className="grid grid-cols-2 gap-4">
        <Card label="Peso estimado" sub={unit === 'months' ? '0,5 × meses + 4' : years <= 5 ? '2 × años + 8' : '3 × años + 7'}>{weight} <span className="text-lg">kg</span></Card>
        <Card label="Desfibrilación" accent="text-red-600" sub="4 J/kg (máx. adulto)">{joules} <span className="text-lg">J</span></Card>
        <Card label="Tubo con balón" sub="Edad/4 + 3,5 (lactante 3,0)">{tubeCuffed.toFixed(1)} <span className="text-lg">mm</span></Card>
        <Card label="Tubo sin balón" sub="Edad/4 + 4 (lactante 3,5)">{tubeUncuffed.toFixed(1)} <span className="text-lg">mm</span></Card>
        <Card label="Adrenalina PCR" sub="10 µg/kg = 0,1 ml/kg de 1:10.000">{adrenaline.toFixed(2)} <span className="text-lg">mg</span></Card>
        <Card label="Bolo de cristaloide" sub="10 ml/kg, reevaluar (20 ml/kg si shock)">{fluids} <span className="text-lg">ml</span></Card>
      </div>
      <Caveat>
        Dosis de PCR según ERC/PLS: adrenalina 10 µg/kg cada 3-5 min (dosis máxima por bolo: 1 mg); la descarga inicial es 4 J/kg. Las fórmulas pueden fallar en
        obesidad o desnutrición. Comprueba siempre las dosis antes de administrar.
      </Caveat>
    </div>
  );
}
