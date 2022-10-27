const express = require('express');
const morgan = require('morgan');
const cors = require('cors');


const app = express();

const port=3000;

//Settings
app.set('port', process.env.PORT || port);

//Middleware

app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

app.use(cors());

app.use(morgan('dev'));
//Router
app.use(require('./Routes/UnidadesMedida'));
app.use(require('./Routes/Usuarios'));
app.use(require('./Routes/Tiendas'));
app.use(require('./Routes/Categorias'));
app.use(require('./Routes/UnidadesMedida'));
app.use(require('./Routes/Productos'));
app.use(require('./Routes/Ventas'));
app.use(require('./Routes/Tarjetas'));

app.listen(app.get('port'),()=>{
    console.log(`Server rum on port ${app.get('port')}`)
});