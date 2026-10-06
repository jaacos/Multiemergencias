import React from 'react';

const Card = ({ title, color, items }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow">
    <h3 className={`font-black text-xl mb-4 ${color}`}>{title}</h3>
    <ul className="space-y-3 text-slate-700 dark:text-slate-300 font-medium">
      {items.map(([l, rest]) => (
        <li key={l + rest}><strong className="text-slate-900 dark:text-white">{l}</strong>{rest}</li>
      ))}
    </ul>
  </div>
);

export default function TransferTemplates() {
  return (
    <div className="space-y-6">
      <Card title="ISBAR (preaviso general)" color="text-blue-700 dark:text-blue-400" items={[
        ['I', 'dentificación: quién soy, unidad, paciente (edad/sexo).'],
        ['S', 'ituación: motivo del traslado, qué ocurre ahora.'],
        ['B', 'ackground (antecedentes): historia relevante, alergias, medicación.'],
        ['A', 'ssessment (evaluación): constantes, exploración, hallazgos y tratamiento aplicado.'],
        ['R', 'ecomendación: qué necesito del hospital (box, UCI, especialista, equipo).'],
      ]} />
      <Card title="ATMIST (trauma)" color="text-red-600 dark:text-red-400" items={[
        ['A', 'ge: edad y sexo.'],
        ['T', 'ime: hora del incidente.'],
        ['M', 'echanism: mecanismo lesional (velocidad, altura, etc.).'],
        ['I', 'njuries: lesiones encontradas (de cabeza a pies).'],
        ['S', 'igns: constantes (TA, FC, FR, SpO₂, GCS).'],
        ['T', 'reatment: tratamiento aplicado (fluidos, torniquete, IOT).'],
      ]} />
    </div>
  );
}
