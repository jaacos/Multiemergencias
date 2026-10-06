import { useEffect, useState } from 'react';

// Devuelve Date.now() refrescado cada `ms` (null = parado).
// Los cronómetros calculan SIEMPRE a partir de marcas de tiempo, nunca contando ticks:
// así no se desfasan si el navegador ralentiza el timer con la pantalla bloqueada.
export function useNow(ms) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!ms) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), ms);
    const onVis = () => setNow(Date.now());
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis); };
  }, [ms]);
  return now;
}
