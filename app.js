'use strict'

var express = require('express'); //cargamos en una variable la libreria de Express
var bodyParser = require('body-parser'); //cargamos en una variable body-parser

var app = express(); //vamos a crear el objeto de Express

//cada uno de los ficheros de rutas las tenemos que cargar aqui!!!:
//cargar rutas de 'user':(de momento como no tenemos ninguna no vamos a hacer nada)
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

//configurar bodyParser
app.use(bodyParser.urlencoded({extended:false})); //es necesario para que body-parser funcione
app.use(bodyParser.json()); //esto lo que hace es convertir a objeto JSON los datos que nos llegan por las peticiones HTTP y poder trabajar con ellos dento del proyecto

//configurar cabeceras HTTP (lo dejamos pa luego)
//para evitar problemas con el control de acceso a la hora de hacer peticiones ajax.
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*'); //esto nos va a permitir acceder a todas las rutas
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');//configuracion de varias cabeceras
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	//el next es para salir de este middleware y pasar a otra cosa
	next(); //para salir de este middleware.
});



//carga de rutas base. detras de la ruta /api va otra configuracion de rutas
//cada ruta va a tener un /api delante.
//metodo use. el segundo argumento es el fichero de configuracion de rutas. cargo la variable ahi: cargamos las rutas q tengamos configuradas.
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

//comentamos esta ruta porque ya no lo vamos a utilizar. vamos a utilizar las rutas y controladores q vayamos cargando.
/*app.get('/pruebas', function(req, res){
	res.status(200).send({message: 'Bienvenido al curso de Musify'});
});*/


//exportamos el modulo
module.exports = app; //ahora podremos importar Express dentro de otros ficheros de otros de la app.