import { useCallback, useSyncExternalStore } from 'react';

// Estado persistente en localStorage compartido entre componentes.
// Sobrevive a navegar atrás/adelante y a recargar la app.
// No guardar nunca datos identificativos de pacientes.
const stores = new Map();

function getStore(key, initial) {
  if (!stores.has(key)) {
    let value = initial;
    try {
      const raw = localStorage.getItem(key);
      if (raw) value = JSON.parse(raw);
    } catch { /* almacenamiento no disponible o corrupto */ }
    stores.set(key, { value, subs: new Set() });
  }
  return stores.get(key);
}

export function usePersisted(key, initial) {
  const store = getStore(key, initial);
  const value = useSyncExternalStore(
    (cb) => { store.subs.add(cb); return () => store.subs.delete(cb); },
    () => store.value
  );
  const set = useCallback((update) => {
    const next = typeof update === 'function' ? update(store.value) : update;
    if (next === store.value) return;
    store.value = next;
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* sin cuota */ }
    store.subs.forEach((f) => f());
  }, [key, store]);
  return [value, set];
}
