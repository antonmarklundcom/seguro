// Page content for seguro.com.py (information-only, no forms, no tracking).
// Rules: docs/DISCLAIMERS.md. No prices, no insurer names, no rankings, no promises.
// Every guide needs: slug, title, description, intro, body (HTML), todo (HTML list),
// sources [{label,url}], related [slugs]. `updated` comes from site.json.

const BCP = 'https://www.bcp.gov.py/';
const LEY827 = 'https://www.bcp.gov.py/documents/20117/213083/LEY_827_96_DE_SEGUROS.pdf/68f0897c-3e19-22c3-4904-367b1b2937a9?t=1741806943153';
const SIS_QUEJAS = 'https://www.bcp.gov.py/en/asistencia-al-usuario-de-la-sis';
const SIS_REGISTROS = 'https://www.bcp.gov.py/en/inscripciones';

export const guides = [
  {
    slug: 'como-leer-una-poliza',
    title: 'Cómo leer una póliza: qué mirar antes de firmar',
    description: 'Las partes de una póliza de seguro, qué significan y qué preguntas hacer antes de firmar.',
    intro: 'La póliza es el contrato del seguro. Todo lo que importa (qué cubre, qué no cubre y qué tenés que hacer si pasa algo) está ahí, no en la publicidad ni en lo que te dijeron de palabra.',
    body: `
<h2>Las partes de una póliza</h2>
<ul>
  <li><strong>Condiciones particulares:</strong> tus datos y los del seguro: quién es el tomador y el asegurado, qué se asegura, desde cuándo y hasta cuándo, y la suma asegurada.</li>
  <li><strong>Condiciones generales:</strong> las reglas comunes de ese tipo de seguro: qué está cubierto, qué está excluido, cómo se denuncia un siniestro y cuándo se puede rescindir.</li>
  <li><strong>Cláusulas adicionales o anexos:</strong> coberturas que se agregan o se quitan para tu caso.</li>
</ul>
<h2>Qué mirar, punto por punto</h2>
<ol>
  <li><strong>Quién es quién.</strong> Tomador (quien contrata), asegurado (quien está protegido) y beneficiario (quien cobra, si corresponde).</li>
  <li><strong>Qué está cubierto.</strong> Leé la lista de coberturas con los nombres exactos. Un mismo nombre comercial puede significar cosas distintas en cada aseguradora.</li>
  <li><strong>Qué está excluido.</strong> Las exclusiones son tan importantes como las coberturas. Buscá la sección "exclusiones" o "riesgos no cubiertos".</li>
  <li><strong>Suma asegurada y franquicia.</strong> Hasta cuánto paga la aseguradora y qué parte queda a tu cargo. Mirá <a href="/guias/que-es-la-franquicia/">qué es la franquicia</a>.</li>
  <li><strong>Plazos.</strong> Vigencia, plazos de espera o carencia, y plazo para avisar un siniestro.</li>
  <li><strong>Tus obligaciones.</strong> Qué datos tenés que declarar con veracidad y qué tenés que hacer si pasa algo. Declarar mal puede afectar un reclamo.</li>
  <li><strong>Renovación y cancelación.</strong> Cómo y cuándo se renueva, cómo se cancela y qué pasa con lo pagado.</li>
</ol>
<h2>Preguntas para hacer por escrito</h2>
<p>Si algo no está claro, pedí la respuesta por escrito. Lo que figura en la póliza es lo que vale. Si te dan una explicación verbal que no aparece en el documento, pedí que la incluyan.</p>`,
    todo: `<li>Pedí la póliza completa (condiciones generales y particulares) antes de firmar.</li><li>Subrayá coberturas, exclusiones, franquicia y plazos.</li><li>Anotá las dudas y pedí las respuestas por escrito.</li>`,
    sources: [
      { label: 'Ley 827/96 De Seguros (texto en el sitio del BCP)', url: LEY827 },
      { label: 'Superintendencia de Seguros, Banco Central del Paraguay', url: BCP },
    ],
    related: ['que-es-la-franquicia', 'terceros-vs-todo-riesgo', 'como-hacer-un-reclamo'],
  },
  {
    slug: 'que-es-la-franquicia',
    title: 'Qué es la franquicia (deducible) de un seguro',
    description: 'La franquicia es la parte del daño que paga el asegurado. Explicación con un ejemplo numérico simple.',
    intro: 'La franquicia (también llamada deducible) es la parte de un daño que queda a cargo del asegurado. La aseguradora paga el resto, hasta el límite de la suma asegurada.',
    body: `
<h2>Un ejemplo con números inventados</h2>
<p>Los números son solo para entender la idea; no son precios ni valores reales de ningún seguro.</p>
<ul>
  <li>Daño cubierto: <strong>100</strong>.</li>
  <li>Franquicia: <strong>20</strong>.</li>
  <li>El asegurado paga <strong>20</strong> y la aseguradora paga <strong>80</strong>.</li>
</ul>
<p>Si el daño fuera de 15 y la franquicia de 20, el daño no supera la franquicia y la aseguradora no paga nada.</p>
<h2>Distintas formas de definirla</h2>
<p>Cada póliza dice cómo se calcula. Puede ser un monto fijo o un porcentaje de la suma asegurada o del daño. Algunas coberturas tienen franquicia y otras no. Leé la definición exacta en tu póliza.</p>
<h2>Por qué importa</h2>
<p>La franquicia cambia lo que desembolsás cuando hay un siniestro. Al comparar dos pólizas, mirá la cobertura <em>y</em> la franquicia: una misma cobertura con franquicias distintas no es lo mismo.</p>`,
    todo: `<li>Buscá en la póliza la palabra "franquicia" o "deducible".</li><li>Preguntá si es un monto o un porcentaje y a qué coberturas se aplica.</li>`,
    sources: [{ label: 'Condiciones generales de cada póliza (la definición vigente es la de tu contrato)', url: null }],
    related: ['como-leer-una-poliza', 'terceros-vs-todo-riesgo'],
  },
  {
    slug: 'terceros-vs-todo-riesgo',
    title: 'Seguro de auto: "contra terceros" y "todo riesgo", qué significan',
    description: 'Diferencia general entre el seguro de auto contra terceros y el llamado todo riesgo, y por qué hay que leer cada póliza.',
    intro: '"Contra terceros" y "todo riesgo" son nombres comerciales, no categorías legales fijas. Lo que cubre cada uno lo define la póliza de cada aseguradora.',
    body: `
<h2>La idea general</h2>
<ul>
  <li><strong>Contra terceros (responsabilidad civil):</strong> en general, cubre los daños que causás a otras personas o a sus bienes. No suele cubrir los daños de tu propio vehículo.</li>
  <li><strong>"Todo riesgo":</strong> en general, agrega cobertura para daños al propio vehículo, por ejemplo por choque, robo o incendio, según lo que diga la póliza.</li>
</ul>
<h2>"Todo riesgo" no significa "todo"</h2>
<p>Incluso en las pólizas más amplias hay exclusiones, límites y franquicias. El nombre comercial no reemplaza la lectura de las condiciones. Buscá siempre la lista de riesgos excluidos y la <a href="/guias/que-es-la-franquicia/">franquicia</a>.</p>
<h2>Qué preguntar antes de firmar</h2>
<ul>
  <li>¿Qué daños propios están cubiertos y cuáles no?</li>
  <li>¿Hasta qué monto cubre los daños a terceros?</li>
  <li>¿Qué franquicia se aplica y a qué coberturas?</li>
  <li>¿Qué pasa si conduce otra persona?</li>
  <li>¿Cómo se denuncia un siniestro y en qué plazo?</li>
</ul>
<p>Esta guía no dice cuál conviene: eso depende de cada caso y de cada póliza.</p>`,
    todo: `<li>Pedí por escrito la lista de coberturas y exclusiones.</li><li>Leé <a href="/guias/como-leer-una-poliza/">cómo leer una póliza</a>.</li>`,
    sources: [{ label: 'Condiciones generales de cada póliza', url: null }, { label: 'Superintendencia de Seguros, Banco Central del Paraguay', url: BCP }],
    related: ['como-leer-una-poliza', 'que-es-la-franquicia', 'como-hacer-un-reclamo'],
  },
  {
    slug: 'aseguradora-corredor-agente',
    title: 'Aseguradora, corredor y agente de seguros: qué hace cada uno',
    description: 'Quién emite la póliza, quién intermedia y quién supervisa en Paraguay.',
    intro: 'Tres figuras que se confunden: la aseguradora, el corredor o agente, y el organismo que supervisa. Saber quién es quién ayuda a hacer las preguntas correctas.',
    body: `
<h2>Aseguradora</h2>
<p>Es la empresa que asume el riesgo, emite la póliza y paga los siniestros cubiertos. El contrato de seguro es con ella.</p>
<h2>Corredor y agente de seguros</h2>
<p>Son intermediarios: ponen en contacto a quien busca un seguro con las aseguradoras. Según la Ley 827/96, la intermediación en la contratación de seguros solo puede ser ejercida por agentes y corredores inscriptos en el registro de la autoridad de control.</p>
<h2>Superintendencia de Seguros (SIS)</h2>
<p>La Ley 827/96 crea la Superintendencia de Seguros, que funciona dentro del Banco Central del Paraguay (BCP) y controla a las aseguradoras y a los intermediarios.</p>
<h2>Y este sitio</h2>
<p>seguro.com.py no es ninguna de las tres. Es un sitio informativo: no vende, no cotiza y no intermedia.</p>
<h2>Un caso aparte: la medicina prepaga</h2>
<p>Según publicaciones de prensa, la medicina prepaga está supervisada por la Superintendencia de Salud y no por la Superintendencia de Seguros. Si tenés una duda sobre una prepaga, consultá primero con el organismo que corresponde.</p>`,
    todo: `<li>Antes de firmar, pedí el nombre completo y la matrícula del corredor o agente.</li><li>Seguí los pasos de <a href="/guias/como-verificar-una-aseguradora-o-corredor/">cómo verificar una aseguradora o un corredor</a>.</li>`,
    sources: [
      { label: 'Ley 827/96 De Seguros (texto en el sitio del BCP)', url: LEY827 },
      { label: 'ABC Color, "El seguro de riesgos y la medicina prepaga" (16/03/2025)', url: 'https://www.abc.com.py/edicion-impresa/suplementos/economico/2025/03/16/el-seguro-de-riesgos-y-la-medicina-prepaga/' },
    ],
    related: ['como-verificar-una-aseguradora-o-corredor', 'como-leer-una-poliza'],
  },
  {
    slug: 'como-verificar-una-aseguradora-o-corredor',
    title: 'Cómo verificar que una aseguradora o un corredor estén registrados',
    description: 'Pasos para comprobar en el sitio del Banco Central si una aseguradora, un corredor o un agente de seguros están registrados.',
    intro: 'Antes de pagar o firmar, comprobá que quien te ofrece un seguro esté registrado ante la Superintendencia de Seguros. La comprobación es gratuita y se hace en el sitio oficial.',
    body: `
<h2>Pasos</h2>
<ol>
  <li><strong>Pedí los datos por escrito:</strong> nombre completo o razón social, número de matrícula o registro, y el nombre de la aseguradora que emite la póliza.</li>
  <li><strong>Buscá el registro oficial:</strong> entrá al sitio del Banco Central del Paraguay (bcp.gov.py), sección de la Superintendencia de Seguros, y buscá los registros de aseguradoras y de auxiliares del seguro (agentes, corredores, liquidadores).</li>
  <li><strong>Compará los datos:</strong> el nombre y la matrícula que te dieron tienen que coincidir con los del registro y estar vigentes.</li>
  <li><strong>Revisá las advertencias:</strong> el BCP publica comunicados sobre empresas que no están autorizadas a operar como aseguradoras.</li>
  <li><strong>Confirmá con la aseguradora:</strong> llamá o escribí a sus canales oficiales (los que figuran en su propio sitio) y preguntá si esa persona trabaja con ellos.</li>
</ol>
<h2>Señales para frenar y preguntar</h2>
<ul>
  <li>No te dan nombre completo ni matrícula, o no podés encontrarlos en el registro.</li>
  <li>Te piden pagar de una forma que no podés comprobar con la aseguradora, o no te dan comprobante.</li>
  <li>Te presionan para decidir en el momento.</li>
</ul>
<p>Si algo no coincide, no pagues y consultá directamente con la aseguradora o con la Superintendencia de Seguros.</p>`,
    todo: `<li>Guardá una copia de la póliza y de todos los comprobantes de pago.</li><li>Si dudás, consultá a la Superintendencia de Seguros antes de pagar.</li>`,
    sources: [
      { label: 'BCP: registros de la Superintendencia de Seguros (inscripciones)', url: SIS_REGISTROS },
      { label: 'Banco Central del Paraguay', url: BCP },
    ],
    related: ['aseguradora-corredor-agente', 'como-hacer-un-reclamo'],
  },
  {
    slug: 'como-hacer-un-reclamo',
    title: 'Cómo hacer un reclamo a una aseguradora, paso a paso',
    description: 'Qué hacer después de un siniestro y dónde reclamar si la aseguradora no responde.',
    intro: 'Si te pasa algo cubierto por tu póliza, el orden importa: avisar a tiempo, guardar todo por escrito y, si no hay respuesta, usar los canales oficiales de reclamo.',
    body: `
<h2>1. Avisá el siniestro, por escrito y a tiempo</h2>
<p>Tu póliza fija un plazo para avisar. Leé la sección de siniestros y avisá por el canal que indica, guardando una constancia (correo, formulario con número, carta con sello de recepción).</p>
<h2>2. Reuní la documentación</h2>
<p>Guardá la póliza, el comprobante de pago, fotos, denuncias o informes que pida la póliza y todo lo que enviaste y recibiste.</p>
<h2>3. Pedí las respuestas por escrito</h2>
<p>Si la aseguradora rechaza o reduce el pago, pedí que explique el motivo por escrito y qué cláusula de la póliza aplica.</p>
<h2>4. Si no hay respuesta o no estás de acuerdo</h2>
<p>Primero presentá tu reclamo a la propia aseguradora. Según información publicada por el BCP y por prensa especializada, la Superintendencia de Seguros tiene una plataforma de asistencia al usuario para consultas, quejas y reclamos; el trámite es gratuito, voluntario y extrajudicial. Eso no impide acudir a la Justicia.</p>
<h2>Importante</h2>
<p>Los plazos y requisitos dependen de tu póliza y de la ley. Esta guía no los reemplaza.</p>`,
    todo: `<li>Avisá el siniestro por escrito y guardá la constancia.</li><li>Pedí por escrito el motivo de cualquier rechazo.</li><li>Si no responden, consultá los canales de la Superintendencia de Seguros.</li>`,
    sources: [
      { label: 'BCP: asistencia al usuario de la Superintendencia de Seguros', url: SIS_QUEJAS },
      { label: '100% Seguro, "La Superintendencia de Seguros lanzó su plataforma de consultas, quejas y reclamos"', url: 'https://100seguro.com.py/la-superintendencia-de-seguros-lanzo-su-plataforma-de-consultas-quejas-y-reclamos/' },
    ],
    related: ['como-leer-una-poliza', 'como-verificar-una-aseguradora-o-corredor'],
  },
];

