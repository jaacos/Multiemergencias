// Lógica pura de ventilación (sin React) para poder probarla.

// Peso ideal (Devine, con talla en cm). Mínimo 30 kg para evitar valores absurdos con tallas bajas.
export const ibw = (heightCm, male) => Math.max(30, Math.round((male ? 50 : 45.5) + 0.91 * (heightCm - 152.4)));

// Volumen corriente objetivo en ml para un rango de ml/kg de peso ideal
export const vtRange = (ibwKg, lo, hi) => [Math.round(ibwKg * lo), Math.round(ibwKg * hi)];

// VNI BiPAP en EPOC hipercápnico (BTS/ICS 2016): EPAP inicial 3 (4-5 habitual en práctica); IPAP inicial 15, o 20 si pH < 7,25.
// Se titula IPAP a 20-30 en 10-30 min (máx. 30 sin valoración experta) y EPAP si persiste la hipoxemia (máx. 8).
export const bipapStart = (ph) => ({ ipap: ph < 7.25 ? 20 : 15, epap: 4 });

export const MAX_IPAP = 30;
export const MAX_EPAP = 8;

export function bipapCheck(ipap, epap) {
  const ps = ipap - epap;
  const flags = [];
  if (ipap <= epap) flags.push({ tone: 'bad', text: 'IPAP debe ser mayor que EPAP: no hay soporte inspiratorio.' });
  else if (ps < 5) flags.push({ tone: 'warn', text: 'Presión de soporte < 5 cmH₂O: probablemente insuficiente para ventilar.' });
  if (ipap > MAX_IPAP) flags.push({ tone: 'bad', text: `IPAP > ${MAX_IPAP} cmH₂O: requiere valoración experta.` });
  if (epap > MAX_EPAP) flags.push({ tone: 'bad', text: `EPAP > ${MAX_EPAP} cmH₂O: requiere valoración experta.` });
  return { ps, flags };
}

// CPAP en edema agudo de pulmón cardiogénico: iniciar 5-10 cmH2O, máx. 15 según tolerancia; SpO2 objetivo 94-98 %.
export const MAX_CPAP = 15;
export function cpapCheck(peep) {
  if (peep < 5) return { tone: 'warn', text: 'Por debajo del rango inicial habitual (5-10 cmH₂O).' };
  if (peep <= 10) return { tone: 'ok', text: 'Dentro del rango inicial (5-10 cmH₂O).' };
  if (peep < MAX_CPAP) return { tone: 'warn', text: 'Presión alta: vigilar hipotensión, tolerancia y distensión gástrica.' };
  return { tone: 'bad', text: `Máximo habitual (${MAX_CPAP} cmH₂O): no aumentar más sin valoración experta.` };
}
