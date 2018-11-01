'use strict'

//Para trabajar con el sistema de ficheros y rutas:
var fs = require('fs');
var path = require('path');

//importamos el modulo de paginacion
var mongoosePaginate = require('mongoose-pagination'); 

//todo esto es case-sensitive
//cargamos el model del artista
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getAlbum(req, res){

	//recogemos el id del artista q nos llegara por la url
	var albumId = req.params.id;

	//en el modelo de Album vamos a buscar por id:
	//accedemos a la coleccion artista y buscamos por id:
	//consulta utilizando Mongoose
	//el path seria la propiedad dnd se van a cargar los datos del objeto asociado a esta propiedad
	//dentro de artist nos va a cargar utilizando populate un obj completo de tipo artista 
	//conseguimos todos los datos del artista q ha creado un album
	Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!album){
				res.status(404).send({message: 'El album no existe'});
			}else{
				res.status(200).send({album});
			}
		}
	});
}

function getAlbums(req, res){
	var artistId = req.params.artist;//get de la URL, id del artista

	if(!artistId){
		//Sacar todos los albums de la bbdd
		var find = Album.find({}).sort('title');
	}else{
		//Sacar los albums de un artista concreto de la bbdd
		var find = Album.find({artist: artistId}).sort('year');
	}

	find.populate({path: 'artist'}).exec((err, albums) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!albums){
				res.status(404).send({message: 'No hay albums'});
			}else{
				res.status(200).send({albums});
			}
		}
	});
}

function saveAlbum(req, res){
	var album = new Album();

	var params = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;

	album.save((err, albumStored) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!albumStored){
				res.status(404).send({message: 'El album no se ha guardado'});
			}else{
				res.status(200).send({album: albumStored});
			}
		}
	});
}

function updateAlbum(req, res){
	var albumId = req.params.id;//parametro de la URL
	var update = req.body; //lo q nos llega por el body de la request

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!albumUpdated){
				res.status(404).send({message: 'El album no se ha actualizado'});
			}else{
				res.status(200).send({album: albumUpdated});
			}
		}
	});
}

function deleteAlbum(req, res){
	var albumId = req.params.id;

	Album.findById(albumId).remove((err, albumRemoved) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
			console.log(err);
		}else{
			if(!albumRemoved){
				res.status(404).send({message: 'El album no ha sido eliminado'});
			}else{
				//aqui tendremos un objeto albumRemoved con mas datos.
				Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
					if(err){
						res.status(500).send({message: 'Error al eliminar la canción'});
					}else{
						if(!songRemoved){
							res.status(404).send({message: 'La canción no ha sido eliminada'});
						}else{
							//aqui mostraremos el artista eliminado:
							res.status(200).send({album: albumRemoved});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res){
	var albumId = req.params.id;//recogemos el id de la URL
	var file_name = "Imagen no subida...";

	if(req.files){
		var file_path = req.files.image.path; //el 'image' de aqui, es el 'name'/key de la imagen que voy a subir por PostMan
		var file_split = file_path.split('\/');
		var file_name = file_split[2];
		
		var ext_split = file_name.split("\.");
		var file_ext = ext_split[1];
		
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
			Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
		
				if(!albumUpdated){
					res.status(404).send({message: 'No se ha podido actualizar la imagen'});
				}else{
					res.status(200).send({album: albumUpdated});
				}
			});
		}else{
			res.status(200).send({message: 'Extensión del archivo no válida...'});
		}
	}else{
		res.status(200).send({message: 'No ha subido ninguna imagen...'});
	}
}

function getImageFile(req, res){
	//imageFile es el parametro que nos va a llegar por la url
	//va a ser nombre del fichero q yo quiero sacar del directorio de imagenes del servidor
	//el nombre 'imageFile' aparece en la ruta .../:imageFile
	var imageFile = req.params.imageFile;//recogemos de la URL el nombre del fichero que quiero sacar del directorio de imagenes del servidor
	var path_file = './uploads/albums/'+imageFile;

	//compruebo si existe el fichero en el directorio de imagenes:
	//funcion de callback
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

module.exports = {
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
}