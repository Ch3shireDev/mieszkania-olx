import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url = 'https://www.olx.pl/nieruchomosci/mieszkania/?search%5Bfilter_float_price%3Afrom%5D=1000&search%5Bfilter_float_price%3Ato%5D=2000';

  constructor(private http: HttpClient) { }

  public getLinks() {

    // return this.http.get(url);

    const headers = new HttpHeaders()
      .set('cache-control', 'no-cache')
      .set('response-type', 'text')
      // .set('postman-token', 'b408a67d-5f78-54fc-2fb7-00f6e9cefbd1')
      ;

    return this.http
      .get(this.url, { headers });
  }
}
