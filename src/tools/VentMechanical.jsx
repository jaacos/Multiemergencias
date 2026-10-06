import React, { useState } from 'react';
import { GloveInput, Segmented, ResultCard, InfoBox } from '../components/ui.jsx';

const Param = ({ label, value, border, tone = 'text-slate-500' }) => (
  <div className={`bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm text-center border-l-4 ${border}`}>
    <div className={`text-xs font-bold ${tone}`}>{label}</div>
    <div className="text-lg font-black text-slate-800 dark:text-white">{value}</div>
  </div>
);

export default function VentMechanical() {
  const [height, setHeight] = useState(170);
  const [isMale, setIsMale] = useState(true);
  const [mode, setMode] = useState('vcv');

  const ibw = Math.max(30, Math.round((isMale ? 50 : 45.5) + 0.91 * (height - 152.4)));
  const sex = (on, color) => `flex-1 py-4 rounded-xl font-bold text-lg border-2 ${on ? color : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'}`;

  return (
    <div className="space-y-6">
      <Segmented value={mode} onChange={setMode} options={[{ value: 'vcv', label: 'IPPV / VCV' }, { value: 'cpap', label: 'CPAP' }, { value: 'bipap', label: 'BiPAP' }]} />

      {mode === 'vcv' && (
        <div className="animate-fade-in space-y-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setIsMale(true)} className={sex(isMale, 'border-blue-500 bg-blue-100 text-blue-900')}>Hombre</button>
            <button type="button" onClick={() => setIsMale(false)} className={sex(!isMale, 'border-pink-500 bg-pink-100 text-pink-900')}>Mujer</button>
          </div>
          <GloveInput label="Altura (cm) para peso ideal" value={height} min={120} max={220} step={1} fastStep={5} onChange={setHeight} unit="cm" />
          <ResultCard title="Peso ideal estimado (IBW)" value={`${ibw} kg`} subtitle="Usar SIEMPRE el peso ideal, NO el real." colorClass="bg-sky-600" />

          <div className="grid grid-cols-3 gap-2">
            {[6, 7, 8].map((k) => (
              <div key={k} className={`p-3 rounded-2xl text-center ${k === 6 ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500' : 'bg-slate-100 dark:bg-slate-800'}`}>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-300">{k} ml/kg</div>
                <div className="text-xl font-black mt-1 dark:text-white">{ibw * k} <span className="text-xs">ml</span></div>
              </div>
            ))}
          </div>
          <InfoBox tone="slate">Rango habitual 6-8 ml/kg IBW. Usar 6 ml/kg en SDRA o riesgo de lesión pulmonar.</InfoBox>

          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
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
        <div className="animate-fade-in p-6 bg-green-50 dark:bg-green-900/30 border-2 border-green-500 rounded-2xl">
          <h3 className="text-xl font-black text-green-800 dark:text-green-400 mb-2">CPAP (presión continua)</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">Indicación principal: edema agudo de pulmón cardiogénico e hipoxemia sin hipercapnia.</p>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl">
            <div className="font-bold text-slate-500 uppercase text-xs mb-1">Parámetros iniciales</div>
            <div className="text-3xl font-black text-slate-800 dark:text-white mb-2">PEEP 5-10 <span className="text-base font-normal">cmH₂O</span></div>
            <div className="text-3xl font-black text-slate-800 dark:text-white">FiO₂ 50-100 %</div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Titular la PEEP de forma progresiva. Vigilar hipotensión, vómito y disminución de consciencia. Contraindicada con vía aérea no protegida.</p>
        </div>
      )}

      {mode === 'bipap' && (
        <div className="animate-fade-in p-6 bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-500 rounded-2xl">
          <h3 className="text-xl font-black text-purple-800 dark:text-purple-400 mb-2">BiPAP (doble nivel)</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">Indicación principal: EPOC reagudizado, insuficiencia respiratoria hipercápnica, fatiga muscular.</p>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl space-y-3">
            <div className="font-bold text-slate-500 uppercase text-xs">Parámetros iniciales</div>
            <div>
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400">IPAP (inspiratoria)</div>
              <div className="text-3xl font-black text-slate-800 dark:text-white">10-12 <span className="text-base font-normal">cmH₂O</span></div>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400">EPAP (espiratoria)</div>
              <div className="text-3xl font-black text-slate-800 dark:text-white">4-5 <span className="text-base font-normal">cmH₂O</span></div>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400">Presión de soporte (IPAP − EPAP)</div>
              <div className="text-xl font-bold text-slate-800 dark:text-white">Mínimo 5 cmH₂O</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
