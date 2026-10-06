import React, { useState } from 'react';
import { Section, OptionBtn, ResultCard, InfoBox } from '../components/ui.jsx';

export default function Glasgow() {
  const [s, setS] = useState({ eye: null, verbal: null, motor: null });
  const set = (k) => (v) => setS((p) => ({ ...p, [k]: v }));
  const complete = s.eye && s.verbal && s.motor;
  const total = (s.eye || 0) + (s.verbal || 0) + (s.motor || 0);

  const group = (key, title, opts) => (
    <Section title={title}>
      {opts.map(([v, label]) => <OptionBtn key={v} label={`${v} - ${label}`} value={v} selectedValue={s[key]} onClick={set(key)} />)}
    </Section>
  );

  return (
    <div className="space-y-6">
      {group('eye', 'Apertura ocular', [[4, 'Espontánea'], [3, 'A la orden verbal'], [2, 'Al dolor'], [1, 'Ninguna']])}
      {group('verbal', 'Respuesta verbal', [[5, 'Orientado y conversando'], [4, 'Desorientado / confuso'], [3, 'Palabras inapropiadas'], [2, 'Sonidos incomprensibles'], [1, 'Ninguna']])}
      {group('motor', 'Respuesta motora', [[6, 'Obedece órdenes'], [5, 'Localiza el dolor'], [4, 'Retirada al dolor'], [3, 'Flexión anormal (decorticación)'], [2, 'Extensión anormal (descerebración)'], [1, 'Ninguna']])}
      <InfoBox tone="slate">Paciente intubado o con párpados edematosos: no puntúes el ítem imposible; registra «T» (tubo) o «NT» y puntúa solo los explorables.</InfoBox>
      {complete && (
        <ResultCard
          title="Glasgow"
          value={`GCS ${total} (O${s.eye} V${s.verbal} M${s.motor})`}
          subtitle={total <= 8 ? 'Grave (≤8): valorar aislamiento de vía aérea.' : total <= 12 ? 'Moderado (9-12)' : 'Leve (13-15)'}
          colorClass={total <= 8 ? 'bg-red-600' : total <= 12 ? 'bg-orange-500' : 'bg-green-600'}
        />
      )}
    </div>
  );
}
