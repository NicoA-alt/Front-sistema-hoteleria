import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HabitacionComponent } from './components/habitacion/habitacion.component';
import { HuespedComponent } from './components/huesped/huesped.component';
import { ReservaComponent } from './components/reserva/reserva.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
    declarations: [
        AppComponent,
        HabitacionComponent,
        HuespedComponent,
        ReservaComponent,
        NavbarComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class AppModule { }
