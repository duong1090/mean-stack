import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './authenticate.service';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private authService: SocialAuthService
  ) {}

  login = () => {
    this.authenticationService.login(this.username, this.password).subscribe(
      (data) => {
        if (data != null && data.token) {
          console.log('login Success');
          // this.router.navigateByUrl('/productList');
          this.router.navigateByUrl('/product/list');
        } else {
          console.log('login fail');
        }
      },
      (err) => console.error(err)
    );
  };

  signInWithGoogle() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
      console.log(user);
      this.authenticationService.loginGoogle(user);
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) => {
      // send to server get token
      console.log(user);
      var res: any = this.authenticationService.loginFacebook(user);
    });
  }

  keyUpUsername = (event: any) => {
    let element: HTMLInputElement = event.target;
    let val: string = element.value;
    this.username = val;
  };

  keyUpPassword = (event: any) => {
    let element: HTMLInputElement = event.target;
    let val: string = element.value;
    this.password = val;
  };
  ngOnInit(): void {
    localStorage.removeItem('apiToken');
    
  }
}
