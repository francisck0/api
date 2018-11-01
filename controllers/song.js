'use strict'

//Para trabajar con el sistema de ficheros y rutas:
var fs = require('fs');
var path = require('path');

//importamos el modulo de paginacion
var mongoosePaginate = require('mongoose-pagination'); 

//cargamos los model de Artista, Album y Song para hacer queries con Mongoose.
//todo esto es case-sensitive
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
	var songId = req.params.id; //NOTA***: Capto el id que me venga en la url.

	//metodo populate: le digo que en la propiedad (path) album me meta todos los datos del album en cuestion.
	//el populate me cambia el ObjectId de un campo del documento por todos sus datos, todo el objeto completo del album.
	Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!song){
				res.status(404).send({message: 'La canción no existe'});
			}else{
				res.status(200).send({song}); //el .send() envia un objeto dentro SIEMPRE, ya sea clave-valor o el valor solo.
			}
		}
	});
}

function getSongs(req, res){

	var albumId = req.params.album; //capto el id album q me venga por la url.

	//NOTA***: El metodo .find({}) SIEMPRE lleva un objeto dentro {}, aunque vaya vacío (.find()).
	if(!albumId){
		var find = Song.find({}).sort('number');
	}else{
		var find = Song.find({album: albumId}).sort('number');
	}

	//en path indicamos el ID que queremos cambiar por todos los datos.
	find.populate({
		path: 'album', //la propiedad q contiene el ObjectID - Album id. ese ID se va a sustituir por todos los datos del album.
		populate: {
			path: 'artist', //quiero que el ObjectID del artista me lo sustituya por todos los datos del artista.
			model: 'Artist' //le paso el modelo de Artista
		}
	}).exec(function (err, songs) { //esto se puede hacer asi con una funcion anonima o con array functions.
		if (err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!songs){
				res.status(404).send({message: 'No hay canciones'});
			}else{
				res.status(200).send({songs});
			}
		}
	});
}

function saveSong(req, res){
	var song = new Song(); //instancia del modelo, creamos el objeto de la cancion

	var params = req.body; //NOTA***: Capto todos los campos que vengan y los almaceno en 'params'
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	song.save((err, songStored) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songStored){
				res.status(404).send({message: 'No se ha guardado la canción'});
			}else{
				res.status(200).send({song: songStored});
			}
		}
	});
}

function updateSong(req, res){
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songUpdated){
				res.status(404).send({message: 'No se ha actualizado la canción'});
			}else{
				res.status(200).send({song: songUpdated});
			}
		}
	});
}

function deleteSong(req, res){
	var songId = req.params.id;
	
	Song.findByIdAndRemove(songId, (err, songRemoved) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songRemoved){
				res.status(404).send({message: 'No se ha eliminado la canción'});
			}else{
				res.status(200).send({song: songRemoved});
			}
		}
	}); //consulta de Mongoose (ORM)
}

function uploadFile(req, res){
	var songId = req.params.id;
	var file_name = "Canción no subida...";

	if(req.files){
		var file_path = req.files.file.path; //'file' es el es el nombre del campo q yo voy a estar enviando. en PostMan envio un .mp3 con el name = 'file'
		var file_split = file_path.split('\/');
		var file_name = file_split[2];
		
		var ext_split = file_name.split("\.");
		var file_ext = ext_split[1];
		
		if(file_ext == 'mp3' || file_ext == 'ogg'){
			Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
		
				if(!songUpdated){
					res.status(404).send({message: 'No se ha podido actualizar la canción'});
				}else{
					res.status(200).send({song: songUpdated});
				}
			});
		}else{
			res.status(200).send({message: 'Extensión del archivo no válida...'});
		}
	}else{
		res.status(200).send({message: 'No ha subido el fichero de audio...'});
	}
}

function getSongFile(req, res){
	//imageFile es el parametro que nos va a llegar por la url
	//va a ser nombre del fichero q yo quiero sacar del directorio de imagenes del servidor
	//el nombre 'imageFile' aparece en la ruta .../:imageFile
	var imageFile = req.params.songFile;//recogemos de la URL el nombre del fichero que quiero sacar del directorio de imagenes del servidor
	var path_file = './uploads/songs/'+imageFile;

	//compruebo si existe el fichero en el directorio de imagenes:
	//funcion de callback
	fs.exists(path_file, function(exists){
		if(exists){
			  res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe el fichero de audio...'});
		}
	});
}


module.exports = {
	getSong,
	getSongs,
	saveSong,
	updateSong,
	deleteSong,
	uploadFile,
	getSongFile
}