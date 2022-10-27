const um = require('../Models/UnidadesMedias');
const express = require('express');
const router = express.Router();

router.post('/um', (req, res) => {
    um.insertUM(req.body)
        .then(um => {
            res.status(200).send({
                mesage: 'Se creo la UM correctamente'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'Error al crear una UM'
            });
        });
});

router.get('/get/um', (req, res) => {
    um.getAllUM()
        .then(um => {
            res.status(200).send(um);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'Error al obtener datos'
            });
        });

});

router.get('/get/um/:codigo', (req, res) => {
    um.getUMByCodigo(req.params.codigo)
        .then(um => {
            res.status(200).send(um);
        })
        .catch(err => {
            console.error(err);
            res.status(404).send({
                mesage: 'Error al obtener datos'
            });
        });
});

router.put('/actualizar/um', (req, res) => {
    um.updateUM(req.body)
        .then(um => {
            res.status(200).send({
                mesage: 'Se actualizaron los datos correctamente'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'Error al actualizar datos'
            });
        });
});

module.exports = router;