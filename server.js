
const express = require( 'express' );
// const bent = require( 'bent' );
const axios = require( "axios" );

var bodyParser = require( "body-parser" );
const jsdom = require( "jsdom" );
const { JSDOM } = jsdom;
const app = express();
app.use( bodyParser.json() );

app.use( express.static( 'dist' ) );

const port = process.env.PORT || 3000;
app.listen( port, () => console.log( `Example app listening at http://localhost:${ port }` ) );



class Advert
{
  constructor ( root )
  {
    this.promoted = root.classList.contains( 'promoted-list' );
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

function parsePage ( html )
{
  try
  {
    const dom = new JSDOM( html );
    const $ = ( require( 'jquery' ) )( dom.window );
    var page = $( 'a[data-cy="page-link-last"]' )[ 0 ].textContent.trim();
    return parseInt( page, 10 );
  }
  catch{
    return 1;
  }
}

function parseData ( html )
{
  const dom = new JSDOM( html );
  const $ = ( require( 'jquery' ) )( dom.window );

  var items = $( 'table[summary="Ogłoszenie"]' );
  var adverts = [];

  for ( var i = 0; i < items.length; i++ )
  {
    try
    {
      const advert = new Advert( items[ i ] );
      adverts.push( advert );
    }
    catch{
      console.log( 'error for parsing the advert' );
    }
  }
  return adverts;
}

async function getAllAdverts ( priceFrom, priceTo, privateBusiness, districtId, city )
{
  let page = 1;
  let lastPage = 1;

  let Adverts = [];

  while ( page !== lastPage + 1 )
  {
    let url = `https://www.olx.pl/nieruchomosci/mieszkania/wynajem/${ city }/?`;
    if ( priceFrom != null ) url += `search%5Bfilter_float_price%3Afrom%5D=${ priceFrom }`;
    if ( priceTo != null ) url += `&search%5Bfilter_float_price%3Ato%5D=${ priceTo }`;
    if ( privateBusiness != null && privateBusiness !== 'undefined' ) url += `&search%5Bprivate_business%5D=${ privateBusiness }`;
    if ( districtId != null && districtId !== 'undefined' ) url += `&search%5Bdistrict_id%5D=${ districtId }`;
    if ( page != null ) url += `&page=${ page }`;

    const getData = async url =>
    {
      try
      {
        const response = await axios.get( url );
        const data = response.data;
        return data;
      } catch ( error )
      {
        return null;
      }
    };

    const body = await getData( url );
    if ( body === null ) break;
    if ( lastPage === 1 ) lastPage = parsePage( body );
    let adverts = parseData( body );

    if ( adverts !== undefined )
    {
      adverts.forEach( ad =>
      {
        Adverts.push( ad );
      } );
    }

    if ( Adverts.length > 200 ) break;
    page += 1;
  }

  return Adverts;
}


app.get( '/api', async ( req, res ) =>
{
  let priceFrom = req.query.priceFrom;
  const priceTo = req.query.priceTo;
  const privateBusiness = req.query.privateBusiness;
  const districtId = req.query.districtId;
  let city = req.query.city;

  if ( priceFrom === undefined ) priceFrom = 0;
  if ( city === undefined ) city = "warszawa";

  let Adverts = await getAllAdverts( priceFrom, priceTo, privateBusiness, districtId, city );

  // Czyszczenie z powtórek.
  let adverts = [];

  let ids = new Set( [] );
  Adverts.forEach( advert =>
  {
    let id = advert.id;
    if ( ids.has( id ) ) return;
    ids.add( id );
    adverts.push( advert );
  } );


  res.send( adverts );
} );
