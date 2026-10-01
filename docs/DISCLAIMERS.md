# Site disclaimers — standard texts

For seguro.com.py. Adapted from the prestamo.com.py pattern (nouns and legal
points changed for insurance). Put every text below in `content/site.php` as
data, so one edit changes every page. The wording is plain, visible and never
hidden behind a tab, tooltip or link, and it uses the same type size as body
text.

## Principles

1. **Say what we are, early, on every page.** An information site.
2. **Say what we are not**, in words people recognise: aseguradora, corredor,
   agente de seguros, asesor.
3. **No small print.** Same size as the body, high contrast.
4. **Repeat where it matters:** next to any number, calculator result,
   directory entry and form.
5. **Dates and sources** on every figure, premium example, legal reference
   and list.
6. **Disclose money.** Today we earn nothing from the content. If that
   changes, say so on the page.
7. **Never fill a gap with invented data.** Company details stay `null` in
   the content file until confirmed; the template then hides the field.

## 1. Top strip (every page, one line)

> Sitio informativo. No vendemos seguros ni somos una aseguradora.

## 2. Footer (every page)

> **Sitio informativo.** seguro.com.py no es una aseguradora, un corredor ni
> un agente de seguros. No vendemos, cotizamos ni contratamos seguros, no
> recibimos solicitudes de seguro, no gestionamos siniestros y no manejamos
> dinero. La información es general y no es asesoramiento. Verificá siempre
> las condiciones, coberturas y exclusiones directamente con la aseguradora.

The footer also shows: razón social, RUC, domicilio and contact e-mail
(**only after the company exists and the data is confirmed; until then show a
contact e-mail only**), and links to Privacidad, Cookies, Términos and
Metodología.

## 3. Calculator or "cotizador" (directly under the result)

Preferred default: **do not build one.** Build an explainer or a
"qué cubre / qué no cubre" checker that shows no prices. If a calculator is
ever built (for example, "cuánto sube la franquicia"), it must carry:

> **Resultado ilustrativo.** No es una cotización ni una oferta. Cada
> aseguradora define prima, cobertura, exclusiones y condiciones. Datos de
> entrada: [fuente], [fecha].

Rules: every input default has a source and a date, nothing is pre-filled
with an insurer's price, and there is no button that leads to "contratar".

## 4. Insurer or broker directory (top of the page, and on each entry)

Top:

> Listado informativo en orden alfabético. No es un ranking ni una
> recomendación. Incluir una entidad no implica relación comercial ni
> respaldo. Datos verificados en el registro de la Superintendencia de
> Seguros en la fecha indicada en cada ficha.

Each entry: "Tipo: aseguradora / corredor / agente · Verificada el [fecha] en
[registro]" and a link to the entity's **own official site**. No logos, no
prices, no stars. (The exact name of the register to cite is an open item:
see `docs/LEGAL-AUDIT.md` §5.)

## 5. Guides (end of every guide)

> Esta guía es informativa y no reemplaza el asesoramiento de un
> profesional. Actualizada el [fecha]. Fuentes: [lista]. ¿Encontraste un
> error? Escribinos a contacto@…

## 6. Contact page (above the form)

> **Este formulario es solo para aseguradoras, corredores, medios y socios
> comerciales.** No tramitamos pedidos de seguro ni recibimos datos de
> personas que buscan un seguro. Si buscás un seguro, leé nuestras guías y
> verificá que la aseguradora o el corredor estén registrados.

## 7. Consent box

See `docs/PARTNER-FORM.md` ("Consent box"). One pattern for every form.

## 8. Cookie banner

> Usamos cookies de análisis para saber qué guías sirven más. Solo las
> activamos si las aceptás. Podés cambiar tu decisión cuando quieras.

Buttons "Aceptar" and "Rechazar": equal size and weight.

## 9. Premium or price examples in guides

Allowed only with an **insurer source and a date**, labelled:

> Ejemplo ilustrativo tomado de [fuente, fecha]. No es una cotización; la
> prima depende de cada aseguradora y de cada caso.

Otherwise write "la prima varía según la aseguradora, el vehículo y el
perfil" and name no figure.

## 10. If we ever earn money from the content

> **Transparencia:** [nombre] nos paga por [publicidad / enlaces /
> contenido patrocinado]. Esto no cambia nuestra información ni el orden
> alfabético.

## 11. Words never to use

fácil · rápido · al instante · aprobado · garantizado · sin requisitos ·
el mejor · la más barata · "te aseguramos" · "nuestras pólizas" ·
"cotizá ya" · "contratá" · "asesoramos" · "recomendamos" · urgency
("últimos días", "solo hoy") · fear-based copy ("¿y si te pasa algo?",
"no te quedes sin cobertura").

Replacements: "compará" (only objective, sourced facts), "información para
decidir", "qué mirar antes de contratar", "preguntale a la aseguradora o a un
corredor registrado".
