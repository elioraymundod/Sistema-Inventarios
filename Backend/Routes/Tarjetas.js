const tarjetas = require('../Models/Tarjetas');
const express = require('express');
const router = express.Router();

router.get('/get/tarjeta/:nombre/:numero/:cvv/:fecha', (req, res) => {
    tarjetas.getTarjeta(req.params.nombre, req.params.numero, req.params.cvv, req.params.fecha)
        .then(tarjetas => {
            res.status(200).send(tarjetas);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'Error al obtener datos'
            });
        });

});

module.exports = router;