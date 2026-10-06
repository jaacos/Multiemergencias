import test from 'node:test';
import assert from 'node:assert/strict';
import { interpret } from '../src/tools/gasLogic.js';

// [nombre, tipo, pH, pCO2, HCO3, texto esperado en headline, texto esperado en detail]
const CASES = [
  ['normal', 'arterial', 7.40, 40, 24, 'normal', ''],
  ['cetoacidosis compensada', 'arterial', 7.20, 24, 10, 'Acidosis metabólica', 'adecuada'],
  ['EPOC crónico', 'arterial', 7.34, 70, 36, 'Acidosis respiratoria', 'Crónica'],
  ['acidosis respiratoria aguda', 'arterial', 7.20, 70, 26, 'Acidosis respiratoria', 'Aguda'],
  ['acidosis mixta', 'arterial', 7.10, 60, 14, 'Acidosis mixta', ''],
  ['alcalosis metabólica', 'arterial', 7.52, 48, 38, 'Alcalosis metabólica', 'adecuada'],
  ['alcalosis respiratoria aguda', 'arterial', 7.55, 25, 22, 'Alcalosis respiratoria', 'Aguda'],
  ['acidosis metabólica + respiratoria', 'arterial', 7.15, 40, 12, 'Acidosis metabólica', 'acidosis respiratoria añadida'],
  ['venosa normal', 'venosa', 7.37, 46, 26, 'normal', ''],
  ['pH normal con trastorno', 'arterial', 7.38, 52, 30, 'respiratoria', ''],
];
for (const [name, type, ph, pco2, hco3, head, det] of CASES) {
  test(`gasometría: ${name}`, () => {
    const r = interpret(type, ph, pco2, hco3);
    assert.ok(r.headline.toLowerCase().includes(head.toLowerCase()), `titular «${r.headline}»`);
    assert.ok(r.detail.toLowerCase().includes(det.toLowerCase()), `detalle «${r.detail}»`);
  });
}

test('gasometría venosa no calcula compensación', () => {
  const r = interpret('venosa', 7.20, 24, 10);
  assert.match(r.detail, /venosa/i);
});

test('rangos venosos verificados (pH 7,32-7,42; pCO2 40-50)', () => {
  assert.match(interpret('venosa', 7.32, 40, 24).headline, /normal/i);
  assert.doesNotMatch(interpret('venosa', 7.31, 45, 24).headline, /^Equilibrio/);
});
