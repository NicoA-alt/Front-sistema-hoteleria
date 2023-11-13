import { Habitacion } from "./habitacion";
import { Huesped } from "./huesped";

export class reserva {
    id: number;
    fechaInicio: string; 
    fechaFin: string; 
    habitacion: Habitacion;
    huespedes: Huesped[];
  }