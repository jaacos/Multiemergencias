import React, { useEffect, useState } from 'react';
import { IconChevronLeft, IconMoon, IconSun } from './components/ui.jsx';
import PwaStatus, { OfflineBadge } from './components/PwaStatus.jsx';
import { structure } from './tools/index.js';
import { usePersisted } from './hooks/usePersisted.js';
import { CPR_KEY } from './tools/CPRAssistant.jsx';
import { INIT as CPR_INIT, active as cprActive } from './tools/cprLogic.js';

// Ruta por hash (#/categoría/herramienta): funciona offline sin servidor y el botón
// «atrás» del móvil navega por la app en vez de cerrarla.
const parseHash = () => {
  const [cat, tool] = window.location.hash.replace(/^#\/?/, '').split('/');
  const c = structure.find((x) => x.id === cat);
  const t = c?.tools.find((x) => x.id === tool);
  return { cat: c?.id ?? null, tool: t?.id ?? null };
};
const go = (path) => { window.location.hash = path; };

function useDark() {
  const [dark, setDark] = useState(() => {
    try { const v = localStorage.getItem('theme'); if (v) return v === 'dark'; } catch { /* */ }
    return true; // oscuro por defecto en operativa
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0f172a' : '#ffffff');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch { /* */ }
  }, [dark]);
  return [dark, setDark];
}

export default function App() {
  const [dark, setDark] = useDark();
  const [route, setRoute] = useState(parseHash);
  const [cpr] = usePersisted(CPR_KEY, CPR_INIT);

  useEffect(() => {
    const on = () => setRoute(parseHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [route.cat, route.tool]);

  const cat = structure.find((c) => c.id === route.cat);
  const tool = cat?.tools.find((t) => t.id === route.tool);
  const title = tool?.title ?? cat?.title ?? 'Emergencias Pro';
  const back = () => (route.tool ? go(`/${route.cat}`) : go('/'));

  let content;
  if (tool) {
    const Active = tool.comp;
    content = <div className="animate-fade-in-up"><Active /></div>;
  } else if (cat) {
    content = (
      <div className="animate-fade-in grid grid-cols-1 gap-4">
        {cat.tools.map((t) => (
          <button key={t.id} type="button" onClick={() => go(`/${cat.id}/${t.id}`)} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-left font-black text-xl text-slate-800 dark:text-white active:scale-95 transition-transform">
            {t.title}
          </button>
        ))}
      </div>
    );
  } else {
    content = (
      <>
        <PwaStatus />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {structure.map((c) => {
            const Icon = c.icon;
            return (
              <button key={c.id} type="button" onClick={() => go(`/${c.id}`)} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center active:scale-95 transition-transform min-h-[140px]">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${c.color}`}><Icon /></div>
                <h2 className="font-black text-lg text-slate-800 dark:text-white">{c.title}</h2>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-8 text-center">
          Herramienta de apoyo, no sustituye al juicio clínico ni a los protocolos de tu servicio. Revisar las dosis y los datos antes de actuar.
          No se almacenan datos identificativos de pacientes.
        </p>
      </>
    );
  }

  const cprRunning = cprActive(cpr) && route.tool !== 'cpr';

  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 pt-[env(safe-area-inset-top)]">
        <div className="max-w-xl mx-auto flex items-center gap-2 p-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
          {(cat || tool) && (
            <button type="button" aria-label="Volver" onClick={back} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:bg-slate-200 dark:active:bg-slate-700"><IconChevronLeft /></button>
          )}
          <h1 className="text-lg leading-tight font-black flex-1 min-w-0 line-clamp-2">{title}</h1>
          <OfflineBadge />
          <button type="button" aria-label={dark ? 'Modo claro' : 'Modo oscuro'} onClick={() => setDark(!dark)} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {dark ? <IconSun /> : <IconMoon />}
          </button>
        </div>
        {cprRunning && (
          <button type="button" onClick={() => go('/ops/cpr')} className="w-full bg-red-600 text-white font-black py-3 animate-pulse">● RCP EN CURSO · volver al asistente</button>
        )}
      </header>

      <main className="max-w-xl mx-auto p-4 mt-2 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">{content}</main>
    </div>
  );
}
