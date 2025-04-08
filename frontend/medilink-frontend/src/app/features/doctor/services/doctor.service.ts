import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class DoctorService {
  private apiUrl = environment.apiUrl + '/doctors'; ;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  create(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiUrl}/create`, doctor);
  }

  update(id: number, doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/update/${id}`, doctor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
