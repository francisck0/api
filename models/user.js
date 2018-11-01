'use strict'

var mongoose = require('mongoose'); //cargamos el modulo de Mongoose para poder acceder a la BBDD

var Schema = mongoose.Schema; //nos va a permitir definir un modelo/esquema de la BBDD.
//Nos va a permitir crear un objeto de tipo Schema que posteriormente al guardar datos utilizando ese esquema se va a guardar
//un documento concreto dentro de una coleccion.

//con JSON definimos los campos que va a tener y sus tipos.
var UserSchema = Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	role: String,
	image: String
});
//no le añadimos un campo ID pq automaticamente MongoDB ya se lo añade.

//exportamos el modelo para poder usar este objeto fuera de este fichero:
//usamos la instruccion module.exports y diciendole que exporte mongoose.model (nombre de la entidad/coleccion Users -pluraliza- q va a utilizar, nombre del schema q va a utilizar)
//cuando usemos el schema UserSchema vamos a tener un objeto User q vamos a poder instanciar y automaticamente le vamos a estar asignando valores a esqte esquema de la BBDD
//cuando nosotros guardemos un dato en la BBDD se a a guardar en una coleccion q se llame Users (pluraliza automaticamente lo q ponemos ahi) y va a guardar
//una instancia de cada uno de los usuarios q nosotros vayamos guardando utilizando el objeto User y a su vez este utiliza el esquema q estamos definiendo con el mongoose schema
//y automaticamente esto se guarda en la BBDD.
module.exports = mongoose.model('User', UserSchema); //objeto User - coleccion Users.