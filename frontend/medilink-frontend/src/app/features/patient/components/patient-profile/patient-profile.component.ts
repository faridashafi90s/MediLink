import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';
import { NavigationComponent } from '../../../../shared/components/navigation/navigation.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { MatExpansionPanelDescription } from '@angular/material/expansion';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavigationComponent],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css'],
  providers: [PatientService]
})
export class PatientProfileComponent implements OnInit {
  patientForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private authService: AuthService
  ) {
    this.patientForm = this.fb.group({
      id: [null],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required, this.dateValidator]],
      gender: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  dateValidator(control: any) {
    const today = new Date();
    const dob = new Date(control.value);
    return dob >= today ? { invalidDate: true } : null;
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadPatient(user.id);
      }
      else {
        console.error('Patient not found!');
      }
    });
  }

  loadPatient(id: number): void {
    this.patientService.getById(id).subscribe({
      next: (patient) => {
        const date = new Date(patient.dateOfBirth);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        this.patientForm.patchValue({
          ...patient,
          dateOfBirth: formattedDate
        });
      },
      error: () => this.errorMessage = 'Failed to load patient details.'
    });
  }

  onSubmit(): void {
    if (this.patientForm.invalid) return;

    this.isSubmitting = true;
    this.patientService.update(this.patientForm.value.id, this.patientForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Profile updated successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Failed to update profile.';
        this.isSubmitting = false;
      }
    });
  }
}