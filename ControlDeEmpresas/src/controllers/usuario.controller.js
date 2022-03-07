const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function Registrar(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();

    if(parametros.nombre && parametros.email && parametros.password) {
            usuarioModel.nombre = parametros.nombre;
            usuarioModel.email = parametros.email;
            usuarioModel.rol = 'ROL_EMPRESA';

            Usuario.find({ email : parametros.email }, (err, usuarioEncontrado) => {
                if ( usuarioEncontrado.length == 0 ) {

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500)
                                .send({ mensaje: 'Error en la peticion' });
                            if(!usuarioGuardado) return res.status(500)
                                .send({ mensaje: 'Error al agregar el Usuario'});
                            
                            return res.status(200).send({ usuario: usuarioGuardado });
                        });
                    });                    
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
                }
            })
    }
}

function RegistrarAdministrador(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();

            usuarioModel.nombre = 'Admin';
            usuarioModel.email = 'admin@gmail.com';
            usuarioModel.rol = 'ROL_ADMIN';

            Usuario.find({ nombre : 'Admin' }, (err, usuarioEncontrado) => {
                if ( usuarioEncontrado.length == 0 ) {

                    bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500)
                                .send({ mensaje: 'Error en la peticion' });
                            if(!usuarioGuardado) return res.status(500)
                                .send({ mensaje: 'Error al agregar el Usuario'});
                            
                            return res.status(200).send({ usuario: usuarioGuardado });
                        });
                    });                    
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este nombre de usuario, ya  se encuentra utilizado' });
                }
            })
    
}

function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ nombre : parametros.nombre }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            // COMPARO CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword)=>{//TRUE OR FALSE
                    // VERIFICO SI EL PASSWORD COINCIDE EN BASE DE DATOS
                    if ( verificacionPassword ) {
                        // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }

                        
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide'});
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.'})
        }
    })
}

function editarEmpresaAdmin (req, res) {
    var idUser = req.params.idUsuario;
    var parametros = req.body;

    Usuario.findByIdAndUpdate(idUser, parametros, { new: true } ,(err, usuarioActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!usuarioActualizado) return res.status(404).send( { mensaje: 'Error al Editar el Usuario'});

        return res.status(200).send({ usuario: usuarioActualizado});
    });
}

function eliminarEmpresaAdmin (req, res) {
    var idUser = req.params.idUsuario;

    Usuario.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!usuarioEliminado) return res.status(404).send( { mensaje: 'Error al Eliminar el Usuario'});

        return res.status(200).send({ usuario: usuarioEliminado});
    });
}


function EditarEmpresa(req, res) {
    var idUser = req.params.idUsuario;
    var parametros = req.body;    



    Usuario.findByIdAndUpdate(idUser, parametros, {new : true},
        (err, usuarioActualizado)=>{
            if(err) return res.status(500)
                .send({ mensaje: 'Error en la peticion' });
            if(!usuarioActualizado) return res.status(500)
                .send({ mensaje: 'Error al editar el Usuario'});
            
            return res.status(200).send({usuario : usuarioActualizado})
        })
}

function EliminarEmpresa(req, res) {
    var idUser = req.params.idUsuario;
    var parametros = req.body;    

    


    Usuario.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!usuarioEliminado) return res.status(404).send( { mensaje: 'Error al Eliminar el Usuario'});

        return res.status(200).send({ usuario: usuarioEliminado});
    });
}

module.exports = {
    Registrar,
    RegistrarAdministrador,
    Login,
    editarEmpresaAdmin,
    eliminarEmpresaAdmin,
    EditarEmpresa,
    EliminarEmpresa
}