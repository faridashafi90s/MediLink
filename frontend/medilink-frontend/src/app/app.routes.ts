import { Routes } from '@angular/router';
import { WelcomeComponent } from './shared/components/welcome/welcome.component';

export const appRoutes: Routes = [
  { path: '', component: WelcomeComponent },
  {
    path: 'patients',
    loadChildren: () => import('./features/patient/patient.routes').then(m => m.patientRoutes),
  },
  {
    path: 'doctors',
    loadChildren: () => import('./features/doctor/doctor.routes').then(m => m.doctorRoutes),
  }
];