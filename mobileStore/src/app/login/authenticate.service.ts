import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Config } from '../config/server.config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: Object;

  constructor(private http: HttpClient, private router: Router) {
    const user = localStorage.getItem('currentUser');
    this.currentUserSubject = JSON.parse(user ? user : '{}');
  }

  public get currentUserValue(): Object {
    return this.currentUserSubject;
  }

  public loginGoogle(param: any) {
    this.http.post<any>(`${Config.API_URL_AUTH}login`, param).subscribe(
      (res) => {
        console.log('ressress', res);
        if (res != null) {
          // let is_admin = user.username == 'admin' ? 1 : 0;
          localStorage.setItem('apiToken', res.token);
          localStorage.setItem(
            'currentUser',
            JSON.stringify({ ...res, is_admin: 1 })
          );
          this.router.navigate(['/product/list']);
          return res;
        } else {
          return null;
        }
        console.log('Success');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public loginFacebook(param: any) {
    this.http.post<any>(`${Config.API_URL_AUTH}login`, param).subscribe(
      (res) => {
        console.log('ressress', res);
        if (res != null) {
          // let is_admin = user.username == 'admin' ? 1 : 0;
          localStorage.setItem('apiToken', res.token);
          localStorage.setItem(
            'currentUser',
            JSON.stringify({ ...res, is_admin: 1 })
          );
          this.router.navigate(['/product/list']);
          return res;
        } else {
          return null;
        }
        console.log('Success');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public login = (username: string, password: string) => {
    console.log('loginService::::', username);

    const loginUrl = `${Config.API_URL_AUTH}login`;
    console.log(loginUrl);

    return this.http
      .post<any>(loginUrl, {
        username,
        password,
        provider: 'LOCAL',
      })
      .pipe(
        map((user) => {
          console.log('login:::pipe', user);
          if (user != null) {
            // let is_admin = user.username == 'admin' ? 1 : 0;
            localStorage.setItem('apiToken', user.token);
            localStorage.setItem(
              'currentUser',
              JSON.stringify({ ...user, is_admin: user.is_admin })
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
    localStorage.removeItem('apiToken');
  };
}
