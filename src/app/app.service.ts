import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Advert } from './advert';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  public getAdverts(priceFrom: number, priceTo: number, privateBusiness: string, districtId: number, page: number): Observable<Advert[]> {
    return this.http.get<Advert[]>('/api/');
  }
}
