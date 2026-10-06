import React, { useState } from 'react';
import { HAZMAT, GRE_GUIDES } from '../data/hazmat.js';

const BY_UN = Object.fromEntries(HAZMAT.map((h) => [h[0], h]));

export default function Hazmat() {
  const [code, setCode] = useState('');
  const add = (n) => setCode((c) => (c.length < 4 ? c + n : c));
  const found = code.length === 4 ? BY_UN[code] : null;
  const guide = found ? GRE_GUIDES[found[3]] : null;
  const key = 'py-5 text-2xl font-black rounded-xl dark:text-white';

  return (
    <div className="space-y-6">
      <div className="bg-orange-100 dark:bg-orange-900/40 p-6 rounded-2xl border-2 border-orange-500 text-center">
        <div className="text-sm font-black uppercase text-orange-800 dark:text-orange-400 mb-2">Panel naranja · nº ONU (parte inferior, 4 cifras)</div>
        <div className="text-5xl font-black tracking-widest text-slate-900 dark:text-white h-12" aria-live="polite">{code.padEnd(4, '_')}</div>
      </div>

      {code.length === 4 && (
        <div className="p-4 bg-slate-800 text-white rounded-xl animate-fade-in shadow-lg">
          {found ? (
            <div className="space-y-2">
              <div className="text-green-400 text-sm font-bold uppercase tracking-wide">Sustancia identificada · UN {found[0]}</div>
              <div className="text-xl font-black">{found[1]}</div>
              <div className="text-sm">Clase de peligro: <strong>{found[2]}</strong> · Guía GRE <strong>{found[3]}</strong> ({guide.name})</div>
              <div className="text-sm">{found[4]}</div>
              <div className="bg-white/10 rounded-lg p-3 text-sm font-bold">Aislamiento inicial orientativo: {guide.isolate} en todas direcciones</div>
            </div>
          ) : (
            <div>
              <div className="text-yellow-400 mb-1 text-sm font-bold uppercase tracking-wide">UN {code}: no está en la lista offline</div>
              <span className="text-slate-300 block mb-2 mt-2 font-bold">Actuación genérica de primera respuesta:</span>
              <ul className="list-disc pl-5 font-normal text-sm space-y-1">
                <li>Aislar el área de inmediato (mínimo 100 m si se desconoce la sustancia).</li>
                <li>Aproximarse a favor del viento, en zona alta y desde lejos.</li>
                <li>Evitar contacto con producto, humo o vapores; no tocar derrames.</li>
                <li>No usar agua sobre el material sin consultar.</li>
                <li>Consultar la GRE completa o el centro coordinador / toxicológico.</li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} type="button" onClick={() => add(String(n))} className={`${key} bg-slate-200 dark:bg-slate-700 active:bg-slate-300`}>{n}</button>
        ))}
        <button type="button" onClick={() => setCode('')} className={`${key} bg-red-100 dark:bg-red-900/50 !text-red-600`}>CLR</button>
        <button type="button" onClick={() => add('0')} className={`${key} bg-slate-200 dark:bg-slate-700`}>0</button>
        <button type="button" onClick={() => setCode((c) => c.slice(0, -1))} className={`${key} bg-slate-300 dark:bg-slate-600 !text-xl`}>DEL</button>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Lista reducida ({HAZMAT.length} sustancias) y distancias orientativas. No sustituye a la GRE completa ni a la ficha de seguridad; los gases tóxicos por inhalación (TIH) exigen distancias mayores.
      </p>
    </div>
  );
}
