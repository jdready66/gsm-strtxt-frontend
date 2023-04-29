import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Role } from 'src/app/models/role.enum';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { PasswordModalComponent } from '../password-modal/password-modal.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  currentUser: User = new User();
  message: string = '';
  mode: string = 'view';

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((data) => {
      this.currentUser = data;
    });
  }

  navigateToDetail() {
    this.router.navigate(['/detail', this.currentUser.id]);
  }

  cancelEdit() {
    this.mode = 'view';
  }

  openPasswordModal(user: User) {
    //this.resetMessage();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };
    const modalRef =    this.modalService.open(PasswordModalComponent, ngbModalOptions);
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.requireCurrentPassword();
    modalRef.componentInstance.focusPassword();

    modalRef.result
      .then((result) => {
        console.log(result);
        this.message = result;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
