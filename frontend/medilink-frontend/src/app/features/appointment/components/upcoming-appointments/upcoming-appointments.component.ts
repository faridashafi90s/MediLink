import { Component, Inject, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Appointment } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentStatus } from '../../models/appointment-status.enum';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { UserRole } from '../../../../shared/models/user-role.enum';
import { UserData } from '../../../../shared/models/user-data.model';

@Component({
  selector: 'app-upcoming-appointments',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './upcoming-appointments.component.html',
  styleUrl: './upcoming-appointments.component.css'
})
export class UpcomingAppointmentsComponent implements OnInit {
  userDetails!: UserData;
  upcomingAppointments$!: Observable<Appointment[]>;
  UserRole = UserRole;

  constructor(private appointmentService: AppointmentService, @Inject(MAT_DIALOG_DATA) public data: { userDetails: UserData },
    private dialogRef: MatDialogRef<UpcomingAppointmentsComponent>, private dialog: MatDialog) {
    this.userDetails = data.userDetails;
  }

  ngOnInit(): void {
    this.loadUpcomingAppointments();
  }

  private loadUpcomingAppointments(): void {
    const appointments$ = this.userDetails.role === UserRole.Doctor
      ? this.appointmentService.getByDoctorId(this.userDetails.id)
      : this.appointmentService.getByPatientId(this.userDetails.id);

    this.upcomingAppointments$ = appointments$.pipe(
      map(appointments => appointments.filter(a => a.status === AppointmentStatus.Scheduled))
    );
  }

  editAppointment(appointmentId: number): void {
    const editDialog = this.dialog.open(AppointmentFormComponent, {
      width: '600px',
      data: { appointmentId: appointmentId }
    });

    editDialog.afterOpened().subscribe(() => {
      this.dialogRef.close();
    });
  }

  cancelAppointment(appointmentId: number): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.delete(appointmentId).subscribe({
        error: (error) => {
          console.log('Failed to cancel appointment. Error: ', error)
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
