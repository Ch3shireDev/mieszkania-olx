export enum Status {
  None,
  Upvote,
  Downvote
}

export class Advert {

  public id: string;
  public url: string;
  public name: string;
  public price: string;
  public priceNum: number;
  public img: string;
  public publicationDate: string;
  public promoted: boolean;

  public status: any;

  constructor(x: any) {
    this.id = x.id;
    this.name = x.name;
    this.price = x.price;
    this.priceNum = parseInt(x.priceNum, 10);
    this.promoted = x.promoted;
    this.publicationDate = x.publicationDate;
    this.url = x.url;
    this.getStatus();

  }

  public setStatus(status) {
    this.status = status;
    localStorage.setItem(this.id, status);
    console.log(status);
  }

  public getStatus() {
    const status = localStorage.getItem(this.id);
    if (status == null) { return; }
    this.status = status;
  }
}
