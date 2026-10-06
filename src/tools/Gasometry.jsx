import React, { useState } from 'react';
import { GloveInput, Segmented, ResultCard, InfoBox, Caveat, Card, Chip } from '../components/ui.jsx';

import { REF, where, f1, interpret } from './gasLogic.js';

const Toggle = ({ on, onClick, children }) => (
  <button type="button" aria-pressed={on} onClick={onClick} className={`px-4 py-3 rounded-2xl font-bold text-sm border-2 ${on ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-500/15 dark:text-blue-100 dark:border-blue-400' : 'border-dashed border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300'}`}>
    {on ? '✓ ' : '+ '}{children}
  </button>
);

const Row = ({ label, value, unit, refText, tone, chip }) => (
  <div className="flex items-center gap-3 py-2.5 border-b last:border-b-0 border-slate-100 dark:border-slate-700/60">
    <div className="flex-1 min-w-0">
      <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">{label}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{refText}</div>
    </div>
    <div className="text-right">
      <div className="font-black text-lg tabular-nums text-slate-900 dark:text-white">{value}<span className="text-xs font-semibold text-slate-500 ml-1">{unit}</span></div>
    </div>
    <div className="w-[88px] text-right"><Chip tone={tone}>{chip}</Chip></div>
  </div>
);

const lvl = (s, lowLabel = '↓ Bajo', highLabel = '↑ Alto') => (s === 'ok' ? ['ok', 'Normal'] : s === 'low' ? ['warn', lowLabel] : ['warn', highLabel]);

