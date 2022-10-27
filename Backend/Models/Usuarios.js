const con = require('../Configs/cone');

module.exports={
    insertUser(user){
        return new Promise((resolve,reject)=>{
            let query='INSERT INTO sistema_ventas.usuarios SET ?';
            con.query(query,[user],(err,rows)=>{
                if(err) reject(err);
                else resolve (true);
            });
        });
    },

    getUserByLoginAndPass(login, pass){
        return new Promise((resolve,reject)=>{
            con.query('select * from sistema_ventas.usuarios where user = ? and pass = ? and estado = 1', [login, pass], (err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        })
    }, 

    getAlllUsers(){
        return new Promise((resolve,reject)=>{
            con.query('select us.*, ca.nombre as nombreRol, ti.nombre as nombreTienda from sistema_ventas.usuarios as us ' +
            'inner join sistema_ventas.cat_dato as ca on us.rol = ca.id '+
            'inner join sistema_ventas.tiendas as ti on us.tienda_asignada = ti.id where us.estado = 1', (err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        })
    }, 

    getCatalogoByCodigo(codigoCatalogo){
        return new Promise((resolve,reject)=>{
            con.query('select * from sistema_ventas.cat_dato as ca ' +
            'where ca.catalogo = ?', codigoCatalogo,(err,rows)=>{
                if(err) reject(err);
                else resolve(rows);
            })
        })
    }, 

    updateUsuario(usuario){
        return new Promise((resolve,reject)=>{
            let query='UPDATE sistema_ventas.usuarios SET id = ?, nombre=?, user = ?, pass=?, rol=?, tienda_asignada=?, usuario_modifica=?, fecha_modifica=?, ip_modifica=?, estado=?  WHERE id = ?';
            con.query(query,[usuario.nit,
                usuario.nombre,
                usuario.usuario,
                usuario.pass,
                usuario.rol,
                usuario.tienda,
                usuario.usuario_modifica,
                usuario.fecha_modifica,
                usuario.ip_modifica,
                usuario.estado,
                usuario.nit],(err,rows)=>{
                if(err) reject(err);
                else resolve (true);

            });
        });
    },
}