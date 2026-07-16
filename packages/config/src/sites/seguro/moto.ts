import type { VerticalConfig } from "../../vertical";
import { seguroSite } from "./site";

const description =
  "Cotiza el seguro de tu moto en Paraguay gratis y en 2 minutos. Compara " +
  "precios de las mejores aseguradoras y recibi tu cotizacion por WhatsApp.";

export const seguroDeMoto: VerticalConfig = {
  id: "seguro-de-moto",
  siteId: seguroSite.id,
  name: "Seguro de Moto",
  pillarPath: "/seguro-de-moto",
  seo: {
    title: "Seguro de Moto en Paraguay - Cotiza Gratis | Seguro",
    description,
  },
  active: true,
  fields: [
    {
      key: "vehicleYear",
      step: 1,
      label: "De que anio es tu moto?",
      type: "number",
      required: true,
      placeholder: "Ej: 2021",
    },
    {
      key: "engineSize",
      step: 1,
      label: "Cual es la cilindrada de tu moto?",
      type: "select",
      required: true,
      options: [
        { value: "hasta-125", label: "Hasta 125cc" },
        { value: "126-250", label: "126cc a 250cc" },
        { value: "251-500", label: "251cc a 500cc" },
        { value: "mas-500", label: "Mas de 500cc" },
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
