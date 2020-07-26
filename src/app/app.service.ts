import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
import { Advert } from './advert';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  public getAdverts(city: string, priceFrom: number, priceTo: number, privateBusiness: string, districtId: string):
    Observable<Advert[]> {
    const params = {
      priceFrom: priceFrom.toString(),
      priceTo: priceTo.toString(),
      privateBusiness, districtId,
      city
    };
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: { ...params }
    };

    return this.http.get<Advert[]>('/api', httpOptions);
  }
}
