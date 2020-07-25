
const express = require( 'express' );
const curl = require( "curl" );
var bodyParser = require( "body-parser" );
const app = express();
app.use( bodyParser.json() );
app.use( express.static( 'dist' ) );
const port = process.env.PORT || 3000;
app.listen( port, () => console.log( `Example app listening at http://localhost:${ port }` ) );



class Advert
{
  constructor ( root )
  {
    this.id = root.attributes[ 'data-id' ].value;
    const tbody = root.children[ 0 ];
    const tr1 = tbody.children[ 0 ];
    this.url = tr1.children[ 0 ].children[ 0 ].attributes.href.value;
    this.name = tr1.children[ 1 ].children[ 0 ].children[ 0 ].children[ 0 ].text.trim();
    const tr2 = tbody.children[ 1 ];
    this.price = tr1.children[ 2 ].children[ 0 ].children[ 0 ].children[ 0 ].innerHTML.trim();
    this.priceNum = parseFloat( this.price.replace( /([\d\s\,\.]+).*/, '$1' ).replace( ' ', '' ) );
    this.publicationDate = tr2.children[ 0 ].children[ 0 ].children[ 0 ].children[ 1 ].textContent.trim().replace( /\s+/, ' ' );
  }
}


// get url() {
//   let url = `https://www.olx.pl/nieruchomosci/mieszkania/wynajem/${this.city.toLowerCase()}/?`;
//   url += `search%5Bfilter_float_price%3Afrom%5D=${this.priceFrom}`;
//   url += `&search%5Bfilter_float_price%3Ato%5D=${this.priceTo}`;
//   url += `&search%5Bprivate_business%5D=${this.privateBusiness}`;
//   if (this.districtId != null) {
//     url += `&search%5Bdistrict_id%5D=${this.districtId}`;
//   }
//   url += `&page=${this.page}`;
//   return url;
// }



function parseData ( html )
{
  const jsdom = require( "jsdom" );
  const { JSDOM } = jsdom;
  const dom = new JSDOM( html );
  const $ = ( require( 'jquery' ) )( dom.window );

  var items = $( 'table[summary="Ogłoszenie"]' );
  var adverts = [];

  for ( var i = 0; i < items.length; i++ )
  {
    const advert = new Advert( items[ i ] );
    adverts.push( advert );
  }
  return adverts;
}

app.get( '/api/', ( req, res ) =>
{
  const url = "https://www.olx.pl/nieruchomosci/mieszkania/wynajem/warszawa/?search%5Bfilter_float_price%3Afrom%5D=1000&search%5Bfilter_float_price%3Ato%5D=2000&search%5Bprivate_business%5D=private&search%5Bdistrict_id%5D=373";

  curl.get( url, null, ( err, resp, body ) =>
  {
    if ( resp.statusCode == 200 )
    {
      const adverts = parseData( body );
      res.send( adverts );
    }
    else
    {
      console.log( "error while fetching url" );
    }
  } );

} );
