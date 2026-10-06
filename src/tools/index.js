import { IconBrain, IconTrauma, IconBaby, IconLungs, IconOps } from '../components/ui.jsx';
import StrokeFlow from './StrokeFlow.jsx';
import Glasgow from './Glasgow.jsx';
import Fibrinolysis from './Fibrinolysis.jsx';
import NEXUS from './NEXUS.jsx';
import ShockIndex from './ShockIndex.jsx';
import Burns from './Burns.jsx';
import PediatricTape from './PediatricTape.jsx';
import Apgar from './Apgar.jsx';
import Malinas from './Malinas.jsx';
import VentMechanical from './VentMechanical.jsx';
import O2Autonomy from './O2Autonomy.jsx';
import SAFI from './SAFI.jsx';
import RASS from './RASS.jsx';
import Gasometry from './Gasometry.jsx';
import CPRAssistant from './CPRAssistant.jsx';
import TriageSTART from './TriageSTART.jsx';
import TimeLogger from './TimeLogger.jsx';
import TransferTemplates from './TransferTemplates.jsx';
import Hazmat from './Hazmat.jsx';

export const structure = [
  { id: 'neuro', title: 'Neuro & Ictus', icon: IconBrain, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300', tools: [
    { id: 'codo', title: 'Código Ictus (Cincinnati + RACE)', comp: StrokeFlow },
    { id: 'gcs', title: 'Glasgow (GCS)', comp: Glasgow },
    { id: 'fib', title: 'Fibrinólisis (contraindicaciones)', comp: Fibrinolysis },
  ] },
  { id: 'trauma', title: 'Trauma & Sangrado', icon: IconTrauma, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300', tools: [
    { id: 'nexus', title: 'Inmov. cervical (NEXUS / canadiense)', comp: NEXUS },
    { id: 'si', title: 'Índice de shock (adulto / pediátrico)', comp: ShockIndex },
    { id: 'burns', title: 'Quemados (SCQ + fluidos)', comp: Burns },
  ] },
  { id: 'peds', title: 'Pediatría & Parto', icon: IconBaby, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300', tools: [
    { id: 'tape', title: 'Cinta pediátrica rápida', comp: PediatricTape },
    { id: 'apgar', title: 'Test de Apgar', comp: Apgar },
    { id: 'malinas', title: 'Escala de Malinas (parto)', comp: Malinas },
  ] },
  { id: 'air', title: 'Vía aérea & O₂', icon: IconLungs, color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300', tools: [
    { id: 'vent', title: 'Ventilación mecánica (IBW / Vt)', comp: VentMechanical },
    { id: 'o2', title: 'Autonomía de oxígeno', comp: O2Autonomy },
    { id: 'safi', title: 'Índice SAFI', comp: SAFI },
    { id: 'rass', title: 'Escala RASS (sedación)', comp: RASS },
    { id: 'gasometry', title: 'Gasometría (arterial / venosa)', comp: Gasometry },
  ] },
  { id: 'ops', title: 'Operaciones & Triaje', icon: IconOps, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300', tools: [
    { id: 'cpr', title: 'Asistente de RCP (cronómetro)', comp: CPRAssistant },
    { id: 'start', title: 'Triaje START', comp: TriageSTART },
    { id: 'time', title: 'Registro de tiempos (código)', comp: TimeLogger },
    { id: 'isbar', title: 'Preaviso hospital (ISBAR / ATMIST)', comp: TransferTemplates },
    { id: 'hazmat', title: 'MatPel · búsqueda ONU', comp: Hazmat },
  ] },
];
