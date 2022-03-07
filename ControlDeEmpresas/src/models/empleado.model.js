const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmpleadoSchema = Schema({
    nombre: String,
    puesto: String,
    departamento: String,
    idUsuarios: {type: Schema.Types.ObjectId, ref: 'Usuarios'}
});

module.exports = mongoose.model('Empleados', EmpleadoSchema);