// Lógica pura del asistente de RCP. Todo se deriva de marcas de tiempo (epoch ms),
// así que el estado puede persistirse y restaurarse sin perder precisión.
export const CYCLE_MS = 120000;       // ciclo de 2 min
export const BEAT_MS = 545;           // ~110 compresiones/min (rango ERC 100-120)
export const VENT_MS = 5000;          // ventana de 2 ventilaciones en 30:2
export const CHECK_TARGET_S = 10;     // pausa máxima recomendada para analizar ritmo
export const ADR_REMINDER_MS = 180000; // adrenalina cada 3-5 min

export const INIT = {
  phase: 'idle', // idle | compress | check | paused | ended
  mode: '30:2',
  t0: null, endedAt: null,
  phaseStart: null, cycleEnd: null, remaining: null, compStart: null,
  cycles: 0, shocks: 0, adr: 0, amio: 0, lastAdr: null,
  rhythm: null, // 'VF' | 'NS'
  logs: [],
};

const fmtClock = (t) => new Date(t).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
export const fmtMMSS = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const log = (s, now, event) => ({
  ...s,
  logs: [{ clock: fmtClock(now), at: s.t0 ? fmtMMSS(now - s.t0) : '0:00', event }, ...s.logs],
});

export const active = (s) => s.phase === 'compress' || s.phase === 'check' || s.phase === 'paused';

export function start(s, now) {
  return log({ ...INIT, mode: s.mode, t0: now, phase: 'compress', phaseStart: now, cycleEnd: now + CYCLE_MS, compStart: now }, now, `INICIO RCP (${s.mode === '30:2' ? '30:2' : 'continua'})`);
}

export function enterCheck(s, now) {
  if (s.phase !== 'compress' || now < s.cycleEnd) return s;
  return log({ ...s, phase: 'check', phaseStart: now, cycles: s.cycles + 1 }, now, `Fin ciclo ${s.cycles + 1}: COMPROBAR RITMO`);
}

export function resume(s, now) {
  if (s.phase !== 'check' && s.phase !== 'paused') return s;
  const cycleEnd = s.phase === 'paused' && s.remaining ? now + s.remaining : now + CYCLE_MS;
  return log({ ...s, phase: 'compress', phaseStart: now, cycleEnd, remaining: null, compStart: now }, now, 'Se reanudan compresiones');
}

export function pause(s, now) {
  if (s.phase !== 'compress') return s;
  return log({ ...s, phase: 'paused', phaseStart: now, remaining: Math.max(0, s.cycleEnd - now) }, now, 'Pausa manual');
}

export function setMode(s, now, mode) {
  return { ...s, mode, compStart: s.phase === 'compress' ? now : s.compStart };
}

export function setRhythm(s, now, rhythm) {
  return log({ ...s, rhythm }, now, rhythm === 'VF' ? 'Ritmo DESFIBRILABLE (FV/TVSP)' : 'Ritmo NO desfibrilable (asistolia/AESP)');
}

export function shock(s, now) {
  if (!active(s)) return s;
  const n = s.shocks + 1;
  // Tras la descarga se reanudan compresiones de inmediato y se reinicia el ciclo de 2 min
  const next = log({ ...s, shocks: n, rhythm: 'VF', phase: 'compress', phaseStart: now, cycleEnd: now + CYCLE_MS, remaining: null, compStart: now }, now, `⚡ DESCARGA nº ${n}`);
  return next;
}

export function adrenaline(s, now) {
  if (!active(s)) return s;
  return log({ ...s, adr: s.adr + 1, lastAdr: now }, now, `Adrenalina 1 mg (nº ${s.adr + 1})`);
}

export function amiodarone(s, now) {
  if (!active(s)) return s;
  const dose = s.amio === 0 ? '300 mg' : s.amio === 1 ? '150 mg' : 'dosis adicional';
  return log({ ...s, amio: s.amio + 1 }, now, `Amiodarona ${dose}`);
}

export function rosc(s, now) {
  if (!active(s)) return s;
  return log({ ...s, phase: 'ended', endedAt: now }, now, 'ROSC: recuperación de circulación espontánea');
}

export function end(s, now) {
  if (!active(s)) return s;
  return log({ ...s, phase: 'ended', endedAt: now }, now, 'Fin de la RCP');
}

// Metrónomo: id de latido (para parpadeo / sonido), contador 1-30 y ventana de ventilación.
export function metronome(s, now) {
  const e = Math.max(0, now - s.compStart);
  if (s.mode !== '30:2') return { beat: Math.floor(e / BEAT_MS), count: null, vent: false };
  const period = 30 * BEAT_MS + VENT_MS;
  const k = Math.floor(e / period);
  const p = e - k * period;
  if (p < 30 * BEAT_MS) return { beat: k * 30 + Math.floor(p / BEAT_MS), count: Math.floor(p / BEAT_MS) + 1, vent: false };
  return { beat: null, count: null, vent: true };
}

// Recordatorios de fármacos según ERC (ALS adulto)
export function hints(s, now) {
  const h = [];
  if (!active(s)) return h;
  if (s.rhythm === 'NS' && s.adr === 0) h.push('Ritmo no desfibrilable: adrenalina 1 mg lo antes posible.');
  if (s.rhythm === 'VF' && s.shocks >= 3 && s.adr === 0) h.push('Tras la 3.ª descarga: adrenalina 1 mg.');
  if (s.rhythm === 'VF' && s.shocks >= 3 && s.amio === 0) h.push('Tras la 3.ª descarga: amiodarona 300 mg.');
  if (s.rhythm === 'VF' && s.shocks >= 5 && s.amio === 1) h.push('Tras la 5.ª descarga: amiodarona 150 mg.');
  if (s.adr > 0 && now - s.lastAdr >= ADR_REMINDER_MS) h.push(`Última adrenalina hace ${fmtMMSS(now - s.lastAdr)}: repetir cada 3-5 min.`);
  return h;
}
