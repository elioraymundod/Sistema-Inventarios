const tiendas = require('../Models/Tiendas');
const express = require('express');
const router = express.Router();

router.post('/tiendas', (req, res) => {
    tiendas.insertTienda(req.body)
        .then(tiendas => {
            res.status(200).send({
                mesage: 'Se creo la tienda correctamente'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'Error al crear una tienda'
            });
        });
});

router.get('/get/tiendas', (req, res) => {
    tiendas.getAllTiendas()
        .then(tiendas => {
            res.status(200).send(tiendas);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'Error al obtener datos'
            });
        });

});

module.exports = router;