const envioCorreo = require('../Models/envioCorreo');
const express = require('express');
const router = express.Router();

router.post('/enviarCorreo', (req, res) => {
    envioCorreo.enviarCorreo(req.body)
        .then(envioCorreo => {
            res.status(200).send({
                mesage: 'Se envio el correo correctamente'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'error al mandar correo'
            });
        });
});

module.exports = router;