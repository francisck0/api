'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var SongSchema = Schema({
	number: String,
	name: String,
	duration: String,
	file: String,
	album: {type: Schema.ObjectId, ref: 'Album'} //se va a guardar un ID de un Album (hace referencia al modelo 'Album')
	//ObjectId nos va a permitir tmb mediante el metodo populate cargar dentro de la propiedad album, todos los datos del objeto album q hay asociado a un documento concreto
	//tenemos una cancion guardada en bbdd y cuando la recuperemos dntro d la propiedad album va a estar toda la informacion del album de esa cancion
	//esta es la potencia que tiene el ObjectId. lo veremos mas adelante.
});

//creamos un modelo 'Album' utilizando ese schema y en la bbdd tendremos una coleccion de artistas que cada documento q contenga sera 1 artista.
module.exports = mongoose.model('Song', SongSchema);