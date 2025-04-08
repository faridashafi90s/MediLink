import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { UserData } from '../../models/user-data.model';
import { UserRole } from '../../models/user-role.enum';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule, AsyncPipe],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})

export class NavigationComponent implements OnInit {
currentUser$!: Observable<UserData | null>;
UserRole = UserRole;

constructor(private authService: AuthService) {}

ngOnInit(): void {
  this.currentUser$ = this.authService.currentUser$;
}

}
