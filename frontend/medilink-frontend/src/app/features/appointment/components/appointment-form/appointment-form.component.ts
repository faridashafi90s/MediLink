import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../../doctor/services/doctor.service';
import { PatientService } from '../../../patient/services/patient.service';
import { AppointmentStatus } from '../../models/appointment-status.enum';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../../shared/services/auth.service';
import { Patient } from '../../../patient/models/patient.model';
import { map, Observable } from 'rxjs';
import { UserData } from '../../../../shared/models/user-data.model';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css'],
  providers: [DoctorService, PatientService]
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  errorMessage = '';
  doctors: any[] = [];
  patient!: Patient;
  minDate: string = '';
  patientId!: number;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appointmentId?: number }
  ) {
    this.appointmentForm = this.fb.group({
      id: [null],
      doctorId: ['', [Validators.required]],
      doctorName: ['', [Validators.required]],
      patientId: ['', [Validators.required]],
      patientName: ['', [Validators.required]],
      appointmentDate: ['', [Validators.required, this.futureDateValidator]],
      status: [AppointmentStatus.Scheduled, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.patientId = user?.id ?? 0;
    });

    if (this.patientId) {
      this.loadDoctors();
      this.loadDoctorDetails();
      this.loadPatientDetails();

      if (this.data.appointmentId) {
        this.isEditMode = true;
        this.loadAppointment(this.data.appointmentId);
      }

      this.setMinDate();

    }
    else {
      console.error('User ID is not defined. Cannot load appointment form.');
    }
  }

  setMinDate(): void {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    this.minDate = localDate.toISOString().split('T')[0];
  }

  futureDateValidator(control: any) {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today ? { pastDate: true } : null;
  }

  loadDoctors(): void {
    this.doctorService.getAll().subscribe({
      next: (data) => this.doctors = data,
      error: () => this.errorMessage = 'Failed to load doctors.'
    });
  }

  loadDoctorDetails(): void {
    this.appointmentForm.get('doctorId')?.valueChanges.subscribe((selectedDoctorId) => {
      const selectedDoctor = this.doctors.find(d => d.id == selectedDoctorId);
      if (selectedDoctor) {
        this.appointmentForm.patchValue({
          doctorName: `${selectedDoctor.firstName} ${selectedDoctor.lastName}`
        }, { emitEvent: false });
      }
    });
  }

  loadPatientDetails(): void {
    this.patientService.getById(this.patientId).subscribe({
      next: (data) => {
        this.appointmentForm.patchValue({ patientId: data.id, patientName: `${data.firstName} ${data.lastName}` }, { emitEvent: false });
      },
      error: () => this.errorMessage = 'Failed to load patient.'
    });
  }

  loadAppointment(appointmentId: number): void {
    this.appointmentService.getById(appointmentId).subscribe({
      next: (appointment) => {
        if (appointment) {
          const date = new Date(appointment.appointmentDate);
          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

          this.appointmentForm.patchValue({
            ...appointment,
            appointmentDate: formattedDate,
          });
        } else {
          this.errorMessage = 'Appointment not found.';
        }
      },
      error: () => (this.errorMessage = 'Failed to load appointment details.'),
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) return;
    this.isSubmitting = true;
    const appointment = this.appointmentForm.value;

    if (this.isEditMode) {
      this.appointmentService.update(appointment.id, appointment).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => {
          this.errorMessage = 'Failed to update appointment.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.appointmentService.create(appointment).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => {
          this.errorMessage = 'Failed to add appointment.';
          this.isSubmitting = false;
        }
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
