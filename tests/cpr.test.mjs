import test from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../src/tools/cprLogic.js';

const T0 = 1_000_000;
const begin = () => C.start(C.INIT, T0);

test('inicio: fase compresión, ciclo de 2 min', () => {
  const s = begin();
  assert.equal(s.phase, 'compress');
  assert.equal(s.cycleEnd, T0 + C.CYCLE_MS);
  assert.equal(s.logs.length, 1);
});

test('fin de ciclo solo al cumplirse los 2 min y no se aplica dos veces', () => {
  const s = begin();
  assert.equal(C.enterCheck(s, T0 + 119_999), s);
  const c = C.enterCheck(s, T0 + C.CYCLE_MS);
  assert.equal(c.phase, 'check');
  assert.equal(c.cycles, 1);
  assert.equal(C.enterCheck(c, T0 + C.CYCLE_MS + 5000), c);
});

test('descarga reinicia el ciclo y reanuda compresiones', () => {
  let s = C.enterCheck(begin(), T0 + C.CYCLE_MS);
  s = C.shock(s, T0 + C.CYCLE_MS + 6000);
  assert.equal(s.phase, 'compress');
  assert.equal(s.shocks, 1);
  assert.equal(s.cycleEnd, T0 + C.CYCLE_MS + 6000 + C.CYCLE_MS);
});

test('pausa manual conserva el tiempo restante', () => {
  let s = C.pause(begin(), T0 + 30_000);
  assert.equal(s.phase, 'paused');
  assert.equal(s.remaining, 90_000);
  s = C.resume(s, T0 + 50_000);
  assert.equal(s.cycleEnd, T0 + 50_000 + 90_000);
});

test('recordatorios ERC: ritmo no desfibrilable → adrenalina ya', () => {
  const s = C.setRhythm(begin(), T0 + 1000, 'NS');
  assert.ok(C.hints(s, T0 + 2000).some((h) => /adrenalina/i.test(h)));
});

test('recordatorios ERC: FV tras 3.ª descarga → adrenalina y amiodarona 300; tras 5.ª → 150', () => {
  let s = begin();
  for (let i = 1; i <= 3; i++) s = C.shock(s, T0 + i * 1000);
  const h3 = C.hints(s, T0 + 4000).join(' | ');
  assert.match(h3, /adrenalina/i);
  assert.match(h3, /300 mg/);
  s = C.amiodarone(C.adrenaline(s, T0 + 4000), T0 + 4000);
  for (let i = 4; i <= 5; i++) s = C.shock(s, T0 + 5000 + i * 1000);
  assert.match(C.hints(s, T0 + 12_000).join(' | '), /150 mg/);
});

test('adrenalina repetida: aviso a los 3 min', () => {
  const s = C.adrenaline(begin(), T0);
  assert.equal(C.hints(s, T0 + C.ADR_REMINDER_MS - 1).filter((h) => /Última adrenalina/.test(h)).length, 0);
  assert.equal(C.hints(s, T0 + C.ADR_REMINDER_MS).filter((h) => /Última adrenalina/.test(h)).length, 1);
});

test('metrónomo 30:2: 30 compresiones, luego ventana de ventilación de 5 s', () => {
  const s = begin();
  assert.deepEqual(C.metronome(s, T0), { beat: 0, count: 1, vent: false });
  assert.equal(C.metronome(s, T0 + 29 * C.BEAT_MS + 10).count, 30);
  assert.equal(C.metronome(s, T0 + 30 * C.BEAT_MS + 100).vent, true);
  assert.equal(C.metronome(s, T0 + 30 * C.BEAT_MS + C.VENT_MS + 10).count, 1);
});

test('ROSC finaliza la sesión y bloquea acciones posteriores', () => {
  const s = C.rosc(begin(), T0 + 60_000);
  assert.equal(s.phase, 'ended');
  assert.equal(C.shock(s, T0 + 61_000), s);
});
