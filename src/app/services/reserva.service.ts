import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { reserva } from '../models/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private url = 'http://localhost:8080/reserva'
  constructor(private http: HttpClient) { }
  
  listarReservas(): Observable<any> {
    return this.http.get(this.url);
  }

  registrarReserva(reserva: reserva): Observable<any> {
    return this.http.post(this.url, reserva);
  }

  actualizarReserva(id: number, reserva: reserva): Observable<any> {
    return this.http.put(this.url+'/'+id, reserva);
  }

  borrarReserva(id: number): Observable<any> {
    return this.http.delete(this.url+'/'+id);
  }

  obtenerDetallesReserva(id: number): Observable<any> {
    return this.http.get(this.url+'/'+id);
  }
}
