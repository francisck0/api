'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

exports.createToken = function(user){
	//payload van a ser los datos que se van a codificar  
	var payload = {
		sub: user._id,//guarda el id del registro
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),//formato timestamp fecha actual
		exp: moment().add(30, 'days').unix //expiracion fecha en formato unix/timestamp
	};

	//le pasamos una clave secreta para generar el hash
	return jwt.encode(payload, secret);
};