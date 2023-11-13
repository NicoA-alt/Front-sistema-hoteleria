import { Component, OnInit } from '@angular/core';
import { Habitacion } from 'src/app/models/habitacion';
import { Huesped } from 'src/app/models/huesped';
import { reserva } from 'src/app/models/reserva';
import { HabitacionService } from 'src/app/services/habitacion.service';
import { HuespedService } from 'src/app/services/huesped.service';
import { ReservaService } from 'src/app/services/reserva.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {
  reservas: reserva[] = [];
  habitaciones: Habitacion[] = [];
  huespedes: Huesped[] = [];
  nuevaReserva: reserva = new reserva();
  mostrarFormularioCreacion = false;
  mostrarFormularioEdicion = false;
  dniHuesped: string = '';
  huespedSeleccionado: Huesped | null = null;
  huespedesSeleccionados: Huesped[] = [];
  filtroPorId: boolean = false;
  filtroPorHabitacion: boolean = false;
  filtroPorHuespedId: boolean = false;
  idReserva: number;
  numeroHabitacion: number;
  idHuesped: number;

  constructor(
    private reservaService: ReservaService,
    private habitacionService: HabitacionService,
    private huespedService: HuespedService
  ) { }

  ngOnInit(): void {
    this.cargarReservas();
    this.cargarHabitaciones();
    this.cargarHuespedes();
  }

  cargarReservas() {
    this.reservaService.listarReservas().subscribe(
      data => this.reservas = data,
      error => console.error('Error al cargar las reservas:', error)
    );
  }

  cargarHabitaciones() {
    this.habitacionService.listarHabitaciones().subscribe(
      data => this.habitaciones = data,
      error => console.error('Error al cargar las habitaciones:', error)
    );
  }

  cargarHuespedes() {
    this.huespedService.listarHuespedes().subscribe(
      data => this.huespedes = data,
      error => console.error('Error al cargar los huéspedes:', error)
    );
  }

  mostrarFormularioDeCreacion() {
    this.mostrarFormularioCreacion = true;
  }

  cerrarFormularioCreacion() {
    this.mostrarFormularioCreacion = false;
    this.resetFormulario();
  }

  cerrarFormularioEdicion() {
    this.mostrarFormularioEdicion = false;
    this.resetFormulario();
  }

  guardarCreacion() {
    const fechaInicio = new Date(this.nuevaReserva.fechaInicio);
    const fechaFin = new Date(this.nuevaReserva.fechaFin);
  
    const reservasEnFechas = this.reservas.filter(reserva =>
      reserva.habitacion.numero === this.nuevaReserva.habitacion.numero &&
      (fechaInicio >= new Date(reserva.fechaInicio) && fechaInicio <= new Date(reserva.fechaFin) ||
       fechaFin >= new Date(reserva.fechaInicio) && fechaFin <= new Date(reserva.fechaFin))
    );
  
    const capacidadHabitacion = this.nuevaReserva.habitacion.capacidad;
  
    if (reservasEnFechas.length === 0 && this.huespedesSeleccionados.length <= capacidadHabitacion) {
      this.hacerReserva();
    } else {
      if (reservasEnFechas.length > 0) {
        alert('La habitación no está disponible en las fechas seleccionadas');
      } else {
        alert('La cantidad de huéspedes supera la capacidad de la habitación');
      }
    }
  }
  hacerReserva() {
    if (this.fechasValidas()) {
      this.nuevaReserva.huespedes = this.huespedesSeleccionados;
      this.reservaService.registrarReserva(this.nuevaReserva).subscribe(
        () => {
          this.mostrarFormularioCreacion = false;
          this.nuevaReserva = new reserva();
          this.cargarReservas();
          this.resetFormulario();
        },
        error => console.error('Error al crear la reserva:', error)
      );
    } else {
      alert('Las fechas seleccionadas se solapan con una reserva existente o La fecha de inicio debe ser menor o igual a la fecha de fin.');
    }
  }

  agregarHuesped() {
    const dni = this.dniHuesped.trim();
    if (dni) {
        const huespedExistente = this.huespedes.find(huesped => huesped.dni === dni);

        if (huespedExistente) {
            const existeHuesped = this.huespedesSeleccionados.some(h => h.id === huespedExistente.id);

            if (!existeHuesped) {
                const capacidadHabitacion = this.nuevaReserva.habitacion.capacidad;

                if (this.huespedesSeleccionados.length < capacidadHabitacion) {
                    this.huespedesSeleccionados.push(huespedExistente);
                } else {
                    alert('La cantidad de huéspedes supera la capacidad de la habitación');
                }
            } else {
                alert('El huésped ya ha sido seleccionado.');
            }

            this.dniHuesped = '';
        } else {
            alert('No se encontró ningún huésped con ese DNI.');
        }
    }
}
 
  private resetFormulario() {
    this.nuevaReserva = new reserva();
    this.dniHuesped = '';
    this.huespedSeleccionado = null;
    this.huespedesSeleccionados = [];
  }

  fechasValidas(): boolean {
    if (this.nuevaReserva.fechaInicio && this.nuevaReserva.fechaFin) {
        const nuevaFechaInicio = new Date(this.nuevaReserva.fechaInicio);
        const nuevaFechaFin = new Date(this.nuevaReserva.fechaFin);

        if (nuevaFechaInicio <= nuevaFechaFin) {
            const reservasMismaHabitacion = this.reservas.filter(reserva =>
                reserva.habitacion.numero === this.nuevaReserva.habitacion.numero &&
                reserva.id !== this.nuevaReserva.id
            );

            return reservasMismaHabitacion.every(reserva => {
                const reservaFechaInicio = new Date(reserva.fechaInicio);
                const reservaFechaFin = new Date(reserva.fechaFin);

                return nuevaFechaInicio <= reservaFechaFin && nuevaFechaFin >= reservaFechaInicio;
            });
        } else {
            return false; 
        }
    }
    return false; 
}

  verificarCapacidad(): boolean {
    const habitacionSeleccionada = this.nuevaReserva.habitacion;
    if (habitacionSeleccionada) {
      const capacidadHabitacion = habitacionSeleccionada.capacidad;
      return this.huespedesSeleccionados.length <= capacidadHabitacion;
    }
    return true;
  }

  cambiarHabitacion() {
    this.huespedesSeleccionados = [];
  }

  editarReserva(reserva: reserva) {
    this.nuevaReserva = reserva;
    this.nuevaReserva.habitacion = reserva.habitacion;
    this.huespedesSeleccionados = reserva.huespedes.slice();
    this.mostrarFormularioEdicion = true;
  }

  guardarEdicion() {
    if (this.fechasValidas() && this.nuevaReserva.fechaInicio <= this.nuevaReserva.fechaFin) {
        console.log('this.nuevaReserva antes de actualizar:', this.nuevaReserva);
        this.reservaService.actualizarReserva(this.nuevaReserva.id, this.nuevaReserva).subscribe(
            () => {
                console.log('Reserva actualizada con éxito');
                // Solo actualiza la tabla si la actualización fue exitosa
                this.cargarReservas();
                this.mostrarFormularioEdicion = false;
                this.nuevaReserva = new reserva();
            },
            error => {
                console.error('Error al actualizar la reserva:', error);
            }
        );
    } else {
        alert('La fecha de inicio debe ser anterior o igual a la fecha de fin.');
        this.cargarReservas();
        this.mostrarFormularioEdicion = false;
        this.nuevaReserva = new reserva();
    }
}

  
  confirmarBorrado(reserva: reserva) {
    const confirmacion = confirm(`¿Estás seguro que deseas borrar la reserva ID ${reserva.id}?`);
    if (confirmacion) {
      this.borrarReserva(reserva);
    }
  }

  borrarReserva(reserva: reserva) {
    this.reservaService.borrarReserva(reserva.id).subscribe(
      () => this.cargarReservas(),
      error => console.error('Error al borrar la reserva:', error)
    );
  }

  buscarReservas() {
    if (this.filtroPorId && this.idReserva) {
        this.reservaService.obtenerDetallesReserva(this.idReserva).subscribe(
            (reserva) => {
                this.reservas = [reserva]; // Actualiza la lista de reservas
            },
            (error) => {
                console.error('Error al buscar reserva por ID:', error);
            }
        );
    }

    if (this.filtroPorHabitacion && this.numeroHabitacion) {
        this.habitacionService.obtenerReservasDeHabitacion(this.numeroHabitacion).subscribe(
            (reservas) => {
                this.reservas = reservas; // Actualiza la lista de reservas
            },
            (error) => {
                console.error('Error al buscar reservas por número de habitación:', error);
            }
        );
    }

    if (this.filtroPorHuespedId && this.idHuesped) {
        this.huespedService.getReservaHuesped(this.idHuesped).subscribe(
            (reservas) => {
                this.reservas = reservas; // Actualiza la lista de reservas
            },
            (error) => {
                console.error('Error al buscar reservas por ID de Huésped:', error);
            }
        );
    }
}

  mostrarTodasLasReservas() {
    this.reservaService.listarReservas().subscribe(
      (reservas) => {
        this.reservas = reservas; // Actualiza la lista de reservas
      },
      (error) => {
        console.error('Error al obtener todas las reservas:', error);
      }
    );
  }
  toggleFiltro(filtro: string) {
    if (filtro === 'idReserva') {
        this.filtroPorHabitacion = false;
        this.filtroPorHuespedId = false;
    } else if (filtro === 'numeroHabitacion') {
        this.filtroPorId = false;
        this.filtroPorHuespedId = false;
    } else if (filtro === 'idHuesped') {
        this.filtroPorId = false;
        this.filtroPorHabitacion = false;
    }
}
}

