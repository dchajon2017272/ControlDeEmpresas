const Empleado = require('../models/empleado.model');
const Usuario = require('../models/usuario.model');
const PDF = require('pdfkit');
const fs = require('fs');   

function agregarEmpleado(req, res) {
    var modeloEmpleado = new Empleado();
    var parametros = req.body;

    if (parametros.nombre && parametros.puesto && parametros.departamento) {
        modeloEmpleado.nombre = parametros.nombre;
        modeloEmpleado.puesto = parametros.puesto;
        modeloEmpleado.departamento = parametros.departamento;
        if (req.user.rol !== "ROL_ADMIN") {
            modeloEmpleado.idUsuarios = req.user.sub;
        } else {
            modeloEmpleado.idUsuarios = parametros.idUsuarios;
        }

        modeloEmpleado.save((err, empleadoGuardado) => {
            if (err) return res.status(500).send({ mensaje: "error en la peticion" })
            if (!empleadoGuardado) return res.status(500).send({ mensaje: "ocurrio un error al intentar agregar" })

            return res.status(200).send({ empleado: empleadoGuardado })
        })

    } else {
        return res.status(500).send({ mensaje: "debe llenar todos los campos necesarios" })
    }

}


function editarEmpleado(req, res) {
    var idEmpl = req.params.idEmpleado;
    var parametros = req.body;

    if (req.user.rol !== "ROL_ADMIN") {
        Empleado.findOneAndUpdate({ _id: idEmpl, idUsuarios: req.user.sub }, { nombre: parametros.nombre, puesto: parametros.puesto, departamento: parametros.departamento }, { new: true }, (err, empleadoActualizado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!empleadoActualizado) return res.status(500).send({ mensaje: "Unicamente el Administrador puede editar empleados de otra empresa" })

            return res.status(200).send({ empleado: empleadoActualizado })
        })
    } else {
        Empleado.findByIdAndUpdate(idEmpl, parametros, { new: true }, (err, empleadoActualizado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!empleadoActualizado) return res.status(500).send({ mensaje: "Error al actualizar el Empleado" })

            return res.status(200).send({ empleado: empleadoActualizado })
        })
    }
}

function eliminarEmpleado(req, res) {
    var idEmpl = req.params.idEmpleado;

    if (req.user.rol !== "ROL_ADMIN") {
        Empleado.findOneAndDelete({ _id: idEmpl, idUsuarios: req.user.sub }, (err, empleadoEliminado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!empleadoEliminado) return res.status(500).send({ mensaje: "Unicamente el Administrador puede eliminar empleados de otra empresa" })

            return res.status(200).send({ empleado: empleadoEliminado })
        })
    } else {
        Empleado.findByIdAndDelete(idEmpl, (err, empleadoEliminado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!empleadoEliminado) return res.status(500).send({ mensaje: "Error al Eliminar el empleado" })

            return res.status(200).send({ empleado: empleadoEliminado })
        })
    }
}


function buscarTodosEmpleados(req, res) {

    if (req.user.rol !== "ROL_ADMIN") {
        Empleado.find({ idUsuarios: req.user.sub }, (err, empleadosObtenidos) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!empleadosObtenidos) return res.status(500).send({ mensaje: "Unicamente el Administrador puede buscar empleados de otra empresa" })

            for (let i = 0; i < empleadosObtenidos.length; i++) {
                console.log(empleadosObtenidos[i].nombre,
                    empleadosObtenidos[i].puesto, empleadosObtenidos[i].departamento)
            }
            
            return res.status(200).send({ empleados: empleadosObtenidos })
        })
    } else {
        Empleado.find((err, empleadosObtenidos) => {
            if (err) return res.send({ mensaje: "Error:  " + err })

            for (let i = 0; i < empleadosObtenidos.length; i++) {
                console.log(empleadosObtenidos[i].nombre,
                    empleadosObtenidos[i].puesto, empleadosObtenidos[i].departamento)
            }

            return res.send({ empleados: empleadosObtenidos })
        })
    }
}

