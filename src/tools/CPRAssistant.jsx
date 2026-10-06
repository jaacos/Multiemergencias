import React, { useEffect, useRef, useState } from 'react';
import { usePersisted } from '../hooks/usePersisted.js';
import { useNow } from '../hooks/useNow.js';
import { Segmented, InfoBox, Caveat } from '../components/ui.jsx';
import * as C from './cprLogic.js';

export const CPR_KEY = 'cpr-session';

function useWakeLock(on) {
  useEffect(() => {
    if (!on || !('wakeLock' in navigator)) return undefined;
    let lock = null, cancelled = false;
    const get = async () => {
      try { lock = await navigator.wakeLock.request('screen'); if (cancelled) lock.release(); } catch { /* denegado o no soportado */ }
    };
    const onVis = () => { if (document.visibilityState === 'visible') get(); };
    get();
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelled = true; document.removeEventListener('visibilitychange', onVis); lock?.release?.().catch(() => {}); };
  }, [on]);
}

export default function CPRAssistant() {
  const [s, setS] = usePersisted(CPR_KEY, C.INIT);
  const [sound, setSound] = useState(false); // requiere gesto del usuario para activar el audio
  const [confirmReset, setConfirmReset] = useState(false);
  const audio = useRef(null);
  const lastBeat = useRef(null);

  const live = C.active(s);
  const now = useNow(s.phase === 'compress' ? 60 : live ? 250 : null);
  const act = (fn, ...a) => setS((st) => fn(st, Date.now(), ...a));
  useWakeLock(live);

  // Fin de ciclo (se re-valida dentro del updater para no aplicarlo dos veces)
  useEffect(() => { if (s.phase === 'compress' && now >= s.cycleEnd) act(C.enterCheck); });

  const met = s.phase === 'compress' ? C.metronome(s, now) : null;

  // Sonido del metrónomo (WebAudio). Nota: en iOS el interruptor de silencio lo mute.
  useEffect(() => {
    if (!sound || !met || met.beat === null || met.beat === lastBeat.current) return;
    lastBeat.current = met.beat;
    try {
      const ctx = audio.current;
      if (!ctx) return;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = met.count === 1 ? 1000 : 800;
      g.gain.setValueAtTime(0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      o.connect(g).connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + 0.09);
    } catch { /* sin audio */ }
    if (met.count === 1 || s.mode !== '30:2') navigator.vibrate?.(30);
  });

  const toggleSound = () => {
    if (!sound) {
      try { audio.current = audio.current || new (window.AudioContext || window.webkitAudioContext)(); audio.current.resume(); } catch { /* */ }
    }
    setSound(!sound);
  };

  const total = s.t0 ? (s.endedAt || now) - s.t0 : 0;
  const hints = C.hints(s, now);
  const flash = met && met.beat !== null && met.beat % 2 === 0;

  let panel = 'bg-slate-800';
  if (s.phase === 'compress') panel = met?.vent ? 'bg-blue-700' : flash ? 'bg-red-500' : 'bg-red-700';
  if (s.phase === 'check') panel = now - s.phaseStart > C.CHECK_TARGET_S * 1000 ? 'bg-red-700 animate-pulse' : 'bg-yellow-500';
  if (s.phase === 'paused') panel = 'bg-slate-600';
  if (s.phase === 'ended') panel = 'bg-green-700';

  const big = 'w-full rounded-2xl font-black text-white shadow-md';

  return (
    <div className="space-y-4">
      <Segmented
        value={s.mode}
        onChange={(m) => act(C.setMode, m)}
        options={[{ value: '30:2', label: '30:2 (sin vía aérea avanzada)' }, { value: 'continua', label: 'Continua (vía aérea avanzada)' }]}
      />

      <div className={`p-6 rounded-3xl text-center shadow-xl transition-colors duration-100 ${panel}`} role="timer" aria-live="off">
        <div className="flex justify-between items-center text-white/90 font-bold mb-2 text-sm">
          <div>Total {C.fmtMMSS(total)}</div>
          <div>Ciclos {s.cycles}</div>
          <div>⚡ {s.shocks}</div>
        </div>

        {s.phase === 'idle' && <div className="text-white text-3xl font-black py-8">Listo para iniciar</div>}

        {s.phase === 'compress' && (
          <>
            <div className="text-white font-black tabular-nums text-7xl tracking-tighter">{C.fmtMMSS(s.cycleEnd - now + 999)}</div>
            <div className="text-white font-bold uppercase mt-2 text-lg">
              {met.vent ? 'VENTILAR ×2' : s.mode === '30:2' ? `Compresión ${met.count} / 30` : 'Compresiones continuas · 10 vent/min'}
            </div>
          </>
        )}

        {s.phase === 'check' && (
          <div className="py-2">
            <div className="text-3xl font-black text-yellow-950 mb-1">¡COMPROBAR RITMO!</div>
            <div className="text-xl font-bold text-yellow-950 tabular-nums">Pausa {Math.floor((now - s.phaseStart) / 1000)} s (objetivo ≤ {C.CHECK_TARGET_S} s)</div>
          </div>
        )}

        {s.phase === 'paused' && <div className="text-white text-3xl font-black py-6">EN PAUSA<div className="text-lg font-bold">Quedan {C.fmtMMSS(s.remaining)} de ciclo</div></div>}
        {s.phase === 'ended' && <div className="text-white text-3xl font-black py-6">RCP FINALIZADA<div className="text-lg font-bold">Duración {C.fmtMMSS(total)}</div></div>}
      </div>

      {hints.length > 0 && (
        <div className="space-y-2" role="alert">
          {hints.map((h) => <InfoBox key={h} tone="orange">💊 {h}</InfoBox>)}
        </div>
      )}

      {s.phase === 'idle' && <button type="button" onClick={() => act(C.start)} className={`${big} py-6 text-2xl bg-green-600`}>INICIAR RCP</button>}
      {s.phase === 'ended' && !confirmReset && <button type="button" onClick={() => setConfirmReset(true)} className={`${big} py-5 text-xl bg-slate-600`}>NUEVA RCP / BORRAR REGISTRO</button>}

      {s.phase === 'check' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => act(C.setRhythm, 'VF')} className={`${big} py-4 text-base ${s.rhythm === 'VF' ? 'bg-yellow-600 ring-4 ring-white' : 'bg-yellow-600/80'}`}>Desfibrilable<br /><span className="text-xs font-bold">FV / TV sin pulso</span></button>
            <button type="button" onClick={() => act(C.setRhythm, 'NS')} className={`${big} py-4 text-base ${s.rhythm === 'NS' ? 'bg-slate-600 ring-4 ring-white' : 'bg-slate-500'}`}>No desfibrilable<br /><span className="text-xs font-bold">Asistolia / AESP</span></button>
          </div>
          <button type="button" onClick={() => act(C.resume)} className={`${big} py-5 text-xl bg-green-600`}>REANUDAR RCP</button>
        </>
      )}
      {s.phase === 'paused' && <button type="button" onClick={() => act(C.resume)} className={`${big} py-5 text-xl bg-green-600`}>REANUDAR</button>}
      {s.phase === 'compress' && <button type="button" onClick={() => act(C.pause)} className={`${big} py-4 text-lg bg-slate-500`}>PAUSAR</button>}

      {live && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => act(C.shock)} className={`${big} py-5 text-xl bg-yellow-500 text-yellow-950`}>⚡ DESCARGA</button>
            <button type="button" onClick={() => act(C.adrenaline)} className={`${big} py-5 text-xl bg-purple-600`}>ADRENALINA<br /><span className="text-sm">{s.adr > 0 ? `${s.adr} dada(s)` : '1 mg'}</span></button>
            <button type="button" onClick={() => act(C.amiodarone)} className="py-4 border-2 border-purple-600 text-purple-700 dark:text-purple-300 rounded-2xl font-bold text-lg active:bg-purple-100 dark:active:bg-purple-900">Amiodarona<br /><span className="text-sm">{s.amio === 0 ? '300 mg' : s.amio === 1 ? '150 mg' : `${s.amio} dosis`}</span></button>
            <button type="button" onClick={toggleSound} aria-pressed={sound} className={`py-4 border-2 rounded-2xl font-bold text-lg ${sound ? 'border-blue-500 bg-blue-100 text-blue-900' : 'border-slate-400 text-slate-600 dark:text-slate-300'}`}>🔊 Metrónomo<br /><span className="text-sm">{sound ? 'Sonido activado' : 'Solo visual'}</span></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => act(C.rosc)} className={`${big} py-4 text-lg bg-green-700`}>ROSC</button>
            <button type="button" onClick={() => act(C.end)} className={`${big} py-4 text-lg bg-slate-700`}>FINALIZAR</button>
          </div>
        </>
      )}

      {confirmReset && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-300 space-y-3">
          <div className="font-bold text-red-800 dark:text-red-200">¿Borrar el registro? Esta acción no se puede deshacer.</div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { setConfirmReset(false); setS(C.INIT); }} className="py-3 rounded-xl bg-red-600 text-white font-bold">Borrar</button>
            <button type="button" onClick={() => setConfirmReset(false)} className="py-3 rounded-xl bg-slate-200 dark:bg-slate-700 dark:text-white font-bold">Cancelar</button>
          </div>
        </div>
      )}

      {s.logs.length > 0 && (
        <div className="mt-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 border border-slate-200 dark:border-slate-700">
          <h4 className="font-bold text-slate-500 dark:text-slate-400 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">Registro (se conserva si sales de la pantalla)</h4>
          <ul className="space-y-2 max-h-72 overflow-y-auto">
            {s.logs.map((l, i) => (
              <li key={i} className="flex gap-3 text-sm font-medium dark:text-slate-200">
                <span className="text-blue-600 dark:text-blue-400 w-24 shrink-0 tabular-nums">{l.clock}<br /><span className="text-xs text-slate-400">+{l.at}</span></span>
                <span>{l.event}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Caveat>
        Apoyo a la RCP según ERC (compresiones 100-120/min, ciclos de 2 min, análisis de ritmo ≤ 10 s). No sustituye a tu protocolo ni al juicio clínico.
        El sonido depende del dispositivo (en iPhone se silencia con el interruptor de silencio y no hay vibración); el aviso visual siempre funciona.
      </Caveat>
    </div>
  );
}
