const express = require('express');
const controladorEmpleado = require('../controllers/empleado.controller')

const api = express.Router();


//MIDDLEWARES
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');


api.post('/agregarEmpleado',md_autenticacion.Auth,controladorEmpleado.agregarEmpleado);
api.put('/editarEmpleado/:idEmpleado',md_autenticacion.Auth,controladorEmpleado.editarEmpleado);
api.delete('/eliminarEmpleado/:idEmpleado',md_autenticacion.Auth,controladorEmpleado.eliminarEmpleado)
api.get('/empleados',md_autenticacion.Auth,controladorEmpleado.buscarTodosEmpleados);
api.get('/buscarEmpleadosId/:IdEmpleado',md_autenticacion.Auth,controladorEmpleado.buscarEmpleadosId);
api.get('/buscarNombreEmpleado/:nombre', md_autenticacion.Auth, controladorEmpleado.buscarEmpleadoNombre);
api.get('/buscarPuestoEmpleado/:puesto', md_autenticacion.Auth, controladorEmpleado.buscarEmpleadoPuesto);
api.get('/buscarDepartamentoEmpleado/:departamento', md_autenticacion.Auth, controladorEmpleado.buscarEmpleadoDepartamento);
api.get('/cantidadEmpleados',md_autenticacion.Auth,controladorEmpleado.cantidadEmpleados);
api.get('/generarPDF',md_autenticacion.Auth,controladorEmpleado.generarPDF);


module.exports = api;