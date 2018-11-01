'user strict'

//Para trabajar con el sistema de ficheros y las rutas:
var fs = require('fs');//importamos el modulo de el filesystem. para trabajar con el sistema de ficheros del sistema
var path = require('path');//nos permite acceder a rutas concretas, etc

//cargamos el modulo del bcrypt para encriptar la contraseña
var bcrypt = require('bcrypt-nodejs');

//importamos el model
var User = require('../models/user');
var jwt = require('../services/jwt');


function pruebas(req, res){
	res.status(200).send({
		message: 'Probando una acción del controlador de usuarios del API Rest con Node y MongoDB'
	});
}

//vamos a crear un nuevo metodo para el registro de usuarios.
//va a recibir una request y va a devolver una response.
//primero cargamos el modulo del modelo, de la entidad q hemos creado antes
function saveUser(req, res){
	var user = new User();

	//recogemos los parametros que nos llegan en la peticion por post en el body
	var params = req.body;

	console.log(params);

	//params.name
	//params.noseque
	//params. variables q nos llegan por post

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER'; //el usuario que se registre será 'ROLE_USER', para que no se registre ningun administrador.
	user.image = 'null';

	//ahora guardamos el usuario en BBDD con el metodo .save() de mongoose

	if(params.password){
		// Encriptar contraseña y guardar datos
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			if (user.name != null && user.surname && user.email != null) {
				// Guardo el usuario en la BBDD
				user.save((err, userStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el usuario'});
					}else{
						if(!userStored){
							res.status(404).send({message: 'No se ha registrado el usuario'});
						}else{
							//nos devulve un obj con todos los datos del usuario guardado en la BBDD.
							res.status(200).send({user: userStored});
						}
					}
				});
			}else{
				//si nos faltan datos:
				res.status(200).send({
					message: 'Rellena todos los campos'
				});
			}
		});

	}else{
		//Que nos devuelve un error 500
		res.status(200).send({
			message: 'Introduce la contraseña'
		});
	}
}

//nuevo metodo para el login
function loginUser(req, res){
	var params = req.body; //con bodyparser esos parametros q nos llegan por post son transformados en un objeto JSON.

	var email = params.email;
	var password = params.password;

	//usamos el ORM q es Mongoose para hace una consulta
	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe'});
			}else{
				// Comprobar contraseña
				bcrypt.compare(password, user.password, function(err, check){
					if(check){
						// Si el check es correcto, aqui me tienes q devolver los datos del usuario logueado
						if(params.gethash){
							//devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							//si el hash nos viene vacio
							res.status(200).send({user});
						}
					}else{
						//devuelveme un 404 diciendome q la contraseña es incorrecta o q el usuario no ha podido loguearse.
						res.status(404).send({message: 'El usuario no ha podido loguearse'});
					}
				});
			}
		}
	});
}

function updateUser(req, res){
	var userId = req.params.id;//nos viene por la URL.
	var update = req.body; //nos viene por POST.

	//Comprobamos que los datos del usuario que pretendemos modificar son los del propio usuario logueado y no otro.
	// req.user.sub es como se llama el id del usuario en el Token (ver services: jwt.js)
	if(userId != req.user.sub){
		return res.status(500).send({message: 'No tienes permiso para actualizar este usuario'});
	}

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if(!userUpdated){
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdated});
			}
		}
	});
}

function uploadImage(req, res){
	var userId = req.params.id;//recogemos el id de la URL
	var file_name = "Imagen no subida...";

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\/');
		var file_name = file_split[2];
		
		var ext_split = file_name.split("\.");
		var file_ext = ext_split[1];
		
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
		
				if(!userUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({image: file_name, user: userUpdated});
				}
			});
		}else{
			res.status(200).send({message: 'No has subido ninguna imagen...'});
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
	var path_file = './uploads/users/'+imageFile;

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


//Para poder usar este controlador fuera de este fichero hay que exportarlo:
module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
}