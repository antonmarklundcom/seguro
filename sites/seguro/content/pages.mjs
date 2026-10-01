/* sites/seguro/content/pages.mjs — phase-1 page records.
   Adding a page is one record in this array. Blog indexes, category indexes
   and posts are generated from sites/seguro/blog/*.md and are not listed here.

   Every page is informational. No record may declare a contact form, a lead
   CTA or a paid placement: the engine has no such block. */

import config from '../site.config.mjs';

const HOLDER = config.operator.holderName;
const REVIEWED = '2026-10-01';
const CHECKED = '2026-10-01';

/* Official sources shared by several pages. `checked` is the date the link was consulted. */
const SRC_SIS = {
  claim: 'Datos de las entidades aseguradoras y de los grupos coaseguradores supervisados por la Superintendencia de Seguros.',
  label: 'Superintendencia de Seguros — Banco Central del Paraguay',
  url: 'https://www.bcp.gov.py/web/institucional/entidades-supervisadas1',
  checked: CHECKED
};
const SRC_SALUD = {
  claim: 'Organismo de supervisión de los prestadores de salud, entre ellos la medicina prepaga.',
  label: 'Superintendencia de Salud',
  url: 'https://superintendenciadesalud.gov.py/',
  checked: CHECKED
};
const SRC_POLIZA = {
  claim: 'El alcance, las exclusiones y las condiciones de cada cobertura están en la póliza de cada aseguradora.',
  label: 'Condiciones generales y particulares de la póliza (documento de la aseguradora)',
  url: null,
  checked: CHECKED
};

