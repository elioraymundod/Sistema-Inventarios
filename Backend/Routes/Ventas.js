const ventas = require('../Models/Ventas');
const express = require('express');
const router = express.Router();

router.get('/get/all/ventas', (req, res) => {
    ventas.getAllVentas()
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

router.post('/ventas', (req, res) => {
    ventas.insertVenta(req.body)
        .then(venta => {
            res.status(200).send({
                mesage: 'Se creo el registro correctamente'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'Error al crear un registro'
            });
        });
});


router.post('/ventas/detalle', (req, res) => {
    ventas.insertDetalleVenta(req.body)
        .then(dVenta => {
            res.status(200).send({
                mesage: 'Se creo el registro correctamente'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'Error al crear un registro'
            });
        });
});

router.get('/get/ventas/pendientes', (req, res) => {
    ventas.getVentasPendientes()
        .then(ventas => {
            res.status(200).send(ventas);
        })
        .catch(err => {
            console.error(err);
            res.status(404).send({
                mesage: 'Error al obtener datos'
            });
        });



});

router.get('/buscar/codigo/envio/:codigoEnvio', (req, res) => {
    ventas.buscarCodigoEnvio(req.params.codigoEnvio)
        .then(ventas => {
            res.status(200).send(ventas);
        })
        .catch(err => {
            console.error(err);
            res.status(404).send({
                mesage: 'Error al obtener datos'
            });
        });

});

router.get('/obtener/detalle/venta/:codigoVenta', (req, res) => {
    ventas.getDetalleVenta(req.params.codigoVenta)
        .then(ventas => {
            res.status(200).send(ventas);
        })
        .catch(err => {
            console.error(err);
            res.status(404).send({
                mesage: 'Error al obtener datos'
            });
        });

});

router.put('/actualizar/estado/venta', (req, res) => {
    ventas.updateEstadoVenta(req.body)
        .then(venta => {
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