export const glossary = [
  ['Agente de seguros', 'Persona inscripta ante la Superintendencia de Seguros que intermedia entre quien busca un seguro y una aseguradora.'],
  ['Asegurado', 'Persona o bien protegido por el seguro.'],
  ['Aseguradora', 'Empresa que emite la póliza, asume el riesgo y paga los siniestros cubiertos.'],
  ['Beneficiario', 'Persona que cobra la indemnización o el capital, cuando la póliza lo prevé.'],
  ['Carencia', 'Período inicial en el que ciertas coberturas todavía no están activas.'],
  ['Condiciones generales', 'Reglas comunes a todas las pólizas de un mismo tipo de seguro.'],
  ['Condiciones particulares', 'Datos concretos de tu póliza: quién, qué, desde cuándo, hasta cuánto.'],
  ['Corredor de seguros', 'Intermediario inscripto ante la Superintendencia de Seguros que puede trabajar con varias aseguradoras.'],
  ['Exclusión', 'Situación o daño que la póliza expresamente no cubre.'],
  ['Franquicia (deducible)', 'Parte del daño que queda a cargo del asegurado. Ver la guía de franquicia.'],
  ['Póliza', 'El contrato de seguro: documento con las condiciones del seguro.'],
  ['Preexistencia', 'Condición o daño que ya existía antes de empezar el seguro. Muchas pólizas la tratan de forma especial.'],
  ['Prima', 'Lo que se paga a la aseguradora por el seguro.'],
  ['Siniestro', 'El hecho que produce el daño y por el que se reclama.'],
  ['Subrogación', 'Derecho de la aseguradora, después de pagar un siniestro, a reclamar al responsable del daño.'],
  ['Suma asegurada', 'Límite máximo que la aseguradora se compromete a pagar.'],
  ['Superintendencia de Seguros (SIS)', 'Organismo que, según la Ley 827/96, funciona dentro del Banco Central del Paraguay y controla a aseguradoras e intermediarios.'],
  ['Tomador', 'Persona que contrata el seguro y firma la póliza. Puede ser distinta del asegurado.'],
  ['Vigencia', 'Período durante el cual el seguro está activo.'],
];

