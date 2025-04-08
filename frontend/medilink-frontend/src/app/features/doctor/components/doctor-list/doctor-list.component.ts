import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css'],
  providers: [DoctorService]
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];
  errorMessage = '';

  constructor(private router: Router, private doctorService: DoctorService) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getAll().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load doctors. Please try again.';
      }
    });
  }

  deleteDoctor(id: number) {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.delete(id).subscribe(() => {
        this.doctors = this.doctors.filter((d) => d.id !== id);
        alert('Doctor deleted successfully.');
      });
    }
  }

  navigateToAdd(): void {
    this.router.navigate(['/doctors/add']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/doctors/edit', id]);
  }
}