const PAGES = [
  /* ------------------------------------------------------------------ S01 */
  {
    id: 'home',
    slug: '/',
    kind: 'home',
    parent: null,
    breadcrumbLabel: 'Inicio',
    title: 'Seguros y planes de salud en Paraguay | Seguro.com.py',
    description: 'Guías claras sobre seguro de auto, medicina prepaga y asistencia al viajero en Paraguay, con criterios de comparación y enlaces a los canales oficiales de cada proveedor.',
    h1: 'Seguros y planes de salud en Paraguay: información para comparar',
    eyebrow: 'Portal informativo independiente',
    summary: 'Explicamos qué cubre cada tipo de póliza, qué preguntar antes de contratar y dónde consultar los datos oficiales. No vendemos seguros: te damos el contexto para que hables con el proveedor sabiendo qué mirar.',
    cta: { label: 'Cómo verificar una aseguradora', href: '/aseguradoras/' },
    secondaryCta: { label: 'Empezar por seguro de auto', href: '/autos/' },
    disclaimers: ['S', 'H'],
    updated: REVIEWED,
    sections: [
      {
        type: 'cards',
        heading: 'Por dónde empezar',
        lede: 'Tres recorridos según lo que estés averiguando.',
        items: [
          {
            eyebrow: 'Autos',
            title: 'Seguro de auto y de moto',
            text: 'Diferencias entre responsabilidad civil contra terceros y todo riesgo, qué es la franquicia y qué datos te van a pedir.',
            href: '/autos/',
            linkLabel: 'Ver la guía de autos'
          },
          {
            eyebrow: 'Salud',
            title: 'Medicina prepaga',
            text: 'La medicina prepaga no es un seguro. Qué mirar en la red de sanatorios, las consultas incluidas, los copagos y los períodos de carencia.',
            href: '/salud/',
            linkLabel: 'Ver la guía de salud'
          },
          {
            eyebrow: 'Entidades',
            title: 'Cómo verificar una aseguradora o un corredor',
            text: 'Dónde consultar la fuente oficial para comprobar si una aseguradora o un corredor está habilitado, antes de firmar.',
            href: '/aseguradoras/',
            linkLabel: 'Ver cómo verificar'
          }
        ]
      },
      {
        type: 'steps',
        heading: 'Cómo usar este sitio',
        items: [
          { title: 'Entendé el producto', text: 'Leé la guía del ramo que te interesa para saber qué cubre, qué excluye y qué palabras aparecen en la póliza.' },
          { title: 'Armá tus preguntas', text: 'Cada guía termina con una lista de preguntas concretas para hacerle al proveedor antes de firmar.' },
          { title: 'Consultá la fuente oficial', text: 'Usá la página de verificación para llegar a la fuente oficial. La cotización y las condiciones las da el proveedor.' }
        ]
      },
      {
        type: 'prose',
        heading: 'Qué hacemos y qué no hacemos',
        body: [
          'Seguro.com.py es un portal editorial. Publicamos guías y comparaciones de criterios a partir de fuentes públicas, y mostramos la fecha en que revisamos cada página.',
          'No emitimos pólizas, no cotizamos, no intermediamos y no recibimos solicitudes de seguro. El único formulario del sitio es para correcciones, pedidos sobre tus datos y mensajes de aseguradoras, corredores, medios y agencias. Si querés contratar, el trámite es directamente con la aseguradora o con un corredor.'
        ]
      },
      {
        type: 'ctaBand',
        heading: '¿Estás por contratar un seguro de auto?',
        text: 'Antes de pedir precios, revisá qué datos te van a pedir y con qué criterios conviene comparar las propuestas que recibas.',
        cta: { label: 'Cómo pedir una cotización', href: '/autos/cotizar/' },
        secondary: { label: 'Cómo comparamos', href: '/como-comparamos/' }
      }
    ]
  },

  /* ------------------------------------------------------------------ S02 */
  {
    id: 'autos',
    slug: '/autos/',
    kind: 'hub',
    parent: 'home',
    breadcrumbLabel: 'Autos',
    title: 'Seguro de auto en Paraguay: coberturas y condiciones',
    description: 'Qué cubre un seguro de auto en Paraguay, en qué se diferencian el contra terceros y el todo riesgo, cómo funciona la franquicia y qué conviene revisar antes de contratar.',
    h1: 'Seguro de auto en Paraguay: coberturas y condiciones',
    eyebrow: 'Guía del ramo',
    summary: 'Un seguro de auto es un contrato: lo que pagás y lo que recibís están definidos en la póliza y en sus condiciones particulares. Esta guía explica el vocabulario y los límites para que puedas leer una propuesta con criterio.',
    cta: { label: 'Cómo pedir una cotización', href: '/autos/cotizar/' },
    disclaimers: ['S'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Las dos coberturas que vas a encontrar',
        body: [
          'La responsabilidad civil contra terceros cubre los daños que vos causás a otras personas o a sus bienes, hasta el límite que fija la póliza. No cubre los daños de tu propio vehículo.',
          'El todo riesgo agrega los daños propios del vehículo asegurado, normalmente con una franquicia o deducible a tu cargo por cada siniestro. Cuanto más alta la franquicia, menor suele ser la prima, y al revés.',
          'Entre esos dos extremos hay coberturas intermedias con nombres comerciales distintos en cada compañía. El nombre no dice qué cubre: lo que importa es el listado de riesgos cubiertos, las exclusiones y las sumas aseguradas.'
        ]
      },
      {
        type: 'compare',
        heading: 'Contra terceros y todo riesgo: qué cambia',
        caption: 'Comparación de criterios generales entre las dos coberturas más frecuentes de automotor.',
        columns: ['Criterio', 'Contra terceros', 'Todo riesgo'],
        rows: [
          ['Daños a terceros', 'Cubiertos hasta el límite de la póliza', 'Cubiertos hasta el límite de la póliza'],
          ['Daños del vehículo asegurado', 'No cubiertos', 'Cubiertos, con franquicia'],
          ['Robo total', 'Según póliza; con frecuencia excluido', 'Habitualmente cubierto'],
          ['Franquicia', 'Suele no aplicarse a terceros', 'Se aplica a los daños propios'],
          ['Peso en la prima', 'Menor', 'Mayor']
        ],
        methodology: 'Cuadro conceptual elaborado con las categorías de cobertura de uso corriente en el mercado paraguayo. No refleja el producto de ninguna compañía en particular: cada póliza define su propio alcance.',
        reviewed: REVIEWED
      },
      {
        type: 'list',
        heading: 'Qué revisar en una propuesta',
        lede: 'Pedí que cada punto quede por escrito en la propuesta o en las condiciones particulares.',
        items: [
          'Suma asegurada del vehículo y cómo se actualiza durante la vigencia.',
          'Límite de la responsabilidad civil frente a terceros, en guaraníes.',
          'Monto exacto de la franquicia y si es fija o un porcentaje.',
          'Exclusiones: uso comercial, conductor sin registro habilitante, alcohol, zonas o países no cubiertos.',
          'Qué asistencias están incluidas: grúa, auxilio mecánico, auto de reemplazo.',
          'Plazo y documentación para denunciar un siniestro.',
          'Períodos de carencia y condiciones de renovación o rescisión.'
        ]
      },
      {
        type: 'cards',
        heading: 'Seguir leyendo',
        columns: 2,
        items: [
          { title: 'Cómo pedir una cotización', text: 'Qué datos del vehículo y del conductor piden las compañías, y cómo dejar las propuestas comparables entre sí.', href: '/autos/cotizar/', linkLabel: 'Ver la guía' },
          { title: 'Preguntas frecuentes', text: 'Respuestas breves sobre franquicias, siniestros, coberturas y el funcionamiento de este portal.', href: '/preguntas-frecuentes/', linkLabel: 'Ver las preguntas' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S05 */
  {
    id: 'autos-cotizar',
    slug: '/autos/cotizar/',
    kind: 'guide',
    parent: 'autos',
    breadcrumbLabel: 'Cómo pedir una cotización',
    title: 'Cómo pedir una cotización de seguro de auto en Paraguay',
    description: 'Qué datos del vehículo y del conductor piden las aseguradoras y qué preguntar cuando pedís una cotización directamente a la aseguradora. Guía informativa: este portal no cotiza.',
    h1: 'Cómo pedir una cotización de seguro de auto en Paraguay',
    eyebrow: 'Guía práctica',
    summary: 'Este portal no cotiza ni intermedia. Acá explicamos qué datos te van a pedir y qué conviene preguntar cuando pedís una cotización a una aseguradora.',
    cta: { label: 'Cómo verificar una aseguradora', href: '/aseguradoras/' },
    disclaimers: ['S'],
    updated: REVIEWED,
    sections: [
      {
        type: 'list',
        heading: 'Los datos que te van a pedir',
        lede: 'Tenelos a mano antes de escribir o llamar: con esto suele alcanzar para una propuesta inicial.',
        items: [
          'Marca, modelo, versión y año del vehículo.',
          'Uso: particular, laboral o comercial. El uso declarado cambia la cobertura.',
          'Ciudad donde circula y guarda habitualmente el vehículo.',
          'Datos del conductor habitual: edad y antigüedad del registro de conducir.',
          'Si el vehículo tiene prenda o leasing, porque puede haber una cobertura exigida por la entidad.',
          'Cobertura que buscás: contra terceros, intermedia o todo riesgo.'
        ]
      },
      {
        type: 'steps',
        heading: 'Cómo pedirla',
        items: [
          { title: 'Definí una misma base', text: 'Pedí a cada compañía la misma cobertura, la misma suma asegurada y la misma franquicia. Si cambia la base, los números dejan de ser comparables.' },
          { title: 'Pedí la propuesta por escrito', text: 'Solicitá el detalle de coberturas, exclusiones, franquicia y vigencia en un documento, no solo un monto por mensaje.' },
          { title: 'Preguntá por el costo total del año', text: 'Consultá la prima anual, el plan de cuotas, los recargos por financiación y qué impuestos o gastos están incluidos.' },
          { title: 'Compará y consultá las dudas', text: 'Repasá el cuadro de coberturas antes de decidir y volvé a preguntar lo que no esté claro. La póliza es el documento que manda.' }
        ]
      },
      {
        type: 'prose',
        heading: 'A quién pedírsela',
        body: [
          'Una cotización se pide directamente a la aseguradora, por sus canales oficiales, o a un corredor de seguros. Antes de hacerlo con un intermediario, conviene verificar su habilitación ante la Superintendencia de Seguros del Banco Central del Paraguay.',
          'Este portal no gestiona cotizaciones, no recibe solicitudes de seguro y no deriva datos a ninguna entidad.'
        ]
      },
      {
        type: 'faq',
        heading: 'Dudas frecuentes antes de pedir una propuesta',
        items: [
          { q: '¿Qué preguntar sobre la vigencia de una cotización?', a: 'Preguntale a la aseguradora, por escrito, cuánto tiempo vale la propuesta y qué pasos siguen para que se emita la póliza. Lo que obliga a cada parte figura en el documento que te entreguen, no en esta guía.' },
          { q: '¿Por qué dos compañías me dan precios muy distintos?', a: 'Porque cada una evalúa el riesgo con sus propios criterios y porque las coberturas rara vez son idénticas. Antes de comparar montos, verificá que la suma asegurada, la franquicia y el listado de exclusiones sean equivalentes.' },
          { q: '¿Conviene siempre la franquicia más baja?', a: 'No necesariamente. Una franquicia baja sube la prima anual. La decisión depende de cuánto podrías afrontar de tu bolsillo ante un siniestro y de cuántas veces esperás usar la cobertura.' }
        ]
      },
      {
        type: 'links',
        heading: 'Enlaces oficiales',
        lede: 'Fuentes para verificar entidades antes de pedir una propuesta.',
        items: [
          { href: 'https://www.bcp.gov.py/web/institucional/entidades-supervisadas1', label: 'Superintendencia de Seguros — Banco Central del Paraguay', note: 'organismo de supervisión; verificá acá la habilitación de una entidad' },
          { href: '/aseguradoras/', label: 'Cómo verificar una aseguradora o un corredor', note: 'guía de este portal con el enlace oficial' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S09 */
  {
    id: 'salud',
    slug: '/salud/',
    kind: 'hub',
    parent: 'home',
    breadcrumbLabel: 'Salud',
    title: 'Medicina prepaga y planes de salud en Paraguay',
    description: 'Qué es la medicina prepaga, en qué se diferencia de un seguro, cómo leer la red de sanatorios, los copagos y las carencias de un plan asistencial en Paraguay.',
    h1: 'Medicina prepaga y planes de salud en Paraguay',
    eyebrow: 'Guía del ramo',
    summary: 'La medicina prepaga es un servicio asistencial, no un seguro. El proveedor se compromete a prestaciones concretas en una red definida, y ese alcance está escrito en el contrato del plan.',
    cta: { label: 'Ver las guías de salud del blog', href: '/blog/salud/' },
    disclaimers: ['H', 'M'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Prepaga y seguro no son lo mismo',
        body: [
          'Un seguro indemniza un daño según una póliza y está bajo la órbita de la Superintendencia de Seguros. Un plan de medicina prepaga da acceso a prestaciones médicas en una red de prestadores, y corresponde al ámbito de la Superintendencia de Salud.',
          'La consecuencia práctica es que en un plan asistencial lo decisivo no es una suma asegurada, sino qué sanatorios y profesionales integran la red, qué prácticas están incluidas y cuánto se paga en cada consulta o estudio.'
        ]
      },
      {
        type: 'compare',
        heading: 'Qué mirar en un plan asistencial',
        caption: 'Criterios de lectura de un contrato de medicina prepaga y qué implica cada uno.',
        columns: ['Criterio', 'Qué preguntar', 'Por qué importa'],
        rows: [
          ['Red de sanatorios', '¿Qué sanatorios y clínicas están incluidos y en qué ciudades?', 'Determina dónde te podés atender sin pagar aparte.'],
          ['Consultas', '¿Cuántas consultas anuales incluye y con qué especialidades?', 'Los topes anuales cambian mucho entre planes.'],
          ['Copagos', '¿Cuánto se paga por consulta, estudio, urgencia e internación?', 'Es el costo real más allá de la cuota mensual.'],
          ['Carencias', '¿Cuánto tiempo hay que esperar por cada prestación?', 'Define desde cuándo podés usar cada beneficio.'],
          ['Preexistencias', '¿Cómo se tratan las condiciones previas?', 'Puede haber exclusiones o esperas específicas.'],
          ['Actualización de cuota', '¿Con qué frecuencia y con qué criterio se ajusta?', 'Afecta el costo del plan a lo largo del contrato.']
        ],
        methodology: 'Criterios de lectura generales, redactados a partir de la estructura habitual de los contratos de medicina prepaga. No comparan planes concretos ni sustituyen el contrato del prestador.',
        reviewed: REVIEWED
      },
      {
        type: 'note',
        heading: 'Sobre tus datos de salud',
        body: 'Este portal no pregunta ni almacena información de salud y no tramita pedidos de planes. Si usás el formulario de contacto, no incluyas datos de salud. Cualquier consulta sobre coberturas médicas se hace directamente con el prestador.'
      },
      {
        type: 'links',
        heading: 'Dónde verificar',
        items: [
          { href: 'https://superintendenciadesalud.gov.py/', label: 'Superintendencia de Salud', note: 'organismo de supervisión de prestadores de salud' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S18 */
  {
    id: 'aseguradoras',
    slug: '/aseguradoras/',
    kind: 'guide',
    parent: 'home',
    breadcrumbLabel: 'Verificar aseguradoras',
    title: 'Aseguradoras en Paraguay: cómo verificar una aseguradora o un corredor',
    description: 'Cómo comprobar si una aseguradora o un corredor de seguros está habilitado en Paraguay: qué pedir, dónde consultar la fuente oficial y qué revisar antes de firmar.',
    h1: 'Aseguradoras en Paraguay: cómo verificar una aseguradora o un corredor',
    eyebrow: 'Guía práctica',
    summary: 'Este portal no lista, compara ni recomienda aseguradoras. Acá explicamos cómo comprobar, en la fuente oficial, si una aseguradora o un corredor está habilitado antes de contratar.',
    disclaimers: ['S'],
    updated: REVIEWED,
    sources: [SRC_SIS],
    sections: [
      {
        type: 'steps',
        heading: 'Cómo verificar en cuatro pasos',
        items: [
          { title: 'Pedí el nombre completo', text: 'Pedí a la aseguradora o al corredor su nombre o razón social completa y, en el caso de un corredor, el dato de su habilitación. Anotalo tal como te lo informan.' },
          { title: 'Buscalo en la fuente oficial', text: 'Consultá la página de la Superintendencia de Seguros del Banco Central del Paraguay (enlace abajo) y buscá ahí la entidad. Los registros y su ubicación en el sitio oficial pueden cambiar: usá la información vigente de esa página.' },
          { title: 'Comparalo con lo que te informaron', text: 'Verificá que el nombre y los datos coincidan. Si no encontrás a la entidad o algo no coincide, preguntale a la Superintendencia y pedile explicaciones al proveedor antes de pagar.' },
          { title: 'Pedí todo por escrito', text: 'Pedí la póliza, las condiciones generales y particulares y el detalle de la propuesta en un documento. La póliza es el documento que manda.' }
        ]
      },
      {
        type: 'prose',
        heading: 'Qué no hace esta página',
        body: [
          'Seguro.com.py no publica listados de aseguradoras ni de corredores, no los ordena y no recomienda a ninguna. Cada entidad informa sus datos y su habilitación por sus propios canales y ante el organismo de supervisión.',
          'Para entender qué cubre cada tipo de póliza, leé las guías de autos, salud y asistencia al viajero. Para pedir una propuesta, mirá qué datos te van a pedir y qué preguntar.'
        ]
      },
      {
        type: 'links',
        heading: 'Fuente oficial',
        items: [
          { href: 'https://www.bcp.gov.py/web/institucional/entidades-supervisadas1', label: 'Superintendencia de Seguros — Banco Central del Paraguay', note: 'organismo de supervisión; consultá acá la habilitación de una entidad' },
          { href: 'https://www.bcp.gov.py/web/institucional/registro-de-la-sis', label: 'Registro de la SIS — Banco Central del Paraguay', note: 'registro de la Superintendencia de Seguros' },
          { href: '/corredores/', label: 'Corredores de seguros: cómo consultar su habilitación' },
          { href: '/autos/cotizar/', label: 'Cómo pedir una cotización de seguro de auto' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S35 */
  {
    id: 'preguntas-frecuentes',
    slug: '/preguntas-frecuentes/',
    kind: 'faq',
    parent: 'home',
    breadcrumbLabel: 'Preguntas frecuentes',
    title: 'Preguntas frecuentes sobre seguros y este portal',
    description: 'Respuestas breves sobre coberturas de auto, franquicias, medicina prepaga y asistencia al viajero, y sobre cómo funciona Seguro.com.py y qué datos publica.',
    h1: 'Preguntas frecuentes sobre seguros y este portal',
    eyebrow: 'Consultas habituales',
    summary: 'Respuestas cortas a lo que más se pregunta. Cada una remite a la guía correspondiente o a la fuente oficial cuando el detalle depende del contrato.',
    disclaimers: ['S', 'H'],
    updated: REVIEWED,
    sections: [
      {
        type: 'faq',
        heading: 'Sobre las coberturas',
        items: [
          { q: '¿Qué cubre el seguro contra terceros?', a: 'Cubre los daños que el vehículo asegurado causa a otras personas o a sus bienes, hasta el límite fijado en la póliza. No cubre los daños del propio vehículo. El alcance exacto, las exclusiones y el límite figuran en las condiciones particulares.' },
          { q: '¿Qué es la franquicia o deducible?', a: 'Es la parte del daño que queda a cargo del asegurado en cada siniestro cubierto. Si el daño es menor que la franquicia, la compañía no realiza pago alguno. Suele expresarse como un monto fijo en guaraníes o como un porcentaje de la suma asegurada.' },
          { q: '¿La medicina prepaga es un seguro?', a: 'No. Es un servicio asistencial prestado por entidades sujetas a la Superintendencia de Salud. Lo que define el plan es la red de prestadores, las prestaciones incluidas, los copagos y los períodos de carencia, no una suma asegurada.' },
          { q: '¿La asistencia al viajero equivale a un seguro de viaje?', a: 'No siempre. La asistencia al viajero es un servicio cuyo alcance depende del contrato: puede incluir prestaciones directas, reembolsos o ambas cosas. Conviene verificar en cada caso si existe un respaldo asegurador y cuáles son los límites y las exclusiones.' }
        ]
      },
      {
        type: 'faq',
        heading: 'Sobre este portal',
        items: [
          { q: '¿Seguro.com.py vende seguros?', a: 'No. Es un portal informativo. No emite pólizas, no cotiza, no intermedia y no deriva contactos a ninguna entidad. La contratación se hace siempre con la aseguradora o con un corredor.' },
          { q: '¿Piden datos personales?', a: 'No pedimos datos a quienes buscan un seguro. El único formulario del sitio es de contacto, para correcciones, pedidos sobre tus datos y mensajes de aseguradoras, corredores, medios y agencias: pide solo lo necesario para responder y tu autorización expresa. No usamos cookies de análisis ni de publicidad.' },
          { q: '¿Cómo pido que corrijan un dato del sitio?', a: 'Usá el formulario de contacto y elegí "Quiero corregir un dato del sitio". Revisamos el dato contra la fuente y actualizamos la fecha de la página.' },
          { q: '¿Con qué frecuencia se actualizan los datos?', a: 'Cada guía muestra la fecha de su última actualización y la lista de fuentes consultadas, con la fecha de consulta.' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S36 */
  {
    id: 'como-comparamos',
    slug: '/como-comparamos/',
    kind: 'comparison',
    parent: 'home',
    breadcrumbLabel: 'Cómo comparamos',
    title: 'Cómo comparamos la información publicada en el portal',
    description: 'Los criterios editoriales de Seguro.com.py: qué fuentes usamos, cómo elegimos qué entidades incluir, cómo fechamos cada dato y qué hacemos cuando no podemos verificar una información.',
    h1: 'Cómo comparamos información sobre seguros y planes',
    eyebrow: 'Metodología',
    summary: 'Publicamos criterios, no veredictos. Esta página explica de dónde sale cada dato, cómo se ordenan los listados y en qué casos preferimos no publicar.',
    disclaimers: ['S', 'H'],
    updated: REVIEWED,
    sections: [
      {
        type: 'list',
        heading: 'Reglas que seguimos',
        items: [
          'Usamos fuentes primarias: el sitio oficial de la entidad y los organismos de supervisión.',
          'Cada guía lleva su fecha de actualización y la lista de fuentes consultadas, con la fecha de consulta.',
          'Un dato sin fuente verificable no se publica.',
          'Las tablas comparan criterios y condiciones generales, nunca precios inventados.',
          'No publicamos rankings, puntajes ni recomendaciones de aseguradoras o prestadores.',
          'Corregimos los errores que nos señalen mediante el formulario de contacto y actualizamos la fecha de la página.'
        ]
      },
      {
        type: 'prose',
        heading: 'Lo que esta comparación no es',
        body: [
          'No es un cuadro exhaustivo del mercado ni compara productos o precios de entidades concretas.',
          'No es una recomendación personalizada. Cada situación depende del vehículo, del uso, del grupo familiar y del presupuesto, y esa evaluación la hace el proveedor con vos.'
        ]
      },
      {
        type: 'prose',
        heading: 'Cómo se financia el sitio',
        body: [
          'Hoy el portal no vende publicidad, no participa en programas de afiliación y no recibe pagos por contactos. El formulario de contacto no es un canal de venta ni de derivación de datos a terceros.',
          'Si en el futuro se incorpora algún espacio publicitario, quedará identificado como tal en la página donde aparezca y esta metodología se actualizará con la fecha del cambio.'
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S37 */
  {
    id: 'nosotros',
    slug: '/nosotros/',
    kind: 'legal',
    parent: 'home',
    breadcrumbLabel: 'Nosotros',
    title: 'Quién está detrás de Seguro.com.py',
    description: 'Qué es Seguro.com.py, quién escribe las guías, con qué criterio editorial se publican y cuáles son los límites de lo que el portal puede y no puede hacer.',
    h1: 'Quién está detrás de Seguro.com.py',
    eyebrow: 'El portal',
    summary: 'Somos un portal editorial independiente sobre seguros y planes de salud en Paraguay. Publicamos guías en castellano, con fuentes y fechas visibles.',
    disclaimers: [],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Qué es este sitio',
        body: [
          'Seguro.com.py nació para responder en castellano y con foco local las preguntas que aparecen antes de contratar un seguro: qué cubre, qué excluye, qué preguntar y dónde verificar.',
          'Todo el contenido se redacta a partir de fuentes públicas y se revisa con una fecha visible. Cuando un dato no se puede verificar, se dice explícitamente en lugar de rellenarlo.'
        ]
      },
      {
        type: 'prose',
        heading: 'Qué no somos',
        body: [
          'No somos una aseguradora, ni una sociedad de corretaje, ni un agente matriculado, ni una entidad financiera. No vendemos ni intermediamos seguros y no gestionamos siniestros.',
          'Tampoco damos asesoramiento individualizado. Para una recomendación sobre tu caso concreto tenés que hablar con la entidad o con un corredor matriculado.'
        ]
      },
      {
        type: 'prose',
        heading: 'Responsabilidad editorial',
        body: [
          'Las guías son firmadas por la redacción del portal. Si encontrás un error, escribinos desde el formulario de contacto: revisamos el dato contra la fuente oficial, lo corregimos y actualizamos la fecha de la página.'
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S38 */
  {
    id: 'contacto',
    slug: '/contacto/',
    kind: 'utility',
    parent: 'home',
    breadcrumbLabel: 'Contacto',
    title: 'Contacto | Seguro.com.py',
    description: 'Cómo ponerte en contacto con Seguro.com.py: un formulario para correcciones, pedidos sobre tus datos y mensajes de aseguradoras, corredores, medios y agencias. No tramitamos pedidos de seguro.',
    h1: 'Contacto',
    eyebrow: 'Escribinos',
    summary: 'Elegí el motivo de tu consulta. La comunicación con el portal es solo por formulario.',
    disclaimers: [],
    updated: REVIEWED,
    sections: [
      {
        type: 'cards',
        heading: '¿Qué necesitás?',
        columns: 2,
        items: [
          { eyebrow: 'Personas', title: 'Estoy buscando un seguro', text: 'Este sitio no tramita pedidos de seguro. Te mostramos qué leer y cómo verificar a una aseguradora o a un corredor.', href: '/contacto/busco-un-seguro/', linkLabel: 'Ver qué hacer' },
          { eyebrow: 'Mensajes', title: 'Quiero enviar un mensaje', text: 'Para corregir un dato del sitio, hacer un pedido sobre tus datos personales, o si sos una aseguradora, un corredor, un medio o una agencia.', href: '/contacto/mensaje/', linkLabel: 'Ir al formulario' }
        ]
      },
      {
        type: 'note',
        heading: 'Lo que no podemos hacer',
        body: 'No cotizamos, no contratamos pólizas, no gestionamos siniestros ni reclamos y no derivamos tu consulta a ninguna aseguradora. Para eso hay que usar los canales oficiales del proveedor.'
      }
    ]
  },

  {
    id: 'contacto-busco-un-seguro',
    slug: '/contacto/busco-un-seguro/',
    kind: 'utility',
    parent: 'contacto',
    breadcrumbLabel: 'Busco un seguro',
    title: 'Busco un seguro: qué hacer | Seguro.com.py',
    description: 'Seguro.com.py no tramita pedidos de seguro ni recibe datos de personas que buscan uno. Qué leer primero y cómo verificar a una aseguradora o a un corredor.',
    h1: 'Estoy buscando un seguro',
    eyebrow: 'Contacto',
    summary: 'Este sitio es informativo y no tramita pedidos de seguro. No hay ningún formulario para pedir una cotización ni para dejar tus datos.',
    disclaimers: ['S'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Qué podés hacer',
        body: [
          'Para entender tus opciones, leé nuestras guías. Antes de contratar, verificá en la fuente oficial que la aseguradora o el corredor estén habilitados.',
          'La cotización y las condiciones las da siempre el proveedor, por sus propios canales.'
        ]
      },
      {
        type: 'links',
        heading: 'Por dónde seguir',
        items: [
          { href: '/autos/', label: 'Seguro de auto en Paraguay: coberturas y condiciones' },
          { href: '/salud/', label: 'Medicina prepaga y planes de salud' },
          { href: '/autos/cotizar/', label: 'Qué datos te piden y qué preguntar al pedir una cotización' },
          { href: '/aseguradoras/', label: 'Cómo verificar una aseguradora o un corredor' },
          { href: '/preguntas-frecuentes/', label: 'Preguntas frecuentes' }
        ]
      }
    ]
  },

  {
    id: 'contacto-mensaje',
    slug: '/contacto/mensaje/',
    output: 'php',
    indexable: false,
    kind: 'utility',
    parent: 'contacto',
    breadcrumbLabel: 'Formulario',
    title: 'Escribinos | Seguro.com.py',
    description: 'Formulario de contacto: correcciones, pedidos sobre tus datos y mensajes de aseguradoras, corredores, medios y agencias.',
    h1: 'Escribinos',
    eyebrow: 'Formulario de contacto',
    summary: 'Para correcciones, pedidos sobre tus datos personales y mensajes de aseguradoras, corredores, medios y agencias.',
    disclaimers: [],
    sections: [{ type: 'contactForm' }]
  },

  {
    id: 'contacto-gracias',
    slug: '/contacto/gracias/',
    indexable: false,
    kind: 'utility',
    parent: 'contacto',
    breadcrumbLabel: 'Gracias',
    title: 'Gracias | Seguro.com.py',
    description: 'Confirmación del formulario de contacto de Seguro.com.py.',
    h1: 'Gracias',
    eyebrow: 'Formulario de contacto',
    summary: 'Si tu mensaje corresponde a lo que atiende este formulario, lo vamos a responder. Este sitio no tramita pedidos de seguro.',
    cta: { label: 'Volver al inicio', href: '/' },
    disclaimers: [],
    sections: []
  },

  /* ------------------------------------------------------------------ S39 */
  {
    id: 'aviso-legal',
    slug: '/aviso-legal/',
    kind: 'legal',
    parent: 'home',
    breadcrumbLabel: 'Aviso legal',
    title: 'Aviso legal de Seguro.com.py',
    description: 'Identificación del portal, naturaleza informativa del servicio, límites de responsabilidad, propiedad intelectual y enlaces a sitios de terceros en Seguro.com.py.',
    h1: 'Aviso legal de Seguro.com.py',
    eyebrow: 'Legal',
    summary: 'Esta página identifica al portal y delimita el alcance de lo que publica. Los textos legales del sitio son una redacción propia y no constituyen asesoramiento jurídico.',
    disclaimers: [],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Identificación y contacto',
        body: [
          `Seguro.com.py es un portal informativo sobre seguros y planes de salud en Paraguay. Su titular es ${HOLDER}. El único canal de contacto es el formulario del sitio.`,
          'No hay atención telefónica ni oficinas de atención al público: el portal es exclusivamente digital y editorial.'
        ]
      },
      { type: 'links', items: [{ href: '/contacto/', label: 'Contacto' }] },
      {
        type: 'prose',
        heading: 'Naturaleza del servicio',
        body: [
          'El portal presta un servicio de carácter estrictamente informativo, educativo y de difusión. No es una entidad aseguradora, reaseguradora, sociedad de corretaje ni agente matriculado, y tampoco una entidad bancaria, financiera o casa de crédito.',
          'El portal no realiza cotizaciones vinculantes, no suscribe pólizas, no evalúa solvencia, no intermedia en la contratación y no presta asesoramiento asegurador o financiero individualizado.',
          'Las tablas comparativas muestran criterios generales y son referenciales.'
        ]
      },
      {
        type: 'prose',
        heading: 'Límite de responsabilidad',
        body: [
          'La información se publica de buena fe, a partir de fuentes que se indican en cada página, con su fecha de verificación. Las condiciones de un producto pueden cambiar sin que el portal lo advierta de inmediato.',
          'La única fuente vinculante es la documentación contractual que te entregue el proveedor. Antes de contratar, verificá los datos en los canales oficiales de la entidad.'
        ]
      },
      {
        type: 'prose',
        heading: 'Enlaces y marcas de terceros',
        body: [
          'El sitio enlaza a páginas oficiales de entidades y de organismos públicos para que puedas verificar la información. El portal no controla esos sitios ni responde por su contenido.',
          'Los nombres comerciales y las marcas mencionadas pertenecen a sus titulares y se usan únicamente con fines identificativos e informativos. Su mención no implica vinculación, patrocinio ni recomendación.'
        ]
      },
      {
        type: 'prose',
        heading: 'Propiedad intelectual',
        body: [
          'Los textos, las tablas y el diseño del sitio son obra del portal. Podés citarlos indicando la fuente y enlazando la página original; la reproducción total sin autorización no está permitida.'
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S40 */
  {
    id: 'privacidad',
    slug: '/privacidad/',
    kind: 'legal',
    parent: 'home',
    breadcrumbLabel: 'Privacidad',
    title: 'Privacidad y cookies en Seguro.com.py',
    description: 'Qué datos trata Seguro.com.py: el formulario de contacto (con VenderCRM y correo electrónico), los registros del servidor, las cookies y cómo ejercer tus derechos desde el formulario.',
    h1: 'Privacidad y uso de datos en Seguro.com.py',
    eyebrow: 'Legal',
    summary: 'El sitio no recibe pedidos de seguro. El único formulario es de contacto. Esta página explica qué datos trata, para qué, quién los ve, cuánto tiempo los conserva y cómo pedir que los borremos.',
    disclaimers: [],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Quién trata tus datos',
        body: [`El responsable del tratamiento es ${HOLDER}, titular de seguro.com.py.`]
      },
      {
        type: 'list',
        heading: 'Qué datos recibimos en el formulario',
        items: [
          'Tipo de consulta, nombre y apellido, organización (según el tipo de consulta), cargo (opcional), teléfono o WhatsApp, correo electrónico y el texto de tu mensaje.',
          'La constancia de tu autorización: la versión del texto aceptado y la fecha y hora (zona horaria America/Asuncion).',
          'No pedimos cédula, datos de salud, datos de vehículos o inmuebles, números de póliza ni datos de otras personas. Te pedimos que no los incluyas en el mensaje.'
        ]
      },
      {
        type: 'prose',
        heading: 'Para qué los usamos',
        body: [
          'Solo para responder a tu mensaje y, si escribís en nombre de una aseguradora, un corredor, un medio o una agencia, para gestionar esa relación de negocio.',
          'No vendemos tus datos ni los compartimos con aseguradoras, corredores ni bancos.'
        ]
      },
      {
        type: 'prose',
        heading: 'Quién los ve',
        body: [
          `${HOLDER} y dos proveedores: VenderCRM, que usamos para gestionar contactos, y nuestro proveedor de correo electrónico, que nos avisa de cada mensaje. Los servidores del sitio están en Brasil y algunos proveedores pueden operar fuera de Paraguay.`
        ]
      },
      {
        type: 'prose',
        heading: 'Cuánto tiempo los conservamos',
        body: [
          'Mientras sea necesario para responder y, como máximo, 24 meses después del último contacto, salvo que pidas antes que los borremos.'
        ]
      },
      {
        type: 'prose',
        heading: 'Cookies',
        body: [
          'Este sitio no usa cookies de análisis ni de publicidad y no carga scripts de terceros. Por eso no mostramos un aviso de cookies. Si esto cambia, te vamos a pedir tu consentimiento antes de activar nada.'
        ]
      },
      {
        type: 'prose',
        heading: 'Registros técnicos del servidor',
        body: [
          'El servicio de hosting conserva registros de acceso y de errores que pueden incluir la dirección IP y el agente de usuario. Se usan para operar y proteger el sitio. El plazo de conservación lo define el proveedor de hosting.',
          'Para limitar el abuso del formulario, guardamos durante una hora un código derivado de la dirección IP (no la dirección en sí).'
        ]
      },
      {
        type: 'prose',
        heading: 'Tus derechos',
        body: [
          'Podés pedir acceso, rectificación, supresión u oposición, y retirar tu autorización cuando quieras. Usá el formulario de contacto y elegí "Pedido sobre mis datos personales". Te respondemos por el medio que indiques.',
          'Versión del texto de autorización del formulario: v1.0.'
        ]
      },
      { type: 'links', items: [{ href: '/contacto/mensaje/', label: 'Formulario de contacto' }] }
    ]
  },

  /* ------------------------------------------------------------------ S41 */
  {
    id: 'terminos',
    slug: '/terminos/',
    kind: 'legal',
    parent: 'home',
    breadcrumbLabel: 'Términos de uso',
    title: 'Términos de uso de Seguro.com.py',
    description: 'Condiciones de uso del portal Seguro.com.py: alcance del contenido, usos permitidos, exactitud de la información, enlaces externos y modificaciones de estos términos.',
    h1: 'Términos de uso de Seguro.com.py',
    eyebrow: 'Legal',
    summary: 'Al usar el sitio aceptás estas condiciones. Son breves porque el portal es informativo: no hay cuentas de usuario, ni pagos, ni contratación de productos.',
    disclaimers: [],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Alcance',
        body: [
          'El contenido de Seguro.com.py es de carácter general e informativo. No constituye asesoramiento asegurador, financiero, legal ni médico, y no reemplaza la documentación contractual del proveedor.',
          'No existen cuentas de usuario, registros ni operaciones de pago en este sitio.'
        ]
      },
      {
        type: 'prose',
        heading: 'Uso permitido',
        body: [
          'Podés leer, imprimir y compartir el contenido para uso personal, y citarlo indicando la fuente y enlazando la página original.',
          'No está permitido reproducir el sitio de forma sistemática, extraer su contenido de manera automatizada ni presentarlo como propio.'
        ]
      },
      {
        type: 'prose',
        heading: 'Exactitud y actualización',
        body: [
          'Procuramos que la información sea correcta a la fecha de revisión indicada en cada página. Las condiciones de los productos cambian y pueden hacerlo sin previo aviso.',
          'Si detectás un error, avisanos desde el formulario de contacto y lo corregimos.'
        ]
      },
      {
        type: 'prose',
        heading: 'Formulario de contacto',
        body: [
          'El formulario es solo para correcciones, pedidos sobre tus datos y mensajes de aseguradoras, corredores, medios y agencias. No tramita pedidos de seguro. Podemos borrar los mensajes que no correspondan a ese uso.'
        ]
      },
      {
        type: 'prose',
        heading: 'Enlaces externos y modificaciones',
        body: [
          'El sitio enlaza a páginas de terceros para permitir la verificación de datos. No respondemos por el contenido ni por las prácticas de esos sitios.',
          'Podemos actualizar estos términos. La versión vigente es la publicada en esta página, con la fecha de revisión visible.'
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S45 */
  {
    id: '404',
    slug: '/404.html',
    kind: 'utility',
    parent: 'home',
    breadcrumbLabel: 'Página no encontrada',
    indexable: false,
    hero: true,
    title: 'Página no encontrada | Seguro.com.py',
    description: 'La dirección solicitada no corresponde a una página disponible en Seguro.com.py. Volvé al inicio o entrá a las guías de autos, salud y verificación de aseguradoras.',
    h1: 'No encontramos esta página de Seguro.com.py',
    summary: 'Puede que el enlace esté mal escrito o que la página haya cambiado de dirección.',
    cta: { label: 'Volver al inicio', href: '/' },
    disclaimers: ['U404'],
    sections: [
      {
        type: 'links',
        heading: 'Páginas principales',
        items: [
          { href: '/autos/', label: 'Seguro de auto en Paraguay' },
          { href: '/salud/', label: 'Medicina prepaga y planes de salud' },
          { href: '/aseguradoras/', label: 'Cómo verificar una aseguradora o un corredor' },
          { href: '/blog/', label: 'Blog con guías por categoría' },
          { href: '/preguntas-frecuentes/', label: 'Preguntas frecuentes' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S03 */
  {
    id: 'autos-contra-terceros',
    slug: '/autos/contra-terceros/',
    kind: 'guide',
    parent: 'autos',
    breadcrumbLabel: 'Contra terceros',
    title: 'Qué cubre el seguro contra terceros en Paraguay',
    description: 'Alcance real del seguro de auto contra terceros: qué daños cubre, qué límites tiene la póliza y qué queda excluido. Con ejemplos para leer una cobertura básica.',
    h1: 'Qué cubre el seguro contra terceros',
    eyebrow: 'Cobertura básica',
    summary: 'El contra terceros cubre lo que vos le causás a otros, no lo que le pasa a tu propio vehículo. Esta guía explica su alcance y sus límites.',
    cta: { label: 'Ver el resto de la guía de autos', href: '/autos/' },
    disclaimers: ['S'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'La idea central',
        body: [
          'La responsabilidad civil contra terceros responde por los daños que el vehículo asegurado causa a otras personas o a otros bienes: otro auto, una pared, un poste, una lesión a un peatón. La compañía paga hasta el límite fijado en la póliza, llamado suma asegurada o límite de responsabilidad civil.',
          'Lo que no cubre es tan importante como lo que cubre: los daños de tu propio vehículo quedan a tu cargo, salvo que contrates una cobertura adicional. Por eso conviene revisar el límite de responsabilidad civil frente al valor de lo que podrías llegar a dañar en un siniestro.'
        ]
      },
      {
        type: 'list',
        heading: 'Qué suele incluir y qué no',
        lede: 'Cada compañía redacta sus condiciones particulares distinto; esta es la estructura habitual del mercado.',
        items: [
          'Incluye: daños materiales a terceros hasta el límite contratado.',
          'Incluye, en muchas pólizas: daños corporales o muerte de terceros, con un sublímite propio.',
          'No incluye: daños al vehículo asegurado, salvo que se agregue una cobertura adicional.',
          'No incluye, habitualmente: robo total o parcial del vehículo asegurado.',
          'Puede excluir: uso comercial no declarado, conducción sin registro habilitante o bajo efectos del alcohol.',
          'Puede excluir: circulación fuera del territorio declarado en la póliza.'
        ]
      },
      {
        type: 'faq',
        heading: 'Preguntas sobre esta cobertura',
        items: [
          { q: '¿El contra terceros cubre el vidrio o los espejos de mi auto?', a: 'No. Esos son daños propios del vehículo asegurado, y quedan fuera de una cobertura contra terceros pura. Se cubren solo si contratás una cobertura intermedia o todo riesgo que los incluya expresamente.' },
          { q: '¿Qué pasa si el daño que causo supera el límite de la póliza?', a: 'La compañía paga hasta el límite contratado; el excedente queda a cargo del asegurado, salvo que exista otra cobertura que lo respalde. Por eso conviene elegir un límite acorde al riesgo que querés cubrir.' },
          { q: '¿Puedo tener contra terceros y sumarle asistencia en el camino?', a: 'Sí, muchas compañías ofrecen servicios de grúa o auxilio mecánico como un adicional independiente de la cobertura de responsabilidad civil. Preguntá si tu póliza lo incluye o si se contrata aparte.' }
        ]
      },
      {
        type: 'links',
        heading: 'Seguir leyendo',
        items: [
          { href: '/autos/todo-riesgo/', label: 'Seguro todo riesgo: franquicia y deducible' },
          { href: '/guias/que-pasa-si-choco-y-no-tengo-seguro/', label: 'Qué pasa si chocás y no tenés seguro' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S04 */
  {
    id: 'autos-todo-riesgo',
    slug: '/autos/todo-riesgo/',
    kind: 'guide',
    parent: 'autos',
    breadcrumbLabel: 'Todo riesgo',
    title: 'Seguro todo riesgo: franquicia y deducible explicados',
    description: 'Cómo funciona el seguro de auto todo riesgo, qué es la franquicia o deducible, cómo se aplica en un siniestro y qué revisar antes de elegir el monto.',
    h1: 'Seguro todo riesgo: franquicia y deducible',
    eyebrow: 'Cobertura ampliada',
    summary: 'El todo riesgo suma a la responsabilidad civil los daños propios del vehículo. A cambio, casi siempre aparece una franquicia: una parte del daño que pagás vos en cada siniestro.',
    cta: { label: 'Cómo funciona la franquicia o deducible', href: '/guias/como-funciona-la-franquicia-o-deducible/' },
    disclaimers: ['S'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Qué agrega frente al contra terceros',
        body: [
          'El todo riesgo cubre, además de los daños a terceros, los daños propios del vehículo asegurado: choque, vuelco, incendio y, según la póliza, robo total o parcial. El nombre comercial varía entre compañías, pero la lógica es la misma: se indemniza también el auto asegurado.',
          'Esa cobertura adicional tiene un costo, y buena parte de ese costo se administra con la franquicia: un monto o porcentaje que queda a tu cargo en cada siniestro cubierto, antes de que la aseguradora pague el resto.'
        ]
      },
      {
        type: 'steps',
        heading: 'Cómo funciona la franquicia en la práctica',
        items: [
          { title: 'Se fija al contratar', text: 'La franquicia se define en la póliza, como monto fijo en guaraníes o como porcentaje de la suma asegurada.' },
          { title: 'Se aplica por siniestro', text: 'Cada vez que reclamás un daño cubierto, se descuenta la franquicia del monto a indemnizar, no de la prima.' },
          { title: 'No se aplica a terceros', text: 'La franquicia recae sobre los daños de tu propio vehículo; los daños a terceros suelen indemnizarse sin descuento de franquicia.' },
          { title: 'Cambia el costo de la póliza', text: 'Una franquicia más alta reduce la prima anual; una franquicia más baja la sube, porque la aseguradora asume más riesgo por siniestro.' }
        ]
      },
      {
        type: 'prose',
        heading: 'Cómo elegir el monto',
        body: [
          'No hay una franquicia correcta para todos: depende de cuánto podrías afrontar de tu bolsillo si tenés un siniestro y de cuántas veces esperás usar la cobertura. Una franquicia baja tiene sentido si preferís pagar más de prima para no desembolsar nada ante un daño; una franquicia alta conviene si preferís una prima menor y podés cubrir el deducible cuando ocurra.'
        ]
      },
      {
        type: 'links',
        heading: 'Guías relacionadas',
        items: [
          { href: '/guias/como-funciona-la-franquicia-o-deducible/', label: 'Cómo funciona la franquicia o deducible' },
          { href: '/glosario/', label: 'Glosario de seguros y planes asistenciales' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S06 */
  {
    id: 'motos',
    slug: '/motos/',
    kind: 'hub',
    parent: 'home',
    breadcrumbLabel: 'Motos',
    title: 'Seguro para motos en Paraguay: qué consultar',
    description: 'Qué cubre un seguro de moto en Paraguay, en qué se diferencia del seguro de auto y qué preguntas conviene hacer antes de contratar una cobertura para tu vehículo de dos ruedas.',
    h1: 'Seguro para motos: qué consultar',
    eyebrow: 'Guía del ramo',
    summary: 'Las motos tienen coberturas y exclusiones propias, distintas de las del automóvil. Antes de comparar precios conviene entender qué se está contratando.',
    cta: { label: 'Cómo verificar una aseguradora', href: '/aseguradoras/' },
    disclaimers: ['S'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Por qué la moto se trata distinto',
        body: [
          'Las motocicletas suelen concentrar un riesgo distinto al del automóvil: mayor exposición del conductor, mayor incidencia de robo en algunos modelos y un parque más heterogéneo en cilindrada y uso. Por eso las aseguradoras suelen tener condiciones particulares para este ramo, con exclusiones específicas.',
          'La cobertura contra terceros y el todo riesgo existen también para motos, con la misma lógica que en autos: la primera cubre lo que le causás a otros, la segunda suma los daños propios y trae franquicia.'
        ]
      },
      {
        type: 'list',
        heading: 'Qué preguntar antes de contratar',
        items: [
          'Si la cobertura incluye elementos como casco, baúl o accesorios instalados después de la compra.',
          'Qué franquicia se aplica en caso de todo riesgo y si varía según el tipo de siniestro.',
          'Si hay exclusiones por cilindrada, antigüedad del vehículo o modificaciones no homologadas.',
          'Qué documentación pide la aseguradora del conductor: categoría de registro habilitante para motos.',
          'Si el robo total o parcial está cubierto y bajo qué condiciones de seguridad (candado, alarma, guardado).',
          'Qué asistencia en el camino incluye la póliza: grúa, traslado, auxilio mecánico.'
        ]
      },
      {
        type: 'faq',
        heading: 'Dudas frecuentes',
        items: [
          { q: '¿Puedo asegurar una moto usada?', a: 'Sí, la mayoría de las compañías aseguran motos usadas, aunque pueden pedir una inspección previa y ajustar la suma asegurada según el valor de mercado del modelo y año.' },
          { q: '¿El seguro cubre a un segundo conductor?', a: 'Depende de la póliza. Algunas compañías piden declarar a todos los conductores habituales; usar la moto con un conductor no declarado puede afectar la cobertura ante un siniestro.' }
        ]
      },
      {
        type: 'links',
        heading: 'Seguir leyendo',
        items: [
          { href: '/autos/', label: 'Seguro de auto en Paraguay' },
          { href: '/aseguradoras/', label: 'Cómo verificar una aseguradora o un corredor' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S07 */
  {
    id: 'hogar',
    slug: '/hogar/',
    kind: 'hub',
    parent: 'home',
    breadcrumbLabel: 'Hogar',
    title: 'Seguro de hogar en Paraguay: coberturas y límites',
    description: 'Qué protege un seguro de hogar en Paraguay, qué diferencia hay entre continente y contenido, y qué exclusiones conviene revisar antes de asegurar una vivienda.',
    h1: 'Seguro de hogar: coberturas y límites',
    eyebrow: 'Guía del ramo',
    summary: 'Un seguro de hogar protege la vivienda y, según la póliza, sus bienes contra riesgos como incendio, robo o daños por agua. El detalle está siempre en las condiciones particulares.',
    cta: { label: 'Cómo verificar una aseguradora', href: '/aseguradoras/' },
    disclaimers: ['S'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Continente y contenido',
        body: [
          'La mayoría de las pólizas de hogar distinguen entre continente, la estructura de la vivienda, y contenido, los bienes muebles dentro de ella. Podés asegurar solo el continente, solo el contenido, o ambos, con sumas aseguradas independientes para cada uno.',
          'Los riesgos habituales incluyen incendio, explosión, daños por agua, fenómenos climáticos y robo con violencia. Cada riesgo puede tener su propio sublímite y sus propias exclusiones dentro de la misma póliza.'
        ]
      },
      {
        type: 'list',
        heading: 'Qué revisar antes de contratar',
        items: [
          'Si la suma asegurada del continente refleja el costo de reconstrucción, no el valor de mercado del inmueble.',
          'Si el contenido tiene un límite general y sublímites para objetos de valor (joyas, electrónica, obras de arte).',
          'Qué exclusiones aplican: humedad preexistente, desgaste, ausencia prolongada de la vivienda, uso comercial no declarado.',
          'Si el robo requiere signos de violencia o forzamiento para activarse.',
          'Qué documentación vas a necesitar para denunciar un siniestro: fotos, denuncia policial, comprobantes de compra.',
          'Si existe responsabilidad civil frente a terceros incluida, por ejemplo por daños a un vecino.'
        ]
      },
      {
        type: 'links',
        heading: 'Seguir leyendo',
        items: [
          { href: '/responsabilidad-civil/', label: 'Responsabilidad civil: coberturas y condiciones' },
          { href: '/empresas/', label: 'Seguros para empresas' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S08 */
  {
    id: 'vida',
    slug: '/vida/',
    kind: 'hub',
    parent: 'home',
    breadcrumbLabel: 'Vida',
    title: 'Seguro de vida en Paraguay: condiciones para consultar',
    description: 'Qué tipos de seguro de vida existen en Paraguay, qué preguntas conviene hacer sobre beneficiarios, exclusiones y capital asegurado antes de contratar una póliza.',
    h1: 'Seguro de vida: condiciones para consultar',
    eyebrow: 'Guía del ramo',
    summary: 'Un seguro de vida paga un capital a los beneficiarios designados ante el fallecimiento del asegurado, y en algunos productos ante invalidez o enfermedades graves. Las condiciones varían mucho entre pólizas.',
    cta: { label: 'Cómo verificar una aseguradora', href: '/aseguradoras/' },
    disclaimers: ['S'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Tipos habituales',
        body: [
          'El seguro de vida temporal cubre un período determinado y paga el capital asegurado si el fallecimiento ocurre dentro de ese plazo; si el plazo termina sin siniestro, no hay valor de rescate. Otros productos combinan cobertura de vida con un componente de ahorro o inversión, con reglas propias de rescate según lo que fije cada contrato.',
          'Muchas pólizas de vida agregan coberturas adicionales, como invalidez total y permanente o enfermedades graves, cada una con su propia definición contractual de qué situaciones activan el pago.'
        ]
      },
      {
        type: 'list',
        heading: 'Qué preguntar antes de contratar',
        items: [
          'Qué capital asegurado corresponde a cada cobertura y cómo se actualiza con el tiempo.',
          'Quiénes son los beneficiarios designados y cómo se modifican durante la vigencia.',
          'Qué exclusiones aplican: preexistencias no declaradas, ciertas causas de fallecimiento, actividades de riesgo.',
          'Si existe un período de carencia antes de que ciertas coberturas empiecen a regir.',
          'Qué documentación exige la declaración jurada de salud al contratar.',
          'Si el producto tiene valor de rescate y cómo se calcula al momento de rescindir.'
        ]
      },
      {
        type: 'links',
        heading: 'Seguir leyendo',
        items: [
          { href: '/empresas/', label: 'Seguros para empresas' },
          { href: '/glosario/', label: 'Glosario de seguros y planes asistenciales' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S13 */
  {
    id: 'salud-comparar-planes',
    slug: '/salud/comparar-planes/',
    kind: 'comparison',
    parent: 'salud',
    breadcrumbLabel: 'Comparar planes',
    title: 'Criterios para comparar planes de salud y sanatorios en Paraguay',
    description: 'Criterios para comparar planes de medicina prepaga en Paraguay: red de sanatorios, consultas incluidas, copagos, carencias y preexistencias, sin ordenar ni recomendar prestadores.',
    h1: 'Cómo comparar planes de salud y sanatorios',
    eyebrow: 'Comparación de criterios',
    summary: 'La medicina prepaga no es un seguro, y no hay una suma asegurada que comparar. Esta página ordena los criterios que sí sirven para comparar un plan frente a otro.',
    cta: { label: 'Medicina prepaga y planes de salud', href: '/salud/' },
    disclaimers: ['H', 'M'],
    updated: REVIEWED,
    sections: [
      {
        type: 'compare',
        heading: 'Criterios para comparar planes asistenciales',
        caption: 'Comparación de criterios generales entre planes de medicina prepaga. No refleja precios ni condiciones de un prestador específico.',
        columns: ['Criterio', 'Qué mirar', 'Por qué importa'],
        rows: [
          ['Red de sanatorios', 'Ciudades y centros incluidos', 'Define dónde te podés atender sin costo aparte'],
          ['Consultas incluidas', 'Cantidad anual por especialidad', 'Cambia mucho el uso real del plan'],
          ['Copagos', 'Monto por consulta, estudio e internación', 'Es el costo que se paga además de la cuota'],
          ['Carencias', 'Plazo por tipo de prestación', 'Define desde cuándo se puede usar cada beneficio'],
          ['Preexistencias', 'Cómo se declaran y qué implican', 'Puede generar exclusiones o esperas específicas'],
          ['Actualización de cuota', 'Frecuencia y criterio de ajuste', 'Afecta el costo del plan a lo largo del tiempo']
        ],
        methodology: 'Cuadro elaborado con los criterios habituales de lectura de un contrato de medicina prepaga en Paraguay. No compara prestadores concretos ni constituye una recomendación.',
        reviewed: REVIEWED
      },
      {
        type: 'prose',
        heading: 'Cómo usar esta comparación',
        body: [
          'Pedí a cada prestador la misma información, en el mismo orden: red, consultas, copagos, carencias y preexistencias. Solo así los datos que recibas van a ser comparables entre sí.',
          'Esta página no ordena prestadores por precio ni por calidad. Esta página no nombra prestadores: pedí a cada uno la misma información y verificá su habilitación en la Superintendencia de Salud.'
        ]
      },
      { type: 'links', heading: 'Dónde verificar', items: [{ href: 'https://superintendenciadesalud.gov.py/', label: 'Superintendencia de Salud', note: 'organismo de supervisión de prestadores de salud' }] }
    ]
  },

  /* ------------------------------------------------------------------ S14 */
  {
    id: 'asistencia-al-viajero',
    slug: '/asistencia-al-viajero/',
    kind: 'hub',
    parent: 'home',
    breadcrumbLabel: 'Asistencia al viajero',
    title: 'Asistencia al viajero: prestaciones y condiciones',
    description: 'Qué es la asistencia al viajero, en qué se diferencia de un seguro de viaje tradicional y qué prestaciones, exclusiones y respaldo asegurador conviene verificar antes de viajar.',
    h1: 'Asistencia al viajero: prestaciones y condiciones',
    eyebrow: 'Guía del ramo',
    summary: 'La asistencia al viajero es un servicio contractual: lo que cubre depende exactamente de lo que dice el contrato, no de lo que promete el nombre comercial del producto.',
    cta: { label: 'Ver asistencia por tarjeta de crédito', href: '/asistencia-al-viajero/tarjetas-de-credito/' },
    disclaimers: ['T'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Servicio contractual, no siempre un seguro',
        body: [
          'La asistencia al viajero puede prestarse de dos maneras: como un servicio de asistencia directa, donde una central coordina médicos, traslados u hoteles ante un evento cubierto, o con un respaldo asegurador detrás, donde además existen reembolsos e indemnizaciones sujetas a póliza.',
          'La diferencia importa porque cambia qué podés reclamar y cómo: un servicio de asistencia pura resuelve el problema en el momento, según sus prestaciones contratadas; un respaldo asegurador agrega la posibilidad de reembolso o indemnización, con sus propios plazos y documentación.'
        ]
      },
      {
        type: 'list',
        heading: 'Qué verificar antes de viajar',
        items: [
          'Qué prestaciones están incluidas: asistencia médica, traslados, gastos de hospedaje, pérdida de equipaje.',
          'Cuál es el límite de cobertura por evento y el límite total del contrato.',
          'Qué exclusiones aplican: deportes de riesgo, embarazo avanzado, condiciones preexistentes.',
          'Cómo y en qué plazo se activa la asistencia durante el viaje, y el teléfono de la central operativa.',
          'Si el producto tiene respaldo de una aseguradora identificada o es un servicio de asistencia sin ese respaldo.',
          'Qué documentación vas a necesitar para un reembolso posterior al viaje.'
        ]
      },
      {
        type: 'links',
        heading: 'Seguir leyendo',
        items: [
          { href: '/asistencia-al-viajero/tarjetas-de-credito/', label: 'Asistencia al viajero con tarjetas de crédito' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S15 */
  {
    id: 'asistencia-al-viajero-tarjetas-de-credito',
    slug: '/asistencia-al-viajero/tarjetas-de-credito/',
    kind: 'guide',
    parent: 'asistencia-al-viajero',
    breadcrumbLabel: 'Tarjetas de crédito',
    title: 'Asistencia al viajero con tarjetas de crédito: qué revisar',
    description: 'Cómo funciona la asistencia al viajero incluida con tarjetas de crédito, cómo activarla, qué verificar de su respaldo asegurador y qué preguntar antes de viajar confiando en ese beneficio.',
    h1: 'Asistencia al viajero con tarjetas de crédito: qué revisar',
    eyebrow: 'Beneficio de tarjeta',
    summary: 'Muchas tarjetas de crédito incluyen asistencia al viajero como beneficio adicional. El alcance depende del convenio entre el emisor de la tarjeta y el prestador, y conviene verificarlo antes de viajar, no durante una emergencia.',
    cta: { label: 'Ver la guía general de asistencia al viajero', href: '/asistencia-al-viajero/' },
    disclaimers: ['T'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Cómo suele activarse',
        body: [
          'La asistencia asociada a una tarjeta de crédito habitualmente exige un requisito de activación: por ejemplo, haber pagado el pasaje o una parte del viaje con esa tarjeta, o estar al día con la cuenta. Verificá el requisito exacto con el emisor antes de asumir que el beneficio aplica.',
          'El alcance de las prestaciones (límites, exclusiones, zonas cubiertas) depende del convenio vigente entre el banco emisor y el prestador de asistencia, y puede cambiar de un año a otro sin que el titular lo note hasta necesitarlo.'
        ]
      },
      {
        type: 'list',
        heading: 'Qué verificar antes de viajar',
        items: [
          'Requisito de activación del beneficio: forma de pago, antigüedad de la tarjeta, categoría de la tarjeta.',
          'Vigencia territorial: países o regiones cubiertos y duración máxima del viaje.',
          'Límite de cobertura por evento médico y exclusiones habituales (deportes de riesgo, preexistencias).',
          'Si existe un respaldo asegurador identificado detrás del beneficio, y cuál es.',
          'Teléfono de la central de asistencia y procedimiento para activarla desde el exterior.',
          'Si conviene contratar una cobertura adicional para viajes largos o de mayor riesgo.'
        ]
      },
      {
        type: 'faq',
        heading: 'Preguntas frecuentes',
        items: [
          { q: '¿Toda tarjeta de crédito incluye asistencia al viajero?', a: 'No necesariamente. Depende de la categoría de la tarjeta y del convenio del emisor con un prestador de asistencia. Consultá directamente con tu banco cuál es tu beneficio concreto.' },
          { q: '¿El beneficio de la tarjeta reemplaza un seguro de viaje?', a: 'No siempre cubre lo mismo. Compará los límites y exclusiones del beneficio de tarjeta con los de un producto de asistencia contratado aparte antes de decidir que alcanza.' },
          { q: '¿Qué hago si la asistencia no responde en el destino?', a: 'Guardá los datos de contacto alternativos del emisor de la tarjeta y conservá comprobantes de gastos médicos para un reclamo posterior. Este portal no gestiona esos reclamos.' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S16 */
  {
    id: 'empresas',
    slug: '/empresas/',
    kind: 'hub',
    parent: 'home',
    breadcrumbLabel: 'Empresas',
    title: 'Seguros para empresas en Paraguay: preguntas al proveedor',
    description: 'Qué tipos de seguros contratan las empresas en Paraguay, desde responsabilidad civil hasta seguros patrimoniales, y qué preguntas conviene hacer antes de contratar una póliza comercial.',
    h1: 'Seguros para empresas: preguntas al proveedor',
    eyebrow: 'Guía del ramo',
    summary: 'Los riesgos de una empresa varían según el rubro y el tamaño. Esta guía no evalúa tu riesgo particular: ordena las preguntas que conviene hacerle a un asegurador o corredor especializado.',
    cta: { label: 'Ver responsabilidad civil', href: '/responsabilidad-civil/' },
    disclaimers: ['S'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Categorías habituales',
        body: [
          'Las empresas suelen combinar varias pólizas: seguros patrimoniales sobre edificios, mercadería o maquinaria; responsabilidad civil frente a terceros; seguros de transporte de mercadería; y coberturas de personal, como accidentes de trabajo o vida colectiva.',
          'La combinación correcta depende del rubro, del tamaño de la operación y de los contratos que la empresa firma con clientes o proveedores, que a veces exigen determinadas coberturas mínimas.'
        ]
      },
      {
        type: 'list',
        heading: 'Preguntas para el proveedor',
        items: [
          'Qué bienes y actividades quedan efectivamente cubiertos y con qué sumas aseguradas.',
          'Qué exclusiones aplican por rubro (por ejemplo, actividades de mayor riesgo o mercadería específica).',
          'Si existe responsabilidad civil por productos o por servicios prestados a terceros.',
          'Qué documentación se necesita para denunciar un siniestro y en qué plazo.',
          'Si la póliza exige medidas de prevención (alarmas, extintores, protocolos) como condición de cobertura.',
          'Cómo se actualizan las sumas aseguradas frente a la inflación o al crecimiento del negocio.'
        ]
      },
      {
        type: 'links',
        heading: 'Seguir leyendo',
        items: [
          { href: '/responsabilidad-civil/', label: 'Responsabilidad civil: coberturas y condiciones' },
          { href: '/corredores/', label: 'Corredores de seguros: cómo consultar su habilitación' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S17 */
  {
    id: 'responsabilidad-civil',
    slug: '/responsabilidad-civil/',
    kind: 'guide',
    parent: 'empresas',
    breadcrumbLabel: 'Responsabilidad civil',
    title: 'Responsabilidad civil: coberturas y condiciones',
    description: 'Qué es un seguro de responsabilidad civil, qué situaciones cubre habitualmente, qué límites y exclusiones tiene y cómo se diferencia de la responsabilidad civil incluida en el seguro de auto.',
    h1: 'Responsabilidad civil: coberturas y condiciones',
    eyebrow: 'Concepto',
    summary: 'La responsabilidad civil cubre lo que una persona o una empresa está obligada a indemnizar por daños causados a terceros. Existe como cobertura independiente y también incluida dentro de otras pólizas, como la de auto.',
    cta: { label: 'Ver seguros para empresas', href: '/empresas/' },
    disclaimers: ['S'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Qué cubre y qué no',
        body: [
          'Un seguro de responsabilidad civil indemniza a un tercero por los daños que el asegurado le causó, dentro del límite y las condiciones que fija la póliza. No indemniza al propio asegurado por sus daños, ni cubre obligaciones asumidas fuera del contrato de seguro.',
          'Existen variantes: responsabilidad civil general, hacia productos vendidos, hacia servicios profesionales o incluida dentro de otra póliza (como la del auto o la del hogar). Cada variante define su propio alcance de actividades cubiertas.'
        ]
      },
      {
        type: 'list',
        heading: 'Qué revisar en una póliza de responsabilidad civil',
        items: [
          'Qué actividades o situaciones están específicamente cubiertas.',
          'El límite de indemnización por evento y el límite agregado por vigencia.',
          'Exclusiones habituales: dolo, actividades no declaradas, daños a bienes propios.',
          'Si cubre gastos de defensa legal ante un reclamo, además de la indemnización.',
          'Plazo y forma de notificar un reclamo de un tercero para no perder cobertura.'
        ]
      },
      {
        type: 'links',
        heading: 'Seguir leyendo',
        items: [
          { href: '/empresas/', label: 'Seguros para empresas' },
          { href: '/hogar/', label: 'Seguro de hogar' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S27 */
  {
    id: 'corredores',
    slug: '/corredores/',
    kind: 'guide',
    parent: 'aseguradoras',
    breadcrumbLabel: 'Corredores de seguros',
    title: 'Corredores de seguros: cómo consultar su habilitación',
    description: 'Qué es un corredor de seguros en Paraguay, qué rol cumple frente al asegurado y la compañía, y cómo verificar su matrícula ante el organismo de supervisión antes de operar con uno.',
    h1: 'Corredores de seguros: cómo consultar su habilitación',
    eyebrow: 'Intermediación',
    summary: 'Un corredor de seguros es un intermediario entre quien busca un seguro y las aseguradoras. Antes de operar con uno, conviene verificar su habilitación ante el organismo de supervisión.',
    cta: { label: 'Cómo verificar una aseguradora', href: '/aseguradoras/' },
    disclaimers: ['S'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Qué hace un corredor',
        body: [
          'Un corredor de seguros es un intermediario: presenta propuestas de una o varias aseguradoras. Cada corredor define con qué compañías trabaja y cómo cobra, y eso conviene preguntarlo por escrito antes de aceptar una propuesta.',
          'Seguro.com.py no recomienda corredores ni los lista. La habilitación se verifica en la fuente oficial indicada al final de esta página.'
        ]
      },
      {
        type: 'list',
        heading: 'Qué verificar antes de operar con un corredor',
        items: [
          'Que figure como habilitado ante la Superintendencia de Seguros del Banco Central del Paraguay.',
          'Con qué compañías trabaja habitualmente y si eso limita las propuestas que te va a presentar.',
          'Cómo se comunica la comisión que recibe y si eso afecta el precio final que pagás.',
          'Qué documentación te entrega de cada propuesta, además de un monto verbal.',
          'Cómo actúa ante un siniestro: si acompaña la gestión o solo intermedió la contratación inicial.'
        ]
      },
      {
        type: 'links',
        heading: 'Verificar la habilitación',
        items: [
          { href: 'https://www.bcp.gov.py/web/institucional/entidades-supervisadas1', label: 'Superintendencia de Seguros — Banco Central del Paraguay', note: 'organismo de supervisión; consultá acá la habilitación' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S28 */
  {
    id: 'comparar',
    slug: '/comparar/',
    kind: 'comparison',
    parent: 'home',
    breadcrumbLabel: 'Comparar',
    title: 'Criterios para comparar seguros en Paraguay',
    description: 'Cómo comparar seguros con criterio: coberturas, franquicia, asistencia, exclusiones y forma de pago, en lugar de comparar solo el precio final de una propuesta.',
    h1: 'Criterios para comparar seguros',
    eyebrow: 'Comparación de criterios',
    summary: 'Comparar seguros solo por precio suele llevar a comparar productos distintos. Esta página ordena los criterios que sí permiten una comparación justa.',
    cta: { label: 'Ver la comparación de seguros de auto', href: '/comparar/seguros-de-auto/' },
    disclaimers: ['S', 'M'],
    updated: REVIEWED,
    sections: [
      {
        type: 'list',
        heading: 'Los cinco criterios que importan',
        lede: 'Pedí a cada compañía la misma información sobre estos cinco puntos antes de comparar montos.',
        items: [
          'Coberturas: qué eventos están efectivamente incluidos y con qué sumas aseguradas.',
          'Franquicia: monto o porcentaje que queda a tu cargo en cada siniestro cubierto.',
          'Asistencia: qué servicios adicionales incluye la póliza, como grúa o auxilio mecánico.',
          'Exclusiones: qué situaciones quedan expresamente fuera de cobertura.',
          'Forma de pago: contado, cuotas, recargos por financiación e impuestos incluidos o no en el monto informado.'
        ]
      },
      {
        type: 'prose',
        heading: 'Por qué no publicamos rankings',
        body: [
          'Este portal no ordena ni puntúa aseguradoras ni usa superlativos para describir un producto. Cada situación depende del perfil de riesgo, del presupuesto y de lo que decida el proveedor tras evaluar tu caso concreto.',
          'Lo que sí podemos ofrecer es un mismo esquema de preguntas para que las respuestas que recibas de distintas compañías sean comparables entre sí.'
        ]
      },
      {
        type: 'links',
        heading: 'Comparaciones por ramo',
        items: [
          { href: '/comparar/seguros-de-auto/', label: 'Cómo comparar seguros de auto' },
          { href: '/salud/comparar-planes/', label: 'Comparativa de planes de salud' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S29 */
  {
    id: 'comparar-seguros-de-auto',
    slug: '/comparar/seguros-de-auto/',
    kind: 'comparison',
    parent: 'comparar',
    breadcrumbLabel: 'Seguros de auto',
    title: 'Cómo comparar seguros de auto en Paraguay',
    description: 'Criterios concretos para comparar propuestas de seguro de auto en Paraguay: coberturas, franquicia, asistencia, exclusiones y forma de pago, sin rankear aseguradoras.',
    h1: 'Cómo comparar seguros de auto en Paraguay',
    eyebrow: 'Comparación de criterios',
    summary: 'Dos propuestas de seguro de auto rara vez son idénticas. Esta guía ordena los criterios para que puedas detectar en qué se diferencian antes de decidir por precio.',
    cta: { label: 'Cómo pedir una cotización', href: '/autos/cotizar/' },
    disclaimers: ['S', 'M'],
    updated: REVIEWED,
    sections: [
      {
        type: 'compare',
        heading: 'Qué comparar entre propuestas de auto',
        caption: 'Criterios generales para comparar propuestas de seguro de automotor. No refleja precios de ninguna compañía en particular.',
        columns: ['Criterio', 'Qué pedir', 'Riesgo de no verificarlo'],
        rows: [
          ['Cobertura', 'Tipo exacto: contra terceros, intermedia o todo riesgo', 'Comparar precios de productos distintos'],
          ['Suma asegurada', 'Monto del vehículo y de responsabilidad civil', 'Quedar subasegurado ante un siniestro grave'],
          ['Franquicia', 'Monto exacto y si es fija o porcentual', 'Sorpresas en el desembolso ante un siniestro'],
          ['Exclusiones', 'Listado completo, no solo un resumen', 'Reclamos rechazados por situaciones no cubiertas'],
          ['Asistencia', 'Grúa, auxilio mecánico, auto de reemplazo', 'Pagar aparte servicios que creías incluidos'],
          ['Forma de pago', 'Contado, cuotas, recargos e impuestos', 'Comparar precios sin los mismos componentes']
        ],
        methodology: 'Cuadro elaborado con los criterios habituales de una propuesta de seguro de automotor en el mercado paraguayo. No refleja el producto de ninguna compañía en particular.',
        reviewed: REVIEWED
      },
      {
        type: 'links',
        heading: 'Seguir leyendo',
        items: [
          { href: '/autos/cotizar/', label: 'Cómo pedir una cotización de seguro de auto' },
          { href: '/autos/todo-riesgo/', label: 'Seguro todo riesgo: franquicia y deducible' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S30 */
  {
    id: 'guias-cuanto-cuesta-un-seguro-de-auto-en-paraguay',
    slug: '/guias/cuanto-cuesta-un-seguro-de-auto-en-paraguay/',
    kind: 'guide',
    parent: 'autos',
    breadcrumbLabel: 'Cuánto cuesta',
    title: 'Cuánto cuesta un seguro de auto en Paraguay',
    description: 'Qué factores influyen en el precio de un seguro de auto en Paraguay: tipo de cobertura, vehículo, uso y franquicia, sin publicar montos estimados ni precios de referencia.',
    h1: 'Cuánto cuesta un seguro de auto en Paraguay',
    eyebrow: 'Guía de precio',
    summary: 'No publicamos un monto de referencia porque no existe un precio único: cada propuesta depende de varias variables que conviene entender antes de pedir precios.',
    cta: { label: 'Cómo pedir una cotización', href: '/autos/cotizar/' },
    disclaimers: ['S'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Por qué no hay un precio único',
        body: [
          'El precio que cobra una compañía surge de cómo evalúa el riesgo de asegurar ese vehículo con ese conductor. Dos personas con el mismo modelo de auto pueden recibir propuestas distintas si cambian variables como el uso, la ciudad o el historial declarado.',
          'Por eso este portal no publica precios de referencia: cualquier cifra sin el contexto completo de la propuesta induciría a comparar cosas distintas.'
        ]
      },
      {
        type: 'list',
        heading: 'Factores que mueven el precio',
        items: [
          'Tipo de cobertura: contra terceros, intermedia o todo riesgo.',
          'Marca, modelo, versión, año y valor de mercado del vehículo.',
          'Uso declarado: particular, laboral o comercial.',
          'Ciudad de circulación y de guarda habitual del vehículo.',
          'Antigüedad del registro de conducir y edad del conductor habitual.',
          'Monto de la franquicia elegida: a mayor franquicia, menor suele ser la prima.',
          'Forma de pago: contado o financiado, con eventuales recargos.'
        ]
      },
      {
        type: 'links',
        heading: 'Seguir leyendo',
        items: [
          { href: '/autos/cotizar/', label: 'Cómo pedir una cotización' },
          { href: '/comparar/seguros-de-auto/', label: 'Cómo comparar seguros de auto' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S31 */
  {
    id: 'guias-que-pasa-si-choco-y-no-tengo-seguro',
    slug: '/guias/que-pasa-si-choco-y-no-tengo-seguro/',
    kind: 'guide',
    parent: 'autos',
    breadcrumbLabel: 'Si chocás sin seguro',
    title: 'Qué pasa si chocás y no tenés seguro',
    description: 'Pasos generales a considerar tras un choque sin seguro de auto en Paraguay, y por qué conviene asesorarse con una fuente legal antes de tomar decisiones sobre responsabilidad y pagos.',
    h1: 'Qué pasa si chocás y no tenés seguro',
    eyebrow: 'Guía general',
    summary: 'Qué conviene hacer, en términos generales, después de un choque cuando no hay seguro. Esta guía no reemplaza el asesoramiento legal sobre tu caso concreto.',
    cta: { label: 'Ver qué cubre el contra terceros', href: '/autos/contra-terceros/' },
    disclaimers: ['S', 'D'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'La diferencia de no tener cobertura',
        body: [
          'Con un seguro contra terceros vigente, la compañía responde por los daños que le causás a otra persona, hasta el límite de la póliza. Sin seguro, no hay una compañía que responda por esos daños, y el reclamo puede dirigirse directamente a quien los causó. Las vías y los plazos dependen del caso: consultalos con un abogado.',
          'Esto aplica tanto si vos causaste el daño como si lo sufriste: si no tenés seguro y te chocan, tu propio vehículo tampoco tiene cobertura para sus daños, salvo que el responsable o su aseguradora se hagan cargo.'
        ]
      },
      {
        type: 'steps',
        heading: 'Pasos generales a considerar',
        items: [
          { title: 'Priorizá la seguridad', text: 'Atendé primero cualquier lesión y señalizá el lugar para evitar un segundo accidente.' },
          { title: 'Documentá el hecho', text: 'Sacá fotos del lugar, de los vehículos y de cualquier daño visible antes de mover los autos, si es seguro hacerlo.' },
          { title: 'Hacé la denuncia correspondiente', text: 'Según el caso, puede corresponder dar aviso a la autoridad de tránsito. Verificá el procedimiento vigente en fuentes oficiales.' },
          { title: 'Consultá asesoramiento legal', text: 'Un abogado puede orientarte sobre responsabilidad, plazos y opciones de resarcimiento según las circunstancias específicas del caso.' }
        ]
      },
      {
        type: 'note',
        heading: 'Esto no es asesoramiento legal',
        body: 'Esta guía describe pasos generales y no reemplaza una consulta con un profesional del derecho sobre tu situación particular. Las consecuencias legales de un siniestro dependen de las circunstancias del caso y de la normativa vigente.'
      },
      {
        type: 'links',
        heading: 'Seguir leyendo',
        items: [
          { href: '/autos/contra-terceros/', label: 'Qué cubre el seguro contra terceros' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S32 */
  {
    id: 'guias-como-funciona-la-franquicia-o-deducible',
    slug: '/guias/como-funciona-la-franquicia-o-deducible/',
    kind: 'guide',
    parent: 'autos',
    breadcrumbLabel: 'Franquicia o deducible',
    title: 'Cómo funciona la franquicia o deducible',
    description: 'Qué es la franquicia o deducible en un seguro, cómo se aplica ante un siniestro y un ejemplo con números ilustrativos para entender el cálculo.',
    h1: 'Cómo funciona la franquicia o deducible',
    eyebrow: 'Concepto',
    summary: 'La franquicia es la parte del daño que asume el asegurado en cada siniestro cubierto. Entender cómo se calcula ayuda a elegir un monto acorde a tu situación.',
    cta: { label: 'Seguro todo riesgo: franquicia y deducible', href: '/autos/todo-riesgo/' },
    disclaimers: ['S'],
    updated: REVIEWED,
    sections: [
      {
        type: 'prose',
        heading: 'Qué es y para qué existe',
        body: [
          'La franquicia o deducible es el monto que el asegurado asume por su cuenta en cada siniestro cubierto, antes de que la aseguradora pague el resto. Existe para evitar reclamos de montos muy pequeños y para que el asegurado comparta parte del riesgo, lo que en general reduce el costo de la prima.',
          'Se define en la póliza como un monto fijo en guaraníes o como un porcentaje de la suma asegurada, y suele aplicarse solo a los daños propios del vehículo asegurado, no a los daños a terceros.'
        ]
      },
      {
        type: 'prose',
        heading: 'Un ejemplo delimitado',
        body: [
          'Ejemplo ilustrativo con unidades, no con montos reales: si un siniestro cubierto genera un daño de 100 unidades y la póliza tiene un deducible fijo de 30 unidades, el pago de la aseguradora sería de 70 unidades y las 30 restantes quedan a cargo del asegurado. Es un ejemplo simplificado: cada póliza define sus propias reglas de cálculo, topes y excepciones.'
        ]
      },
      {
        type: 'links',
        heading: 'Seguir leyendo',
        items: [
          { href: '/autos/todo-riesgo/', label: 'Seguro todo riesgo: franquicia y deducible' }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ S33 */
  {
    id: 'glosario',
    slug: '/glosario/',
    kind: 'glossary',
    parent: 'home',
    breadcrumbLabel: 'Glosario',
    title: 'Glosario de seguros y planes asistenciales',
    description: 'Definiciones claras de los términos más usados en seguros y medicina prepaga en Paraguay: franquicia, prima, siniestro, carencia, copago y más, con enlaces a las guías relacionadas.',
    h1: 'Glosario de seguros y planes asistenciales',
    eyebrow: 'Vocabulario',
    summary: 'Términos frecuentes en pólizas de seguro y contratos de medicina prepaga, explicados de forma general y sin sustituir la definición contractual de cada documento.',
    cta: { label: 'Volver a la guía de autos', href: '/autos/' },
    disclaimers: ['S', 'H'],
    updated: REVIEWED,
    sections: [
      {
        type: 'glossary',
        heading: 'Términos de seguros',
        items: [
          { term: 'Prima', definition: 'El monto que el asegurado paga a la compañía a cambio de la cobertura contratada, ya sea en un pago o en cuotas.' },
          { term: 'Suma asegurada', definition: 'El límite máximo que la aseguradora se compromete a pagar ante un siniestro cubierto, según lo pactado en la póliza.' },
          { term: 'Franquicia o deducible', definition: 'La parte del daño que queda a cargo del asegurado en cada siniestro cubierto, antes del pago de la aseguradora.' },
          { term: 'Siniestro', definition: 'El evento cubierto por la póliza que da lugar a un reclamo, como un choque, un robo o un incendio.' },
          { term: 'Póliza', definition: 'El contrato de seguro, con sus condiciones generales y particulares, que define coberturas, exclusiones y obligaciones de ambas partes.' },
          { term: 'Responsabilidad civil', definition: 'La obligación de indemnizar a un tercero por los daños que le causaste, cubierta hasta el límite fijado en la póliza.' },
          { term: 'Corredor de seguros', definition: 'Intermediario matriculado que gestiona propuestas y pólizas por cuenta del asegurado ante distintas compañías.' }
        ]
      },
      {
        type: 'glossary',
        heading: 'Términos de medicina prepaga y viaje',
        items: [
          { term: 'Medicina prepaga', definition: 'Servicio asistencial que da acceso a una red de prestadores médicos a cambio de una cuota; no es un seguro y no paga indemnizaciones.' },
          { term: 'Carencia', definition: 'El tiempo que hay que esperar desde el inicio del contrato hasta poder usar una prestación específica.' },
          { term: 'Copago', definition: 'El monto que el afiliado paga por cada consulta, estudio o internación, además de la cuota mensual del plan.' },
          { term: 'Preexistencia', definition: 'Una condición de salud anterior al inicio del contrato, que el prestador puede tratar con esperas o condiciones específicas.' },
          { term: 'Asistencia al viajero', definition: 'Servicio contractual que coordina prestaciones (médicas, de traslado u otras) durante un viaje, con o sin respaldo asegurador.' }
        ]
      }
    ]
  },
];

/* ------------------------------------------------------------------------
   Derived content: hub pages that list child pages (provider directories,
   comparison indexes) are generated from PAGES itself instead of hand-kept,
   so a new provider or comparison page automatically appears on its hub
   without a second edit. Only sections explicitly marked below are derived;
   everything else in a record above is authored by hand. */

function byId(id) {
  const page = PAGES.find((p) => p.id === id);
  if (!page) throw new Error(`Derived content: unknown page id ${id}`);
  return page;
}

function childCard(page, eyebrow) {
  return {
    eyebrow,
    title: page.breadcrumbLabel,
    text: page.summary,
    href: page.slug,
    linkLabel: 'Ver la ficha'
  };
}

function childLink(page) {
  return { href: page.slug, label: page.breadcrumbLabel };
}

/* /comparar/ — link every comparison page that lives under this hub, plus
   the salud comparison (a different parent, kept as a manual cross-link
   because it belongs to a different section of the site). */
{
  const hub = byId('comparar');
  const linksSection = hub.sections.find((s) => s.type === 'links' && s.heading === 'Comparaciones por ramo');
  const childComparisons = PAGES
    .filter((p) => p.kind === 'comparison' && p.parent === 'comparar')
    .map((p) => childLink(p));
  linksSection.items = [...childComparisons, childLink(byId('salud-comparar-planes'))];
}

/* /autos/ — link the three auto guias children alongside the existing
   "Seguir leyendo" cards, so a new /guias/ page under autos appears here
   without editing this record by hand. */
{
  const hub = byId('autos');
  const seguirLeyendo = hub.sections.find((s) => s.type === 'cards' && s.heading === 'Seguir leyendo');
  const guiaChildren = PAGES
    .filter((p) => p.parent === 'autos' && p.slug.startsWith('/guias/'))
    .map((p) => ({
      title: p.breadcrumbLabel,
      text: p.summary,
      href: p.slug,
      linkLabel: 'Ver la guía'
    }));
  seguirLeyendo.items.push(...guiaChildren);
}

/* Home — point readers at the three new auto guias from the "Cómo usar este
   sitio" steps band via a small links section appended after it. */
{
  const home = byId('home');
  const stepsIndex = home.sections.findIndex((s) => s.type === 'steps');
  home.sections.splice(stepsIndex + 1, 0, {
    type: 'links',
    heading: 'Guías rápidas de auto',
    items: PAGES
      .filter((p) => p.parent === 'autos' && p.slug.startsWith('/guias/'))
      .map((p) => childLink(p))
  });
}

/* Sources shown at the end of every guide-like page (standard: each guide lists its sources with
   the date they were consulted). Pages that already declare their own `sources` are left alone. */
{
  const withSis = new Set(['autos-cotizar', 'corredores', 'preguntas-frecuentes', 'autos', 'comparar', 'comparar-seguros-de-auto', 'guias-cuanto-cuesta-un-seguro-de-auto-en-paraguay']);
  const health = new Set(['salud', 'salud-comparar-planes']);
  for (const page of PAGES) {
    if (page.sources || !['guide', 'hub', 'comparison', 'glossary', 'faq'].includes(page.kind)) continue;
    if (page.id === 'contacto-busco-un-seguro') continue;
    if (health.has(page.id)) page.sources = [SRC_SALUD, SRC_SIS, SRC_POLIZA];
    else if (page.id === 'corredores') page.sources = [SRC_SIS];
    else if (withSis.has(page.id)) page.sources = [SRC_POLIZA, SRC_SIS];
    else page.sources = [SRC_POLIZA];
  }
}

export default PAGES;
