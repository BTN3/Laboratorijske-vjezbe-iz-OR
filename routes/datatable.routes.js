const express = require('express');
const router = express.Router();
const db = require('../db');
var KnjigeLista;
var autorLista;
var converter = require('json-2-csv');
var fs = require('fs');

router.get('/', async function (req, res, next) {
    const Knjige = `SELECT isbn,naziv_knjige,drzava_nastanka,jezik,izdavacka_kuca, EXTRACT(YEAR from datum_izdavanja) as datum,broj_stranica,uvez,wikipedia,zanr FROM knjiga`;
    const autor = `SELECT ime,prezime,EXTRACT(YEAR from datum_rodjenja) as datum_rodjenja,naziv_knjige FROM autor`;
    try {
      KnjigeLista = (await db.query(Knjige, [])).rows;
      autorLista = (await db.query(autor, [])).rows;
    
      
        
        let categoryItemMap = {};
     
        res.render("datatable", {
            title: 'Datatable',
            categories: KnjigeLista,
            categoryItemMap: autorLista,
            categories1: KnjigeLista,
          categoryItemMap1: autorLista,
          //  user: req.session.user,
            linkActive: 'datatable',
            category:{
                name:'Kategorija',
                lista:KnjigeLista.rows
            },
            quote:"AJAX is great!",
           odabir: "nesto"
           
        });
        console.log(JSON.stringify(KnjigeLista));
      
    } catch (err) {
        console.log(err);
    }
   // res.render("order", {title: 'An Ajax Example', quote: "AJAX is great!"});
});
router.post('/',async function(req,res,next){//middlewere, dohavt podataka i bacanje podataka u bazu
 /* const Knjige = `SELECT isbn,naziv_knjige,drzava_nastanka,jezik,izdavacka_kuca, EXTRACT(YEAR from datum_izdavanja) as datum,broj_stranica,uvez,wikipedia,zanr FROM knjiga`;
  const autor = `SELECT ime,prezime,EXTRACT(YEAR from datum_rodjenja) as datum_rodjenja,naziv_knjige FROM autor`;
  KnjigeLista = (await db.query(Knjige, [])).rows;
  autorLista = (await db.query(autor, [])).rows;*/


    let ime = req.body.ArtiklIme;
      //console.log(JSON.stringify(req.body));
      let input = req.body.quote;
      let odabir = req.body.drop;
      console.log(input);
      console.log(odabir);
      
      if(odabir == 0 ){
        var jsonPomocna = [];
        console.log("usao");
        var data1 = fs.readFileSync('../Knjige_copy.json');
        var json = JSON.parse(data1);//lista
      for(let knjiga of KnjigeLista){
          if (JSON.stringify(knjiga).includes(input) || JSON.stringify(knjiga).includes(input.toUpperCase()) ){
           // ne radi za Obamu!
            for(let i of json){
              if(i.naziv_knjige == knjiga.naziv_knjige){
                jsonPomocna.push(i);
              } 
            }
        
         
           
          }
      }
      fs.writeFileSync('../Knjige.json', JSON.stringify(jsonPomocna, null, 2));
      converter.json2csv(jsonPomocna, (err, csv) => {
        if (err) {
            throw err;
        }
    
        // print CSV string
        console.log(csv);
    
        // write CSV to a file
        fs.writeFileSync('../Knjige.csv', csv);
        
    });
      }
      else if(odabir == 1){
        var zas= 1;
        var jsonPomocna = [];
        for(let knjiga of KnjigeLista){
          console.log(knjiga.naziv_knjige);
          if ((knjiga.naziv_knjige.includes(input) || knjiga.naziv_knjige.includes(input.toUpperCase()))){
        
        console.log("usao");
     
        var data1 = fs.readFileSync('../Knjige_copy.json');
        var json = JSON.parse(data1);
        for(let i of json){
          if(i.isbn == knjiga.isbn){
            jsonPomocna.push(i);
           
          } 
        }
      }
        }
        fs.writeFileSync('../Knjige.json', JSON.stringify(jsonPomocna, null, 2));
        converter.json2csv(jsonPomocna, (err, csv) => {
          if (err) {
              throw err;
          }
      
          // print CSV string
          console.log(csv);
      
          // write CSV to a file
          fs.writeFileSync('../Knjige.csv', csv);
          
      });

      }
    
    else if(odabir ==2){
      var jsonPomocna = [];
      console.log("usao");
     // var data = fs.readFileSync('../Knjige.json');
      var data1 = fs.readFileSync('../Knjige_copy.json');
      var json = JSON.parse(data1);
      for(let knjiga of KnjigeLista){
        if ((knjiga.isbn.includes(input) || knjiga.isbn.includes(input.toUpperCase())) ){
          
       //   console.log(json);
          for(let i of json){
            if(i.isbn == knjiga.isbn){
              jsonPomocna.push(i);
            } 
        }
    
      }
    }
    fs.writeFileSync('../Knjige.json', JSON.stringify(jsonPomocna, null, 2));
    converter.json2csv(jsonPomocna, (err, csv) => {
      if (err) {
          throw err;
      }
  
      // print CSV string
      console.log(csv);
  
      // write CSV to a file
      fs.writeFileSync('../Knjige.csv', csv);
      
  });
  }
    else if(odabir == 3){
      var jsonPomocna = [];
      console.log("usao");
      var data = fs.readFileSync('../Knjige.json');
      var data1 = fs.readFileSync('../Knjige_copy.json');
      var json = JSON.parse(data1);
      for(let knjiga of KnjigeLista){
        if ((knjiga.jezik.includes(input) || knjiga.jezik.includes(input.toUpperCase())) ){
        
          //  console.log(json);
          for(let i of json){
            if(i.jezik == knjiga.jezik){
              jsonPomocna.push(i);
            } 
          }
        
        
       
      }
    
    }
    fs.writeFileSync('../Knjige.json', JSON.stringify(jsonPomocna, null, 2));
    converter.json2csv(jsonPomocna, (err, csv) => {
      if (err) {
          throw err;
      }
  
      // print CSV string
      console.log(csv);
  
      // write CSV to a file
      fs.writeFileSync('../Knjige.csv', csv);
      
  });
  }
    else if(odabir == 4){
      var jsonPomocna = [];
      let zas = false;
      console.log("usao");
      var data = fs.readFileSync('../Knjige.json');
      var data1 = fs.readFileSync('../Knjige_copy.json');
      var json = JSON.parse(data1);
      for(let knjiga of KnjigeLista){
          for(let autor of autorLista){
            if(knjiga.naziv_knjige == autor.naziv_knjige){  
              if ((autor.ime.includes(input) || autor.ime.includes(input.toUpperCase()) ||autor.prezime.includes(input) || autor.prezime.includes(input.toUpperCase()))){
                zas = true;
              for(let i of json){
                if(i.naziv_knjige == knjiga.naziv_knjige){
                jsonPomocna.push(i);
                
                } 
              }
            
            } 
            if(zas == true) break;
          
          }
          
    }
  }
  fs.writeFileSync('../Knjige.json', JSON.stringify(jsonPomocna, null, 2));
  converter.json2csv(jsonPomocna, (err, csv) => {
    if (err) {
        throw err;
    }

    // print CSV string
    console.log(csv);

    // write CSV to a file
    fs.writeFileSync('../Knjige.csv', csv);
    
});
  }
      
      res.render("datatable", { title: 'Datatable',
      categories1: KnjigeLista,
      categoryItemMap1: autorLista,
      categories: KnjigeLista,
      categoryItemMap: autorLista,
    //  user: req.session.user,
      linkActive: 'datatable',
      category:{
          name:'Kategorija',
          lista:KnjigeLista.rows
      },
      input:input,
      odabir:odabir
     });
  
   
});

router.get('/allBooks', async function (req, res, next) {
  const Knjige = `SELECT isbn,naziv_knjige,drzava_nastanka,jezik,izdavacka_kuca, EXTRACT(YEAR from datum_izdavanja) as datum,broj_stranica,uvez,wikipedia,zanr FROM knjiga`;
  const autor = `SELECT ime,prezime,EXTRACT(YEAR from datum_rodjenja) as datum_rodjenja,naziv_knjige FROM autor`;
  try {
    KnjigeLista = (await db.query(Knjige, [])).rows;
    autorLista = (await db.query(autor, [])).rows;
  }
  catch(err){
    console.log(err);
  }

  res.json(KnjigeLista);

});


module.exports = router;