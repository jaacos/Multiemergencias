import React, { useState } from 'react';
import { GloveInput, Segmented, ResultCard, InfoBox, Caveat, Card, Chip } from '../components/ui.jsx';
import * as V from './ventLogic.js';

const Param = ({ label, value, border, tone = 'text-slate-500' }) => (
  <div className={`bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm text-center border-l-4 ${border}`}>
    <div className={`text-xs font-bold ${tone}`}>{label}</div>
    <div className="text-lg font-black text-slate-800 dark:text-white">{value}</div>
  </div>
);

const Flag = ({ tone, children }) => <InfoBox tone={tone === 'bad' ? 'red' : tone === 'warn' ? 'yellow' : 'green'}>{children}</InfoBox>;

// Objetivo de volumen corriente a partir del peso ideal (se comparte entre modos)
const VtTarget = ({ ibw, lo, hi, note }) => {
  const [a, b] = V.vtRange(ibw, lo, hi);
  return (
    <Card className="p-4">
      <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Volumen corriente objetivo · {lo}-{hi} ml/kg de peso ideal ({ibw} kg)</div>
      <div className="text-3xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">{a} – {b} <span className="text-base font-semibold text-slate-500">ml</span></div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{note}</div>
    </Card>
  );
};

export default function VentMechanical() {
  const [height, setHeight] = useState(170);
  const [isMale, setIsMale] = useState(true);
  const [mode, setMode] = useState('vcv');
  const [ph, setPh] = useState(7.3);
  const [peep, setPeep] = useState(5);
  const [ipap, setIpap] = useState(15);
  const [epap, setEpap] = useState(4);

  const ibw = V.ibw(height, isMale);
  const start = V.bipapStart(ph);
  const bi = V.bipapCheck(ipap, epap);
  const cp = V.cpapCheck(peep);
  const sex = (on, color) => `flex-1 py-4 rounded-2xl font-bold text-lg border-2 ${on ? color : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'}`;

  return (
    <div className="space-y-6">
      <Segmented value={mode} onChange={setMode} options={[{ value: 'vcv', label: 'IPPV / VCV' }, { value: 'cpap', label: 'CPAP' }, { value: 'bipap', label: 'BiPAP' }]} />

      <div className="space-y-3">
        <div className="flex gap-2">
          <button type="button" onClick={() => setIsMale(true)} className={sex(isMale, 'border-blue-500 bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-100')}>Hombre</button>
          <button type="button" onClick={() => setIsMale(false)} className={sex(!isMale, 'border-pink-500 bg-pink-100 text-pink-900 dark:bg-pink-500/20 dark:text-pink-100')}>Mujer</button>
        </div>
        <GloveInput label="Altura (peso ideal)" value={height} min={120} max={220} step={1} fastStep={5} onChange={setHeight} unit="cm" />
      </div>

      {mode === 'vcv' && (
        <div className="animate-fade-in space-y-4">
          <ResultCard title="Peso ideal estimado (IBW)" value={`${ibw} kg`} subtitle="Usar SIEMPRE el peso ideal, NO el real." colorClass="bg-sky-600" />
          <div className="grid grid-cols-3 gap-2">
            {[6, 7, 8].map((k) => (
              <div key={k} className={`p-3 rounded-2xl text-center ${k === 6 ? 'bg-blue-100 dark:bg-blue-500/15 border-2 border-blue-500' : 'bg-slate-100 dark:bg-slate-800'}`}>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-300">{k} ml/kg</div>
                <div className="text-xl font-black mt-1 dark:text-white">{ibw * k} <span className="text-xs">ml</span></div>
              </div>
            ))}
          </div>
          <InfoBox tone="slate">Rango habitual 6-8 ml/kg IBW. Usar 6 ml/kg en SDRA o riesgo de lesión pulmonar.</InfoBox>
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-black text-slate-700 dark:text-slate-300 mb-3">Parámetros iniciales y límites</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Param label="PEEP inicial" value="5 cmH₂O" border="border-slate-500" />
              <Param label="FiO₂ inicial" value="100 % y titular" border="border-blue-500" />
              <Param label="P. pico (alarma)" value="< 35 cmH₂O" border="border-red-500" tone="text-red-500" />
              <Param label="P. meseta" value="≤ 30 cmH₂O" border="border-orange-500" tone="text-orange-500" />
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li><strong>FR inicial:</strong> 12-16 rpm, ajustada a EtCO₂ (35-45 mmHg salvo indicación distinta).</li>
              <li><strong>I:E:</strong> 1:2; 1:3-1:4 en asma / EPOC para evitar atrapamiento aéreo.</li>
              <li>Titular FiO₂ y PEEP para SpO₂ 92-96 % (88-92 % si EPOC hipercápnico).</li>
            </ul>
          </div>
        </div>
      )}

      {mode === 'cpap' && (
        <div className="animate-fade-in space-y-4">
          <InfoBox tone="green"><strong>CPAP</strong> (presión continua): edema agudo de pulmón cardiogénico e hipoxemia sin hipercapnia. <strong>La presión no se calcula por peso</strong>: se inicia en 5-10 cmH₂O y se titula según la respuesta clínica.</InfoBox>
          <GloveInput label="PEEP / CPAP actual" value={peep} min={3} max={20} step={1} fastStep={5} onChange={setPeep} unit="cmH₂O" />
          <Flag tone={cp.tone}>{cp.text}</Flag>
          <div className="grid grid-cols-2 gap-3">
            <Param label="Inicio" value="5 – 10 cmH₂O" border="border-green-500" />
            <Param label="Máximo habitual" value={`${V.MAX_CPAP} cmH₂O`} border="border-red-500" tone="text-red-500" />
            <Param label="FiO₂" value="titular" border="border-blue-500" />
            <Param label="SpO₂ objetivo" value="94 – 98 %" border="border-emerald-500" />
          </div>
          <Card className="p-4 text-sm text-slate-600 dark:text-slate-300 space-y-1.5">
            <div className="font-extrabold text-slate-900 dark:text-white">Vigilar durante la titulación</div>
            <div>• Si la hipoxemia persiste con la presión inicial, aumentar progresivamente hasta el máximo tolerado.</div>
            <div>• Hipotensión (menor retorno venoso), vómito, distensión gástrica y descenso de la consciencia.</div>
            <div>• Contraindicada con vía aérea no protegida, vómito activo o neumotórax sin drenar.</div>
          </Card>
          <Caveat>Rangos de CPAP prehospitalaria en edema agudo de pulmón (5-10 cmH₂O, máx. 15). El protocolo de tu servicio puede fijar otros valores.</Caveat>
        </div>
      )}

      {mode === 'bipap' && (
        <div className="animate-fade-in space-y-4">
          <InfoBox tone="blue"><strong>BiPAP</strong> (doble nivel): EPOC reagudizado con acidosis respiratoria, insuficiencia respiratoria hipercápnica y fatiga muscular. Las presiones dependen del <strong>pH</strong> y de la respuesta; el <strong>peso ideal</strong> marca el volumen corriente objetivo.</InfoBox>

          <GloveInput label="pH del paciente" value={ph} min={6.9} max={7.5} step={0.01} fastStep={0.1} decimals={2} onChange={setPh} />
          <ResultCard
            title="Ajuste inicial sugerido (EPOC hipercápnico)"
            value={`IPAP ${start.ipap} / EPAP ${start.epap}`}
            subtitle={ph < 7.25 ? 'pH < 7,25: IPAP inicial 20 cmH₂O.' : 'IPAP inicial 15 cmH₂O (20 si pH < 7,25).'}
            colorClass={ph < 7.25 ? 'bg-red-600' : 'bg-sky-600'}
          />

          <button type="button" onClick={() => { setIpap(start.ipap); setEpap(start.epap); }} className="w-full py-3 rounded-2xl font-bold border-2 border-dashed border-blue-400 text-blue-700 dark:text-blue-300">Cargar ajuste inicial en los controles</button>

          <GloveInput label="IPAP actual" value={ipap} min={4} max={40} step={1} fastStep={5} onChange={setIpap} unit="cmH₂O" />
          <GloveInput label="EPAP actual" value={epap} min={3} max={15} step={1} fastStep={5} onChange={setEpap} unit="cmH₂O" />

          <Card className="p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Presión de soporte (IPAP − EPAP)</div>
              <div className="text-4xl font-black tabular-nums text-slate-900 dark:text-white">{bi.ps} <span className="text-base font-semibold text-slate-500">cmH₂O</span></div>
            </div>
            <Chip tone={bi.ps >= 5 ? 'ok' : 'bad'}>{bi.ps >= 5 ? 'Suficiente' : 'Insuficiente'}</Chip>
          </Card>
          {bi.flags.map((f) => <Flag key={f.text} tone={f.tone}>{f.text}</Flag>)}

          <VtTarget ibw={ibw} lo={6} hi={8} note="Si el volumen espirado es inferior, aumentar IPAP (más presión de soporte). En obesidad-hipoventilación pueden requerirse objetivos mayores." />

          <Card className="p-4 text-sm text-slate-600 dark:text-slate-300 space-y-1.5">
            <div className="font-extrabold text-slate-900 dark:text-white">Titulación (BTS/ICS)</div>
            <div>• Subir IPAP en 10-30 min hasta 20-30 cmH₂O (máx. {V.MAX_IPAP} sin valoración experta) buscando mejor expansión torácica y menor FR.</div>
            <div>• Subir EPAP solo si persiste la hipoxemia (máx. {V.MAX_EPAP} sin valoración experta).</div>
            <div>• Frecuencia de respaldo 16-20; I:E 1:2 a 1:3 (tiempo inspiratorio 0,8-1,2 s).</div>
            <div>• <strong>SpO₂ objetivo 88-92 %</strong> en EPOC hipercápnico. Gasometría de control a los 60 min.</div>
          </Card>
          <Caveat>Valores de la guía BTS/ICS 2016 de VNI en EPOC. En edema agudo de pulmón se prefiere CPAP. Los protocolos regionales pueden variar.</Caveat>
        </div>
      )}
    </div>
  );
}
