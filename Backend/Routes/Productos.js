const producto = require('../Models/Productos');
const express = require('express');
const router = express.Router();

router.post('/productos', (req, res) => {
    producto.insertProducto(req.body)
        .then(productos => {
            res.status(200).send({
                mesage: 'Se creo el producto correctamente'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'Error al crear una categoria'
            });
        });
});

router.get('/get/productos', (req, res) => {
    producto.getAllProductos()
        .then(productos => {
            res.status(200).send(productos);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'Error al obtener datos'
            });
        });

});

router.get('/get/productos/:codigo', (req, res) => {
    producto.getCategoriaByCodigo(req.params.codigo)
        .then(categorias => {
            res.status(200).send(categorias);
        })
        .catch(err => {
            console.error(err);
            res.status(404).send({
                mesage: 'Error al obtener datos'
            });
        });
});

router.put('/actualizar/producto', (req, res) => {
    producto.updateCategoria(req.body)
        .then(categoria => {
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

router.get('/get/productos/idproducto/idtienda/:idProducto/:idTienda', (req, res) => {
    producto.getProductoByTienda(req.params.idProducto, req.params.idTienda)
        .then(productos => {
            res.status(200).send(productos);
        })
        .catch(err => {
            console.error(err);
            res.status(404).send({
                mesage: 'Error al obtener datos'
            });
        });
});

router.post('/productos/tiendas', (req, res) => {
    producto.insertProductoTienda(req.body)
        .then(productos => {
            res.status(200).send({
                mesage: 'Se creo el registro correctamente'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'Error al crear una categoria'
            });
        });
});

router.put('/actualizar/cantidad/producto', (req, res) => {
    producto.sumarCantidad(req.body)
        .then(producto => {
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

router.get('/get/total/productos/:idProducto', (req, res) => {
    producto.getCantidadExistencias(req.params.idProducto)
        .then(total => {
            res.status(200).send(total);
        })
        .catch(err => {
            console.error(err);
            res.status(404).send({
                mesage: 'Error al obtener datos'
            });
        });
});

router.put('/put/actualizar/cantidad/producto', (req, res) => {
    producto.updateCantidadProducto(req.body)
        .then(producto => {
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