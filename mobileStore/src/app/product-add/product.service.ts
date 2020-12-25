import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Config } from '../config/server.config';
import { Product } from 'src/app/model';
import { isNgTemplate } from '@angular/compiler';

const createUrl = `${Config.API_URL}movie/create`;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private headerHttp: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    let headers: any = {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('apiToken'),
    };
    this.headerHttp = headers;
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(createUrl, data);
  }

  update(data: any): Observable<any> {
    return this.httpClient.post(`${Config.API_URL}movie/update`, data);
  }

  delete(id: any): Observable<any> {
    return this.httpClient.post(Config.API_URL.concat('movie/delete'), { id });
  }

  getListProduct = () => {
    return this.httpClient.get<any>(`${Config.API_URL}movie/list`).pipe(
      map((data) => {
        console.log('getListProduct0:::pipe', data);
        if (data) {
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
    return this.httpClient.get<any>(`${Config.API_URL}movie/detail/${id}`).pipe(
      map((data) => {
        console.log('getListProduct0:::pipe', data);
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
