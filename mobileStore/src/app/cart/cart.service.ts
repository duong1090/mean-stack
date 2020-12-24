import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Config } from '../config/server.config';
import { AuthenticationService } from '../login/authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private count: any;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  public get countCart(): any {
    return this.count;
  }

  public getCart = () => {
    const user: any = this.authenticationService.currentUserValue;
    const id: any = user && user.id ? user.id : '';
    return this.http
      .get<any>(Config.API_URL.concat('cart/list').concat(`/${id}`))
      .pipe(
        map((list) => {
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
      .post<any>(Config.API_URL.concat('cart/delete').concat(`/${item.id}`), {})
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
        Config.API_URL.concat('cart/delete-all').concat(`/${user_id}`),
        {}
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
    const user: any = this.authenticationService.currentUserValue;
    const user_id: any = user && user.id ? user.id : '';
    return this.http.post<any>(Config.API_URL.concat('cart/add'), {
      userId: user_id,
      prodId: item.id,
      count: 1,
    });
  };
}
