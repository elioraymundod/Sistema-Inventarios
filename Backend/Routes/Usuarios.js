const users = require('../Models/Usuarios');
const express = require('express');
const router = express.Router();


router.post('/usuarios', (req, res) => {
    users.insertUser(req.body)
        .then(user => {
            res.status(200).send({
                mesage: 'Se creo el usuario correctamente'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'Error al crear un usuario'
            });
        });
});

router.get('/get/usuarios/:user/:pass', (req, res) => {
    users.getUserByLoginAndPass(req.params.user, req.params.pass)
        .then(user => {
            res.status(200).send(user);
        })
        .catch(err => {
            console.error(err);
            res.status(404).send({
                mesage: 'Error al obtener datos'
            });
        });

});

router.get('/get/all/usuarios', (req, res) => {
    users.getAlllUsers()
        .then(user => {
            res.status(200).send(user);
        })
        .catch(err => {
            console.error(err);
            res.status(404).send({
                mesage: 'Error al obtener datos'
            });
        });

});

router.get('/get/catalogo/:catalogo', (req, res) => {
    users.getCatalogoByCodigo(req.params.catalogo)
        .then(catalogos => {
            res.status(200).send(catalogos);
        })
        .catch(err => {
            console.error(err);
            res.status(404).send({
                mesage: 'Error al obtener datos'
            });
        });
});

router.put('/actualizar/usuario',(req,res)=>{
    users.updateUsuario(req.body)
                    .then(usuario=>{
                        res.status(200).send({
                            mesage:'Se actualizaron los datos correctamente'
                        });
                    })
                    .catch(err=>{
                        console.error(err);
                        res.status(500).send({
                            mesage:'Error al actualizar datos'
                        });
                    });
});

module.exports = router;