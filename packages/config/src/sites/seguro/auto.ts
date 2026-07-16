import type { VerticalConfig } from "../../vertical";
import { seguroSite } from "./site";

const description =
  "Compara cotizaciones de seguro de auto en Paraguay con las mejores " +
  "aseguradoras. Cotiza gratis en 2 minutos y recibi ofertas por WhatsApp.";

export const seguroDeAuto: VerticalConfig = {
  id: "seguro-de-auto",
  siteId: seguroSite.id,
  name: "Seguro de Auto",
  pillarPath: "/seguro-de-auto",
  seo: {
    title: "Seguro de Auto en Paraguay - Cotiza Gratis | Seguro",
    description,
  },
  active: true,
  fields: [
    {
      key: "vehicleYear",
      step: 1,
      label: "De que anio es tu vehiculo?",
      type: "number",
      required: true,
      placeholder: "Ej: 2019",
    },
    {
      key: "coverageType",
      step: 1,
      label: "Que tipo de cobertura buscas?",
      type: "radio",
      required: true,
      options: [
        { value: "terceros", label: "Contra terceros" },
        { value: "todo-riesgo", label: "Todo riesgo" },
        { value: "no-se", label: "No estoy seguro" },
      ],
    },
    {
      key: "city",
      step: 2,
      label: "En que ciudad circulas habitualmente?",
      type: "select",
      required: true,
      options: [
        { value: "asuncion", label: "Asuncion" },
        { value: "ciudad-del-este", label: "Ciudad del Este" },
        { value: "encarnacion", label: "Encarnacion" },
        { value: "luque", label: "Luque" },
        { value: "san-lorenzo", label: "San Lorenzo" },
        { value: "otra", label: "Otra" },
      ],
    },
    {
      key: "name",
      step: 3,
      label: "Como te llamas?",
      type: "text",
      required: true,
      placeholder: "Nombre y apellido",
    },
    {
      key: "phone",
      step: 3,
      label: "Cual es tu WhatsApp?",
      type: "text",
      required: true,
      placeholder: "09XX XXX XXX",
    },
  ],
};
