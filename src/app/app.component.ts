import { Component, OnInit } from '@angular/core';
import { Advert, Status } from './advert';
import { AppService } from './app.service';
import { NgxSpinnerService } from 'ngx-spinner';
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
  public districtId = '373';
  public error: string;

  public priceSort = 0;

  public businessTypes = [
    { name: 'Prywatne', id: 'private' },
    { name: 'Biura/Deweloperzy', id: 'business' },
    { name: 'Wszystkie', id: undefined },
  ];

  public districts = [
    { name: 'Bemowo', id: '367' },
    { name: 'Białołęka', id: '365' },
    { name: 'Bielany', id: '369' },
    { name: 'Mokotów', id: '353' },
    { name: 'Ochota', id: '355' },
    { name: 'Praga-Północ', id: '379' },
    { name: 'Praga-Południe', id: '381' },
    { name: 'Rembertów', id: '361' },
    { name: 'Śródmieście', id: '351' },
    { name: 'Targówek', id: '377' },
    { name: 'Ursus', id: '371' },
    { name: 'Ursynów', id: '373' },
    { name: 'Wawer', id: '383' },
    { name: 'Wesoła', id: '533' },
    { name: 'Wilanów', id: '375' },
    { name: 'Włochy', id: '357' },
    { name: 'Wola', id: '359' },
    { name: 'Żoliborz', id: '363' },
    { name: 'Cała Warszawa', id: undefined }
  ];

  public blacklist = false;
  public whitelist = false;

  public constructor(private appService: AppService, private spinnerService: NgxSpinnerService) {
  }

  public ngOnInit(): void {
    this.process();
  }

  public setSortByPrice() {
    this.priceSort = (this.priceSort + 1) % 3;
    this.sortByPrice();
  }

  public sortByPrice() {
    if (this.priceSort === 0) { return; }
    else if (this.priceSort === 1) {
      this.adverts = this.adverts.sort((a, b) => a.priceNum - b.priceNum);
    }
    else {
      this.adverts = this.adverts.sort((a, b) => b.priceNum - a.priceNum);
    }
  }


  public process() {
    this.error = undefined;
    this.adverts = [];
    this.spinnerService.show();
    this.appService.getAdverts(this.city.toLowerCase(),
      this.priceFrom,
      this.priceTo,
      this.privateBusiness,
      this.districtId).subscribe(adverts => {
        this.adverts = adverts
          .map(a => new Advert(a));
        this.sortByPrice();
        this.spinnerService.hide();
      }, err => {
        this.error = err.message;
        console.log(err);
        this.spinnerService.hide();
      });
  }

  public upvote(advert: Advert) {
    advert.setStatus(Status.Upvote);
  }
  public downvote(advert: Advert) {
    advert.setStatus(Status.Downvote);
  }
  public clearvote(advert: Advert) {
    advert.setStatus(Status.None);
  }

  public setBlacklist() {
    this.blacklist = !this.blacklist;
  }

  public setWhitelist() {
    this.whitelist = !this.whitelist;
  }

  public filterAdverts(adverts: Advert[]): Advert[] {
    // advert.status === Status.Upvote && this.whitelist || advert.status === Status.Downvote && this.blacklist
    return adverts.filter(advert => {
      if (this.blacklist) {
        if (advert.status == Status.Downvote) { return false; }
      }
      if (this.whitelist) {
        if (advert.status == Status.Upvote) { return false; }
      }

      return true;
    });
  }
}
