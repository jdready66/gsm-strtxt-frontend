import { Component, NgModuleRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/admin.service';
import { PasswordModalComponent } from '../password-modal/password-modal.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  userList: Array<User> = [];
  message: String = "";

  constructor(
    private adminService: AdminService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.adminService.findAllUsers().subscribe((data) => {
      this.userList = data;
    });
  }

  detail(user: User) {
    this.router.navigate(['/detail', user.id], { state: user });
  }

  changePassword(user: User) {
    alert('change password for: ' + user.name);
  }

  newUser() {
    this.router.navigate(['/detail/0']);
  }

  openPasswordModal(user: User) {
    this.resetMessage();
    const modalRef = this.modalService.open(PasswordModalComponent);
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.focusPassword();

    modalRef.result.then((result) => {
      console.log(result);
      this.message = result;
      
    }).catch((error) => {
      console.log(error);
    });
  }

  resetMessage() {
    this.message = '';
  }
}
