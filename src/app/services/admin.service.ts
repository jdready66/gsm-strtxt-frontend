import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PasswordChange } from '../models/password-change.model';
import { User } from '../models/user.model';
import { AuthenticationService } from './authentication.service';
import { RequestBaseService } from './request-base.service';

const API_URL = environment.BASE_URL + '/api/admin';

@Injectable({
  providedIn: 'root',
})
export class AdminService extends RequestBaseService {
  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  findAllUsers(): Observable<any> {
    return this.http.get(API_URL + '/all', { headers: this.getHeaders });
  }

  deleteUserById(id: number): Observable<any> {
    return this.http.delete(API_URL + '/delete-user/' + id, {
      headers: this.getHeaders,
    });
  }

  updateUser(user: User): Observable<any> {
    console.log('updateUser()...  headers: ', this.getHeaders);
    console.log('updating user: ', user);
    return this.http.put(API_URL + '/update-user/' + user.id, user, {headers: this.getHeaders });
  }

  updatePassword(user: User, currentPassword: string): Observable<any>{
    console.log('updatePassword()...');
    return this.http.put(API_URL + '/update-password/' + user.id, 
      new PasswordChange(user, currentPassword), {headers: this.getHeaders});
  }

}
