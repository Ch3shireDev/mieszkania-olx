import { Component, OnInit } from '@angular/core';
import { Advert, Status } from './advert';
import { AppService } from './app.service';
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


  public constructor(private appService: AppService) {
  }

  public ngOnInit(): void {
    this.process();
  }

  public process() {
    this.appService.getAdverts(this.priceFrom, this.priceTo, this.privateBusiness, this.districtId, this.page).subscribe(adverts => {
      this.adverts = adverts;
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
