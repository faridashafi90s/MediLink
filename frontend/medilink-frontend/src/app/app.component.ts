import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { UserRole } from './shared/models/user-role.enum';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'medilink-frontend';
  showNavbar = true;
  UserRole = UserRole;

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => {
      this.showNavbar = this.router.url !== '/';
    });
  }

  switchRole(newRole: UserRole): void {
    this.authService.logout();
    this.authService.demoLogin(newRole).subscribe({
      next: () => {
        const route = newRole === UserRole.Doctor
          ? '/doctors/doctor-dashboard'
          : '/patients/patient-dashboard';
        this.router.navigate([route]);
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  }
}
