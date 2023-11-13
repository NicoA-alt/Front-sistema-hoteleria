import { Component, OnInit } from '@angular/core';
import { Habitacion } from 'src/app/models/habitacion';
import { HabitacionService } from 'src/app/services/habitacion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-habitacion',
  templateUrl: './habitacion.component.html',
  styleUrls: ['./habitacion.component.css']
})
export class HabitacionComponent implements OnInit {
  habitaciones: Habitacion[] = [];
  mostrarFormularioCreacion = false;
  mostrarFormularioEdicion = false;
  mostrarDisponibles = false;
  tiposHabitacion: string[] = ['SIMPLE', 'DOBLE', 'TRIPLE', 'CUADRUPLE'];
  fomularioCreacion: FormGroup;
  formularioEdicion: FormGroup;
  nuevaHabitacion: Habitacion = new Habitacion(); // Mantenemos nuevaHabitacion

  constructor(
    private habitacionService: HabitacionService,
    private fb: FormBuilder
  ) {
    this.fomularioCreacion = this.fb.group({
      numero: ['', [Validators.required]],
      tipo: ['SIMPLE', [Validators.required]],
      disponible: [false, []],
      precio: ['', [Validators.required]],
      capacidad: ['', [Validators.required]]
    });
    this.formularioEdicion = this.fb.group({
      numero: ['', [Validators.required]],
      tipo: ['SIMPLE', [Validators.required]],
      disponible: [false, []],
      precio: ['', [Validators.required]],
      capacidad: ['', [Validators.required]]
    });
  }

  get numero() { return this.fomularioCreacion.get('numero'); }
  get tipo() { return this.fomularioCreacion.get('tipo'); }
  get disponible() { return this.fomularioCreacion.get('disponible'); }
  get precio() { return this.fomularioCreacion.get('precio'); }
  get capacidad() { return this.fomularioCreacion.get('capacidad'); }
  get numeroEdicion() { return this.formularioEdicion.get('numero'); }
  get tipoEdicion() { return this.formularioEdicion.get('tipo'); }
  get disponibleEdicion() { return this.formularioEdicion.get('disponible'); }
  get precioEdicion() { return this.formularioEdicion.get('precio'); }
  get capacidadEdicion() { return this.formularioEdicion.get('capacidad'); }
  
  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  cargarHabitaciones() {
    this.habitacionService.listarHabitaciones().subscribe(
      data => {
        this.habitaciones = data;
      },
      error => {
        console.error('Error al cargar las habitaciones:', error);
      }
    );
  }

  mostrarFormularioDeCreacion() {
    this.mostrarFormularioCreacion = true;
  }

  cerrarFormularioCreacion() {
    this.mostrarFormularioCreacion = false;
  }

  guardarCreacion() {
    const valoresFormulario = this.fomularioCreacion.value;
    this.habitacionService.agregarHabitacion(valoresFormulario).subscribe(
      () => {
        this.mostrarFormularioCreacion = false;
        this.fomularioCreacion.reset(); // Esto reiniciará el formulario después de guardar
        this.cargarHabitaciones();
      },
      error => {
        console.error('Error al crear la habitación:', error);
      }
    );
  }

  editarHabitacion(habitacion: Habitacion) {
    this.mostrarFormularioEdicion = true;
    this.nuevaHabitacion = { ...habitacion }; // Actualizamos nuevaHabitacion

    this.formularioEdicion.patchValue({
      numero: this.nuevaHabitacion.numero,
      tipo: this.nuevaHabitacion.tipo,
      disponible: this.nuevaHabitacion.disponible,
      precio: this.nuevaHabitacion.precio,
      capacidad: this.nuevaHabitacion.capacidad
    });
  }

  guardarEdicion() {
    const valoresEdicion = this.formularioEdicion.value;
    console.log(this.nuevaHabitacion.numero, valoresEdicion)
    this.habitacionService.actualizarHabitacion(this.nuevaHabitacion.numero, valoresEdicion).subscribe(
      () => {
        this.mostrarFormularioEdicion = false;
        this.nuevaHabitacion = new Habitacion();
        this.cargarHabitaciones();
      },
      error => {
        console.error('Error al editar la habitación:', error);
      }
    );
  }

  cerrarFormularioEdicion() {
    this.mostrarFormularioEdicion = false;
  }

  cancelarEdicion() {
    this.formularioEdicion.reset(); // Esto reiniciará el formulario al cancelar
    this.mostrarFormularioEdicion = false;
  }

  confirmarBorrado(habitacion: Habitacion) {
    const confirmar = window.confirm('¿Estás seguro de que deseas borrar la habitación?');
    if (confirmar) {
      this.borrarHabitacion(habitacion.numero);
    }
  }

  borrarHabitacion(numero: number) {
    this.habitacionService.borrarHabitacion(numero).subscribe(
      () => {
        this.cargarHabitaciones();
      },
      error => {
        console.error('Error al borrar la habitación:', error);
      }
    );
  }

  cancelarCreacion() {
    this.mostrarFormularioCreacion = false;
    this.fomularioCreacion.reset(); // Esto reiniciará el formulario al cancelar
  }

  aplicarFiltro() {
    this.habitacionService.obtenerHabitacionesDisponibles().subscribe(
      data => {
        this.habitaciones = data;
      },
      error => {
        console.error('Error al cargar las habitaciones:', error);
      }
    );
  }
}
