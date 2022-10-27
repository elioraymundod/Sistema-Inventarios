const con = require('../Configs/cone');

module.exports={
    insertTienda(tienda){
        return new Promise((resolve,reject)=>{
            let query='INSERT INTO sistema_ventas.tiendas SET ?';
            con.query(query,[tienda],(err,rows)=>{
                if(err) reject(err);
                else resolve (true);
            });
        });
    },

    getAllTiendas(){
        return new Promise((resolve,reject)=>{
            con.query('select * from sistema_ventas.tiendas',(err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        })
    }, 
}