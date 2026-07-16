import type { VerticalConfig } from "../../vertical";
import { seguroDeAuto } from "./auto";
import { seguroDeMoto } from "./moto";
import { seguroMedico } from "./medico";
import { seguroSite } from "./site";

export const seguroVerticals: VerticalConfig[] = [seguroDeAuto, seguroDeMoto, seguroMedico];

export { seguroSite, seguroDeAuto, seguroDeMoto, seguroMedico };
