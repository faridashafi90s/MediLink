import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css'],
  providers: [PatientService]
})
export class PatientFormComponent implements OnInit {
  patientForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  patientId!: number;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router,
    private dialogRef: MatDialogRef<PatientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { patientId?: number }
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
    if (this.data.patientId) {
      this.patientId = this.data.patientId;
      this.isEditMode = true;
      this.loadPatient();
    }
  }

  loadPatient(): void {
    this.patientService.getById(this.patientId).subscribe({
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
    const patient = this.patientForm.value;

    if (this.isEditMode) {
      this.patientService.update(patient.id, patient).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => {
          this.errorMessage = 'Failed to update patient.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.patientService.create(this.patientForm.value).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => {
          this.errorMessage = 'Failed to add patient.';
          this.isSubmitting = false;
        }
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
