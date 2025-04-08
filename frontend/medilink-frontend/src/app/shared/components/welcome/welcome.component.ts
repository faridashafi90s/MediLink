import { Component, ElementRef, Renderer2, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user-role.enum';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  @ViewChildren('particleBurst') particleBursts!: ElementRef<HTMLDivElement>[];

  readonly floatingIcons = ['❤️', '🩺', '💊', '🌡️'] as const;
  readonly roles = [
    {
      label: "I'm a Patient",
      icon: "👤",
      roleType: UserRole.Patient,
      hue: 200,
      description: 'Book appointments & manage care'
    },
    {
      label: "I'm a Doctor",
      icon: "🩺",
      roleType: UserRole.Doctor,
      hue: 160,
      description: 'Professional medical dashboard'
    }
  ] as const;

  UserType = UserRole;

  constructor(
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2
  ) { }

  selectRole(roleType: UserRole): void {
    this.authService.demoLogin(roleType).subscribe({
      next: () => {
        const route = roleType === UserRole.Doctor
          ? '/doctors/doctor-dashboard'
          : '/patients/patient-dashboard';
        this.router.navigate([route]);
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  }

  activateParticles(event: MouseEvent): void {
    const wrapper = event.currentTarget as HTMLElement;
    const burst = wrapper.querySelector('.particle-burst');

    if (!burst) return;

    const rect = wrapper.getBoundingClientRect();
    this.renderer.setStyle(burst, 'left', `${event.clientX - rect.left}px`);
    this.renderer.setStyle(burst, 'top', `${event.clientY - rect.top}px`);

    this.renderer.removeClass(burst, 'animate');
    requestAnimationFrame(() => {
      this.renderer.addClass(burst, 'animate');
    });
  }
}