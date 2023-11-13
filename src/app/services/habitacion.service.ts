import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habitacion } from '../models/habitacion';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  private url = 'http://localhost:8080/habitacion'
  constructor(private http: HttpClient) { }
  listarHabitaciones(): Observable<any> {
    return this.http.get(this.url);
  }
  // Agregar una nueva habitación
  agregarHabitacion(habitacion: Habitacion): Observable<any> {
    return this.http.post(this.url, habitacion);
  }
  // Actualizar una habitación por su ID
  actualizarHabitacion(id: number,habitacion: Habitacion): Observable<any> {
    return this.http.put(this.url+'/'+id, habitacion);
  }
  // Borrar una habitación por su ID
  borrarHabitacion(id: number): Observable<any> {
    return this.http.delete(this.url+'/'+id);
  }
  // Obtener detalles de una habitación por su ID
  obtenerDetallesHabitacion(id: number): Observable<any> {
    return this.http.get(this.url+'/'+id);
  }

  // Obtener lista de reservas de una habitación por su ID
  obtenerReservasDeHabitacion(id: number): Observable<any> {
    return this.http.get(this.url+'/'+id+'/reserva');
  }

  // Obtener lista de habitaciones disponibles
  obtenerHabitacionesDisponibles(): Observable<any> {
    return this.http.get(this.url+'/disponibles');
  }
}
