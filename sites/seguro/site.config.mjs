/* sites/seguro/site.config.mjs — public build input for seguro.com.py.
   Never a credential store. Validated by engine/config.mjs.

   Manager scope change (2026-09-13): the site launches as a purely
   informational editorial portal. There is no lead capture, no CRM
   integration and no contact form, so the crm and lead contracts from
   SHARED.md are absent and the operator identity is a single monitored
   email address. */

export default {
  id: 'seguro',
  domain: 'seguro.com.py',
  origin: 'https://seguro.com.py',
  locale: 'es-PY',

  brand: {
    name: 'Seguro.com.py',
    shortName: 'Seguro',
    logo: '/favicon.svg',
    themeColor: '#0B2545'
  },

  theme: {
    primary: '#0B2545',    // navy
    accent: '#13A89E',     // teal
    background: '#F6F8FA', // off-white
    text: '#1B1F24'        // ink
  },

  // Company details stay null until the owner confirms them. They are not published: the
  // site shows no RUC and no domicilio (owner decision, 2026-10-01). No e-mail field exists:
  // contact is a form only.
  operator: {
    holderName: 'Anton Marklund', // person who owns the site; used in the consent text and the legal pages
    legalName: null,
    ruc: null,
    address: null
  },

  // Stored once, rendered on every page (docs/DISCLAIMERS.md §1, §2, §5).
  notices: {
    topStrip: 'Sitio informativo. No vendemos seguros ni somos una aseguradora.',
    footerLead: 'Sitio informativo.',
    footer: 'seguro.com.py no es una aseguradora, un corredor ni un agente de seguros. No vendemos, cotizamos ni contratamos seguros, no recibimos solicitudes de seguro, no gestionamos siniestros y no manejamos dinero. La información es general y no es asesoramiento. Verificá siempre las condiciones, coberturas y exclusiones directamente con la aseguradora.',
    guideEnd: 'Esta guía es informativa y no reemplaza el asesoramiento de un profesional. ¿Encontraste un error?'
  },

  contact: {
    consentVersion: 'v1.0',
    types: [
      { id: 'correccion', label: 'Quiero corregir un dato del sitio' },
      { id: 'datos', label: 'Pedido sobre mis datos personales' },
      { id: 'aseguradora', label: 'Soy una aseguradora' },
      { id: 'corredor', label: 'Soy corredor o agente de seguros' },
      { id: 'medio', label: 'Soy un medio de comunicación' },
      { id: 'agencia', label: 'Soy una agencia o proveedor' },
      { id: 'otro', label: 'Otro' }
    ]
  },

  navigation: [
    {
      label: 'Autos',
      href: '/autos/',
      children: [
        { label: 'Datos para una propuesta', href: '/autos/cotizar/' }
      ]
    },
    { label: 'Salud', href: '/salud/' },
    { label: 'Verificar aseguradoras', href: '/aseguradoras/' },
    { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes/' },
    { label: 'Blog', href: '/blog/' }
  ],

  footer: {
    legalCopyVersion: '2026-10-01-seguro',
    tagline: 'Guías y criterios para entender los seguros en Paraguay.',
    linkGroups: [
      {
        label: 'Contenido',
        links: [
          { label: 'Seguro de auto', href: '/autos/' },
          { label: 'Medicina prepaga', href: '/salud/' },
          { label: 'Verificar aseguradoras', href: '/aseguradoras/' },
          { label: 'Blog', href: '/blog/' }
        ]
      },
      {
        label: 'El portal',
        links: [
          { label: 'Nosotros', href: '/nosotros/' },
          { label: 'Cómo comparamos', href: '/como-comparamos/' },
          { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes/' },
          { label: 'Contacto', href: '/contacto/' }
        ]
      },
      {
        label: 'Legal',
        links: [
          { label: 'Aviso legal', href: '/aviso-legal/' },
          { label: 'Privacidad', href: '/privacidad/' },
          { label: 'Términos de uso', href: '/terminos/' }
        ]
      }
    ]
  },

  analytics: { enabled: false, provider: '', publicId: '', consentMode: 'opt-in' },
  ads: { enabled: false, blogOnly: true, publisherId: '' },

  blog: {
    categories: [
      { id: 'autos', label: 'Autos', description: 'Guías sobre seguros de auto y moto en Paraguay.' },
      { id: 'salud', label: 'Salud', description: 'Guías sobre medicina prepaga y planes asistenciales.' },
      { id: 'viajes', label: 'Viajes', description: 'Guías sobre asistencia al viajero.' }
    ],
    pageSize: 12,
    // Shown under every post (posts do not carry their own list). `checked` = date consulted.
    defaultSources: {
      autos: [
        { claim: 'Alcance, exclusiones y condiciones de cada cobertura.', label: 'Condiciones generales y particulares de la póliza (documento de la aseguradora)', url: null, checked: '2026-10-01' },
        { claim: 'Datos de las entidades aseguradoras y de los grupos coaseguradores supervisados por la Superintendencia de Seguros.', label: 'Superintendencia de Seguros — Banco Central del Paraguay', url: 'https://www.bcp.gov.py/web/institucional/entidades-supervisadas1', checked: '2026-10-01' }
      ],
      salud: [
        { claim: 'Organismo de supervisión de los prestadores de salud, entre ellos la medicina prepaga.', label: 'Superintendencia de Salud', url: 'https://superintendenciadesalud.gov.py/', checked: '2026-10-01' },
        { claim: 'Prestaciones, copagos y carencias de cada plan.', label: 'Contrato del plan (documento del prestador)', url: null, checked: '2026-10-01' }
      ],
      viajes: [
        { claim: 'Prestaciones, límites y exclusiones de cada producto de asistencia.', label: 'Contrato o condiciones del producto de asistencia (documento del proveedor)', url: null, checked: '2026-10-01' }
      ]
    },
    feedTitle: 'Seguro.com.py — guías sobre seguros en Paraguay',
    feedDescription: 'Artículos educativos sobre seguros de auto, medicina prepaga y asistencia al viajero en Paraguay.'
  },

  images: { widths: [640, 1280, 1920], formats: ['avif', 'webp'], defaultOg: '' },

  legal: {
    disclaimerVersions: { set: '2026-10-01-seguro' },
    reviewDate: '',
    approvalReference: ''
  },

  seo: {
    titleSuffix: ' | Seguro.com.py',
    defaultImage: '',
    robotsPolicy: 'index,follow,max-image-preview:large'
  },

  build: { outputDomain: 'seguro.com.py', assetStrategy: 'query-hash' }
};
