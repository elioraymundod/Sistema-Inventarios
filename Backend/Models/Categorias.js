const con = require('../Configs/cone');

module.exports={
    insertCategoria(categoria){
        return new Promise((resolve,reject)=>{
            let query='INSERT INTO sistema_ventas.categorias SET ?';
            con.query(query,[categoria],(err,rows)=>{
                if(err) reject(err);
                else resolve (true);
            });
        });
    },

    getAllCategorias(){
        return new Promise((resolve,reject)=>{
            con.query('select * from sistema_ventas.categorias',(err,rows)=>{
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
}