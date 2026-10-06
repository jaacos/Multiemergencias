import React, { useState } from 'react';
import { GloveInput, ResultCard, InfoBox, Caveat } from '../components/ui.jsx';

const DEVICES = [['Aire', 21], ['Gafas', 30], ['Venturi', 40], ['Reservorio', 80]];

// SpO2/FiO2 (S/F) frente a PaO2/FiO2 (Rice, Chest 2007): S/F 315 ~ P/F 300; S/F 235 ~ P/F 200.
const classify = (sf) => {
  if (sf > 315) return ['Sin alteración significativa del intercambio', 'bg-green-600'];
  if (sf > 235) return ['Compatible con P/F 200-300 (rango de SDRA leve)', 'bg-yellow-500'];
  if (sf > 150) return ['Compatible con P/F 100-200 (rango de SDRA moderado)', 'bg-orange-500'];
  return ['Compatible con P/F < 100 (rango de SDRA grave). Valorar soporte ventilatorio', 'bg-red-600'];
};

export default function SAFI() {
  const [spo2, setSpo2] = useState(95);
  const [fio2, setFio2] = useState(21);
  const sf = Math.round(spo2 / (fio2 / 100));
  const [sub, color] = classify(sf);

  return (
    <div className="space-y-6">
      <GloveInput label="SpO₂" value={spo2} min={50} max={100} step={1} onChange={setSpo2} unit="%" />
      <GloveInput label="FiO₂" value={fio2} min={21} max={100} step={1} onChange={setFio2} unit="%" />
      <div className="grid grid-cols-4 gap-2">
        {DEVICES.map(([n, v]) => (
          <button key={n} type="button" onClick={() => setFio2(v)} className="px-2 py-3 bg-slate-200 dark:bg-slate-700 dark:text-white rounded-lg font-bold text-xs">{n}<br />{v} %</button>
        ))}
      </div>
      <InfoBox tone="slate">FiO₂ con dispositivos de bajo flujo es aproximada. Gafas nasales: 24-40 % según flujo; Venturi: 24-60 % según válvula; mascarilla con reservorio: 60-90 %.</InfoBox>
      <ResultCard title="SAFI (SpO₂/FiO₂)" value={sf} subtitle={sub} colorClass={color} />
      <Caveat>
        Orientativo: no sustituye a la gasometría y no diagnostica SDRA (requiere criterios clínicos y radiológicos). Poco fiable con SpO₂ &gt; 97 % (curva de disociación plana),
        con mala perfusión o intoxicación por CO.
      </Caveat>
    </div>
  );
}
