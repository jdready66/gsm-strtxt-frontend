import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { Role } from 'src/app/models/role.enum';
import { User } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/admin.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormHelperService } from 'src/app/services/form-helper.service';
import { UserService } from 'src/app/services/user.service';
import CustomValidators from 'src/app/validation/CustomValidators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit, OnDestroy {
  detailForm: FormGroup;
  user: User = new User();
  id: number = 0;
  self = false;
  private sub: any;

  errorMessage: string = '';
  confirmPassword: string = '';

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private formHelper: FormHelperService,
    private location: Location
  ) {
    this.detailForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required]),
        pin: new FormControl('', [Validators.required]),
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        confirm: new FormControl('', [Validators.required]),
        role: new FormControl('', []),
      },
      [CustomValidators.match('password', 'confirm')]
    );

    // Only works in the constructor
    this.user = Object.assign(
      new User(),
      this.router.getCurrentNavigation()?.extras.state
    );
    if (this.user.id) {
      console.log('user:', this.user);
      this.id = this.user.id;
    }
    console.log('id in constructor: ' + this.id);
  }

  ngOnInit(): void {
    console.log('history:', window.history);
    console.log('state:', window.history.state);
    this.sub = this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.self = this.adminService.getCurrentUser().id == this.id;
      console.log('id passed: ' + this.id);
      if (this.user.id) {
        this.patchDetailForm();
      } else {
        if (this.id === 0) {
          console.log('new user - no need to lookup...');
          this.detailForm.controls['role'].setValue('USER');
          return;
        }
        console.log('user was not passed... getting based on id...');
        this.userService.getUserById(this.id).subscribe({
          next: (data) => {
            this.user = data;
            this.patchDetailForm();
          },
          error: (err) => {
            console.log('error', err);
          },
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  patchDetailForm() {
    this.clearPasswordValidation();
    this.detailForm.patchValue(this.user);
    if (this.self) {
      this.detailForm.get('role')?.disable();
    }
  }

  clearPasswordValidation() {
    console.log('clearing errors...');
    this.detailForm.clearValidators();
    this.detailForm.updateValueAndValidity();
    this.detailForm.setErrors(null);
    this.detailForm.controls['password'].clearValidators();
    this.detailForm.controls['password'].updateValueAndValidity();
    this.detailForm.controls['password'].setErrors(null);
    this.detailForm.controls['confirm'].clearValidators();
    this.detailForm.controls['confirm'].updateValueAndValidity();
    this.detailForm.controls['confirm'].setErrors(null);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.detailForm.controls;
  }

  saveUser(): void {
    if (this.detailForm.invalid) {
      console.log('form is invalid!');
      Object.keys(this.detailForm.controls).forEach((key) => {
        console.log(
          'key: ' + key + ' is valid: ' + this.detailForm.controls[key].errors
        );
      });
      return;
    }

    Object.assign(this.user, this.detailForm.value);
    this.user.id = this.id;
    console.log('after assign... user:', this.user);

    if (this.user.id == 0) {
      this.authenticationService.register(this.user).subscribe({
        next: (data) => {
          this.user.id = data.id;
          if (this.user.role == Role.ADMIN) {
            this.updateUser();
          } else {
            //this.router.navigate(['/admin']);
            this.navigateBack();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err.status, err.statusText, err.message);
          console.log('calling processServeFormError()...');
          this.errorMessage = this.formHelper.processServerFormError(
            err,
            this.detailForm,
            "Error creating user."
          );
          console.log('errorMessage: ' + this.errorMessage);
        },
      });
    } else {
      this.updateUser();
    }
  }

  updateUser() {
    this.adminService.updateUser(this.user).subscribe({
      next: () => {
        console.log('routine to admin...');
        //this.router.navigate(['/admin']);
        this.navigateBack();
      },
      error: (err) => {
          console.log(err.status, err.statusText, err.message);
        console.log('calling processServeFormError()...');
        this.errorMessage = this.formHelper.processServerFormError(
          err,
          this.detailForm,
          "Error updating user."
        );
        console.log('errorMessage: ' + this.errorMessage);
      },
    });
  }

  deleteUser() {
    if (confirm('Are you sure you want to delete this user?')) {
      if (this.user.id && this.user.id > 0) {
        this.adminService.deleteUserById(this.user.id).subscribe({
          next: () => {
            //this.router.navigate(['/admin']);
            this.navigateBack();
          },
          error: (err) => {
            this.errorMessage = 'Error trying to delete user.';
            console.log(err);
          },
        });
      }
    }
  }

  cancelForm() {
    //this.router.navigate(['/admin']);
    this.navigateBack();
  }

  navigateBack() {
    this.location.back();
  }
}
