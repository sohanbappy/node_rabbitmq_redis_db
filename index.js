var tcpClient= require('tcp-client')
 
var options ={}
options.ip= '127.0.0.1'    //192.168.xxx.xxx
options.port= '1557'  //6777
options.timeout='31536000'  //5000 => 5seg
 
var client = tcpClient.createClient(options)
 
client.request("tramaEnvio",function (err, response) {
  // do something with response
})