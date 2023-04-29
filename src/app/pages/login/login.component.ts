import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user: User = new User();
  errorMessage: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this.authenticationService.currentUserValue?.id) {
      this.router.navigate(['/profile']);
    }
  }
  
  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.user = Object.assign(this.user, this.loginForm.value);
    console.log(this.user);

    this.authenticationService.login(this.user).subscribe({
      next: (data) => {
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        if (error['status'] == 403) {
          this.errorMessage = 'Username or password is incorrect';
        } else if (error['status'] == 0) {
          this.errorMessage = "Unable to communicate with back-end";
        } else {
          this.errorMessage = 'Unknown problem?';
        }
        console.log(error);
      },
    });
  }
}
