import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
  providers: [PatientService]
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  errorMessage = '';

  constructor(private router: Router, private patientService: PatientService) { }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAll().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load patients. Please try again.'; // ➡️ Set error message
      }
    });
  }

  deletePatient(id: number) {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.delete(id).subscribe(() => {
        this.patients = this.patients.filter((p) => p.id !== id);
        alert('Patient deleted successfully.');
      });
    }
  }

  navigateToAdd(): void {
    this.router.navigate(['/patients/add']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/patients/edit', id]);
  }
}