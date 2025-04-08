import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentService } from '../../../appointment/services/appointment.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DoctorService } from '../../services/doctor.service';
import { AsyncPipe } from '@angular/common';
import { NavigationComponent } from '../../../../shared/components/navigation/navigation.component';
import { UpcomingAppointmentsComponent } from '../../../appointment/components/upcoming-appointments/upcoming-appointments.component';
import { ComingSoonDialog } from '../../../../shared/components/coming-soon-dialog/coming-soon-dialog.component';
import { DoctorFormComponent } from '../doctor-form/doctor-form.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserData } from '../../../../shared/models/user-data.model';

@Component({
  selector: 'app-doctor-dashboard',
  imports: [MatDialogModule, AsyncPipe, NavigationComponent, RouterOutlet],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css',
  providers: [DoctorService]
})
export class DoctorDashboardComponent implements OnInit {
  upcomingAppointmentsCount$!: Observable<number>;
  doctorDetails!: UserData;

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.doctorDetails = user;
        this.upcomingAppointmentsCount$ = this.appointmentService.getUpcomingAppointmentsCount(this.doctorDetails.id, this.doctorDetails.role);
      }
      else {
        console.error('Doctor not found!');
      }
    });
  }

  openUpcomingAppointments() {
    this.dialog.open(UpcomingAppointmentsComponent, {
      width: '600px',
      data: { userDetails: this.doctorDetails }
    });
  }

  openComingSoonDialog(): void {
    this.dialog.open(ComingSoonDialog, {
      width: '600px'
    });
  }

  openProfile(): void {
    this.dialog.open(DoctorFormComponent, {
      width: '600px',
      data: { doctorId: this.doctorDetails.id }
    });
  }
}
