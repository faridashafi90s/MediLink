import { Routes } from '@angular/router';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { UpcomingAppointmentsComponent } from './components/upcoming-appointments/upcoming-appointments.component';

export const appointmentRoutes: Routes = [
  {
    path: '',
    component: AppointmentListComponent,
  },
  { path: 'add', component: AppointmentFormComponent },
  { path: 'edit/:id', component: AppointmentFormComponent },
  { path: 'upcoming', component: UpcomingAppointmentsComponent },
];
