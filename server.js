var net = require('net');
var logger=require('./logger');
var amqp = require('amqplib');

// Import net module.  No Need
// var redis = require("redis"),
// cr = redis.createClient();



// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

//No need
// cr.on("error", function (err) {
//     logger.info("Redis Error " + err);
// });

const EXCHANGE_NAME = 'data';
const EXCHANGE_TYPE = 'x-recent-history';
const EXCHANGE_OPTION = {
  durable: true,
  autoDelete: true,
  arguments: {
    'x-recent-history-length': 10
  }
};
var conn=null;
var channel=null;
 async function initmq(){
     conn = await amqp.connect('amqp://localhost');
     channel = await conn.createChannel();
  
   // await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, EXCHANGE_OPTION);
}


// Create and return a net.Server object, the function will be invoked when client connect to this server.
var server = net.createServer(async function(client) {

    logger.info('Client connect. Client local address : ' + client.localAddress + ':' + client.localPort + '. client remote address : ' + client.remoteAddress + ':' + client.remotePort);
    server.getConnections(function (err, count) {
      if(!err)
      {
          // Print current connection count in server console.
          logger.info("There are %d connections now. ", count);
      }else
      {
          logger.info(JSON.stringify(err));
      }
   });

    client.setEncoding('utf-8');

    client.setTimeout(15000);

    // When receive client data.
    client.on('data', function (data) {

        // Print received client data and length.
        logger.info('Receive client send data : ' + data + ', data size : ' + client.bytesRead);
        channel.sendToQueue(EXCHANGE_NAME, Buffer.from(data));
      /*  var str = data.replace(/\n|\r/g, "");
        if(str.length>0){
          var astr=str.split(',');
          if( Array.isArray(astr)==true){
            const hid=astr[0];
            if(hid.length==15){
                channel.publish(EXCHANGE_NAME, key, new Buffer(msg));
       
            }
          }
        
        }else{
          client.end;
        }*/
        // Server send data back to client use client net.Socket object.
       // client.end('Server received data : ' + data + ', send back to client data size : ' + client.bytesWritten);
    });
	// When client send data complete.
	client.on('error', function(ex) {
	logger.info("client handled error");
	logger.info(ex);
	});

    // When client send data complete.
    client.on('end', function () {
        logger.info('Client disconnect.');

        // Get current connections count.
        server.getConnections(function (err, count) {
            if(!err)
            {
                // Print current connection count in server console.
                logger.info("There are %d connections now. ", count);
            }else
            {
                logger.info(JSON.stringify(err));
            }

        });
    });

    // When client timeout.
    client.on('timeout', function () {
        logger.info('Client request time out. ');
    })
});

// Make the server a TCP server listening on port 9999.
server.listen(1557, async function () {

    // Get server address info.
    var serverInfo = server.address();

    var serverInfoJson = JSON.stringify(serverInfo);

    logger.info('TCP server listen on address : ' + serverInfoJson);

    server.on('close', function () {
      cr.quit();

        logger.info('TCP server socket is closed.');
    });

    server.on('error', function (error) {
        logger.info(JSON.stringify(error));
    });
    await initmq();
 

});
module.exports=server;