/*function generarPDF(req, res) {

    if (req.user.rol !== "ADMINISTRADOR") {
        Empleado.find({ idEmpresa: req.user.sub }, (err, empleadosObtenidos) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!empleadosObtenidos) return res.status(500).send({ mensaje: "Unicamente el Administrador puede buscar empleados de otra empresa" })

            for (let i = 0; i < empleadosObtenidos.length; i++) {
                console.log(empleadosObtenidos[i].nombre,
                    empleadosObtenidos[i].puesto, empleadosObtenidos[i].departamento)
            }
            
            return res.status(200).send({ empleados: empleadosObtenidos })
        })
    } else {
        Empleado.find((err, empleadosObtenidos) => {
            if (err) return res.send({ mensaje: "Error:  " + err })

            for (let i = 0; i < empleadosObtenidos.length; i++) {
                console.log(empleadosObtenidos[i].nombre,
                    empleadosObtenidos[i].puesto, empleadosObtenidos[i].departamento)
            }


            const doc = new PDF();

            
            
            doc.pipe(fs.createWriteStream('salida.pdf'));

            doc.text(empleadosObtenidos);
            
            doc.end();

            return res.send({ empleados: empleadosObtenidos })
        })
    }
}*/

function generarPDF(req, res) {

    if (req.user.rol !== "ROL_ADMIN") {
        Empleado.find({ idUsuarios: req.user.sub }, (err, empleadosObtenidos) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!empleadosObtenidos) return res.status(500).send({ mensaje: "Unicamente el Administrador puede buscar empleados de otra empresa" })

            for (let i = 0; i < empleadosObtenidos.length; i++) {
                console.log(empleadosObtenidos[i].nombre,
                    empleadosObtenidos[i].puesto, empleadosObtenidos[i].departamento)
            }

             const doc = new PDF();

            doc.pipe(fs.createWriteStream('salida.pdf'));

            doc.text(empleadosObtenidos);
            
            doc.end();
            
            return res.status(200).send({ empleados: empleadosObtenidos })
        })
    } else {
        Empleado.find((err, empleadosObtenidos) => {
            if (err) return res.send({ mensaje: "Error:  " + err })

            for (let i = 0; i < empleadosObtenidos.length; i++) {
                console.log(empleadosObtenidos[i].nombre,
                    empleadosObtenidos[i].puesto, empleadosObtenidos[i].departamento)
            }

            const doc = new PDF();

            doc.pipe(fs.createWriteStream('salida.pdf'));

            doc.text(empleadosObtenidos);
            
            doc.end();
            
            return res.status(200).send({ empleados: empleadosObtenidos })

           
        })
    }
}

function cantidadEmpleados(req, res) {

    if (req.user.rol !== "ROL_ADMIN") {
        Empleado.count({ idUsuarios: req.user.sub }, (err, empleadosObtenidos) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!empleadosObtenidos) return res.status(500).send({ mensaje: "Unicamente el Administrador puede buscar empleados de otra empresa" })

            

            return res.status(200).send({ empleados: empleadosObtenidos })
        })
    } else {
        Empleado.count((err, empleadosObtenidos) => {
            if (err) return res.send({ mensaje: "Error:  " + err })

            for (let i = 0; i < empleadosObtenidos.length; i++) {
                console.log(empleadosObtenidos[i].nombre,
                    empleadosObtenidos[i].puesto, empleadosObtenidos[i].departamento)
            }

            return res.send({ empleadosTotal: empleadosObtenidos })
        })
    }
}

function buscarEmpleadosId(req, res) {
    var idEmp = req.params.IdEmpleado;

    if(req.user.rol !== "ROL_ADMIN"){
        if(req.user.rol !== "ROL_EMPRESA"){
            return res.status(500).send({mensaje: "Unicamente el Administrador puede buscar empleados de otra empresa"})
            
        }else{
            Empleado.findOne({"_id": idEmp, idUsuarios: req.user.sub}, (err, empleadoEncontrado)=>{
                if(err) return res.status(500).send({mensaje: "error en la peticion"})
                if(!empleadoEncontrado) return res.status(500).send({mensaje: "El empleado no se encuentra registrado en esta empresa"})

                return res.status(200).send({empleado: empleadoEncontrado})
            })

        }

    }else{
        Empleado.findById(idEmp, (err, empleadoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "error en la peticion" })
            if (!empleadoEncontrado) return res.status(500).send({ mensaje: "El empleado que busca no esta en ninguna empresa" })

            return res.status(200).send({ empleado: empleadoEncontrado })
        })
    }
    

}

