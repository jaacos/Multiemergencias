import React, { useState } from 'react';
import { Section, YesNo, ResultCard, Segmented, InfoBox } from '../components/ui.jsx';

const NEXUS_ITEMS = [
  ['focal', '1. Déficit neurológico focal'],
  ['mid', '2. Dolor / sensibilidad en línea media cervical'],
  ['alt', '3. Nivel de consciencia alterado'],
  ['intox', '4. Intoxicación aparente'],
  ['dist', '5. Lesión dolorosa distractora'],
];

export default function NEXUS() {
  const [mode, setMode] = useState('nexus');
  const [crit, setCrit] = useState({ focal: null, mid: null, alt: null, intox: null, dist: null });
  const [can, setCan] = useState({ high: null, low: null, rotate: null });

  const nexusComplete = Object.values(crit).every((v) => v !== null);
  const nexusAny = Object.values(crit).some((v) => v === true);
  // Con un criterio positivo el resultado ya es definitivo, aunque falten ítems.
  const nexusRisk = nexusAny;
  const nexusLow = nexusComplete && !nexusAny;

  const immobilize = can.high === true || can.low === false || can.rotate === false;
  const clear = can.high === false && can.low === true && can.rotate === true;

  return (
    <div className="space-y-4">
      <Segmented value={mode} onChange={setMode} options={[{ value: 'nexus', label: 'Criterios NEXUS' }, { value: 'canadian', label: 'Regla canadiense' }]} />

      {mode === 'nexus' && (
        <div className="animate-fade-in space-y-4">
          <InfoBox tone="yellow">NEXUS: si CUALQUIERA es «SÍ», inmovilizar. Solo aplicable tras traumatismo cerrado.</InfoBox>
          {NEXUS_ITEMS.map(([k, t]) => (
            <Section key={k} title={t}>
              <YesNo value={crit[k]} onChange={(v) => setCrit({ ...crit, [k]: v })} />
            </Section>
          ))}
          {nexusRisk && <ResultCard title="Recomendación NEXUS" value="INMOVILIZAR" subtitle="Presenta al menos un criterio de riesgo. Derivar para valoración / imagen." colorClass="bg-red-600" />}
          {nexusLow && <ResultCard title="Recomendación NEXUS" value="BAJO RIESGO" subtitle="Cumple los 5 criterios de bajo riesgo: no precisa inmovilización ni imagen según NEXUS." colorClass="bg-green-600" />}
        </div>
      )}

      {mode === 'canadian' && (
        <div className="animate-fade-in space-y-4">
          <InfoBox tone="sky">Regla canadiense (C-Spine): solo para pacientes alerta (GCS 15), estables y con traumatismo cervical.</InfoBox>

          <Section title="1. ¿Algún factor de ALTO riesgo?" desc="Edad ≥ 65 años, mecanismo peligroso (caída ≥1 m / 5 escalones, carga axial, colisión a alta velocidad, vuelco, vehículo recreativo, bicicleta) o parestesias en extremidades.">
            <YesNo value={can.high} onChange={(v) => setCan({ high: v, low: null, rotate: null })} yesLabel="SÍ (alto riesgo)" />
          </Section>

          {can.high === false && (
            <Section title="2. ¿Algún factor de BAJO riesgo que permita valorar la movilidad?" desc="Colisión simple por alcance, sentado en urgencias, ambulante en cualquier momento, dolor cervical de inicio tardío o ausencia de dolor en línea media.">
              <YesNo value={can.low} onChange={(v) => setCan({ ...can, low: v, rotate: null })} yesLabel="SÍ (hay alguno)" noLabel="NO (ninguno)" />
            </Section>
          )}

          {can.high === false && can.low === true && (
            <Section title="3. ¿Puede rotar el cuello 45° a izquierda y derecha?">
              <YesNo value={can.rotate} onChange={(v) => setCan({ ...can, rotate: v })} yesLabel="SÍ (capaz)" noLabel="NO (incapaz)" />
            </Section>
          )}

          {immobilize && <ResultCard title="Regla canadiense" value="INMOVILIZAR / IMAGEN" subtitle="Requiere radiología y mantener la inmovilización cervical." colorClass="bg-red-600" />}
          {clear && <ResultCard title="Regla canadiense" value="NO REQUIERE IMAGEN" subtitle="Lesión cervical significativa improbable. Se puede retirar la inmovilización." colorClass="bg-green-600" />}
        </div>
      )}
    </div>
  );
}
