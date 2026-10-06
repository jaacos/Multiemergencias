import React, { useState } from 'react';
import { GloveInput, Segmented, ResultCard, InfoBox } from '../components/ui.jsx';

const REF = {
  arterial: { ph: [7.35, 7.45], pco2: [35, 45], hco3: [22, 26] },
  venosa: { ph: [7.31, 7.41], pco2: [41, 51], hco3: [22, 29] },
};

export default function Gasometry() {
  const [type, setType] = useState('arterial');
  const [ph, setPh] = useState(7.4);
  const [pco2, setPco2] = useState(40);
  const [hco3, setHco3] = useState(24);
  const r = REF[type];

  let value = 'Normal';
  let sub = 'Valores dentro de rango.';
  let color = 'bg-green-600';
  let extra = null;

  const pcoHigh = pco2 > r.pco2[1], pcoLow = pco2 < r.pco2[0];
  const hcoHigh = hco3 > r.hco3[1], hcoLow = hco3 < r.hco3[0];

  if (ph < r.ph[0]) {
    color = 'bg-red-600';
    if (pcoHigh && !hcoLow) { value = 'Acidosis respiratoria'; sub = hcoHigh ? 'Con compensación metabólica (HCO₃ alto).' : 'Sin compensación (aguda).'; }
    else if (hcoLow && !pcoHigh) {
      value = 'Acidosis metabólica';
      sub = pcoLow ? 'Con hiperventilación compensadora.' : 'Sin compensación respiratoria.';
      if (type === 'arterial') {
        const exp = 1.5 * hco3 + 8;
        extra = `Fórmula de Winter: pCO₂ esperada ${(exp - 2).toFixed(0)}-${(exp + 2).toFixed(0)} mmHg. ${pco2 > exp + 2 ? 'pCO₂ mayor: acidosis respiratoria añadida.' : pco2 < exp - 2 ? 'pCO₂ menor: alcalosis respiratoria añadida.' : 'Compensación adecuada.'}`;
      }
    } else { value = 'Acidosis mixta'; sub = 'pCO₂ alta y HCO₃ bajo a la vez.'; }
  } else if (ph > r.ph[1]) {
    color = 'bg-red-600';
    if (pcoLow && !hcoHigh) { value = 'Alcalosis respiratoria'; sub = hcoLow ? 'Con compensación metabólica (HCO₃ bajo).' : 'Sin compensación (aguda).'; }
    else if (hcoHigh && !pcoLow) { value = 'Alcalosis metabólica'; sub = pcoHigh ? 'Con hipoventilación compensadora.' : 'Sin compensación respiratoria.'; }
    else { value = 'Alcalosis mixta'; sub = 'pCO₂ baja y HCO₃ alto a la vez.'; }
  } else if (pcoHigh || pcoLow || hcoHigh || hcoLow) {
    color = 'bg-yellow-500';
    value = 'pH normal con alteración';
    sub = 'Trastorno compensado o mixto (efectos opuestos). Valorar clínica, anion gap y lactato.';
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Segmented value={type} onChange={setType} options={[{ value: 'arterial', label: 'Arterial' }, { value: 'venosa', label: 'Venosa' }]} />
      <div className="space-y-4">
        <GloveInput label="pH" value={ph} min={6.8} max={7.8} step={0.01} fastStep={0.1} decimals={2} onChange={setPh} />
        <GloveInput label="pCO₂" value={pco2} min={10} max={120} step={1} fastStep={10} onChange={setPco2} unit="mmHg" />
        <GloveInput label="HCO₃⁻" value={hco3} min={5} max={50} step={1} fastStep={5} onChange={setHco3} unit="mEq/L" />
      </div>
      <ResultCard title={`Interpretación (sangre ${type})`} value={value} subtitle={sub} colorClass={color} />
      {extra && <InfoBox tone="blue">{extra}</InfoBox>}
      <InfoBox tone="slate">Rangos usados — {type === 'arterial' ? 'arterial: pH 7,35-7,45, pCO₂ 35-45, HCO₃ 22-26' : 'venosa: pH 7,31-7,41, pCO₂ 41-51, HCO₃ 22-29'}. La interpretación es orientativa; integrar con la clínica.</InfoBox>
    </div>
  );
}
