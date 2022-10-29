const mysql = require('mysql');
const data = require('./conf')
const express = require('express')
const cors = require('cors');
const app = express();
const server = require('http').Server(app);

app.use(cors());

const mysqlConnection = mysql.createConnection({
  host: data.host,
  user: data.user,
  password: data.password,
  database: data.database,
  port: data.port,
  multipleStatements: true
});
/*
const io = require('socket.io')(server, {
  cors: {
      origins: ['http://localhost:4200']
  }
})

io.on('connection', (socket) => {

  socket.on('find-driver', ({points}) => {
      console.log('......', points);

      const counter = setInterval(() => {
          const coords = points.shift();
          if (!coords) {
              clearInterval(counter)
          } else {
              socket.emit('position', {coords});
          }
      }, 1000)
  })
})*/

mysqlConnection.connect(function (err) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log('Conexion a la db completa');
  }
});

//server.listen(3001, () => console.log('Todo bien !!'))

module.exports = mysqlConnection;