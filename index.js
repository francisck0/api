'use strict'

var mongoose = require('mongoose'); //cargamos la libreria para q intermedie entre la BBDD. cargamos un modulo poniendo .require(...)
var app = require('./app'); //cargamos este fichero JS q es el q va a tener la configuracion de las rutas, etc, será un fichero de carga central.
//vamos a configurar un puerto para nuestro API, para nuestro servidor.
var port = process.env.PORT || 3977; //el puerto q va a tener nuestro servidor web en nuestro backend de Node.
//lo de process.env.PORT es para que si tenemos configurado el puerto en nuestras variables de entorno lo coja de ahi, pero nosotros usaremos el puerto fijo.

/*Para eliminar el aviso de mongoose que devuelve por la consola donde hemos lanzado el npm start, tenemos que añadir la siguiente linea de código :
mongoose.Promise = global.Promise;
Justo encima de la llamada a mongoose.connect
Nos vemos en la siguiente clase :)*/
mongoose.Promise = global.Promise;

//Conexion con la BBDD.
//indicamos la url de nuestra BBDD. 27017 es el puerto por defecto. 'curso_mean2' es el nombre de la BBDD:
mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) => {
	if (err){
		//si hay un error lanzamos una excepcion
		throw err;
	}else{
		//si todo va correcto
		console.log("La conexión a la base de datos está funcionando correctamente...");

		//ponemos el servidor a escuchar
		app.listen(port, function(){
			console.log("Servidor del API Rest de música escuchando en http://localhost:"+port);
		});
	}
});