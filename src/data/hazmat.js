// Guías GRE (Emergency Response Guidebook): aislamiento inicial por guía.
// Datos transcritos a mano: VERIFICAR contra la edición oficial vigente de la GRE antes de uso operativo.
export const GRE_GUIDES = {
  115: { name: 'Gases inflamables', isolate: '100 m' },
  121: { name: 'Gases inertes', isolate: '100 m' },
  122: { name: 'Gases oxidantes', isolate: '100 m' },
  124: { name: 'Gases tóxicos y/o oxidantes (corrosivos)', isolate: '100 m (TIH: ver tabla verde, puede ser mucho mayor)' },
  125: { name: 'Gases corrosivos', isolate: '100 m (TIH: ver tabla verde)' },
  126: { name: 'Gases comprimidos / licuados', isolate: '100 m' },
  127: { name: 'Líquidos inflamables (polares)', isolate: '50 m' },
  128: { name: 'Líquidos inflamables (no polares)', isolate: '50 m' },
  130: { name: 'Líquidos inflamables / nocivos', isolate: '50 m' },
  131: { name: 'Líquidos inflamables y tóxicos', isolate: '50 m' },
  137: { name: 'Sustancias corrosivas reactivas con agua', isolate: '50 m' },
  153: { name: 'Sustancias tóxicas y/o corrosivas (combustibles)', isolate: '50 m' },
  157: { name: 'Sustancias tóxicas y/o corrosivas (no combustibles)', isolate: '50 m' },
};

// [nº ONU, nombre, clase de peligro, guía GRE, riesgos]
export const HAZMAT = [
  ['1203', 'Gasolina', '3', 128, 'Muy inflamable; vapores más pesados que el aire. Riesgo de incendio/explosión.'],
  ['1072', 'Oxígeno comprimido', '2.2 (5.1)', 122, 'Comburente: aviva el fuego intensamente. Alejar de grasas y aceites.'],
  ['1005', 'Amoníaco anhidro', '2.3 (8)', 125, 'Tóxico por inhalación y corrosivo. TIH: consultar distancias ampliadas.'],
  ['1993', 'Líquido inflamable, n.e.p.', '3', 128, 'Inflamable; identificar la sustancia concreta.'],
  ['3336', 'Mezcla de mercaptanos, líquida, inflamable', '3', 130, 'Inflamable, olor intenso, nocivo por inhalación.'],
  ['1017', 'Cloro', '2.3 (5.1, 8)', 124, 'Gas tóxico, corrosivo y comburente. TIH: consultar distancias ampliadas.'],
  ['1978', 'Propano', '2.1', 115, 'Gas inflamable licuado. Riesgo de BLEVE si hay fuego sobre el recipiente.'],
  ['1075', 'Gases licuados del petróleo (GLP)', '2.1', 115, 'Gas inflamable licuado. Riesgo de explosión y BLEVE.'],
  ['1202', 'Gasóleo / diésel', '3', 128, 'Líquido inflamable.'],
  ['1830', 'Ácido sulfúrico', '8', 137, 'Corrosivo. Reacciona violentamente con agua: no aplicar agua directamente.'],
  ['1090', 'Acetona', '3', 127, 'Líquido muy inflamable.'],
  ['1170', 'Etanol', '3', 127, 'Líquido inflamable.'],
  ['1230', 'Metanol', '3 (6.1)', 131, 'Inflamable y tóxico.'],
  ['2074', 'Acrilamida, sólida', '6.1', 153, 'Tóxica.'],
  ['1049', 'Hidrógeno comprimido', '2.1', 115, 'Gas extremadamente inflamable; llama casi invisible.'],
  ['1011', 'Butano', '2.1', 115, 'Gas inflamable licuado. Riesgo alto de explosión.'],
  ['1066', 'Nitrógeno comprimido', '2.2', 121, 'Asfixiante en espacios cerrados.'],
  ['1073', 'Oxígeno líquido refrigerado', '2.2 (5.1)', 122, 'Comburente y criogénico: quemaduras por frío.'],
  ['1223', 'Queroseno', '3', 128, 'Líquido inflamable.'],
  ['1789', 'Ácido clorhídrico', '8', 157, 'Corrosivo; vapores irritantes.'],
  ['1950', 'Aerosoles', '2', 126, 'Recipientes a presión; inflamables según contenido.'],
  ['2055', 'Estireno monómero, estabilizado', '3', 128, 'Líquido inflamable; puede polimerizar.'],
];
