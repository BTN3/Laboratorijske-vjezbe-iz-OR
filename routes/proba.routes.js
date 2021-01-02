const express = require('express');
const router = express.Router();
const db = require('../db');
var hateoasLinker = require('express-hateoas-links');

// replace standard express res.json with the new version
// replace standard express res.json with the new version
router.use(hateoasLinker);

// standard express route
router.get('/',  async function (req, res, next){

    // create an example JSON Schema
    var personSchema = 'SELECT * from knjiga';
   var KnjigeLista = (await db.query(personSchema, [])).rows;

    // call res.json as normal but pass second param as array of links
    res.json({Knjige:KnjigeLista, links: [
        { rel: "self", method: "GET", href: 'http://127.0.0.1' },
        { rel: "create", method: "POST", title: 'Create Person', href: 'http://127.0.0.1/autors' }
    ]
});
});

// express route to process the person creation
router.get('/person', function(req, res){
    // do some stuff with the person data
});
module.exports = router;