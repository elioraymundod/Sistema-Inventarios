const con = require('../Configs/cone');

module.exports={

    getAllVentas(){
        return new Promise((resolve,reject)=>{
            con.query('select ve.*, cd.nombre as estado_venta from sistema_ventas.ventas as ve ' +
            ' inner join sistema_ventas.cat_dato as cd on cd.id = ve.venta_atendida ', (err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        })
    }, 

    insertVenta(venta){
        return new Promise((resolve,reject)=>{
            let query='INSERT INTO sistema_ventas.ventas SET ?';
            con.query(query,[venta],(err,rows)=>{
                if(err) reject(err);
                else resolve (true);
            });
        });
    },

    insertDetalleVenta(venta){
        return new Promise((resolve,reject)=>{
            let query='INSERT INTO sistema_ventas.detalle_venta SET ?';
            con.query(query,[venta],(err,rows)=>{
                if(err) reject(err);
                else resolve (true);
            });
        });
    },

    getVentasPendientes(){
        return new Promise((resolve,reject)=>{
            con.query('select vp.* from sistema_ventas.ventas as vp where vp.venta_atendida = 4 ', (err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        })
    }, 

    buscarCodigoEnvio(codigoEvnio){
        return new Promise((resolve,reject)=>{
            con.query('select vp.* from sistema_ventas.ventas as vp where vp.codigo_envio = ? ', codigoEvnio, (err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        })
    }, 

    getDetalleVenta(codigoVenta){
        return new Promise((resolve,reject)=>{
            con.query('select vp.*, pr.nombre as nombre_producto from sistema_ventas.detalle_venta as vp '
            +' inner join sistema_ventas.productos as pr on pr.id = vp.id_producto where vp.id_venta = ?', codigoVenta, (err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        })
    },
    

    updateEstadoVenta(venta){
        return new Promise((resolve,reject)=>{
            let query='UPDATE sistema_ventas.ventas SET venta_atendida=?, pedido_entregado=? WHERE id = ?';
            con.query(query,[venta.nuevo_codigo, venta.nuevo_codigo,
                venta.id_venta],(err,rows)=>{
                if(err) reject(err);
                else resolve (true);
            });
        });
    },

}