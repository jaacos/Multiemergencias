import test from 'node:test';
import assert from 'node:assert/strict';
import { SECTIONS, EMPTY, score, isComplete, interpret } from '../src/tools/itpLogic.js';

const all = (v) => Object.fromEntries(SECTIONS.map((s) => [s.key, v]));

test('ITP: seis parámetros con +2, +1 y −1', () => {
  assert.equal(SECTIONS.length, 6);
  for (const s of SECTIONS) assert.deepEqual(s.options.map((o) => o.v), [2, 1, -1]);
});
test('ITP: rango −6 a +12', () => {
  assert.equal(score(all(2)), 12);
  assert.equal(score(all(-1)), -6);
});
test('ITP: completo solo con los 6 parámetros', () => {
  assert.equal(isComplete(EMPTY), false);
  assert.equal(isComplete(all(2)), true);
  assert.equal(isComplete({ ...all(2), cns: null }), false);
});
test('ITP: umbral de derivación ≤ 8', () => {
  assert.equal(interpret(8).color, 'bg-red-600');
  assert.equal(interpret(9).color, 'bg-green-600');
  assert.equal(interpret(-3).color, 'bg-red-600');
});
test('ITP: caso clínico (niño 15 kg, vía aérea normal, TAS 70, obnubilado, herida menor, fractura cerrada) = 1+2+1+1+1+1 = 7', () => {
  assert.equal(score({ size: 1, airway: 2, sbp: 1, cns: 1, wound: 1, skeletal: 1 }), 7);
});
