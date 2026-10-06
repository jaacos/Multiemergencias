import React from 'react';
import { InfoBox, Caveat } from '../components/ui.jsx';

const Box = ({ title, tone, items }) => (
  <div className={`p-4 rounded-xl border ${tone}`}>
    <h3 className="font-black mb-2">{title}</h3>
    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-800 dark:text-slate-200">
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  </div>
);

export default function Fibrinolysis() {
  return (
    <div className="space-y-6">
      <InfoBox tone="blue">
        Información para el <strong>preaviso</strong>. La indicación de fibrinólisis / trombectomía la decide el neurólogo del centro receptor.
        Ante la duda NO descartes al paciente en el medio extrahospitalario: transmite los datos.
      </InfoBox>
      <InfoBox tone="yellow">
        <strong>Datos a transmitir siempre:</strong> hora de último visto bien, glucemia capilar, TA, anticoagulación (fármaco y última toma),
        cirugía / traumatismo / sangrado reciente, escala RACE y mRS previa.
      </InfoBox>
      <Box
        title="Contraindicaciones absolutas (alteplasa / tenecteplasa)"
        tone="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
        items={[
          'Hemorragia intracraneal actual o previa; sospecha de hemorragia subaracnoidea.',
          'Ictus isquémico, traumatismo craneoencefálico grave o cirugía intracraneal/intraespinal en los últimos 3 meses.',
          'Neoplasia intracraneal, malformación arteriovenosa o aneurisma no tratado.',
          'Sospecha de disección aórtica; endocarditis infecciosa.',
          'Hemorragia interna activa o diátesis hemorrágica conocida.',
          'Glucemia < 50 mg/dL (corregir: puede simular un ictus).',
          'Plaquetas < 100.000/µL; INR > 1,7; TTPa prolongado.',
          'HBPM a dosis terapéuticas en las últimas 24 h; anticoagulante oral directo en las últimas 48 h (salvo antídoto / niveles normales).',
          'TA ≥ 185/110 mmHg que no se consigue controlar.',
        ]}
      />
      <Box
        title="Precauciones / contraindicaciones relativas"
        tone="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400"
        items={[
          'Cirugía mayor o traumatismo grave en los últimos 14 días.',
          'Hemorragia gastrointestinal o urinaria en los últimos 21 días.',
          'Infarto agudo de miocardio en los últimos 3 meses.',
          'Punción arterial en zona no compresible en los últimos 7 días.',
          'Crisis epiléptica al inicio con déficit posictal (valorar simulador).',
          'Embarazo o puerperio inmediato.',
          'Déficit leve o en rápida mejoría (valoración individual).',
        ]}
      />
      <Caveat>
        Resumen de criterios de las guías ESO/AHA-ASA habituales. Los umbrales concretos varían entre protocolos regionales: prevalece el protocolo de tu servicio.
      </Caveat>
    </div>
  );
}
