import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { RequestBaseService } from './request-base.service';

const API_URL = environment.BASE_URL + '/api/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends RequestBaseService {

  constructor(authenticationService: AuthenticationService, http: HttpClient) { 
    super(authenticationService, http);
  }

  changeRole(newRole: string): Observable<any> {
    return this.http.put(API_URL + '/change/' + newRole, {}, {headers: this.getHeaders});
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(API_URL + '/' + id, {headers: this.getHeaders});
  }

}
