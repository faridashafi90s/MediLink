import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { Router } from '@angular/router';
import { NavigationComponent } from '../../../../shared/components/navigation/navigation.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { AppointmentStatus } from '../../models/appointment-status.enum';
import { UserData } from '../../../../shared/models/user-data.model';
import { UserRole } from '../../../../shared/models/user-role.enum';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, NavigationComponent],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  errorMessage = '';
  AppointmentStatus = AppointmentStatus;
  userDetails!: UserData;
  UserRole = UserRole;

  constructor(private router: Router, private appointmentService: AppointmentService, private authService: AuthService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (!user) {
        console.error('User not found!');
        return;
      }
      this.userDetails = user;
      this.loadAppointments();
    });
  }

  loadAppointments(): void {
    if (this.userDetails?.role === UserRole.Doctor) {
      this.appointmentService.getByDoctorId(this.userDetails.id).subscribe({
        next: (data) => {
          this.appointments = data;
        },
        error: () => {
          this.errorMessage = 'Failed to load doctor appointments. Please try again.';
        }
      });
    }
    else {
      this.appointmentService.getByPatientId(this.userDetails.id).subscribe({
        next: (data) => {
          this.appointments = data;
        },
        error: () => {
          this.errorMessage = 'Failed to load patient appointments. Please try again.';
        }
      });
    }
  }

  deleteAppointment(id: number): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.delete(id).subscribe(() => {
        this.appointments = this.appointments.filter((a) => a.id !== id);
        alert('Appointment deleted successfully.');
      });
    }
  }

  markCompleted(appointment: Appointment): void {
    appointment.status = AppointmentStatus.Completed;
    this.updateStatus(appointment);
  }

  markCancelled(appointment: Appointment): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      appointment.status = AppointmentStatus.Cancelled;
      this.updateStatus(appointment);
    }
  }


  private updateStatus(appointment: Appointment): void {
    this.appointmentService.update(appointment.id, appointment).subscribe({
      next: () => {
        alert('Appointment status updated successfully.');
      },
      error: () => {
        alert('Failed to update appointment status. Please try again.');
      }
    });
  }

  editAppointment(appointmentId: number): void {
    this.dialog.open(AppointmentFormComponent, {
      width: '600px',
      data: { appointmentId: appointmentId }
    });
  }

  createAppointment() {
    this.dialog.open(AppointmentFormComponent, {
      width: '600px',
      data: {}
    });
  }
}
