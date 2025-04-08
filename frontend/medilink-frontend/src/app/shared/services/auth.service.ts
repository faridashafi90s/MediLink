import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserData } from '../models/user-data.model';
import { AuthResponse } from '../models/auth-response.model';
import { UserRole } from '../models/user-role.enum';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth'; 
  private currentUserSubject = new BehaviorSubject<UserData | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private demoAccounts = {
    patient: {
      email: 'demo.patient@medilink.com',
      password: 'Patient@123',
      role: UserRole.Patient
    },
    doctor: {
      email: 'demo.doctor@medilink.com',
      password: 'Doctor@123',
      role: UserRole.Doctor
    }
  };

  constructor(private http: HttpClient) {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const storedUser = localStorage.getItem('medilink_user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  demoLogin(userType: UserRole): Observable<AuthResponse> {
    let credentials;

    if (userType === UserRole.Patient) {
      credentials = this.demoAccounts.patient;
    } else if (userType === UserRole.Doctor) {
      credentials = this.demoAccounts.doctor;
    } else {
      throw new Error('Invalid user type');
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  private handleAuthentication(response: AuthResponse): void {
    const userData: UserData = {
      role: UserRole[response.role as keyof typeof UserRole],
      id: response.userId,
      token: response.token,
      email: response.email,
      fullName: response.fullName
    };

    localStorage.setItem('medilink_user', JSON.stringify(userData));
    this.currentUserSubject.next(userData);
  }

  logout(): void {
    localStorage.removeItem('medilink_user');
    this.currentUserSubject.next(null);
  }

  getAuthHeader(): { [header: string]: string } {
    const user = this.currentUserSubject.value;
    return user ? { Authorization: `Bearer ${user.token}` } : {};
  }
}