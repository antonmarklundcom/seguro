import type { VerticalConfig } from "../../vertical";
import { seguroSite } from "./site";

const description =
  "Compara planes de seguro medico y medicina prepaga en Paraguay. " +
  "Cotiza gratis para vos o tu familia y recibi ofertas por WhatsApp.";

export const seguroMedico: VerticalConfig = {
  id: "seguro-medico",
  siteId: seguroSite.id,
  name: "Seguro Medico",
  pillarPath: "/seguro-medico",
  seo: {
    title: "Seguro Medico en Paraguay - Cotiza Gratis | Seguro",
    description,
  },
  active: true,
  fields: [
    {
      key: "planFor",
      step: 1,
      label: "Para quien buscas el plan?",
      type: "radio",
      required: true,
      options: [
        { value: "individual", label: "Solo para mi" },
        { value: "familia", label: "Para mi familia" },
        { value: "empresa", label: "Para mi empresa" },
      ],
    },
    {
      key: "ageRange",
      step: 1,
      label: "Cual es tu rango de edad?",
      type: "select",
      required: true,
      options: [
        { value: "18-30", label: "18 a 30 anios" },
        { value: "31-45", label: "31 a 45 anios" },
        { value: "46-60", label: "46 a 60 anios" },
        { value: "60+", label: "Mas de 60 anios" },
      ],
    },
    {
      key: "city",
      step: 2,
      label: "En que ciudad vivis?",
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
