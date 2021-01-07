import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Config } from '../config/server.config';
import { Product } from 'src/app/model';
import { isNgTemplate } from '@angular/compiler';
import { Router } from '@angular/router';

const createUrl = `${Config.API_URL}movie/create`;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private headerHttp: HttpHeaders;

  constructor(private httpClient: HttpClient, private router: Router) {
    this.isLogin();
    let headers: any = {
      'x-access-token': localStorage.getItem('apiToken'),
    };
    var values = [],
      keys = Object.keys(localStorage),
      i = keys.length;

    while (i--) {
      values.push(localStorage.getItem(keys[i]));
    }
    /// chỗ này t đọc localstore ra cái values. token t lưu trong values['apiToken']
    console.log('localStoragelocalStorage', values);
    this.headerHttp = headers;
    console.log('headersheaders', this.headerHttp);
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

  create(data: any): Observable<any> {
    this.isLogin();

    return this.httpClient.post<any>(createUrl, data, { headers: this.headerHttp }).pipe(
      map((data) => {
        console.log('getListProduct0:::pipedetail', data);
        if (
          data.message == 'Failed to authenticate token.' ||
          data.message == 'No token provided.'
        ) {

          console.log("FailedFailedFailedFailedFailedFailedFailed");
          return this.router.navigate(['/login']);
        }
        return null
      })
    );
    ;
  }

  update(data: FormData): Observable<any> {
    this.isLogin();
    console.log('updateProductService:::', data);
    return this.httpClient.post(`${Config.API_URL}movie/update`, data, {
      headers: this.headerHttp,
    });
  }

  delete(id: any): Observable<any> {
    this.isLogin();

    return this.httpClient.post(
      Config.API_URL.concat('movie/delete'),
      { id },
      { headers: this.headerHttp }
    );
  }

  getListProduct = () => {
    this.isLogin();

    return this.httpClient
      .get<any>(`${Config.API_URL}movie/list`, { headers: this.headerHttp })
      .pipe(
        map((data) => {
          if (data) {
            console.log('getListProduct0:::pipe', data);
            if (
              data.message == 'Failed to authenticate token.' ||
              data.message == 'No token provided.'
            )
              return this.router.navigate(['/login']);

            return data.map((item: any) => {
              return {
                ...item,
                id: item._id,
                image: Config.API_UPLOAD.concat(item.image),
              };
            });
          } else {
            return [];
          }
        })
      );
  };

  getProduct = (id: number) => {
    this.isLogin();
    return this.httpClient
      .get<any>(`${Config.API_URL}movie/detail/${id}`, {
        headers: this.headerHttp,
      })
      .pipe(
        map((data) => {
          console.log('getListProduct0:::pipedetail', data);
          if (
            data.message == 'Failed to authenticate token.' ||
            data.message == 'No token provided.'
          ) {

            console.log("FailedFailedFailedFailedFailedFailedFailed");
            return this.router.navigate(['/login']);
          }
          if (data && data.data) {
            return {
              ...data.data,
              id: data.data._id,
              image: Config.API_UPLOAD.concat(data.data.image),
            };
          } else {
            return null;
          }
        })
      );
  };
}
