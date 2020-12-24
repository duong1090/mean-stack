import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Config } from '../config/server.config';
import { Product } from 'src/app/model';

const createUrl = `${Config.API_URL}product/create`;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}

  create(data: any): Observable<any> {
    return this.httpClient.post(createUrl, data);
  }
  getListProduct = () => {
    return this.httpClient.get<any>(`${Config.API_URL}product/list`).pipe(
      map((data) => {
        console.log('getListProduct0:::pipe', data);
        if (data) {
          return data;
        } else {
          return [];
        }
      })
    );
  };

  getProduct = (id: number) => {
    return this.httpClient.get<any>(`${Config.API_URL}product/get/${id}`).pipe(
      map((data) => {
        console.log('getListProduct0:::pipe', data);
        if (data) {
          return data;
        } else {
          return null;
        }
      })
    );
  };
}
