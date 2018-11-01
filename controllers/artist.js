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


function getArtist(req, res){

	//recogemos el id del artista q nos llegara por la url
	var artistId = req.params.id;

	//en el modelo de Artist vamos a buscar por id:
	//accedemos a la coleccion artista y buscamos por id:
	Artist.findById(artistId, (err, artist) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!artist){
				res.status(404).send({message: 'El artista no existe'});
			}else{
				res.status(200).send({artist});
			}  
		}
	});
}

function getArtists(req, res){
	//si viene la 'page' le damos el valor, si no le damos un 1.
	if(req.params.page){
		var page = req.params.page;//recibimos en la url un parametro llamado 'page'
	}else{
		var page = 1;
	}
	var itemsPerPage = 4;

	Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!artists){
				res.status(404).send({message: 'No hay artistas'});
			}else{
				return res.status(200).send({
					total_items: total,
					artists: artists
				});
			}
		}
	});
}

function saveArtist(req, res){
	var artist = new Artist();

	var params = req.body;

	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	artist.save((err, artistStored) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistStored){
				res.status(404).send({message: 'El artista no ha sido guardado'});
			}else{
				res.status(200).send({artist: artistStored});
			}
		}
	});
}

function updateArtist(req, res){
	//el id del artista q nos llegara por la URL
	var artistId = req.params.id;
	var update = req.body; //el body de la peticion, los datos q enviemos dsd el cliente

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistUpdated){
				res.status(404).send({message: 'El artista no ha sido actualizado'});
			}else{
				res.status(200).send({artist: artistUpdated});
			}
		}
	});
}

function deleteArtist(req, res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if(err){
			res.status(500).send({message: 'Error al eliminar el artista'});
		}else{
			if(!artistRemoved){
				res.status(404).send({message: 'El artista no ha sido eliminado'});
			}else{
				//res.status(404).send({artistRemoved});
				
				//cuando borremos un artista vamos a eliminar todos sus albumes
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el album'});
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
										res.status(200).send({artist: artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res){
	var artistId = req.params.id;//recogemos el id de la URL
	var file_name = "Imagen no subida...";

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\/');
		var file_name = file_split[2];
		
		var ext_split = file_name.split("\.");
		var file_ext = ext_split[1];
		
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
		
				if(!artistUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({artist: artistUpdated});
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
	var path_file = './uploads/artists/'+imageFile;

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
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
}