export default function Gasometry() {
  const [type, setType] = useState('arterial');
  const [ph, setPh] = useState(7.4);
  const [pco2, setPco2] = useState(40);
  const [hco3, setHco3] = useState(24);
  const [use, setUse] = useState({ ox: false, lac: false, ion: false, alb: false });
  const [po2, setPo2] = useState(90);
  const [sat, setSat] = useState(97);
  const [fio2, setFio2] = useState(21);
  const [lac, setLac] = useState(1.0);
  const [na, setNa] = useState(140);
  const [cl, setCl] = useState(104);
  const [alb, setAlb] = useState(4.0);

  const arterial = type === 'arterial';
  const flip = (k) => setUse((u) => ({ ...u, [k]: !u[k] }));
  const r = REF[type];
  const res = interpret(type, ph, pco2, hco3);

  // Anion gap y delta ratio
  const ag = na - cl - hco3;
  const agc = use.alb ? ag + 2.5 * (4 - alb) : ag;
  const agHigh = agc > 12;
  let delta = null;
  if (use.ion && agHigh && hco3 < 24) delta = (agc - 12) / (24 - hco3);

  const rows = [];
  const [pt, pl] = lvl(where(ph, r.ph), 'Acidosis', 'Alcalosis');
  rows.push(<Row key="ph" label="pH" value={ph.toFixed(2)} refText={`${r.ph[0]} – ${r.ph[1]}`} tone={pt} chip={pl} />);
  const [ct, cl2] = lvl(where(pco2, r.pco2));
  rows.push(<Row key="co2" label={arterial ? 'PaCO₂' : 'pCO₂ venosa'} value={pco2} unit="mmHg" refText={`${r.pco2[0]} – ${r.pco2[1]} mmHg`} tone={ct} chip={cl2} />);
  const [ht, hl] = lvl(where(hco3, r.hco3));
  rows.push(<Row key="hco3" label="HCO₃⁻" value={hco3} unit="mEq/L" refText={`${r.hco3[0]} – ${r.hco3[1]} mEq/L`} tone={ht} chip={hl} />);

  if (arterial && use.ox) {
    const [pot, pol] = po2 < 60 ? ['bad', '↓↓ Grave'] : po2 < 80 ? ['warn', '↓ Bajo'] : po2 > 100 && fio2 === 21 ? ['warn', '↑ Alto'] : ['ok', 'Normal'];
    rows.push(<Row key="po2" label="PaO₂" value={po2} unit="mmHg" refText="80 – 100 mmHg (aire ambiente; baja con la edad)" tone={pot} chip={pol} />);
    const [st, sl] = sat < 90 ? ['bad', '↓↓ Grave'] : sat < 95 ? ['warn', '↓ Bajo'] : ['ok', 'Normal'];
    rows.push(<Row key="sat" label="SpO₂" value={sat} unit="%" refText="≥ 95 %" tone={st} chip={sl} />);
    const pf = Math.round(po2 / (fio2 / 100));
    const [pft, pfl] = pf > 300 ? ['ok', 'Normal'] : pf > 200 ? ['warn', '200-300'] : pf > 100 ? ['bad', '100-200'] : ['bad', '≤ 100'];
    rows.push(<Row key="pf" label={`PaO₂/FiO₂ (FiO₂ ${fio2} %)`} value={pf} refText="> 300 (normal ≈ 400-500)" tone={pft} chip={pfl} />);
  }
  if (use.lac) {
    const [lt, ll] = lac <= 2 ? ['ok', 'Normal'] : lac < 4 ? ['warn', 'Elevado'] : ['bad', '≥ 4 Grave'];
    rows.push(<Row key="lac" label="Lactato" value={lac.toFixed(1)} unit="mmol/L" refText="≤ 2,0 mmol/L" tone={lt} chip={ll} />);
  }
  if (use.ion) {
    rows.push(<Row key="ag" label={use.alb ? 'Anion gap corregido' : 'Anion gap'} value={f1(agc)} unit="mEq/L" refText="8 – 12 mEq/L (Na − Cl − HCO₃⁻)" tone={agHigh ? 'bad' : agc < 8 ? 'warn' : 'ok'} chip={agHigh ? '↑ Alto' : agc < 8 ? '↓ Bajo' : 'Normal'} />);
    if (delta !== null) {
      const [dt, dl] = delta < 1 ? ['warn', '< 1'] : delta <= 2 ? ['ok', '1 – 2'] : ['warn', '> 2'];
      rows.push(<Row key="dr" label="Cociente delta (Δ/Δ)" value={delta.toFixed(2)} refText="(AG − 12) ÷ (24 − HCO₃⁻)" tone={dt} chip={dl} />);
    }
  }

  const insights = [];
  if (use.ion && hco3 < r.hco3[0] && agHigh) insights.push('Acidosis metabólica con anion gap elevado: causas frecuentes son láctica, cetoacidosis, insuficiencia renal y tóxicos (metanol, etilenglicol, salicilatos).');
  if (use.ion && hco3 < r.hco3[0] && !agHigh) insights.push('Acidosis metabólica con anion gap normal (hiperclorémica): pérdidas digestivas, acidosis tubular renal, exceso de cloruro.');
  if (delta !== null) insights.push(delta < 1 ? 'Δ/Δ < 1: acidosis con anion gap elevado más acidosis hiperclorémica.' : delta <= 2 ? 'Δ/Δ 1-2: acidosis metabólica por anion gap elevado pura.' : 'Δ/Δ > 2: alcalosis metabólica concomitante o HCO₃⁻ basal alto.');
  if (use.lac && lac > 2 && use.ion && agHigh) insights.push('Lactato y anion gap elevados: la acidosis láctica es la causa más probable. Buscar hipoperfusión, sepsis o hipoxia.');
  if (use.lac && lac >= 4) insights.push('Lactato ≥ 4 mmol/L: indica hipoperfusión tisular grave; priorizar reanimación y traslado.');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`sticky top-[76px] z-[5] -mx-1 px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur ${res.tone} ${res.tone === 'bg-yellow-500' ? 'text-slate-900' : 'text-white'}`} role="status" aria-live="polite">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] opacity-80">Interpretación en vivo · {type}</div>
        <div className="font-black leading-tight">{res.headline}</div>
      </div>

      <Segmented value={type} onChange={(v) => { setType(v); if (v === 'venosa') setUse((u) => ({ ...u, ox: false })); }} options={[{ value: 'arterial', label: 'Arterial' }, { value: 'venosa', label: 'Venosa' }]} />
      {!arterial && <InfoBox tone="sky">En venosa son equivalentes pH, HCO₃⁻ y lactato (si no hay shock). La pCO₂ venosa es ≈ 3-6 mmHg mayor y su correlación individual es pobre; la pO₂ venosa no sirve para valorar oxigenación.</InfoBox>}

      <div className="space-y-4">
        <GloveInput label="pH" value={ph} min={6.8} max={7.8} step={0.01} fastStep={0.1} decimals={2} onChange={setPh} />
        <GloveInput label={arterial ? 'PaCO₂' : 'pCO₂ venosa'} value={pco2} min={10} max={120} step={1} fastStep={10} onChange={setPco2} unit="mmHg" />
        <GloveInput label="HCO₃⁻ (bicarbonato)" value={hco3} min={5} max={50} step={1} fastStep={5} onChange={setHco3} unit="mEq/L" />
      </div>

      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-2 px-1">Datos opcionales</div>
        <div className="flex flex-wrap gap-2">
          {arterial && <Toggle on={use.ox} onClick={() => flip('ox')}>Oxigenación</Toggle>}
          <Toggle on={use.lac} onClick={() => flip('lac')}>Lactato</Toggle>
          <Toggle on={use.ion} onClick={() => flip('ion')}>Na / Cl (anion gap)</Toggle>
          {use.ion && <Toggle on={use.alb} onClick={() => flip('alb')}>Albúmina</Toggle>}
        </div>
      </div>

      {arterial && use.ox && (
        <div className="space-y-4 animate-fade-in">
          <GloveInput label="PaO₂" value={po2} min={20} max={500} step={1} fastStep={10} onChange={setPo2} unit="mmHg" />
          <GloveInput label="SpO₂" value={sat} min={50} max={100} step={1} fastStep={5} onChange={setSat} unit="%" />
          <GloveInput label="FiO₂ en el momento de la muestra" value={fio2} min={21} max={100} step={1} fastStep={10} onChange={setFio2} unit="%" />
        </div>
      )}
      {use.lac && <div className="animate-fade-in"><GloveInput label="Lactato" value={lac} min={0} max={30} step={0.1} fastStep={1} decimals={1} onChange={setLac} unit="mmol/L" /></div>}
      {use.ion && (
        <div className="space-y-4 animate-fade-in">
          <GloveInput label="Sodio (Na⁺)" value={na} min={100} max={180} step={1} fastStep={5} onChange={setNa} unit="mEq/L" />
          <GloveInput label="Cloro (Cl⁻)" value={cl} min={70} max={140} step={1} fastStep={5} onChange={setCl} unit="mEq/L" />
          {use.alb && <GloveInput label="Albúmina" value={alb} min={1} max={6} step={0.1} fastStep={0.5} decimals={1} onChange={setAlb} unit="g/dL" />}
        </div>
      )}

      <ResultCard title={`Interpretación · sangre ${type}`} value={res.headline} subtitle={res.detail} colorClass={res.tone} />

      <Card className="px-4 py-2">{rows}</Card>

      {insights.length > 0 && (
        <div className="space-y-2">{insights.map((t) => <InfoBox key={t} tone="blue">{t}</InfoBox>)}</div>
      )}

      <Card className="p-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white mb-2">Cómo se ha interpretado</h3>
        <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
          {res.steps.map((s) => <li key={s}>{s}</li>)}
        </ol>
      </Card>

      <Caveat>
        Reglas de compensación para sangre arterial en trastornos simples (Winter para acidosis metabólica; +0,7 mmHg de pCO₂ por mEq/L de HCO₃⁻ en alcalosis metabólica;
        acidosis respiratoria: HCO₃⁻ ↑ 1-2 (aguda) o 3-4 (crónica) por cada 10 mmHg; alcalosis respiratoria: ↓ 2 (aguda) o 4-5 (crónica)). El anion gap normal depende del analizador
        (con electrodos modernos puede ser menor). Orientativo: integrar siempre con la clínica y con los rangos de tu laboratorio.
      </Caveat>
    </div>
  );
}
