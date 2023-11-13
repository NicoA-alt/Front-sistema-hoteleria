import { reserva } from "./reserva";

export class Huesped {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
    reservas: reserva[];
  }