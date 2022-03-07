const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autenticacion');

//MIDDLEWARES
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/registrar',[md_autenticacion.Auth,md_roles.verAdmin], usuarioControlador.Registrar);
api.post('/registrarAdministrador', usuarioControlador.RegistrarAdministrador);
api.post('/login', usuarioControlador.Login);
api.put('/editarEmpresaAdmin/:idUsuario',[md_autenticacion.Auth,md_roles.verAdmin], usuarioControlador.editarEmpresaAdmin);
api.delete('/eliminarEmpresa/:idUsuario',[md_autenticacion.Auth,md_roles.verAdmin],usuarioControlador.eliminarEmpresaAdmin)
api.delete('/eliminarUsuario/:idUsuario',usuarioControlador.EliminarEmpresa)
api.put('/editarUsuario/:idUsuario', usuarioControlador.EditarEmpresa);

module.exports = api;