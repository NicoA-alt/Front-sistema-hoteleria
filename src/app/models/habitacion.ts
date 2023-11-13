import { reserva } from './reserva';
import { TipoHabitacion } from './tipoHabitacion.enum';

export class Habitacion {
  numero: number;
  tipo: TipoHabitacion; // Utilizamos el enum en lugar de un string
  disponible: boolean;
  precio: number;
  capacidad: number;
  reservas: reserva[];
}