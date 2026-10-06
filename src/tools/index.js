import { IconBrain, IconTrauma, IconBaby, IconLungs, IconOps } from '../components/ui.jsx';
import StrokeFlow from './StrokeFlow.jsx';
import Glasgow from './Glasgow.jsx';
import Fibrinolysis from './Fibrinolysis.jsx';
import NEXUS from './NEXUS.jsx';
import ShockIndex from './ShockIndex.jsx';
import Burns from './Burns.jsx';
import PediatricTrauma from './PediatricTrauma.jsx';
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
  { id: 'neuro', blurb: 'Ictus, coma y fibrinólisis', title: 'Neuro & Ictus', icon: IconBrain, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300', tools: [
    { id: 'codo', tag: 'ICTUS', desc: 'Cincinnati → Rankin → RACE para oclusión de gran vaso', title: 'Código Ictus (Cincinnati + RACE)', comp: StrokeFlow },
    { id: 'gcs', tag: 'GCS', desc: 'Escala de coma de Glasgow', title: 'Glasgow (GCS)', comp: Glasgow },
    { id: 'fib', tag: 'tPA', desc: 'Criterios y datos a transmitir en el preaviso', title: 'Fibrinólisis (contraindicaciones)', comp: Fibrinolysis },
  ] },
  { id: 'trauma', blurb: 'Columna cervical, shock, ITP y quemados', title: 'Trauma & Sangrado', icon: IconTrauma, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300', tools: [
    { id: 'nexus', tag: 'C-SPINE', desc: 'NEXUS y regla canadiense de columna cervical', title: 'Inmov. cervical (NEXUS / canadiense)', comp: NEXUS },
    { id: 'si', tag: 'SHOCK', desc: 'FC/TAS y SIPA pediátrico', title: 'Índice de shock (adulto / pediátrico)', comp: ShockIndex },
    { id: 'itp', tag: 'ITP', desc: 'Índice de Trauma Pediátrico: 6 parámetros, −6 a +12', title: 'Índice de Trauma Pediátrico (ITP)', comp: PediatricTrauma },
    { id: 'burns', tag: 'SCQ', desc: 'Regla de los 9 y fluidos en quemados', title: 'Quemados (SCQ + fluidos)', comp: Burns },
  ] },
  { id: 'peds', blurb: 'Peso, Apgar y riesgo de parto', title: 'Pediatría & Parto', icon: IconBaby, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300', tools: [
    { id: 'tape', tag: 'PEDS', desc: 'Peso, tubo, descarga y adrenalina por edad', title: 'Cinta pediátrica rápida', comp: PediatricTape },
    { id: 'apgar', tag: 'APGAR', desc: 'Valoración del recién nacido', title: 'Test de Apgar', comp: Apgar },
    { id: 'malinas', tag: 'PARTO', desc: 'Riesgo de parto inminente', title: 'Escala de Malinas (parto)', comp: Malinas },
  ] },
  { id: 'air', blurb: 'Ventilación, oxigenación y gasometría', title: 'Vía aérea & O₂', icon: IconLungs, color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300', tools: [
    { id: 'vent', tag: 'VM', desc: 'Peso ideal, volumen tidal, CPAP y BiPAP', title: 'Ventilación mecánica (IBW / Vt)', comp: VentMechanical },
    { id: 'o2', tag: 'O₂', desc: 'Minutos de autonomía de la botella', title: 'Autonomía de oxígeno', comp: O2Autonomy },
    { id: 'safi', tag: 'SAFI', desc: 'SpO₂/FiO₂ con leyenda y PaFi estimada', title: 'Índice SAFI', comp: SAFI },
    { id: 'rass', tag: 'RASS', desc: 'Nivel de sedación y agitación', title: 'Escala RASS (sedación)', comp: RASS },
    { id: 'gasometry', tag: 'GAS', desc: 'Gases, lactato, anion gap y compensación', title: 'Gasometría (arterial / venosa)', comp: Gasometry },
  ] },
  { id: 'ops', blurb: 'RCP, triaje, tiempos y MatPel', title: 'Operaciones & Triaje', icon: IconOps, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300', tools: [
    { id: 'cpr', tag: 'RCP', desc: 'Ciclos, descargas, fármacos y registro', title: 'Asistente de RCP (cronómetro)', comp: CPRAssistant },
    { id: 'start', tag: 'START', desc: 'Clasificación de múltiples víctimas', title: 'Triaje START', comp: TriageSTART },
    { id: 'time', tag: 'TIEMPOS', desc: 'Cronología con tiempos calculados', title: 'Registro de tiempos (código)', comp: TimeLogger },
    { id: 'isbar', tag: 'ISBAR', desc: 'Plantillas de comunicación', title: 'Preaviso hospital (ISBAR / ATMIST)', comp: TransferTemplates },
    { id: 'hazmat', tag: 'ONU', desc: 'Nº ONU → guía GRE y aislamiento', title: 'MatPel · búsqueda ONU', comp: Hazmat },
  ] },
];
