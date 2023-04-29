import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Role } from 'src/app/models/role.enum';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormHelperService } from 'src/app/services/form-helper.service';
import CustomValidators from 'src/app/validation/CustomValidators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  user: User = new User();
  faUser = faUserCircle;
  errorMessage: string = '';
  confirmPassword = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private formHelper: FormHelperService
  ) {
    this.registerForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required]),
      'confirm': new FormControl('', [Validators.required])
    },[
      CustomValidators.match('password', 'confirm')
    ]);
  }

  ngOnInit(): void {
    if (this.authenticationService.currentUserValue?.id) {
      this.router.navigate(['/profile']);
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }
    
    this.user = Object.assign(this.user, this.registerForm.value);
    this.user.role = Role.UNKNWON;
    console.log(this.user);


    this.authenticationService.register(this.user).subscribe({
      next: (data) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = this.formHelper.processServerFormError(err, this.registerForm);
      },
    });
  }
}
