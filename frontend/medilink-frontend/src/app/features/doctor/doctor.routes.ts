import { Routes } from '@angular/router';
import { DoctorListComponent } from './components/doctor-list/doctor-list.component';
import { DoctorFormComponent } from './components/doctor-form/doctor-form.component';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard.component';
import { DoctorProfileComponent } from './components/doctor-profile/doctor-profile.component';
import { AppointmentListComponent } from '../appointment/components/appointment-list/appointment-list.component';

export const doctorRoutes: Routes = [
  {
    path: '',
    component: DoctorListComponent,
  },
  { path: 'add', component: DoctorFormComponent },
  { path: 'edit/:id', component: DoctorFormComponent },
  {
    path: 'doctor-dashboard',
    children: [
      { path: '', component: DoctorDashboardComponent },
      { path: 'appointments', component: AppointmentListComponent },
      { path: 'profile', component: DoctorProfileComponent },
    ]
  },
];