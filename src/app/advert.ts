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

  public status: any;

  constructor(root: any) {
    this.id = root.attributes['data-id'].value;
    const tbody = root.children[0];
    const tr1 = tbody.children[0];
    this.url = tr1.children[0].children[0].attributes.href.value;

    this.name = tr1.children[1].children[0].children[0].children[0].innerText.trim();
    const tr2 = tbody.children[1];
    this.price = tr1.children[2].children[0].innerText.trim();
    this.priceNum = parseFloat(this.price.replace(/([\d\s\,\.]+).*/, '$1').replace(' ', ''));
    this.publicationDate = tr2.children[0].children[0].children[0].children[1].innerText.trim();

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
