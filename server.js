
const RTCMultiConnectionServer = require('rtcmulticonnection-server');
const moment=require('moment');  
const express = require('express')
const app = express() 

const server = require('http').Server(app)
const ioServer= require('socket.io')(server)

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(express.static('public'))



app.get('/openroom', (req, res) => {
    
    res.render(`openroom`)
  })
  app.get('/joinroom', (req, res) => {
    
    res.render(`joinroom`)
  })
 
ioServer.on('connection', function(socket) {
    RTCMultiConnectionServer.addSocket(socket);
});


server.listen(process.env.PORT||3010, ()=> {
    console.log('server started on port 3010!')
  })
  