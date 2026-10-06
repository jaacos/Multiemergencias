// Lógica pura de interpretación ácido-base (sin React) para poder probarla.
// Rangos de referencia. Arterial: pH 7,35-7,45 · pCO₂ 35-45 · HCO₃⁻ 22-26 · PaO₂ 80-100 · SaO₂ ≥ 95.
// Venosa: pH 7,32-7,42 · pCO₂ 40-50 · HCO₃⁻ 22-29. Lactato ≤ 2 mmol/L. Anion gap 8-12 mEq/L (según analizador).
export const REF = {
  arterial: { ph: [7.35, 7.45], pco2: [35, 45], hco3: [22, 26] },
  venosa: { ph: [7.32, 7.42], pco2: [40, 50], hco3: [22, 29] },
};
export const where = (v, [lo, hi]) => (v < lo ? 'low' : v > hi ? 'high' : 'ok');
export const f1 = (n) => n.toFixed(1);

export function interpret(type, ph, pco2, hco3) {
  const r = REF[type];
  const arterial = type === 'arterial';
  const phS = where(ph, r.ph), cS = where(pco2, r.pco2), hS = where(hco3, r.hco3);
  const steps = [`pH ${ph.toFixed(2)}: ${phS === 'low' ? 'acidemia' : phS === 'high' ? 'alcalemia' : 'dentro de rango'}.`];

  if (phS === 'ok' && cS === 'ok' && hS === 'ok') {
    return { headline: 'Equilibrio ácido-base normal', detail: 'pH, pCO₂ y HCO₃⁻ dentro de rango.', tone: 'bg-green-600', steps };
  }

  // Dirección del proceso primario: la que marca el pH (o su lado de 7,40 si está en rango)
  const acid = phS === 'low' ? true : phS === 'high' ? false : ph < 7.4;
  const resp = acid ? cS === 'high' : cS === 'low';
  const met = acid ? hS === 'low' : hS === 'high';
  const word = acid ? 'Acidosis' : 'Alcalosis';
  const severe = ph < 7.2 || ph > 7.6;
  const tone = severe ? 'bg-red-600' : phS === 'ok' ? 'bg-yellow-500' : 'bg-orange-500';

  if (resp && met) {
    steps.push(`pCO₂ y HCO₃⁻ se desvían ambos en sentido ${acid ? 'ácido' : 'alcalino'}: no se compensan, se suman.`);
    return { headline: `${word} mixta`, detail: `Componente respiratorio y metabólico a la vez${severe ? ' · pH potencialmente peligroso' : ''}.`, tone, steps };
  }

  if (!resp && !met) {
    steps.push('pCO₂ / HCO₃⁻ no explican el sentido del pH.');
    return {
      headline: phS === 'ok' ? 'pH normal con pCO₂/HCO₃⁻ alterados' : `${acid ? 'Acidemia' : 'Alcalemia'} sin causa clara`,
      detail: phS === 'ok' ? 'Trastorno compensado o mixto de efectos opuestos. Valora clínica, anion gap y lactato.' : 'pH alterado con pCO₂ y HCO₃⁻ en rango: revisa la muestra (burbujas, demora, anticoagulante).',
      tone: 'bg-yellow-500', steps,
    };
  }

  if (resp) {
    steps.push(`pCO₂ ${pco2} mmHg ${acid ? '↑ (hipercapnia)' : '↓ (hipocapnia)'} → proceso respiratorio ${acid ? 'ácido' : 'alcalino'}.`);
    if (!arterial) return { headline: `${word} respiratoria`, detail: 'En sangre venosa la compensación no se calcula (pCO₂ venosa ≈ arterial + 3-6 mmHg, con acuerdo individual pobre). Confirma con gasometría arterial si es decisivo.', tone, steps };
    let detail;
    if (acid) {
      const d = (pco2 - 40) / 10;
      const acute = 24 + 2 * d, chronic = 24 + 3 * d;
      steps.push(`HCO₃⁻ esperado: agudo ≈ ${f1(24 + d)}-${f1(acute)} · crónico ≈ ${f1(chronic)}-${f1(24 + 4 * d)} mEq/L (↑ 1-2 / 3-4 por cada 10 mmHg de pCO₂).`);
      if (hco3 <= acute + 1) detail = 'Aguda: la compensación renal aún no ha actuado.';
      else if (hco3 > 24 + 4 * d + 2) detail = 'Crónica con alcalosis metabólica añadida (HCO₃⁻ superior al esperado).';
      else if (hco3 >= chronic - 1) detail = 'Crónica o compensada (retención de HCO₃⁻).';
      else detail = 'Subaguda, o aguda sobre crónica (compensación parcial).';
    } else {
      const d = (40 - pco2) / 10;
      const acute = 24 - 2 * d, chronic = 24 - 4 * d;
      steps.push(`HCO₃⁻ esperado: agudo ≈ ${f1(acute)} · crónico ≈ ${f1(24 - 5 * d)}-${f1(chronic)} mEq/L (↓ 2 / 4-5 por cada 10 mmHg de pCO₂).`);
      if (hco3 < 24 - 5 * d - 2) detail = 'Con acidosis metabólica añadida (HCO₃⁻ inferior al esperado).';
      else if (hco3 >= acute - 1) detail = 'Aguda: la compensación renal aún no ha actuado. Descartar dolor, ansiedad, hipoxemia, sepsis.';
      else if (hco3 <= chronic + 1) detail = 'Crónica o compensada.';
      else detail = 'Subaguda (compensación parcial).';
    }
    return { headline: `${word} respiratoria`, detail, tone, steps };
  }

  // Metabólico
  steps.push(`HCO₃⁻ ${hco3} mEq/L ${acid ? '↓' : '↑'} → proceso metabólico ${acid ? 'ácido' : 'alcalino'}.`);
  if (!arterial) return { headline: `${word} metabólica`, detail: 'Con sangre venosa pH y HCO₃⁻ son fiables si no hay shock. La compensación respiratoria requiere pCO₂ arterial.', tone, steps };
  let detail;
  if (acid) {
    const exp = 1.5 * hco3 + 8;
    steps.push(`Fórmula de Winter: pCO₂ esperada = 1,5 × ${hco3} + 8 = ${f1(exp)} ± 2 mmHg.`);
    if (pco2 > exp + 2) detail = `pCO₂ ${pco2} por encima de lo esperado: acidosis respiratoria añadida (fatiga o hipoventilación).`;
    else if (pco2 < exp - 2) detail = `pCO₂ ${pco2} por debajo de lo esperado: alcalosis respiratoria añadida.`;
    else detail = 'Compensación respiratoria adecuada.';
  } else {
    const exp = 40 + 0.7 * (hco3 - 24);
    steps.push(`pCO₂ esperada ≈ 40 + 0,7 × (${hco3} − 24) = ${f1(exp)} ± 3 mmHg.`);
    if (pco2 > exp + 3) detail = 'pCO₂ superior a lo esperado: acidosis respiratoria añadida.';
    else if (pco2 < exp - 3) detail = 'pCO₂ inferior a lo esperado: alcalosis respiratoria añadida.';
    else detail = 'Compensación respiratoria adecuada (hipoventilación).';
  }
  return { headline: `${word} metabólica`, detail, tone, steps };
}

