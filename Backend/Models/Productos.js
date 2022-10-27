const con = require('../Configs/cone');

module.exports={
    insertProducto(producto){
        return new Promise((resolve,reject)=>{
            let query='INSERT INTO sistema_ventas.productos SET ?';
            con.query(query,[producto],(err,rows)=>{
                if(err) reject(err);
                else resolve (true);
            });
        });
    },

    getAllProductos(){
        return new Promise((resolve,reject)=>{
            con.query('select *, pr.nombre as nombreProducto, pr.id as idProducto, ca.nombre as nombreCategoria, um.nombre as nombreUM from sistema_ventas.productos pr ' +
            'inner join sistema_ventas.categorias ca on ca.id = pr.categoria ' +
            'inner join sistema_ventas.unidades_medida um on um.id = pr.unidad_medida',(err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        })
    }, 

    getCategoriaByCodigo(codigoCategoria){
        return new Promise((resolve,reject)=>{
            con.query('select * from sistema_ventas.categorias where id = ?', codigoCategoria,(err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        })
    }, 

    updateCategoria(categoria){
        return new Promise((resolve,reject)=>{
            let query='UPDATE sistema_ventas.categorias SET nombre = ?, descripcion=?, usuario_modifica=?, fecha_modifica=?, ip_modifica=?  WHERE id = ?';
            con.query(query,[categoria.nombre,
                categoria.descripcion,
                categoria.usuario_modifica,
                categoria.fecha_modifica,
                categoria.ip_modifica,
                categoria.id],(err,rows)=>{
                if(err) reject(err);
                else resolve (true);
            });
        });
    },

    getProductoByTienda(idProducto, idTienda){
        return new Promise((resolve,reject)=>{
            con.query('select * from sistema_ventas.productos_tiendas where id_producto = ? and id_tienda = ?', [idProducto, idTienda],(err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        });
    },

    insertProductoTienda(producto){
        return new Promise((resolve,reject)=>{
            let query='INSERT INTO sistema_ventas.productos_tiendas SET ?';
            con.query(query,[producto],(err,rows)=>{
                if(err) reject(err);
                else resolve (true);
            });
        });
    },

    sumarCantidad(existencias){
        return new Promise((resolve,reject)=>{
            let query='UPDATE sistema_ventas.productos_tiendas SET cantidad = ? WHERE id_producto = ? and id_tienda = ?';
            con.query(query,[existencias.cantidad,
                existencias.id_producto,
                existencias.id_tienda],(err,rows)=>{
                if(err) reject(err);
                else resolve (true);
            });
        });
    },

    getCantidadExistencias(idProducto){
        return new Promise((resolve,reject)=>{
            con.query('select SUM(pt.cantidad) as total from sistema_ventas.productos_tiendas as pt where pt.id_producto = ?', idProducto,(err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        });
    },
    
    updateCantidadProducto(producto){
        return new Promise((resolve,reject)=>{
            let query='UPDATE sistema_ventas.productos_tiendas SET cantidad=? WHERE id_producto = ?';
            con.query(query,[producto.cantidad,
                producto.id_producto],(err,rows)=>{
                if(err) reject(err);
                else resolve (true);
            });
        });
    },


}