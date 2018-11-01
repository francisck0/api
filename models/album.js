'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var AlbumSchema = Schema({
	title: String,
	description: String,
	year: Number,
	image: String,
	artist: {type: Schema.ObjectId, ref: 'Artist'} //guardamos una referencia a otro objeto. Guarda un ID de otro objeto q tenemos guardado en otra coleccion/documento de la BBDD.
	//vamos a hacer referencia a la entidad en la q este guardado este ID del objeto q estamos guardando.
	//internaente hara referencia a la coleccion de ese objeto (Artist) y va a relacionar esos 2 campos.
});

//creamos un modelo 'Album' utilizando ese schema y en la bbdd tendremos una coleccion de artistas que cada documento q contenga sera 1 artista.
module.exports = mongoose.model('Album', AlbumSchema);