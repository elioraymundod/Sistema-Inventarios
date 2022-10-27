const con = require('../Configs/cone');

module.exports={
    insertUM(um){
        return new Promise((resolve,reject)=>{
            let query='INSERT INTO sistema_ventas.unidades_medida SET ?';
            con.query(query,[um],(err,rows)=>{
                if(err) reject(err);
                else resolve (true);
            });
        });
    },

    getAllUM(){
        return new Promise((resolve,reject)=>{
            con.query('select * from sistema_ventas.unidades_medida',(err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        })
    }, 

    getUMByCodigo(codigoUm){
        return new Promise((resolve,reject)=>{
            con.query('select * from sistema_ventas.unidades_medida where id = ?', codigoUm,(err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        })
    }, 

    updateUM(um){
        return new Promise((resolve,reject)=>{
            let query='UPDATE sistema_ventas.unidades_medida SET nombre = ?, abrebiacion=?, usuario_modifica=?, fecha_modifica=?, ip_modifica=?  WHERE id = ?';
            con.query(query,[um.nombre,
                um.abrebiacion,
                um.usuario_modifica,
                um.fecha_modifica,
                um.ip_modifica,
                um.id],(err,rows)=>{
                if(err) reject(err);
                else resolve (true);
            });
        });
    },
}