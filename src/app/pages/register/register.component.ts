import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  user: User = new User();
  faUser = faUserCircle;
  errorMessage: string = '';
  confirmPassword = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authenticationService.currentUserValue?.id) {
      this.router.navigate(['/profile']);
    }
  }

  register() {
    this.authenticationService.register(this.user).subscribe({
      next: (data) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err?.status === 409) {
          this.errorMessage = 'Username already exists.';
        } else {
          this.errorMessage = 'Unexpected error occurred.';
          console.log(err);
        }
      },
    });
  }
}
