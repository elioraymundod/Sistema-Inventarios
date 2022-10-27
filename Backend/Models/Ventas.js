const con = require('../Configs/cone');

module.exports={

    getAllVentas(){
        return new Promise((resolve,reject)=>{
            con.query('select ve.* from sistema_ventas.ventas as ve ', (err,rows)=>{
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

}