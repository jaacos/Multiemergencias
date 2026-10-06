# Cambios y puntos clínicos a validar

Referencias: ERC 2025 (RCP), APLS (pediatría), ATLS 10.ª ed./ABA (quemados), Rice 2007 (S/F), guías ESO (ictus).
**Un responsable clínico de tu servicio debe revisar este documento antes del uso operativo.** Donde tu protocolo regional difiera, prevalece el protocolo.

| Herramienta | Antes | Ahora | Motivo / fuente |
|---|---|---|---|
| Cincinnati | Solo se podía marcar «anormal»; con un solo hallazgo el flujo no avanzaba. «Negativo» = «baja probabilidad de ictus». | Cada ítem Normal/Anormal. Negativo advierte que **no descarta** ictus. Recordatorio de hora de último visto bien. | Error funcional + sensibilidad limitada (circulación posterior). |
| RACE | Etiquetas ambiguas. | Descripciones por opción; corte ≥5 se mantiene. | Escala RACE original. |
| Fibrinólisis | INR>1,7 como relativa; sin glucemia, plaquetas, HBPM/ACOD ni TA. | Añadidos glucemia <50, plaquetas <100.000, INR>1,7, HBPM <24 h, ACOD <48 h, TA ≥185/110 como absolutas; datos a transmitir en el preaviso. | Criterios ESO/AHA-ASA. Los umbrales varían por protocolo. |
| RCP | Pausa de 15 s con autoreanudación; sin contador de descargas ni recordatorios; 30:2 no hacía nada. | Pausa objetivo ≤10 s (sin autoreanudar), contador de descargas, adrenalina (no desfibrilable: ya; desfibrilable: tras 3.ª descarga; luego cada 3-5 min), amiodarona 300 mg tras 3.ª y 150 mg tras 5.ª, modo 30:2 con contador. | ERC 2025 (sin cambios mayores respecto a 2021 en estos puntos). |
| Cinta pediátrica | Peso `2×edad+8` para todas las edades; lactante fijo 5 kg; solo tubo sin balón. | Peso APLS: `0,5×meses+4` (lactante), `2×años+8` (1-5), `3×años+7` (6-12). Tubo con y sin balón. Bolo 10 ml/kg. | APLS 2011. |
| Quemados | Parkland 4 ml sin alternativa; sin avisos pediátricos. | Selector ATLS/ABA 2 ml (**por defecto**) o Parkland 4 ml; aviso Lund-Browder en niños; ml/h de las primeras 8 h. | ATLS 10.ª ed. **Tu servicio decide cuál usar por defecto.** |
| SAFI | Tabla con tramos inconsistentes y sin leyenda. | Leyenda con 4 tramos (>315 / 236-315 / 149-235 / ≤148 ↔ PaFi 300 / 200 / 100), PaFi estimada con `SAFI = 64 + 0,84 × PaFi` y aviso si SpO₂ >97 %. | Rice, Chest 2007; definición global de SDRA 2023 (grave ≤148). Orientativo, no diagnostica SDRA. |
| Malinas | `>5` inminente. | `<5` traslado, `5` intermedio, `≥6` inminente; deseo de pujar fuerza «inminente». | Literatura publicada (umbral 6; propuesta alternativa 7). Validar con protocolo obstétrico local. |
| Apgar | Pulso 2 = «>100». | 2 = «≥100». | Definición original. |
| START | «<30 rpm» ambiguo en 30. | «>30» / «≤30». Recuento de víctimas por color. | Algoritmo START. |
| Gasometría | Solo pH/pCO₂/HCO₃⁻; rangos venosos desplazados (pH 7,31-7,41; pCO₂ 41-51). | Rangos venosos corregidos (pH 7,32-7,42; pCO₂ 40-50; HCO₃⁻ 22-29). Añadidos PaO₂, SaO₂, PaO₂/FiO₂, lactato (≤2 normal; ≥4 grave), Na/Cl, albúmina, anion gap (corregido: +2,5 × (4 − alb)) y cociente Δ/Δ. Compensación: Winter, +0,7 mmHg/mEq en alcalosis metabólica, HCO₃⁻ en trastornos respiratorios agudos/crónicos. Lógica probada con 9 casos clínicos. | Fisiología ácido-base estándar. En venosa se asume equivalencia solo de pH, HCO₃⁻ y lactato; la compensación se calcula solo con arterial. Rangos de anion gap dependen del analizador. |
| MatPel | Distancias fijas por sustancia (p. ej. 100 m cloro). | Distancia por guía GRE; TIH remiten a tabla verde. | GRE. **Datos transcritos a mano: verificar contra la edición oficial.** |
| Índice de shock | `si` como string; división por 0. | Numérico; TAS 0 controlada; avisos de limitaciones. | Corrección de código. SIPA (Acker 2015). |

## Sin cambios (revisar si procede)
- Umbrales del índice de shock adulto (0,8 / 1,0).
- Parámetros iniciales de ventilación mecánica, CPAP y BiPAP.
- RASS, ISBAR, ATMIST, NEXUS, regla canadiense, Glasgow.

## Pendiente / sugerido
- Base GRE completa offline (hoy solo 22 sustancias).
- JumpSTART pediátrico; RCP pediátrica/neonatal.

## Pruebas automáticas
`npm test` ejecuta 21 pruebas (lógica de RCP y de interpretación ácido-base, incluidos los rangos venosos verificados). Se ejecutan también en cada despliegue; si fallan, no se publica.
