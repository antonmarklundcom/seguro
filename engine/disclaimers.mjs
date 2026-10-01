/* engine/disclaimers.mjs — the canonical versioned notice strings from
   SHARED.md, reduced to the set an informational, non-lead site needs.

   Manager scope change (2026-09-13): the site launches as a purely editorial
   SEO portal. There is no lead capture, so the consent-related notices F and
   U (thanks page) and the commissions notice A are removed, together with the
   credit notices L and J, which never applied to this domain.

   Every string is a DRAFT tagged VERIFY; none is a legal opinion. Content
   authors reference IDs only and cannot edit or disable a required notice. */

export const DISCLAIMER_VERSION = '2026-10-01-seguro';

export const DISCLAIMERS = {
  P: {
    id: 'P',
    label: 'Alcance del portal',
    text: 'Información general: no es asesoramiento. Este portal no emite ofertas ni evalúa tu elegibilidad. Para decidir, consultá las condiciones directamente con el proveedor o con un corredor registrado.'
  },
  S: {
    id: 'S',
    label: 'Seguros',
    text: 'Las coberturas, exclusiones, primas y condiciones dependen de cada póliza y proveedor. Este portal no cotiza, vende ni emite seguros. La información publicada no reemplaza la documentación contractual.'
  },
  M: {
    id: 'M',
    label: 'Alcance de la comparación',
    text: 'Esta comparación utiliza los criterios y las fuentes indicados, con la fecha de revisión publicada. No incluye necesariamente todas las opciones disponibles y no es una recomendación personalizada.'
  },
  D: {
    id: 'D',
    label: 'Páginas legales',
    text: 'Estas páginas explican el funcionamiento del portal y el tratamiento de datos. Para consultas sobre tus datos, usá el formulario de contacto y elegí "Pedido sobre mis datos personales".'
  },
  H: {
    id: 'H',
    label: 'Medicina prepaga',
    text: 'La medicina prepaga no es un seguro. Los planes asistenciales corresponden a prestadores sujetos a la Superintendencia de Salud. Confirmá habilitación, sanatorios, prestaciones y copagos con el prestador. Este portal no solicita datos de salud.'
  },
  T: {
    id: 'T',
    label: 'Asistencia al viajero',
    text: 'La asistencia al viajero es un servicio cuyo alcance depende del contrato. Confirmá prestaciones, exclusiones y condiciones con el proveedor; las indemnizaciones o reembolsos requieren verificar el respaldo asegurador aplicable.'
  },
  U404: {
    id: 'U404',
    label: 'Página no encontrada',
    text: 'La dirección solicitada no corresponde a una página disponible. Podés volver al inicio o consultar las guías del sitio.'
  }
};

/**
 * Disclaimer IDs a page kind must always carry, regardless of what the page
 * record declares. Content authors can add, never remove.
 */
export const REQUIRED_BY_KIND = {
  home: ['P'],
  hub: ['P'],
  guide: ['P'],
  comparison: ['P', 'M'],
  glossary: ['P'],
  faq: ['P'],
  legal: ['P', 'D'],
  utility: ['P'],
  blogIndex: ['P'],
  blogPost: ['P']
};

export function resolveDisclaimers(kind, declared) {
  const required = REQUIRED_BY_KIND[kind] || ['P'];
  const seen = new Set();
  const ids = [];
  for (const id of [...required, ...(declared || [])]) {
    if (!DISCLAIMERS[id]) throw new Error(`Unknown disclaimer ID: ${id}`);
    if (seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  return ids;
}
