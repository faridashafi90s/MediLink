import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { AppointmentStatus } from '../models/appointment-status.enum';
import { UserRole } from '../../../shared/models/user-role.enum';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AppointmentService {
  private apiUrl = environment.apiUrl + '/appointments'; ;

  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  appointments$ = this.appointmentsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadAppointments();
  }

  private loadAppointments(): void {
    this.http.get<Appointment[]>(`${this.apiUrl}/all`).subscribe(appointments => {
      this.appointmentsSubject.next(appointments);
    });
  }

  getAll(): Observable<Appointment[]> {
    return this.appointments$;
  }

  getById(appointmentId: number): Observable<Appointment | undefined> {
    return this.appointments$.pipe(
      map(appointments => appointments.find(a => a.id === appointmentId))
    );
  }

  create(appointment: Appointment): Observable<void> {
    return this.http.post<Appointment>(`${this.apiUrl}/create`, appointment).pipe(
      map(newAppointmentFromBackend => {
        const completeAppointment = {
          ...newAppointmentFromBackend,
          patientName: appointment.patientName,
          doctorName: appointment.doctorName
        };
        const currentAppointments = this.appointmentsSubject.value;
        this.appointmentsSubject.next([...currentAppointments, completeAppointment]);
      })
    );
  }

  update(id: number, appointment: Appointment): Observable<void> {
    return this.http.put<Appointment>(`${this.apiUrl}/update/${id}`, appointment).pipe(
      map(updatedAppointmentFromBackend => {
        const mergedAppointment = {
          ...updatedAppointmentFromBackend,
          patientName: appointment.patientName,
          doctorName: appointment.doctorName
        };

        const currentAppointments = this.appointmentsSubject.value;
        this.appointmentsSubject.next(
          currentAppointments.map(a => a.id === id ? mergedAppointment : a)
        );
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(
      map(() => {
        const filteredAppointments = this.appointmentsSubject.value.filter(a => a.id !== id);
        this.appointmentsSubject.next(filteredAppointments);
      })
    );
  }

  getUpcomingAppointmentsCount(userId: number, userRole: UserRole): Observable<number> {
    return this.appointments$.pipe(
      map(appointments =>
        appointments.filter(a =>
          a.status === AppointmentStatus.Scheduled &&
          (userRole === UserRole.Doctor ? a.doctorId === userId : a.patientId === userId)
        ).length
      )
    );
  }

  getByDoctorId(doctorId: number): Observable<Appointment[]> {
    return this.appointments$.pipe(
      map(appointments => appointments.filter(a => a.doctorId === doctorId))
    );
  }

  getByPatientId(patientId: number): Observable<Appointment[]> {
    return this.appointments$.pipe(
      map(appointments => appointments.filter(a => a.patientId === patientId))
    );
  }

}
