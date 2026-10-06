import React, { useEffect, useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconMoon, IconSun, IconHeart, IconUsers, IconBrainSm } from './components/ui.jsx';
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
  const title = tool?.title ?? cat?.title ?? 'Herramienta Multiemergencias';
  const back = () => (route.tool ? go(`/${route.cat}`) : go('/'));

  let content;
  if (tool) {
    const Active = tool.comp;
    content = <div className="animate-fade-in-up"><Active /></div>;
  } else if (cat) {
    const Icon = cat.icon;
    content = (
      <div className="animate-fade-in space-y-3">
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${cat.color}`}><Icon /></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{cat.blurb}</p>
        </div>
        {cat.tools.map((t) => (
          <button key={t.id} type="button" onClick={() => go(`/${cat.id}/${t.id}`)} className="w-full flex items-center gap-4 p-4 rounded-3xl text-left bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 shadow-sm dark:shadow-none active:bg-slate-50 dark:active:bg-slate-700/60">
            <span className={`shrink-0 min-w-[64px] px-2 h-14 rounded-2xl flex items-center justify-center text-[11px] font-black tracking-wider ${cat.color}`}>{t.tag}</span>
            <span className="flex-1 min-w-0">
              <span className="block font-extrabold text-[17px] leading-tight text-slate-900 dark:text-white">{t.title}</span>
              <span className="block text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{t.desc}</span>
            </span>
            <span className="text-slate-400 dark:text-slate-500 shrink-0"><IconChevronRight /></span>
          </button>
        ))}
      </div>
    );
  } else {
    const quick = [
      { to: '/ops/cpr', label: 'RCP', icon: IconHeart, cls: 'from-red-600 to-rose-700 shadow-red-600/30' },
      { to: '/neuro/codo', label: 'Ictus', icon: IconBrainSm, cls: 'from-indigo-500 to-violet-700 shadow-indigo-600/30' },
      { to: '/ops/start', label: 'Triaje', icon: IconUsers, cls: 'from-amber-500 to-orange-600 shadow-amber-600/30' },
    ];
    content = (
      <div className="animate-fade-in">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 mb-3 px-1">Acceso rápido</div>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {quick.map((q) => {
            const QI = q.icon;
            return (
              <button key={q.to} type="button" onClick={() => go(q.to)} className={`h-28 rounded-3xl bg-gradient-to-br ${q.cls} shadow-lg text-white flex flex-col items-center justify-center gap-2 font-black text-lg`}>
                <QI />{q.label}
              </button>
            );
          })}
        </div>
        <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 mb-3 px-1">Herramientas</div>
        <div className="space-y-3">
          {structure.map((c) => {
            const Icon = c.icon;
            return (
              <button key={c.id} type="button" onClick={() => go(`/${c.id}`)} className="w-full flex items-center gap-4 p-4 rounded-3xl text-left bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 shadow-sm dark:shadow-none active:bg-slate-50 dark:active:bg-slate-700/60">
                <span className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${c.color}`}><Icon /></span>
                <span className="flex-1 min-w-0">
                  <span className="block font-extrabold text-lg leading-tight text-slate-900 dark:text-white">{c.title}</span>
                  <span className="block text-sm text-slate-500 dark:text-slate-400 mt-0.5">{c.blurb}</span>
                </span>
                <span className="text-slate-400 dark:text-slate-500 shrink-0"><IconChevronRight /></span>
              </button>
            );
          })}
        </div>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 mt-8 text-center px-2">
          Herramienta de apoyo: no sustituye al juicio clínico ni a los protocolos de tu servicio. Revisa dosis y datos antes de actuar.
          No se almacenan datos identificativos de pacientes.
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-2 text-center tabular-nums">{__APP_VERSION__}</p>
      </div>
    );
  }

  const cprRunning = cprActive(cpr) && route.tool !== 'cpr';

  return (
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <header className="bg-white/80 dark:bg-slate-950/75 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-200/80 dark:border-slate-800/80 pt-[env(safe-area-inset-top)]">
        <div className="max-w-xl mx-auto flex items-center gap-2.5 py-3 px-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
          {(cat || tool) && (
            <button type="button" aria-label="Volver" onClick={back} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 active:bg-slate-200 dark:active:bg-slate-700"><IconChevronLeft /></button>
          )}
          {!cat && !tool && <img src="icons/favicon.svg" alt="" className="w-9 h-9 rounded-xl shrink-0" />}
          <h1 className="text-lg leading-tight font-black tracking-tight flex-1 min-w-0 line-clamp-2">{title}</h1>
          <OfflineBadge />
          <button type="button" aria-label={dark ? 'Modo claro' : 'Modo oscuro'} onClick={() => setDark(!dark)} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            {dark ? <IconSun /> : <IconMoon />}
          </button>
        </div>
        {cprRunning && (
          <button type="button" onClick={() => go('/ops/cpr')} className="w-full bg-red-600 text-white font-black py-3 animate-pulse">● RCP EN CURSO · volver al asistente</button>
        )}
      </header>

      <main className="max-w-xl mx-auto p-4 mt-2 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        <PwaStatus home={!cat && !tool} quiet={cprActive(cpr)} />
        {content}
      </main>
    </div>
  );
}
