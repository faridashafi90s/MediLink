import { Routes } from '@angular/router';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { PatientDashboardComponent } from './components/dashboard/patient-dashboard.component';
import { PatientProfileComponent } from './components/patient-profile/patient-profile.component';
import { AppointmentListComponent } from '../appointment/components/appointment-list/appointment-list.component';

export const patientRoutes: Routes = [
  {
    path: '',
    component: PatientListComponent,
  },

  { path: 'add', component: PatientFormComponent },
  { path: 'edit/:id', component: PatientFormComponent },
  {
    path: 'patient-dashboard',
    children: [
      { path: '', component: PatientDashboardComponent },
      { path: 'appointments', component: AppointmentListComponent },
      { path: 'profile', component: PatientProfileComponent },
    ]
  }
];
