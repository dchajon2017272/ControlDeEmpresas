const mongoose = require('mongoose');
const app = require('./app');
const Usuario = require('./src/models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('./src/services/jwt');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/IN6BM', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {

    app.listen(3000, function () {
        console.log("Hola IN6BM!");
        console.log("La base de datos esta corriendo en el puerto 3000!");
        Usuario.find({ nombre: 'Admin' }, (err, usuarioEcontrado) => {
            if (usuarioEcontrado == 0) {

                bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                    Usuario.create({
                        nombre: 'Admin',
                        email: 'admin@gmail.com',
                        rol: 'ROL_ADMIN',
                        password: passwordEncriptada
                        
                    })

                });
            } else {

            }

        })
    })


}).catch(error => console.log(error))