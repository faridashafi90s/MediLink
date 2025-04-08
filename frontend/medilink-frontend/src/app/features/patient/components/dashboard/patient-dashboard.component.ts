import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../appointment/services/appointment.service';
import { UpcomingAppointmentsComponent } from '../../../appointment/components/upcoming-appointments/upcoming-appointments.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AppointmentFormComponent } from '../../../appointment/components/appointment-form/appointment-form.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ComingSoonDialog } from '../../../../shared/components/coming-soon-dialog/coming-soon-dialog.component';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import { NavigationComponent } from '../../../../shared/components/navigation/navigation.component';
import { PatientService } from '../../services/patient.service';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserData } from '../../../../shared/models/user-data.model';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [MatDialogModule, AsyncPipe, NavigationComponent, RouterOutlet],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css',
  providers: [PatientService]
})
export class PatientDashboardComponent implements OnInit {
  patientDetails!: UserData;
  upcomingAppointmentsCount$!: Observable<number>;

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.patientDetails = user;
        this.upcomingAppointmentsCount$ = this.appointmentService.getUpcomingAppointmentsCount(this.patientDetails.id, this.patientDetails.role);
      }
      else {
        console.error('Patient not found!');
      }
    });
  }

  createAppointment() {
    this.dialog.open(AppointmentFormComponent, {
      width: '600px',
      data: {}
    });
  }

  openUpcomingAppointments() {
    this.dialog.open(UpcomingAppointmentsComponent, {
      width: '600px',
      data: { userDetails: this.patientDetails }
    });
  }

  openComingSoonDialog(): void {
    this.dialog.open(ComingSoonDialog, {
      width: '600px'
    });
  }

  openProfile(): void {
    this.dialog.open(PatientFormComponent, {
      width: '600px',
      data: { patientId: this.patientDetails.id }
    });
  }

}
