const express = require('express');
const router = express.Router();
const db = require('../db');
var KnjigeLista;
var autorLista;
var hateoasLinker = require('express-hateoas-links');
var bodyParser = require('body-parser');
var cors = require('cors');
router.use(cors());
var fs = require('fs');
const request = require('request')
const fetch = require('node-fetch');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if ('OPTIONS' == req.method) {
     res.sendStatus(200);
   }
   else {
     next();
   }});

express()
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json());
router.use(hateoasLinker);

router.get('/books', async function (req, res, next) {
    const Knjige = 'SELECT * from knjiga'//nisam sigurna trebaju li se ispisati i svi autori ili samo knjiga--ako da, na koji nacin? 
    hateoasLinker.apply;
    try {
      KnjigeLista = (await db.query(Knjige, [])).rows;
      for(let knjiga of KnjigeLista){
        knjiga.slika = "http://localhost:3000/api/"+knjiga.id_k+"/picture";
      }
      var KNjigeIspis = JSON.stringify(KnjigeLista);
      res.status(200).json({
          status:"OK",
          message:"Fetched Books",
          response:{ 
            "@context": {
            "isbn": "https://schema.org/isbn",
            "broj_stranica": "https://schema.org/numberOfPages",
            "jezik": "https://schema.org/Language"

        },Knjige:KnjigeLista},
          links:[  
      { rel: "self", method: "GET", href: '/api/books' },
      { rel: "read", method: "GET", title: 'get all authors', href: '/api/authors' }
    ]});
     } catch(err){
        console.log(err.status);
    }
       
        let categoryItemMap = {};
 
});
router.get('/books/yearOfPublishing/:year([0-9]{1,10})', async function (req, res, next) {
    const godinaNastanka = parseInt(req.params.year);
    const Knjige = 'SELECT * from knjiga where EXTRACT (YEAR from datum_izdavanja) = $1'//nisam sigurna trebaju li se ispisati i svi autori ili samo knjiga--ako da, na koji nacin? 
    hateoasLinker.apply;
   // const link = "/api/authors/"+id_k;
    try {
      KnjigeLista = (await db.query(Knjige, [godinaNastanka])).rows;
      for(let i of KnjigeLista) i.slika = "http://localhost:3000/api/"+i.id_k+"/picture";
      var KNjigeIspis = JSON.stringify(KnjigeLista);
      if(KnjigeLista.length!= 0){
      res.status(200).json({
          status:"OK",
          message:"Fetched Books",
          response:{"@context": {
            "isbn": "https://schema.org/isbn",
            "broj_stranica": "https://schema.org/numberOfPages",
            "jezik": "https://schema.org/Language"

        }, Knjiga: KnjigeLista},
          links:[  
      { rel: "books", method: "GET",title:'get all books', href: '/api/books' },
      { rel: "authors", method: "GET", title: 'get authors of the book', href: '/api/authors' }
    ]});

  }else{
    res.status(401).json({
      status:"Not found",
      message:"There isn's books published in that year",
      response:null
   })
  }
} catch(err){
        console.log(err.status);
    }
       
        let categoryItemMap = {};
 
});


