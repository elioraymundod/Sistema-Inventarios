const con = require('../Configs/cone');

module.exports={
    getTarjeta(nombre, numero, cvv, fecha){
        return new Promise((resolve,reject)=>{
            con.query('select * from sistema_ventas.tarjetas as sv where sv.nombreTarjeta = ? and sv.numeroTarjeta = ? and '+
            ' sv.cvv = ? and sv.fechaExpiracion = ?', [nombre, numero, cvv, fecha],(err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        })
    }, 
}