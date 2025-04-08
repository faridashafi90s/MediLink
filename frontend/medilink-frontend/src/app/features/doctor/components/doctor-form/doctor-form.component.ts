import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.css'],
  providers: [DoctorService]
})
export class DoctorFormComponent implements OnInit {
  doctorForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  doctorId!: number;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private router: Router,
    private dialogRef: MatDialogRef<DoctorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { doctorId?: number }
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
    if (this.data.doctorId) {
      this.doctorId = this.data.doctorId;
      this.isEditMode = true;
      this.loadDoctor();
    }
  }

  loadDoctor(): void {
    this.doctorService.getById(this.doctorId).subscribe({
      next: (doctor: Doctor) => {
        this.doctorForm.patchValue(doctor);
      },
      error: () => this.errorMessage = 'Failed to load doctor details.'
    });
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) return;
    this.isSubmitting = true;
    const doctor = this.doctorForm.value;

    if (this.isEditMode) {
      this.doctorService.update(doctor.id, doctor).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => {
          this.errorMessage = 'Failed to update doctor.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.doctorService.create(doctor).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => {
          this.errorMessage = 'Failed to add doctor.';
          this.isSubmitting = false;
        }
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