export const pages = {
  home: {
    title: 'Seguros en Paraguay explicados con claridad',
    description: 'Sitio informativo independiente: cómo leer una póliza, qué es la franquicia, cómo verificar una aseguradora o un corredor y cómo hacer un reclamo.',
  },
  quienes: {
    slug: 'quienes-somos',
    title: 'Quiénes somos',
    description: 'seguro.com.py es un sitio informativo independiente sobre seguros en Paraguay.',
    body: `
<p>seguro.com.py es un sitio informativo independiente sobre seguros en Paraguay. Explicamos términos, mostramos qué mirar en una póliza y cómo verificar a una aseguradora o a un corredor.</p>
<h2>Lo que no somos</h2>
<p>No somos una aseguradora, un corredor ni un agente de seguros. No vendemos, no cotizamos y no intermediamos. No recibimos pedidos de seguro ni datos de personas que buscan un seguro.</p>
<h2>Cómo nos financiamos</h2>
<p>Hoy no recibimos dinero de aseguradoras, corredores ni anunciantes, y no tenemos relación comercial con ninguno. Si eso cambia, lo vamos a decir en cada página afectada.</p>
<h2>Contacto</h2>
<p>Para corregir un dato o hacer una consulta sobre el sitio: <a href="mailto:__EMAIL__">__EMAIL__</a>.</p>
__COMPANY__`,
  },
  contacto: {
    slug: 'contacto',
    title: 'Contacto',
    description: 'Cómo escribirnos para corregir un dato o consultar sobre el sitio.',
    body: `
<p><strong>Este contacto es solo para corregir información del sitio y para aseguradoras, corredores, medios o socios comerciales.</strong> No tramitamos pedidos de seguro ni recibimos datos de personas que buscan un seguro.</p>
<p>Si buscás un seguro, leé nuestras <a href="/guias/">guías</a> y verificá siempre que la aseguradora o el corredor estén registrados (<a href="/guias/como-verificar-una-aseguradora-o-corredor/">cómo hacerlo</a>).</p>
<h2>Escribinos</h2>
<p>Correo: <a href="mailto:__EMAIL__">__EMAIL__</a></p>
<p>Por favor, no incluyas datos personales sensibles (salud, cédula, datos de tu póliza). Usamos tu mensaje solo para responderte; mirá la <a href="/politica-de-privacidad/">política de privacidad</a>.</p>`,
  },
  privacidad: {
    slug: 'politica-de-privacidad',
    title: 'Política de privacidad',
    description: 'Qué datos trata este sitio y cómo pedir que los borremos.',
    body: `
<p><em>Versión 1.0, 1 de octubre de 2026.</em></p>
<h2>Resumen</h2>
<ul>
  <li>Este sitio <strong>no tiene formularios</strong> ni te pide datos personales.</li>
  <li>No usamos cookies ni herramientas de análisis (ver <a href="/politica-de-cookies/">cookies</a>).</li>
  <li>Si nos escribís por correo, usamos tu mensaje solo para responderte.</li>
  <li>No vendemos ni compartimos datos con aseguradoras, corredores ni bancos.</li>
</ul>
<h2>Quién responde por los datos</h2>
<p>El titular de seguro.com.py. Contacto: <a href="mailto:__PRIVACY__">__PRIVACY__</a>.</p>
<h2>Qué datos pueden tratarse</h2>
<ul>
  <li><strong>Registros del servidor.</strong> El servicio de alojamiento puede registrar datos técnicos de cada visita (por ejemplo, dirección IP, fecha y página consultada) para seguridad y funcionamiento. Nosotros no los usamos para identificarte.</li>
  <li><strong>Correos que nos enviás.</strong> Tu nombre, tu dirección de correo y lo que escribas. Los usamos solo para responderte y los guardamos mientras sea necesario para eso. Podés pedir que los borremos.</li>
</ul>
<h2>Proveedores</h2>
<p>El sitio se aloja en un servicio de hosting y el correo pasa por un proveedor de correo electrónico; ambos pueden estar fuera de Paraguay.</p>
<h2>Tus derechos</h2>
<p>Podés pedir acceso, corrección o eliminación de tus datos, o retirar tu consentimiento, escribiendo a <a href="mailto:__PRIVACY__">__PRIVACY__</a>. Respondemos en un plazo razonable.</p>
<h2>No nos envíes datos sensibles</h2>
<p>No incluyas datos de salud, cédula ni datos de tu póliza. Si los recibimos, los borramos.</p>
<h2>Cambios</h2>
<p>Si el sitio empieza a recoger datos, actualizaremos esta política antes y pediremos tu consentimiento donde corresponda.</p>`,
  },
  cookies: {
    slug: 'politica-de-cookies',
    title: 'Política de cookies',
    description: 'Este sitio no usa cookies ni herramientas de análisis.',
    body: `
<p><em>Versión 1.0, 1 de octubre de 2026.</em></p>
<p>Este sitio <strong>no usa cookies</strong> ni herramientas de análisis o publicidad. Por eso no mostramos un aviso de cookies.</p>
<p>Si en el futuro usamos alguna herramienta de análisis, la activaremos solo si la aceptás, con los botones "Aceptar" y "Rechazar" del mismo tamaño, y actualizaremos esta página.</p>`,
  },
  terminos: {
    slug: 'terminos',
    title: 'Términos de uso',
    description: 'Condiciones de uso de este sitio informativo.',
    body: `
<p><em>Versión 1.0, 1 de octubre de 2026.</em></p>
<h2>Sitio informativo</h2>
<p>seguro.com.py ofrece información general sobre seguros. No es una aseguradora, un corredor ni un agente de seguros, no vende ni cotiza seguros y no brinda asesoramiento. Nada en este sitio constituye una propuesta comercial, una cotización ni una recomendación.</p>
<h2>Verificá siempre</h2>
<p>Las condiciones, coberturas y exclusiones las define cada póliza. Antes de decidir, verificá la información directamente con la aseguradora y con un corredor o agente registrado.</p>
<h2>Exactitud</h2>
<p>Revisamos el contenido y mostramos la fecha de actualización y las fuentes. Aun así puede haber errores o cambios en la ley. Si encontrás uno, escribinos a <a href="mailto:__EMAIL__">__EMAIL__</a>.</p>
<h2>Enlaces</h2>
<p>El sitio puede enlazar a páginas de terceros (por ejemplo, el Banco Central del Paraguay). No controlamos esas páginas ni respondemos por su contenido.</p>
<h2>Contenido</h2>
<p>Los textos de este sitio son de su titular. Podés citarlos indicando la fuente y el enlace.</p>
<h2>Cambios y ley aplicable</h2>
<p>Podemos actualizar estos términos; la versión vigente es la publicada aquí. Se rigen por las leyes de la República del Paraguay.</p>`,
  },
  metodologia: {
    slug: 'metodologia',
    title: 'Metodología: cómo armamos este sitio',
    description: 'Fuentes, actualización, correcciones e independencia de seguro.com.py.',
    body: `
<h2>Qué publicamos</h2>
<p>Explicaciones generales y neutrales: qué significan los términos de un seguro, qué mirar en una póliza, cómo verificar a una aseguradora o a un corredor y cómo reclamar. No publicamos precios, rankings, comparaciones de aseguradoras ni recomendaciones.</p>
<h2>Fuentes</h2>
<p>Usamos la Ley 827/96, el sitio del Banco Central del Paraguay y publicaciones de prensa especializada, y las citamos al final de cada guía con la fecha de consulta. Las definiciones son generales: la póliza de cada aseguradora prevalece.</p>
<h2>Actualización</h2>
<p>Cada guía muestra su fecha de actualización. Revisamos las páginas que citan normas o trámites cuando cambia la norma y, como mínimo, una vez por trimestre.</p>
<h2>Correcciones</h2>
<p>Si algo es incorrecto, escribinos a <a href="mailto:__EMAIL__">__EMAIL__</a>. Corregimos y dejamos la fecha de la corrección.</p>
<h2>Independencia</h2>
<p>Hoy no recibimos dinero de aseguradoras, corredores ni anunciantes. Si eso cambia, lo indicaremos en cada página afectada.</p>
<h2>Límites</h2>
<p>La información es general y no es asesoramiento legal, financiero ni de seguros.</p>`,
  },
};
