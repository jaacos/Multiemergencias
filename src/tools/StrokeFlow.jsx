import React, { useState } from 'react';
import { Section, OptionBtn, YesNo, ScoreRow, Segmented, ResultCard, InfoBox, Btn } from '../components/ui.jsx';

const EMPTY_RACE = { facial: null, arm: null, leg: null, head: null, aphasia: null };
const sev = (a, b, c) => [{ v: 0, label: a }, { v: 1, label: b }, { v: 2, label: c }];

export default function StrokeFlow() {
  const [step, setStep] = useState('cincinnati');
  const [cin, setCin] = useState({ facial: null, arm: null, speech: null });
  const [rankin, setRankin] = useState(null);
  const [race, setRace] = useState(EMPTY_RACE);

  const cinComplete = Object.values(cin).every((v) => v !== null);
  const cinPositive = Object.values(cin).some((v) => v === true);
  const raceComplete = Object.values(race).every((v) => v !== null);
  const raceScore = Object.values(race).reduce((a, b) => a + (b || 0), 0);

  const reset = () => { setStep('cincinnati'); setCin({ facial: null, arm: null, speech: null }); setRankin(null); setRace(EMPTY_RACE); };
  const setR = (k) => (v) => setRace((r) => ({ ...r, [k]: v }));

  return (
    <div className="space-y-4">
      <Segmented
        value={step}
        onChange={setStep}
        options={[{ value: 'cincinnati', label: '1. Detección' }, { value: 'rankin', label: '2. Basal' }, { value: 'race', label: '3. Gravedad' }]}
      />

      {step === 'cincinnati' && (
        <div className="animate-fade-in space-y-6">
          <InfoBox tone="yellow">Anota la <strong>hora en que el paciente fue visto bien por última vez</strong>. Determina la ventana terapéutica.</InfoBox>
          <Section title="Escala de Cincinnati (detección)">
            <div className="font-bold dark:text-slate-200">Asimetría facial (pedir que sonría)</div>
            <YesNo value={cin.facial} onChange={(v) => setCin({ ...cin, facial: v })} yesLabel="ANORMAL" noLabel="Normal" />
            <div className="font-bold dark:text-slate-200 pt-2">Caída del brazo (mantener 10 s, ojos cerrados)</div>
            <YesNo value={cin.arm} onChange={(v) => setCin({ ...cin, arm: v })} yesLabel="ANORMAL" noLabel="Normal" />
            <div className="font-bold dark:text-slate-200 pt-2">Alteración del habla (repetir una frase)</div>
            <YesNo value={cin.speech} onChange={(v) => setCin({ ...cin, speech: v })} yesLabel="ANORMAL" noLabel="Normal" />
          </Section>

          {cinComplete && cinPositive && (
            <>
              <ResultCard title="Cincinnati" value="POSITIVO" subtitle="Sospecha de ictus. Valorar escala de gravedad y activar Código Ictus según protocolo." colorClass="bg-red-600" />
              <Btn onClick={() => setStep('rankin')} className="bg-red-600 text-white text-xl font-black">Siguiente: situación basal</Btn>
            </>
          )}
          {cinComplete && !cinPositive && (
            <>
              <InfoBox tone="yellow">
                <strong>Cincinnati negativo NO descarta ictus.</strong> Tiene sensibilidad limitada, sobre todo en ictus de circulación posterior
                (vértigo, ataxia, diplopía, alteración visual). Si hay déficit neurológico agudo o la sospecha clínica persiste, trátalo como posible ictus.
              </InfoBox>
              <Btn onClick={() => setStep('rankin')} className="bg-slate-800 text-white dark:bg-slate-700">Continuar de todos modos</Btn>
            </>
          )}
        </div>
      )}

      {step === 'rankin' && (
        <div className="animate-fade-in space-y-6">
          <Section title="Escala Rankin modificada (mRS previa)" desc="Situación funcional ANTES del ictus.">
            <OptionBtn label="0-2: Independiente (autónomo)" value={2} selectedValue={rankin} onClick={(v) => { setRankin(v); setStep('race'); }} />
            <OptionBtn label="3: Dependencia leve (necesita ayuda, camina solo)" value={3} selectedValue={rankin} onClick={(v) => { setRankin(v); setStep('race'); }} />
            <OptionBtn label="4-5: Dependencia severa (silla de ruedas / cama)" value={5} selectedValue={rankin} onClick={setRankin} />
          </Section>
          {rankin === 5 && (
            <div className="space-y-3">
              <InfoBox tone="yellow">Un mRS previo ≥4 suele pesar en contra de terapias de reperfusión, pero la decisión es del neurólogo. Consulta con el coordinador / centro receptor.</InfoBox>
              <Btn onClick={() => setStep('race')} className="bg-slate-800 text-white dark:bg-slate-700">Continuar a RACE</Btn>
            </div>
          )}
        </div>
      )}

      {step === 'race' && (
        <div className="animate-fade-in space-y-6">
          <Section title="Escala RACE (sospecha de oclusión de gran vaso)" desc="Puntuación 0-9. Se evalúa el lado contrario a la hemiparesia en afasia/agnosia.">
            <ScoreRow title="Paresia facial" value={race.facial} onChange={setR('facial')} options={sev('Ausente', 'Leve', 'Moderada-severa')} />
            <ScoreRow title="Paresia del brazo" hint="Brazo extendido 10 s" value={race.arm} onChange={setR('arm')} options={sev('Normal / leve', 'Cae antes de 10 s', 'No vence la gravedad')} />
            <ScoreRow title="Paresia de la pierna" hint="Pierna elevada 5 s" value={race.leg} onChange={setR('leg')} options={sev('Normal / leve', 'Cae antes de 5 s', 'No vence la gravedad')} />
            <ScoreRow title="Desviación oculocefálica" value={race.head} onChange={setR('head')} options={[{ v: 0, label: 'Ausente' }, { v: 1, label: 'Presente' }]} />
            <ScoreRow
              title="Afasia (hemiparesia dcha.) / Agnosia (hemiparesia izda.)"
              hint="Afasia: nº de órdenes obedecidas. Agnosia: reconoce su brazo / su déficit."
              value={race.aphasia}
              onChange={setR('aphasia')}
              options={sev('Normal (2 de 2)', 'Parcial (1 de 2)', 'Ninguna (0 de 2)')}
            />
          </Section>

          {raceComplete && (
            <ResultCard
              title="Puntuación RACE"
              value={`${raceScore} / 9`}
              subtitle={raceScore >= 5 ? 'ALTA sospecha de oclusión de gran vaso. Preaviso y derivación a centro con trombectomía según protocolo.' : 'Baja sospecha de oclusión de gran vaso. Sigue siendo posible un ictus: Código Ictus según protocolo.'}
              colorClass={raceScore >= 5 ? 'bg-red-600' : 'bg-green-600'}
            />
          )}
          <Btn onClick={reset} className="mt-4 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white">Reiniciar flujo</Btn>
        </div>
      )}
    </div>
  );
}
