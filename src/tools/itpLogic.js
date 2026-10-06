// Índice de Trauma Pediátrico (Pediatric Trauma Score, Tepas 1987). Rango −6 a +12.
export const SECTIONS = [
  { key: 'size', title: 'Tamaño (peso)', hint: 'Peso medido o estimado (cinta pediátrica).', options: [
    { v: 2, label: '> 20 kg' }, { v: 1, label: '10 – 20 kg' }, { v: -1, label: '< 10 kg' } ] },
  { key: 'airway', title: 'Vía aérea', options: [
    { v: 2, label: 'Normal' }, { v: 1, label: 'Mantenible (cánula, O₂)' }, { v: -1, label: 'No mantenible (intubado / cricotiroidotomía)' } ] },
  { key: 'sbp', title: 'Presión arterial sistólica', hint: 'Si no se puede medir: pulso radial = >90 · carotídeo/femoral = 50-90 · débil/ausente = <50.', options: [
    { v: 2, label: '> 90 mmHg' }, { v: 1, label: '50 – 90 mmHg' }, { v: -1, label: '< 50 mmHg' } ] },
  { key: 'cns', title: 'Sistema nervioso central', options: [
    { v: 2, label: 'Despierto' }, { v: 1, label: 'Obnubilado / pérdida de consciencia' }, { v: -1, label: 'Coma / descerebración' } ] },
  { key: 'wound', title: 'Heridas abiertas', options: [
    { v: 2, label: 'Ninguna' }, { v: 1, label: 'Menores' }, { v: -1, label: 'Mayores o penetrantes' } ] },
  { key: 'skeletal', title: 'Lesión esquelética', options: [
    { v: 2, label: 'Ninguna' }, { v: 1, label: 'Fractura cerrada' }, { v: -1, label: 'Abierta o múltiples' } ] },
];

export const EMPTY = Object.fromEntries(SECTIONS.map((s) => [s.key, null]));
export const isComplete = (a) => Object.values(a).every((v) => v !== null);
export const score = (a) => Object.values(a).reduce((t, v) => t + (v ?? 0), 0);

// Umbral de derivación a centro de trauma pediátrico: ≤ 8.
export function interpret(total) {
  if (total <= 8) return { color: 'bg-red-600', text: 'Trauma potencialmente grave (ITP ≤ 8): derivar a centro de trauma pediátrico. Cuanto menor la puntuación, mayor la mortalidad.' };
  return { color: 'bg-green-600', text: 'Riesgo bajo de morbimortalidad (ITP 9-12). Mantén la reevaluación: un valor alto no excluye lesiones ocultas.' };
}
