import React, { useState } from 'react';
import { GloveInput, ResultCard, InfoBox, Caveat } from '../components/ui.jsx';

// SIPA: umbrales por edad (Acker et al., 2015), validado de 1 a 16 años.
const sipaThreshold = (age) => (age <= 6 ? 1.2 : age <= 12 ? 1.0 : 0.9);

export default function ShockIndex() {
  const [age, setAge] = useState(30);
  const [hr, setHr] = useState(100);
  const [sbp, setSbp] = useState(120);

  const pediatric = age < 16;
  const valid = sbp > 0;
  const si = valid ? hr / sbp : null;

  let interpretation = 'Introduce una TAS mayor que 0.';
  let color = 'bg-slate-500';
  if (valid) {
    if (pediatric) {
      const th = sipaThreshold(age);
      if (si > th) { interpretation = `SIPA elevado (límite ${th}). Riesgo de shock / trauma grave.`; color = 'bg-red-600'; }
      else { interpretation = `SIPA normal (límite ${th}).`; color = 'bg-green-600'; }
    } else if (si >= 1.0) { interpretation = 'Shock probable. Valorar hemorragia y transfusión.'; color = 'bg-red-600'; }
    else if (si >= 0.8) { interpretation = 'Sospecha de shock. Monitorización estrecha.'; color = 'bg-orange-500'; }
    else { interpretation = 'Normal (< 0,8).'; color = 'bg-green-600'; }
  }

  return (
    <div className="space-y-6">
      <InfoBox tone="blue">Índice de shock = FC / TAS. En menores de 16 años se usa el SIPA con umbral según edad.</InfoBox>
      <GloveInput label="Edad (años)" value={age} min={1} max={100} step={1} onChange={setAge} unit="años" />
      <GloveInput label="Frecuencia cardíaca" value={hr} min={0} max={300} step={5} onChange={setHr} unit="lpm" />
      <GloveInput label="Presión sistólica" value={sbp} min={0} max={300} step={5} onChange={setSbp} unit="mmHg" />
      <ResultCard title={pediatric ? 'SIPA (pediátrico)' : 'Índice de shock'} value={valid ? si.toFixed(2) : '—'} subtitle={interpretation} colorClass={color} />
      <Caveat>Orientativo. Un valor normal no excluye shock (betabloqueantes, marcapasos, fases iniciales). El SIPA no está validado en menores de 1 año.</Caveat>
    </div>
  );
}
