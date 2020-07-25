import { Component, OnInit } from '@angular/core';
import { Advert, Status } from './advert';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MieszkaniaOlx';

  links: string;
  data: string;
  adverts: Advert[];
  status = Status;

  public city = 'Warszawa';
  public priceFrom = 1000;
  public priceTo = 2000;
  public privateBusiness = 'private';
  public districtId = 373;
  public page = 1;

  get url() {
    let url = `https://www.olx.pl/nieruchomosci/mieszkania/wynajem/${this.city.toLowerCase()}/?`;
    url += `search%5Bfilter_float_price%3Afrom%5D=${this.priceFrom}`;
    url += `&search%5Bfilter_float_price%3Ato%5D=${this.priceTo}`;
    url += `&search%5Bprivate_business%5D=${this.privateBusiness}`;
    if (this.districtId != null) {
      url += `&search%5Bdistrict_id%5D=${this.districtId}`;
    }
    url += `&page=${this.page}`;
    return url;
  }

  public constructor() {
  }

  public ngOnInit(): void {
    this.process();
  }

  public process() {
    const domparser = new DOMParser();
    $.get(this.url, data => {
      const doc = domparser.parseFromString(data, 'text/html');
      const advertsHtml = $(doc).find('table[summary="Ogłoszenie"]');
      this.adverts = advertsHtml.map((index, html) => new Advert(html));
    });
  }

  public upvote(advert: Advert) {
    console.log(advert);
    advert.setStatus(Status.Upvote);
  }
  public downvote(advert: Advert) {
    advert.setStatus(Status.Downvote);
  }
  public clearvote(advert: Advert) {
    advert.setStatus(Status.None);
  }

  public nextPage() {
    this.page += 1;
    this.process();
  }
  public previousPage() {
    this.page -= 1;
    this.process();
  }
}