router.get('/books/:id([0-9]{1,10})', async function (req, res, next) {

  
    const id_k = parseInt(req.params.id);
    if(id_k == null){//nece se nikada izvrsiti jer sam stavila regex pa ce sve krive smatrati kao krivi path
    res.status(400).json({
      status:"Wrong type of id",
      message:"Id must be integer",
      response:{Knjiga:KnjigeLista},
      links:[  
      
  { rel: "authors", method: "GET", title: 'get authors of the book', href:link }
      ]})
    }

    const Knjige = 'SELECT * from knjiga where id_k = $1'//nisam sigurna trebaju li se ispisati i svi autori ili samo knjiga--ako da, na koji nacin?       
    const autor = `SELECT ime as ime_autora,prezime as prezime_autora,EXTRACT(YEAR from datum_rodjenja) as datum_rodjenja FROM autor NATURAL JOIN knjiga where id_k = $1`;
    const link = "/api/authors/"+id_k;
    try {
      KnjigeLista = (await db.query(Knjige, [id_k])).rows;
      for(let i of KnjigeLista) i.slika = "http://localhost:3000/api/"+id_k+"/picture";
      autorLista = (await db.query(autor, [id_k])).rows;
     if(KnjigeLista.length!=0){ 
         res.status(200).json({
        status:"OK",
        message:"Fetched Books",
        response:{"@context": {
          "isbn": "https://schema.org/isbn",
          "broj_stranica": "https://schema.org/numberOfPages",
          "jezik": "https://schema.org/Language"

      }, Knjiga: KnjigeLista},
        links:[  
   
    { rel: "authors", method: "GET", title: 'get authors of the book', href:link }
        
  ]});
    }else{
        res.status(401).json({
            status:"Not found",
            message:"Book with provided ID doesn't exist!",
            response:null
    })
    }

}catch(err){
        console.log(err);
    }
});
router.get('/authors', async function (req, res, next) {
    const autor = 'SELECT * from autor'//nisam sigurna trebaju li se ispisati i svi autori ili samo knjiga--ako da, na koji nacin? 
    try {
      autorLista = (await db.query(autor, [])).rows;
      res.status(200).json({
        status:"OK",
        message:"Fetched Authors",
        response:{Autori_knjige: autorLista},
        links:[  
    { rel: "authors", method: "GET", title: 'get all books', href: '/api/books' }//ne mogu poslati paramtear id jer postoji vise autora?
        
  ]});
    
    }
    catch(err){
        console.log(err);
    }
       
        let categoryItemMap = {};
 
});
router.get('/authors/:id([0-9]{1,10})', async function (req, res, next) {
    const id_k = parseInt(req.params.id);
    const autor = `SELECT id, ime as ime_autora,prezime as prezime_autora,EXTRACT(YEAR from datum_rodjenja) as datum_rodjenja FROM autor NATURAL JOIN knjiga where id_k = $1`;
    try {
      autorLista = (await db.query(autor, [id_k])).rows;
     if(autorLista.length!=0){ 
         res.status(200).json({
        status:"OK",
        message:"Fetched Authors",
        response:{Autori_knjige: autorLista},
        links:[  
    { rel: "authors", method: "POST", title: 'create author', href: '/api/authors' }//ne mogu poslati paramtear id jer postoji vise autora?
        
  ]});
    }else{
        res.status(404).json({
            status:"Not found",
            message:"Author with provided ID doesn't exist!",
            response:null
    })
    }

}catch(err){
        console.log(err);
    }
});

router.post('/authors/',bodyParser.json(), async function (req, res, next) {
    var reqBody = JSON.stringify(req.body);
    reqBody = JSON.parse(reqBody);
    console.log(reqBody);
    var id = parseInt(reqBody.id);
    const autor = 'SELECT * from autor where id = $1'
   
   // console.log(req.body);
    try {
      autorLista = (await db.query(autor, [id])).rows;
      if(autorLista.length==0){
     autorLista = (await db.query('INSERT INTO autor VALUES ($1,$2,$3,$4,$5)',[reqBody.ime,reqBody.prezime,reqBody.datum_rodjenja,reqBody.naziv_knjige,id]));
     res.status(200).json({
        status:"OK",
        message:"New author was succesfully added",
        response:{"Autor": reqBody},
        links:[  
    { rel: "authors", method: "GET", title: 'get all books', href: '/api/books' }
     
  ]});
}else{
  res.status(400).json({
      status:"Already exist!",
      message:"Author with provided ID already exist!",
      response:null
})
}
    
    }
    catch(err){
        console.log(err);
    }
       
        let categoryItemMap = {};
 
});
router.put('/books/:id([0-9]{1,10})',bodyParser.json(), async function (req, res, next) {
  var reqBody = JSON.stringify(req.body);
  reqBody = JSON.parse(reqBody);
  //console.log(reqBody.ime);
  var id_k = parseInt(req.params.id);
  const Knjige = 'SELECT * from knjiga where id_k = $1'
  console.log(id_k);
  var broj_stranica = parseInt(reqBody.broj_stranica);
  
 // console.log(req.body);
  try {
    KnjigeLista = (await db.query(Knjige, [id_k])).rows;
  if(KnjigeLista.length!=0){
   var  autorLista = (await db.query('UPDATE knjiga SET isbn = $1,naziv_knjige = $2, drzava_nastanka = $3, jezik = $4, izdavacka_kuca = $5, datum_izdavanja = $6, broj_stranica = $7, uvez = $8, wikipedia=$9,\
   zanr = $10 WHERE id_k = $11 ',[reqBody.isbn,reqBody.naziv_knjige,reqBody.drzava_nastanka,reqBody.jezik,reqBody.izdavacka_kuca, reqBody.datum_izdavanja,broj_stranica,reqBody.uvez,reqBody.wikipedia,reqBody.zanr,id_k]));
   res.status(200).json({
      status:"OK",
      message:"Book was succesfully updated",
      response:{"Knjiga": reqBody,
                "slika": "http://localhost:3000/api/"+id_k+"/img"
    },
      links:[  
  { rel: "books", method: "GET", title: 'get all books', href: '/api/books' }//ne mogu poslati paramtear id jer postoji vise autora?
      
]});
  }else{
    res.status(404).json({
      status:"Not found",
      message:"Book with provided ID doesn't exist!",
      response:null
  })
  
  }
}
  catch(err){
      console.log(err);
  }
     
      let categoryItemMap = {};

});
router.delete('/books/:id([0-9]{1,10})', async function (req, res, next) {//radi
    const id_k = parseInt(req.params.id);
    const Knjige = 'SELECT * from knjiga where id_k = $1'
    try {
      KnjigeLista = (await db.query(Knjige, [id_k])).rows;
     console.log(KnjigeLista.length);
     var ime="";
     for(let k of KnjigeLista) ime =k.naziv_knjige;
  
   //   autorLista = (await db.query(autor, [id_k])).rows;
     if(KnjigeLista.length!=0){ 
      KnjigeLista = (await db.query('DELETE from knjiga where id_k = $1',[id_k]));
         res.status(200).json({
        status:"OK",
        message:"Book was succesfully deleted",
        response:"The name of the book that was deleted is "+ime,
        links:[  
   
    { rel: "books", method: "GET", title: 'get all books', href:'/api/books' }
        
  ]});
    }else{
        res.status(404).json({
            status:"Not found",
            message:"Book with provided ID doesn't exist!",
            response:null
    })
    }

}catch(err){
        console.log(err);
    }
});

