var hostInfo = [];
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


  socket.on('host-info', function(data){
    hostInfo=[]
    hostInfo.push(data)
    console.log("host-info:: " +hostInfo[0]);
});

socket.on('host-disconnect', function(data){
  console.log("making host empty!")
  hostInfo=[]
});

if(hostInfo.length>0){
ioServer.emit("getting-hostid",hostInfo[0])
}
// socket.on('disconnect',(data)=>{
//    if(hostInfo[0]!=undefined){
//     console.log("disconnect:::::"+hostInfo[0])

//    }
// })


});


server.listen(process.env.PORT||3010, ()=> {
    console.log('server started on port 3010!')
  })
  