function buscarEmpleadoNombre(req, res) {
    var nomEmp = req.params.nombre;

    if(req.user.rol !== "ROL_ADMIN"){
        if(req.user.rol !== "ROL_EMPRESA"){
            return res.status(500).send({mensaje: "Unicamente el Administrador puede buscar empleados de otra empresa"})
            
        }else{
            //Empleado.findOne({nombre: nomEmp, idUsuarios: req.user.sub}, (err, empleadoEncontrado) => {
                Empleado.findOne({ nombre: { $regex: nomEmp, $options: 'i' },idUsuarios: req.user.sub }, (err, empleadoEncontrado) => {    
                if(err) return res.status(500).send({mensaje: "error en la peticion"})
                if(!empleadoEncontrado) return res.status(500).send({mensaje: "El empleado no se encuentra registrado en esta empresa"})

                return res.status(200).send({empleado: empleadoEncontrado})
            })

        }

    }else{
        Empleado.find({ nombre: { $regex: nomEmp, $options: 'i' } }, (err, empleadoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "error en la peticion" })
            if (!empleadoEncontrado) return res.status(500).send({ mensaje: "El empleado que busca no esta en ninguna empresa" })

            return res.status(200).send({ empleado: empleadoEncontrado })
        })
    }
    

}


function buscarEmpleadoPuesto(req, res) {
    var puestoEmp = req.params.puesto;

    if(req.user.rol !== "ROL_ADMIN"){
        if(req.user.rol !== "ROL_EMPRESA"){
            return res.status(500).send({mensaje: "Unicamente el Administrador puede buscar empleados de otra empresa"})
            
        }else{
                Empleado.find({ puesto: { $regex: puestoEmp, $options: 'i' },idUsuarios: req.user.sub }, (err, empleadoEncontrado) => {    
                if(err) return res.status(500).send({mensaje: "Error en la peticion"})
                if(!empleadoEncontrado) return res.status(500).send({mensaje: "El empleado no se encuentra registrado en esta empresa"})

                return res.status(200).send({empleado: empleadoEncontrado})
            })

        }

    }else{
        Empleado.find({ puesto: { $regex: puestoEmp, $options: 'i' } }, (err, empleadoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!empleadoEncontrado) return res.status(500).send({ mensaje: "El empleado que busca no esta en ninguna empresa" })

            return res.status(200).send({ empleado: empleadoEncontrado })
        })
    }
}


function buscarEmpleadoDepartamento(req, res) {
    var depEmp = req.params.departamento;

    if(req.user.rol !== "ROL_ADMIN"){
        if(req.user.rol !== "ROL_EMPRESA"){
            return res.status(500).send({mensaje: "Unicamente el Administrador puede buscar empleados de otra empresa"})
            
        }else{
            //Empleado.findOne({nombre: nomEmp, idUsuarios: req.user.sub}, (err, empleadoEncontrado) => {
                Empleado.find({ departamento: { $regex: depEmp, $options: 'i' },idUsuarios: req.user.sub }, (err, empleadoEncontrado) => {    
                if(err) return res.status(500).send({mensaje: "error en la peticion"})
                if(!empleadoEncontrado) return res.status(500).send({mensaje: "El empleado no se encuentra registrado en esta empresa"})

                return res.status(200).send({empleado: empleadoEncontrado})
            })

        }

    }else{
        Empleado.find({ departamento: { $regex: depEmp, $options: 'i' } }, (err, empleadoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "error en la peticion" })
            if (!empleadoEncontrado) return res.status(500).send({ mensaje: "El empleado que busca no esta en ninguna empresa" })

            return res.status(200).send({ empleado: empleadoEncontrado })
        })
    }
    

}

    module.exports = {
        agregarEmpleado,
        editarEmpleado,
        eliminarEmpleado,
        buscarTodosEmpleados,
        buscarEmpleadosId,
        buscarEmpleadoNombre,
        buscarEmpleadoPuesto,
        buscarEmpleadoDepartamento,
        cantidadEmpleados,
        generarPDF
    }

