'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var api = express.Router();//llamamos al Router q nos permitira hacer esas functiones .get, .post...

//cargamos el middleware de la autenticacion
//nos va a permitir restringir el acceso a usuarios correctamente logueados a los metodos de este controlador
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/songs' });

//metodos get, post, put, delete de 'express'.
api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile)
api.get('/get-song-file/:songFile', SongController.getSongFile);

//exportamos los metodos del api
module.exports = api;