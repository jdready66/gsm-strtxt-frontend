import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/admin.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit, OnDestroy {
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
    private route: ActivatedRoute
  ) {
    // Only works in the constructor
    this.user = Object.assign(
      new User(),
      this.router.getCurrentNavigation()?.extras.state
    );
    if (this.user.id) {
      this.id = this.user.id;
    }
    console.log('id in constructor: ' + this.id);
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.self = (this.adminService.getCurrentUser().id == this.id);
      console.log('id passed: ' + this.id);
      if (!this.user.id) {
        if (this.id === 0) {
          console.log('new user - no need to lookup...');
          return;
        }
        console.log('user was not passed... getting based on id...');
        this.userService.getUserById(this.id).subscribe({
          next: (data) => {
            this.user = data;
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

  saveUser(): void {
    this.user.id = this.id;
    console.log('user:', this.user);

    if (this.user.id == 0) {
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
    } else {
      if (this.self) {
        this.errorMessage = 'protect modifying yourself';
        return;
      }
      this.adminService.updateUser(this.user).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.errorMessage = 'Error trying to save user.';
          console.log(err);
        },
      });
    }
  }

  deleteUser() {
    if (confirm('Are you sure you want to delete this user?')) {
      if (this.user.id && this.user.id > 0) {
        this.adminService.deleteUserById(this.user.id).subscribe({
          next: () => {
            this.router.navigate(['/admin']);
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
    this.router.navigate(['/admin']);
  }
}
