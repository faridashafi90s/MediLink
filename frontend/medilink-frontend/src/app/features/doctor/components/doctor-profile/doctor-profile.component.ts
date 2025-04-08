import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationComponent } from '../../../../shared/components/navigation/navigation.component';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavigationComponent],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css'],
  providers: [DoctorService]
})
export class DoctorProfileComponent implements OnInit {
  doctorForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private authService: AuthService,
  ) {
    this.doctorForm = this.fb.group({
      id: [null],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      specialization: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadDoctor(user.id);
      }
      else {
        console.error('Patient not found!');
      }
    });
  }

  loadDoctor(id: number): void {
    this.doctorService.getById(id).subscribe({
      next: (doctor) => {
        this.doctorForm.patchValue(doctor);
      },
      error: () => this.errorMessage = 'Failed to load doctor details.'
    });
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) return;

    this.isSubmitting = true;
    this.doctorService.update(this.doctorForm.value.id, this.doctorForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Profile updated successfully!');
      },
      error: () => {
        this.errorMessage = 'Failed to update profile.';
        this.isSubmitting = false;
      }
    });
  }
}