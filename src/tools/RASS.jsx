import React from 'react';
import { usePersisted } from '../hooks/usePersisted.js';

const ITEMS = [
  ['+4', 'Combativo', 'Violento, peligro inmediato para el equipo.'],
  ['+3', 'Muy agitado', 'Se retira tubos o catéteres; agresivo.'],
  ['+2', 'Agitado', 'Movimientos frecuentes sin propósito; lucha con el ventilador.'],
  ['+1', 'Inquieto', 'Ansioso, movimientos no agresivos ni vigorosos.'],
  ['0', 'Alerta y tranquilo', ''],
  ['−1', 'Somnoliento', 'Despierta a la voz, contacto visual > 10 s.'],
  ['−2', 'Sedación ligera', 'Despierta a la voz, contacto visual < 10 s.'],
  ['−3', 'Sedación moderada', 'Movimiento o apertura ocular a la voz, sin contacto visual.'],
  ['−4', 'Sedación profunda', 'Sin respuesta a la voz; movimiento o apertura ocular al estímulo físico.'],
  ['−5', 'Sin respuesta', 'Sin respuesta a la voz ni al estímulo físico.'],
];

export default function RASS() {
  const [selected, setSelected] = usePersisted('rass-selected', null);
  return (
    <div className="space-y-2">
      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-300 font-bold mb-4">Toca el nivel observado. Reevalúa tras cada cambio de sedación.</div>
      {ITEMS.map(([v, t, d]) => {
        const on = selected === v;
        const color = v.startsWith('+') ? 'text-orange-500' : v === '0' ? 'text-green-500' : 'text-blue-500';
        return (
          <button
            key={v}
            type="button"
            aria-pressed={on}
            onClick={() => setSelected(on ? null : v)}
            className={`w-full text-left p-4 rounded-xl border-2 flex items-center gap-4 ${on ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 shadow-md' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
          >
            <div className={`font-black text-2xl w-12 text-center ${color}`}>{v}</div>
            <div>
              <div className="font-bold text-slate-800 dark:text-white">{t}</div>
              {d && <div className="text-xs text-slate-500 dark:text-slate-400">{d}</div>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
