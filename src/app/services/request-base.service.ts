import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { AuthenticationService } from './authentication.service';

export abstract class RequestBaseService {

  protected currentUser: User = new User();

  protected constructor(protected authenticationService: AuthenticationService, protected http: HttpClient) {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
    });
  }

  get getHeaders(): HttpHeaders {
    console.log('getHeaders... Current User: ', this.currentUser);
    let headers: HttpHeaders = new HttpHeaders()
      .set('authorization', 'Bearer ' + this.currentUser?.accessToken)
      .set('Content-Type', 'application/json; charset=UTF-8');
    console.log('getHeaders... Headers returned: ', headers);

    return headers;
  }

  getCurrentUser(): User {
    return this.currentUser;
  }
}
