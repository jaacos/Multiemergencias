import React, { useState } from 'react';
import { Section, OptionBtn, ResultCard, InfoBox, Caveat } from '../components/ui.jsx';

const GROUPS = [
  ['parity', 'Paridad (partos previos)', [['0 (primípara)', 0], ['1 parto', 1], ['≥ 2 partos', 2]]],
  ['length', 'Duración del trabajo de parto', [['< 3 horas', 0], ['3 a 5 horas', 1], ['> 5 horas', 2]]],
  ['contractions', 'Duración de las contracciones', [['< 1 minuto', 0], ['1 minuto', 1], ['> 1 minuto', 2]]],
  ['interval', 'Intervalo entre contracciones', [['> 5 minutos', 0], ['3 a 5 minutos', 1], ['< 3 minutos', 2]]],
  ['waters', 'Rotura de bolsa', [['No rota', 0], ['Reciente (< 1 h)', 1], ['Prolongada (> 1 h)', 2]]],
];

export default function Malinas() {
  const [s, setS] = useState({ parity: null, length: null, contractions: null, interval: null, waters: null });
  const [push, setPush] = useState(null);
  const complete = Object.values(s).every((v) => v !== null);
  const total = Object.values(s).reduce((a, b) => a + (b || 0), 0);

  let value = total, sub, color;
  if (push) { sub = 'Deseo de pujar / coronamiento: parto inminente con independencia de la puntuación. Atender in situ.'; color = 'bg-red-600'; }
  else if (total < 5) { sub = 'Parto no inminente. Traslado posible, con vigilancia durante el trayecto.'; color = 'bg-green-600'; }
  else if (total === 5) { sub = 'Zona intermedia. Preparar material de parto y reevaluar antes de decidir el traslado.'; color = 'bg-orange-500'; }
  else { sub = 'Parto inminente probable. Preparar asistencia in situ.'; color = 'bg-red-600'; }

  return (
    <div className="space-y-6">
      <InfoBox tone="yellow">Si hay <strong>coronamiento</strong>, sangrado importante, presentación anómala o prolapso de cordón, no depende de la puntuación: actuar según protocolo obstétrico.</InfoBox>
      {GROUPS.map(([k, title, opts]) => (
        <Section key={k} title={title}>
          {opts.map(([label, v]) => <OptionBtn key={label} label={label} value={v} selectedValue={s[k]} onClick={(x) => setS({ ...s, [k]: x })} />)}
        </Section>
      ))}
      <Section title="¿Deseo de pujar o cabeza visible?">
        <div className="grid grid-cols-2 gap-2">
          <OptionBtn label="SÍ" value={true} selectedValue={push} onClick={setPush} />
          <OptionBtn label="NO" value={false} selectedValue={push} onClick={setPush} />
        </div>
      </Section>
      {(push === true || (complete && push !== null)) && <ResultCard title="Puntuación de Malinas" value={value} subtitle={sub} colorClass={color} />}
      <Caveat>El Malinas por sí solo no es un predictor fiable: en estudios, ~25 % de partos extrahospitalarios inesperados puntuaron &lt; 5. La clínica y tu criterio prevalecen.</Caveat>
    </div>
  );
}
