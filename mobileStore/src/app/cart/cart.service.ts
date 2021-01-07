import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Config } from '../config/server.config';
import { AuthenticationService } from '../login/authenticate.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private count: any;
  private headerHttp: HttpHeaders;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    let headers: any = {
      'x-access-token': localStorage.getItem('apiToken'),
    };
    var values = [],
      keys = Object.keys(localStorage),
      i = keys.length;

    while (i--) {
      values.push(localStorage.getItem(keys[i]));
    }
    this.headerHttp = headers;
  }

  isLogin() {
    // IF NGƯỢC
    if (
      !localStorage.getItem('apiToken') ||
      localStorage.getItem('apiToken') == undefined
    ) {
      this.router.navigate(['/login']);
    }
  }

  public get countCart(): any {
    return this.count;
  }

  public getCart = () => {
    const user: any = this.authenticationService.currentUserValue;
    return this.http
      .get<any>(Config.API_URL.concat('cart/list'), {
        headers: this.headerHttp,
      })
      .pipe(
        map((list) => {
          if (
            list.message == 'Failed to authenticate token.' ||
            list.message == 'No token provided.'
          ) {

            console.log("FailedFailedFailedFailedFailedFailedFailed");
            return this.router.navigate(['/login']);
          }
          console.log('cart:::pipe', list);
          if (list && list.length) {
            return list;
          } else {
            return null;
          }
        })
      );
  };

  public removeCart = (item: any) => {
    return this.http
      .post<any>(
        Config.API_URL.concat('cart/delete').concat(`/${item.id}`),
        {},
        {
          headers: this.headerHttp,
        }
      )
      .pipe(
        map((data) => {
          console.log('cart:::remove:::pipe', data);
          if (data != null) return data;
          else return null;
        })
      );
  };

  public removeAll = () => {
    const user: any = this.authenticationService.currentUserValue;
    const user_id: any = user && user.id ? user.id : '';
    return this.http
      .post<any>(
        Config.API_URL.concat('cart/delete-all'),
        {},
        {
          headers: this.headerHttp,
        }
      )
      .pipe(
        map((data) => {
          console.log('cart:::removeAll:::pipe', data);
          if (data != null) return data;
          else return null;
        })
      );
  };

  public addToCart = (item: any) => {
    console.log('addToCart:::', item);
    return this.http.post<any>(
      Config.API_URL.concat('cart/add'),
      {
        prod_id: item.id,
        count: 1,
      },
      {
        headers: this.headerHttp,
      }
    );
  };

  public increaseAmount = (item: any) => {
    console.log('increaseAmount:::', item);
    return this.http
      .post<any>(
        Config.API_URL.concat('cart/increase').concat(`/${item.id}`),
        {},
        { headers: this.headerHttp }
      )
      .pipe(
        map((data) => {
          console.log('cart:::increase:::pipe', data);
          if (data != null) return data.data;
          else return null;
        })
      );
  };
  public decreaseAmount = (item: any) => {
    console.log('decreaseAmount:::', item);
    return this.http
      .post<any>(
        Config.API_URL.concat('cart/decrease').concat(`/${item.id}`),
        {},
        { headers: this.headerHttp }
      )
      .pipe(
        map((data) => {
          console.log('cart:::decrease:::pipe', data);
          if (data != null) return data.data;
          else return null;
        })
      );
  };

  public checkOutCart = () => {
    return this.http.post<any>(
      Config.API_URL.concat('cart/check-out'),
      {},
      { headers: this.headerHttp }
    );
  };
}
