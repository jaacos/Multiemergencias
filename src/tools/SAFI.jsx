import React, { useState } from 'react';
import { GloveInput, ResultCard, InfoBox, Caveat, Card, Chip } from '../components/ui.jsx';

const DEVICES = [['Aire', 21], ['Gafas', 30], ['Venturi', 40], ['Reservorio', 80]];

// Equivalencias S/F ↔ P/F: Rice et al., Chest 2007: S/F = 64 + 0,84 × P/F (válido con SpO₂ ≤ 97 %).
// Cortes: S/F 315 ≈ P/F 300 · 235 ≈ 200 · 148 ≈ 100 (definición global de SDRA, 2023).
const BANDS = [
  { id: 'n', range: '> 315', pf: '> 300', name: 'Sin alteración significativa', note: 'Respirando aire, un adulto sano con SpO₂ 95-100 % da SAFI 452-476.', dot: 'bg-emerald-500', color: 'bg-green-600', min: 316 },
  { id: 'l', range: '236 – 315', pf: '200 – 300', name: 'Alteración leve', note: 'Equivale al rango de SDRA leve de Berlín.', dot: 'bg-yellow-400', color: 'bg-yellow-500', min: 236 },
  { id: 'm', range: '149 – 235', pf: '100 – 200', name: 'Alteración moderada', note: 'Equivale al rango de SDRA moderado. Valorar CPAP / soporte ventilatorio.', dot: 'bg-orange-500', color: 'bg-orange-500', min: 149 },
  { id: 'g', range: '≤ 148', pf: '≤ 100', name: 'Alteración grave', note: 'Equivale al rango de SDRA grave. Soporte ventilatorio probable.', dot: 'bg-red-500', color: 'bg-red-600', min: -Infinity },
];

export default function SAFI() {
  const [spo2, setSpo2] = useState(95);
  const [fio2, setFio2] = useState(21);
  const sf = Math.round(spo2 / (fio2 / 100));
  const band = BANDS.find((b) => sf >= b.min);
  const reliable = spo2 <= 97;
  const pf = reliable ? Math.round((sf - 64) / 0.84) : null;

  return (
    <div className="space-y-6">
      <GloveInput label="SpO₂" value={spo2} min={50} max={100} step={1} onChange={setSpo2} unit="%" />
      <GloveInput label="FiO₂" value={fio2} min={21} max={100} step={1} onChange={setFio2} unit="%" />
      <div className="grid grid-cols-4 gap-2">
        {DEVICES.map(([n, v]) => (
          <button key={n} type="button" onClick={() => setFio2(v)} aria-pressed={fio2 === v} className={`px-1 py-3 rounded-2xl font-bold text-xs leading-tight border-2 ${fio2 === v ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-500/15 dark:text-blue-100 dark:border-blue-400' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200'}`}>
            {n}<br /><span className="text-base font-black">{v}%</span>
          </button>
        ))}
      </div>
      <InfoBox tone="slate">La FiO₂ con dispositivos de bajo flujo es aproximada. Gafas nasales: 24-40 % según flujo · Venturi: 24-60 % según válvula · Mascarilla con reservorio: 60-90 %.</InfoBox>

      <ResultCard title="SAFI (SpO₂ / FiO₂)" value={sf} subtitle={`${band.name}${pf !== null ? ` · PaFi estimada ≈ ${pf}` : ''}`} colorClass={band.color} />
      {!reliable && <InfoBox tone="yellow"><strong>SpO₂ &gt; 97 %:</strong> fuera del rango validado. La saturación es poco sensible a cambios de PaO₂ en la zona plana de la curva, por lo que no se calcula la PaFi estimada.</InfoBox>}

      <Card className="p-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white mb-1">Leyenda: cómo interpretar el SAFI</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Cuanto <strong>menor</strong> es el valor, peor es el intercambio de gases. Es el equivalente no invasivo de la PaFi (PaO₂/FiO₂).</p>
        <div className="space-y-2">
          {BANDS.map((b) => {
            const on = b.id === band.id;
            return (
              <div key={b.id} className={`flex gap-3 p-3 rounded-2xl border-2 ${on ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-400' : 'border-transparent bg-slate-100 dark:bg-slate-800'}`}>
                <span className={`w-3 shrink-0 rounded-full ${b.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 dark:text-white">SAFI {b.range}</span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">PaFi {b.pf}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{b.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{b.note}</div>
                </div>
                {on && <span className="self-start shrink-0"><Chip tone="info">Actual</Chip></span>}
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>Fórmula:</strong> SAFI = SpO₂ ÷ FiO₂ (FiO₂ en fracción, 21 % = 0,21).<br />
          <strong>Equivalencia (Rice 2007):</strong> SAFI ≈ 64 + 0,84 × PaFi, solo con SpO₂ ≤ 97 %.
        </div>
      </Card>

      <Caveat>
        Orientativo: no sustituye a la gasometría y no diagnostica SDRA (exige criterios clínicos, radiológicos y de PEEP). Poco fiable con SpO₂ &gt; 97 %, mala perfusión periférica,
        intoxicación por CO o metahemoglobinemia, donde el pulsioxímetro sobreestima la oxigenación.
      </Caveat>
    </div>
  );
}
