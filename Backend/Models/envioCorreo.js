const con = require('../Configs/cone');
require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports={ 
    enviarCorreo(datosCorreo) {
        return new Promise((resolve,reject)=>{
            let transportador = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'no.responder.correo.er@gmail.com',
                    pass: 'ezkyoebuhomubcag'
                }
            });
            
            let mailOptions = {
                from: 'no.responder.correo.er@gmail.com',
                to: datosCorreo.paraCorreo,
                subject: datosCorreo.asuntoCorreo,
                text: datosCorreo.cuerpoCorreo,
                html: datosCorreo.htmlCorreo
            };
            
            transportador.sendMail(mailOptions, function(err, data){
                if (err) {
                    console.log('error al enviar el correo', err);
                } else {
                    console.log('Correo enviado exitosamente');
                }
            });
        })
    },
  
}