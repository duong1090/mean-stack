import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Config } from '../config/server.config';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: Object;

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('currentUser');
    this.currentUserSubject = JSON.parse(user ? user : '{}');
  }

  public get currentUserValue(): Object {
    return this.currentUserSubject;
  }

  public login = (username: string, password: string) => {
    console.log('loginService::::', username);

    const loginUrl = `${Config.API_URL}user/login`;
    console.log(loginUrl);

    return this.http
      .post<any>(loginUrl, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          console.log('login:::pipe', user);
          if (user != null) {
            let is_admin = user.username == 'admin' ? 1 : 0;
            localStorage.setItem(
              'currentUser',
              JSON.stringify({ ...user, is_admin })
            );
            return user;
          } else {
            return null;
          }
        })
      );
  };

  public logout = () => {
    localStorage.removeItem('currentUser');
  };
}
