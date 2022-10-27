const categorias = require('../Models/Categorias');
const express = require('express');
const router = express.Router();

router.post('/categorias', (req, res) => {
    categorias.insertCategoria(req.body)
        .then(categorias => {
            res.status(200).send({
                mesage: 'Se creo la categoria correctamente'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'Error al crear una categoria'
            });
        });
});

router.get('/get/categorias', (req, res) => {
    categorias.getAllCategorias()
        .then(categorias => {
            res.status(200).send(categorias);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                mesage: 'Error al obtener datos'
            });
        });

});

router.get('/get/categoria/:codigo', (req, res) => {
    users.getCategoriaByCodigo(req.params.codigo)
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

router.put('/actualizar/categoria', (req, res) => {
    categorias.updateCategoria(req.body)
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

module.exports = router;