import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const Banner = ({ tone, children }) => (
  <div className={`p-3 rounded-xl text-sm font-bold flex items-center justify-between gap-3 ${tone}`} role="status">{children}</div>
);

export function OfflineBadge() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return (
    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full shrink-0 ${online ? 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300' : 'bg-amber-200 text-amber-900'}`}>
      {online ? 'En línea' : 'Sin conexión'}
    </span>
  );
}

export default function PwaStatus() {
  const { offlineReady: [offlineReady, setOfflineReady], needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW();
  const [installEvent, setInstallEvent] = useState(null);
  const [hideIOS, setHideIOS] = useState(false);
  const standalone = isStandalone();

  useEffect(() => {
    const h = (e) => { e.preventDefault(); setInstallEvent(e); };
    window.addEventListener('beforeinstallprompt', h);
    // Pide almacenamiento persistente para que el sistema no purgue la caché offline
    navigator.storage?.persist?.().catch(() => {});
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);

  return (
    <div className="space-y-2 mb-4">
      {needRefresh && (
        <Banner tone="bg-blue-100 text-blue-900 dark:bg-blue-900/60 dark:text-blue-100">
          <span>Hay una versión nueva. Actualiza cuando no estés en una intervención.</span>
          <button type="button" onClick={() => updateServiceWorker(true)} className="px-3 py-2 rounded-lg bg-blue-600 text-white shrink-0">Actualizar</button>
        </Banner>
      )}
      {offlineReady && !needRefresh && (
        <Banner tone="bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-100">
          <span>✓ Lista para usar sin conexión.</span>
          <button type="button" onClick={() => setOfflineReady(false)} className="px-3 py-2 shrink-0" aria-label="Cerrar">OK</button>
        </Banner>
      )}
      {installEvent && !standalone && (
        <Banner tone="bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
          <span>Instala la app para abrirla a pantalla completa.</span>
          <button type="button" onClick={async () => { installEvent.prompt(); await installEvent.userChoice; setInstallEvent(null); }} className="px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 shrink-0">Instalar</button>
        </Banner>
      )}
      {isIOS() && !standalone && !hideIOS && (
        <Banner tone="bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
          <span>Para instalar en iPhone/iPad: abre en <strong>Safari</strong>, toca Compartir y «Añadir a pantalla de inicio». Así funciona offline de forma fiable.</span>
          <button type="button" onClick={() => setHideIOS(true)} className="px-3 py-2 shrink-0" aria-label="Cerrar">✕</button>
        </Banner>
      )}
    </div>
  );
}
