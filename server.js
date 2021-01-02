//uvoz modula
const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg')
const db = require('./db')
//const session = require('express-session')
//const pgSession = require('connect-pg-simple')(session)

//uvoz modula s definiranom funkcionalnosti ruta
const orderRouter = require('./routes/datatable.routes');
const apiRouter = require('./routes/api.routes');
const probaRouter = require('./routes/proba.routes');



//middleware - predlošci (ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware - statički resursi
app.use(express.static(path.join(__dirname, 'public')));

//middleware - dekodiranje parametara
app.use(express.urlencoded({ extended: true }));




//definicija ruta
app.use('/datatable', orderRouter);
app.use('/api',apiRouter);
app.use('/',probaRouter);


//app.use('/checkout', checkoutRoute)

//pokretanje poslužitelja na portu 3000
app.listen(3000);