import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Huesped } from '../models/huesped';

@Injectable({
  providedIn: 'root'
})
export class HuespedService {
  private url = 'http://localhost:8080/huesped'
  constructor(private http: HttpClient) { }

  listarHuespedes(): Observable<any> {
    return this.http.get(this.url);
  }

  registrarHuesped(huesped: Huesped): Observable<any> {
    return this.http.post(this.url, huesped);
  }

  actualizarHuesped(id: number, huesped: Huesped): Observable<any> {
    return this.http.put(this.url+'/'+id, huesped);
  }

  borrarHuesped(id: number): Observable<any> {
    return this.http.delete(this.url+'/'+id);
  }

  obtenerDetallesHuesped(id: number): Observable<any> {
    return this.http.get(this.url+'/'+id);
  }

  obtenerHuespedPorDni(dni: string): Observable<any> {
    return this.http.get(this.url+'/dni/'+dni);
  }

  getReservaHuesped(id: number): Observable<any> {
    return this.http.get(this.url+'/'+id+'/reserva');
  }
}
