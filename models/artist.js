'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var ArtistSchema = Schema({
	name: String,
	description: String,
	image: String
});

//creamos un modelo 'Artist' utilizando ese schema y en la bbdd tendremos una coleccion de artistas que cada documento q contenga sera 1 artista.
module.exports = mongoose.model('Artist', ArtistSchema);