router.get('/:id([0-9]{1,10})/picture', bodyParser.json(),async function (req, res, next) {

  const Knjige = 'SELECT * from knjiga where id_k = $1'
  var id = parseInt(req.params.id);
  var data = fs.readFileSync('C:/Users/Dora/Desktop/OR-labos2/OR/labos/jsons/'+id+'.json');
  var json = JSON.parse(data);
  var datum = json.datum;
  var datum2 = Date.parse(datum);
  var datumUh = datum2/3600000;
  var danas = new Date();
  danas = danas/3600000;
  console.log(danas-datumUh);
  console.log(json);
  res.header("Content-Type","image/png")
  if((danas-datumUh)<24)res.sendFile(''+json.slika+'');//ovaj ce se izvrsiti jer sam tak postavila datum
  else{
    try {
      KnjigeLista = (await db.query(Knjige, [id])).rows;
      console.log(KnjigeLista);
      for(let i of KnjigeLista){
        console.log(i.wikipedia);
        let url = 'https://en.wikipedia.org/api/rest_v1/page/summary/'+i.wikipedia;
        let obj = await (await fetch(url)).json();
        obj = JSON.parse(JSON.stringify(obj));
        console.log(obj.originalimage.source);
        download(obj.originalimage.source, './images/'+id+'.png', function(){
          console.log('done');
          res.sendFile('C:/Users/Dora/Desktop/OR-labos2/OR/labos/images/'+id+'.png');
          json.slika = "C:/Users/Dora/Desktop/OR-labos2/OR/labos/images/"+id+".png";
          var godina = new Date().toISOString();
         // console.log("godina:"+godina);
         // console.log("parsiranje"+Date.parse(godina));
          json.datum = godina;
          var novi = json;
          fs.writeFileSync('C:/Users/Dora/Desktop/OR-labos2/OR/labos/jsons/'+id+'.json',JSON.stringify(novi,null,2));

        });
       
      } 
   
    }
    catch(err){

    }
   
  }
 
  

});

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){    
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


async function load() {
  

  console.log(obj);
}



function removeByteOrderMark(str){
  return str.replace(/^\ufeff/g,"")
}





//obrađuje sve nepostojeće krajnje točke
router.use(function(req,res){
  res.status(501).json({
        status:"Not Implemented",
        message:"Method not implemented for requested resource. Please use the right method or check the right input for the path.",
        response:null
    });
    });


    // parse various different custom JSON types as JSON
   /* router.use(bodyParser.json({ type: 'application/*+json' }));
    // parse some custom thing into a Buffer
    router.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
    // parse an HTML body into a string
    router.use(bodyParser.text({ type: 'text/html' }));
    // parse an text body into a string
    router.use(bodyParser.text({ type: 'text/plain' }));
    // create application/x-www-form-urlencoded parser
    router.use(bodyParser.urlencoded({ extended: false }));*/

module.exports = router;