import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Huesped } from 'src/app/models/huesped';
import { HuespedService } from 'src/app/services/huesped.service';

@Component({
  selector: 'app-huesped',
  templateUrl: './huesped.component.html',
  styleUrls: ['./huesped.component.css']
})
export class HuespedComponent implements OnInit{
  huespedes: Huesped[] = [];
  nuevoHuesped: Huesped = new Huesped();
  mostrarFormularioCreacion = false;
  mostrarFormularioEdicion = false;
  valorBusqueda = '';
  formularioCreacion: FormGroup;
  formularioEdicion: FormGroup;

  constructor(private huespedService: HuespedService, private formBuilder: FormBuilder) {
    // Inicializar el formulario reactivo
    this.formularioCreacion = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern(/[A-Za-záéíóúÁÉÍÓÚñÑ\s]+/), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.pattern(/[A-Za-záéíóúÁÉÍÓÚñÑ\s]+/), Validators.maxLength(50)]],
      dni: ['', [Validators.required, Validators.pattern(/^[FM]\d{7}|\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/[0-9\s]+/), Validators.maxLength(12)]]
    });
    // Inicializar el formulario reactivo de edición
    this.formularioEdicion = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern(/[A-Za-záéíóúÁÉÍÓÚñÑ\s]+/), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.pattern(/[A-Za-záéíóúÁÉÍÓÚñÑ\s]+/), Validators.maxLength(50)]],
      dni: ['', [Validators.required, Validators.pattern(/^[FM]\d{7}|\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/[0-9\s]+/), Validators.maxLength(12)]]
    });
  }

  get nombre() { return this.formularioCreacion.get('nombre'); }
  get apellido() { return this.formularioCreacion.get('apellido'); }
  get dni() { return this.formularioCreacion.get('dni'); }
  get email() { return this.formularioCreacion.get('email'); }
  get telefono() { return this.formularioCreacion.get('telefono'); }
  get nombreEdicion() { return this.formularioEdicion.get('nombre'); }
  get apellidoEdicion() { return this.formularioEdicion.get('apellido'); }
  get dniEdicion() { return this.formularioEdicion.get('dni'); }
  get emailEdicion() { return this.formularioEdicion.get('email'); }
  get telefonoEdicion() { return this.formularioEdicion.get('telefono'); }


  ngOnInit(): void {
    this.cargarHuespedes();
  }

  cargarHuespedes() {
    this.huespedService.listarHuespedes().subscribe(
      data => {
        this.huespedes = data;
      },
      error => {
        console.error('Error al cargar los huéspedes:', error);
      }
    );
  }
  mostrarFormularioDeCreacion() {
    this.mostrarFormularioCreacion = true;
  }
  
  cerrarFormularioDeCreacion() {
    this.mostrarFormularioCreacion = false;
  }
  cerrarFormularioEdicion() {
    this.mostrarFormularioEdicion = false;
    this.cancelarEdicion()
  }
  guardarCreacion() {
    // Verificar si el formulario es válido antes de guardar
    if (this.formularioCreacion.valid) {
      this.nuevoHuesped = this.formularioCreacion.value;

      this.huespedService.registrarHuesped(this.nuevoHuesped).subscribe(
        () => {
          this.mostrarFormularioCreacion = false;
          this.formularioCreacion.reset(); // Resetear el formulario después de guardar
          this.cargarHuespedes();
        },
        error => {
          console.error('Error al registrar el huésped:', error);
        }
      );
    }
  }
  guardarEdicion() {
    // Verificar si el formulario de edición es válido antes de guardar
    if (this.formularioEdicion.valid) {
      const idHuesped = this.nuevoHuesped.id; // Obtener el ID del huésped actual
  
      // Obtener los valores del formulario de edición
      const valoresEdicion = this.formularioEdicion.value;
  
      // Actualizar el huésped utilizando el servicio
      this.huespedService.actualizarHuesped(idHuesped, valoresEdicion).subscribe(
        () => {
          // Resetear el formulario y cargar la lista actualizada de huéspedes
          this.mostrarFormularioEdicion = false;
          this.formularioEdicion.reset();
          this.cargarHuespedes();
        },
        error => {
          console.error('Error al editar el huésped:', error);
        }
      );
    }
  }

  confirmarBorrado(huesped: Huesped) {
    const confirmar = window.confirm('¿Estás seguro de que deseas borrar el huésped?');
    if (confirmar) {
      this.borrarHuesped(huesped.id);
    }
  }

  borrarHuesped(id: number) {
    this.huespedService.borrarHuesped(id).subscribe(
      () => {
        this.cargarHuespedes();
      },
      error => {
        console.error('Error al borrar el huésped:', error);
      }
    );
  }
  cancelarCreacion() {
    this.mostrarFormularioCreacion = false;
    this.nuevoHuesped = new Huesped();
  }
  editarHuesped(huesped: Huesped) {
    // Asignar los valores del huésped al formulario de edición
    this.formularioEdicion.patchValue({
      nombre: huesped.nombre,
      apellido: huesped.apellido,
      dni: huesped.dni,
      email: huesped.email,
      telefono: huesped.telefono
    });
  
    // Mostrar el formulario de edición
    this.mostrarFormularioEdicion = true;
    this.nuevoHuesped = { ...huesped };
  }
  cancelarEdicion() {
    this.mostrarFormularioEdicion = false;
    this.nuevoHuesped = new Huesped();
  }
  buscarPorDni() {
    if (this.valorBusqueda) {
        const resultadoBusqueda = this.huespedes.filter(huesped => huesped.dni === this.valorBusqueda);
        this.actualizarListaHuespedes(resultadoBusqueda);
    } else {
      alert('Ingrese un valor para realizar la búsqueda por DNI.');
    }
}

buscarPorId() {
    if (this.valorBusqueda) {
        const valorBusquedaNumero = parseInt(this.valorBusqueda, 10);
        if (!isNaN(valorBusquedaNumero)) {
            const resultadoBusqueda = this.huespedes.filter(huesped => huesped.id === valorBusquedaNumero);
            this.actualizarListaHuespedes(resultadoBusqueda);
        } else {
            console.error('El valor de búsqueda no es un número válido');
        }
    } else {
      alert('Ingrese un valor para realizar la búsqueda por ID.');
    }
}

mostrarTodo() {
    this.valorBusqueda = '';
    this.cargarHuespedes();
}

private actualizarListaHuespedes(lista: Huesped[]) {
    this.huespedes = lista;
}
}
