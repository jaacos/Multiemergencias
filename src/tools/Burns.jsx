import React, { useState } from 'react';
import { GloveInput, Section, Segmented, InfoBox, Caveat } from '../components/ui.jsx';

const PARTS = [
  ['head', 'Cabeza', 9], ['armL', 'Brazo I.', 9], ['armR', 'Brazo D.', 9], ['torsoF', 'Torso ant.', 18],
  ['torsoB', 'Torso post.', 18], ['legL', 'Pierna I.', 18], ['legR', 'Pierna D.', 18], ['gen', 'Genitales', 1],
];

const FORMULAS = {
  atls: { label: 'ATLS/ABA 2 ml', ml: 2 },
  parkland: { label: 'Parkland 4 ml', ml: 4 },
};

export default function Burns() {
  const [weight, setWeight] = useState(70);
  const [sel, setSel] = useState({});
  const [formula, setFormula] = useState('atls');

  const tbsa = PARTS.reduce((a, [k, , p]) => a + (sel[k] ? p : 0), 0);
  const ml = FORMULAS[formula].ml;
  const total = ml * weight * tbsa;
  const first8 = total / 2;

  return (
    <div className="space-y-6">
      <InfoBox tone="red">
        Regla de los 9 solo para <strong>adultos</strong>. En niños (cabeza proporcionalmente mayor) usa Lund-Browder. Cuenta solo quemaduras de 2.º y 3.º grado.
        Reanimación con fluidos habitualmente si SCQ ≥ 20 % (adulto).
      </InfoBox>

      <GloveInput label="Peso estimado" value={weight} min={20} max={200} step={5} onChange={setWeight} unit="kg" />

      <Section title="Fórmula de reanimación">
        <Segmented value={formula} onChange={setFormula} options={Object.entries(FORMULAS).map(([value, f]) => ({ value, label: f.label }))} />
      </Section>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
        <div className="font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase text-sm tracking-wider">Superficie corporal quemada</div>
        <div className="text-4xl font-black text-slate-800 dark:text-white tabular-nums">{tbsa} <span className="text-lg font-normal text-slate-500">%</span></div>
      </div>

      <Section title="Regla de los 9 (adultos)">
        <div className="grid grid-cols-2 gap-2">
          {PARTS.map(([k, label, p]) => (
            <button
              key={k}
              type="button"
              aria-pressed={!!sel[k]}
              onClick={() => setSel((s) => ({ ...s, [k]: !s[k] }))}
              className={`p-3 min-h-[56px] rounded-lg text-sm font-bold border ${sel[k] ? 'bg-orange-500 text-white border-orange-600' : 'bg-slate-200 dark:bg-slate-700 border-transparent dark:text-white'}`}
            >
              {label} ({p} %)
            </button>
          ))}
          <button type="button" onClick={() => setSel({})} className="col-span-2 p-3 border border-red-300 text-red-500 rounded-lg text-sm font-bold active:bg-red-50 dark:active:bg-red-900/30">Reset SCQ</button>
        </div>
      </Section>

      {tbsa > 0 && (
        <div className="p-6 rounded-2xl text-white shadow-lg bg-orange-600 text-center animate-fade-in" role="status">
          <span className="block text-sm font-semibold opacity-90 uppercase">Ringer lactato en 24 h</span>
          <span className="block text-5xl font-black my-2">{total} <span className="text-2xl">ml</span></span>
          <div className="mt-4 p-3 bg-white/20 rounded-xl space-y-1">
            <span className="block text-lg font-bold">{first8} ml en las primeras 8 h (≈ {Math.round(first8 / 8)} ml/h)</span>
            <span className="block text-sm">Contadas desde el momento de la quemadura, no desde la llegada.</span>
            <span className="block text-sm">Resto ({total - first8} ml) en las 16 h siguientes.</span>
          </div>
        </div>
      )}
      <Caveat>
        Es una estimación inicial: ajustar a diuresis (adulto 0,5 ml/kg/h; 30-50 ml/h). ATLS 10.ª ed. y ABA proponen 2 ml/kg/%SCQ (3 ml en niños, 4 ml en quemadura eléctrica);
        la fórmula clásica de Parkland usa 4 ml y tiende a sobrerreanimar. Elige según el protocolo de tu servicio.
      </Caveat>
    </div>
  );
}
