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
| SAFI | Tabla con tramos inconsistentes. | Cortes 315 / 235 / 150 (S/F ↔ P/F 300 / 200 / 100). | Rice 2007. El corte 150 es el menos sólido. Orientativo. |
| Malinas | `>5` inminente. | `<5` traslado, `5` intermedio, `≥6` inminente; deseo de pujar fuerza «inminente». | Literatura publicada (umbral 6; propuesta alternativa 7). Validar con protocolo obstétrico local. |
| Apgar | Pulso 2 = «>100». | 2 = «≥100». | Definición original. |
| START | «<30 rpm» ambiguo en 30. | «>30» / «≤30». Recuento de víctimas por color. | Algoritmo START. |
| Gasometría | Sin compensación. | Compensación y fórmula de Winter (arterial). | Fisiología ácido-base estándar. |
| MatPel | Distancias fijas por sustancia (p. ej. 100 m cloro). | Distancia por guía GRE; TIH remiten a tabla verde. | GRE. **Datos transcritos a mano: verificar contra la edición oficial.** |
| Índice de shock | `si` como string; división por 0. | Numérico; TAS 0 controlada; avisos de limitaciones. | Corrección de código. SIPA (Acker 2015). |

## Sin cambios (revisar si procede)
- Umbrales del índice de shock adulto (0,8 / 1,0).
- Parámetros iniciales de ventilación mecánica, CPAP y BiPAP.
- RASS, ISBAR, ATMIST, NEXUS, regla canadiense, Glasgow.

## Pendiente / sugerido
- Base GRE completa offline (hoy solo 22 sustancias).
- JumpSTART pediátrico; RCP pediátrica/neonatal.
- Tests automáticos de la lógica clínica.
