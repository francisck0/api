'use strict'

//cargamos el modulo de 'express'
var express = require('express');
//var UserController = require('../controllers/user');//cargamos el controller user.js

var UserController = require('../controllers/user');

var api = express.Router(); //ahora podemos crear rutas para nuestra api
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });//NOTA: Aqui se pone un ./ solamente pq el multipart se ve q parte del directorio raiz del proyecto.

//con api cargamos el ruter (ruta, metodo del modulo userController q va a cargar)
api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas); //entro a la url a: http://localhost:3977/api/probando-controlador/
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
//actualizar datos de bbdd con PUT:
//va a recibir un parametro en la url obligatorio /:id
//si el parametro en la url fuera opcional se pondria /:id?
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);
//ahora tendremos q exportar api para q pueda funcionar fuera
module.exports = api; 