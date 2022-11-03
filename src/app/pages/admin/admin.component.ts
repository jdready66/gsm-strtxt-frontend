import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  userList: Array<User> = [];

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.adminService.findAllUsers().subscribe(data => {
      this.userList = data;
    });
  }

  detail(user: User) {
    this.router.navigate(['/detail', user.id], {state: user});
  }

  newUser() {
    this.router.navigate(['/detail/0']);
  }

}
