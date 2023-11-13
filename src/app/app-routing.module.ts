import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Habitacion } from './models/habitacion';
import { Huesped } from './models/huesped';
import { reserva } from './models/reserva';
import { HabitacionComponent } from './components/habitacion/habitacion.component';
import { HuespedComponent } from './components/huesped/huesped.component';
import { ReservaComponent } from './components/reserva/reserva.component';

const routes: Routes = [
  { path: '', redirectTo: '/habitacion', pathMatch: 'full' },
  { path: 'habitacion', component: HabitacionComponent },
  { path: 'huesped', component: HuespedComponent },
  { path: 'reserva', component: ReservaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
