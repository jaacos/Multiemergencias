import test from 'node:test';
import assert from 'node:assert/strict';
import * as V from '../src/tools/ventLogic.js';

test('peso ideal (Devine): hombre 175 cm ≈ 70 kg, mujer 165 cm ≈ 57 kg', () => {
  assert.equal(V.ibw(175, true), 71);
  assert.equal(V.ibw(165, false), 57);
});
test('peso ideal con mínimo de 30 kg', () => assert.equal(V.ibw(120, false), 30));
test('volumen corriente objetivo 6-8 ml/kg', () => assert.deepEqual(V.vtRange(70, 6, 8), [420, 560]));
test('BiPAP inicial: IPAP 15, o 20 si pH < 7,25', () => {
  assert.equal(V.bipapStart(7.30).ipap, 15);
  assert.equal(V.bipapStart(7.24).ipap, 20);
});
test('BiPAP: presión de soporte y alertas', () => {
  assert.equal(V.bipapCheck(15, 4).ps, 11);
  assert.equal(V.bipapCheck(15, 4).flags.length, 0);
  assert.match(V.bipapCheck(8, 5).flags[0].text, /insuficiente/i);
  assert.match(V.bipapCheck(4, 5).flags[0].text, /mayor que EPAP/);
  assert.ok(V.bipapCheck(32, 4).flags.some((f) => /IPAP > 30/.test(f.text)));
  assert.ok(V.bipapCheck(20, 9).flags.some((f) => /EPAP > 8/.test(f.text)));
});
test('CPAP: rangos 5-10 y máximo 15', () => {
  assert.equal(V.cpapCheck(5).tone, 'ok');
  assert.equal(V.cpapCheck(10).tone, 'ok');
  assert.equal(V.cpapCheck(12).tone, 'warn');
  assert.equal(V.cpapCheck(15).tone, 'bad');
  assert.equal(V.cpapCheck(4).tone, 'warn');
});
