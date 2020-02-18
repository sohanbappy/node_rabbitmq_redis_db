var net = require('net');
var logger=require('./logger');
var amqp = require('amqplib');
var CRC16 = require('crc16');



String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("0"+hex).slice(-2);
    }

    return result
}
/*
String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,2}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}
String.prototype.hexDecode1 = function() {
    return this.replace(/\\x([0-9A-Fa-f]{2})/g, function() {
        return String.fromCharCode(parseInt(arguments[1], 16));
    });
};

String.prototype.hexDecode2 = function hex2a() {
    var str = '';
    for (var i = 0; i < this.length; i += 2) str += String.fromCharCode(parseInt(this.substr(i, 2), 16));
    return str;
}*/

String.prototype.hexDecode = function() {
    var s=this;

    var len = s.length;
    var data = [];
    for(var i=0; i<(len/2); data[i++]=0) {} 

    for (var i = 0; i < len; i += 2) {

        var value = (parseInt(s.charAt(i), 16) << 4)
                             + parseInt(s.charAt(i+1), 16);

        // "transforms" your integer to the value a Java "byte" would have:
        if(value > 127) {
            value -= 256;
        }

        data[i / 2] = value;

    }

    return data;

};



 function generateStatusResponse(serial){

    var statusRes = "78780513";

    var serialOne = serial;
    
    var crcMessage = "0513"+serialOne;
    var crcValue =  CRC16(crcMessage, 'hex');
    
    return statusRes+serialOne+crcValue+"0D0A";
}





const EXCHANGE_NAME = 'bike-p';
const EXCHANGE_TYPE = 'x-recent-history';
const EXCHANGE_OPTION = {
  durable: true,
  autoDelete: true,
  arguments: {
    'x-recent-history-length': 10
  }
};
var conn = null;
var channel = null;
 async function initmq(){
     const opt = { credentials: amqp.credentials.plain('newbappy', 'bappy') };
     conn = await amqp.connect('amqp://localhost', opt, (err, conn) => {});

     channel = await conn.createChannel();
}


// Create and return a net.Server object, the function will be invoked when client connect to this server.
var server = net.createServer(async function(client) {
    var hid='hid';

    logger.info('Client connect. Client local address : ' + client.localAddress + ':' + client.localPort + '. client remote address : ' + client.remoteAddress + ':' + client.remotePort);
    server.getConnections(function (err, count) {
      if(!err)
      {
          // Print current connection count in server console.
          logger.info("There are "+count+" connections now. ");
      }else
      {
        logger.info(JSON.stringify(err));
      }
   });

    //client.setEncoding('utf-8');
    client.setEncoding('hex'); 
    client.setTimeout(36000000);







    var loginResponse =  '787805010001D9DC0D0A';
    
    // When receive client data.
    client.on('data', function (clientdata) {
        //logger.info('Receive client send data : ' + clientdata.hexEncode().toUpperCase() + ', data size : ' + client.bytesRead);
       // var encodedata=clientdata.hexEncode().toUpperCase();
        logger.info('Receive client send data : ' + clientdata.toUpperCase() + ', data size : ' + client.bytesRead);
        var encodedata=clientdata.toUpperCase();
        var arrdata=encodedata.split('0D0A')
        arrdata.forEach(adata => {
            var data=adata+'0D0A'
            logger.info(data)

        if(data.length>4){
           const str=data;
           const protocol=str.slice(6,8);
            logger.info("protocol: "+protocol);
            switch(protocol){
                case '01':
                    var hidstr8=data.slice(8,24)
                    hid=hidstr8;
                    logger.info('hid:'+hid)
                   
                    client.write(Buffer.from(loginResponse,'hex'));
                    logger.info(loginResponse.hexDecode().length)
                    if(hid.length==16){
                        channel.sendToQueue('bike-p01', Buffer.from(hid+data));
                        logger.info(hid+'-----len----'+(hid+data).length);

                    }
                    break;
                case '13':
                    var sr1=data.slice(18,22)
                    var res1=generateStatusResponse(sr1);
                    client.write(Buffer.from(res1,'hex'));
                    if(hid.length==16){
                  
                        channel.sendToQueue('bike-p13', Buffer.from(hid+data));
                        logger.info(hid+'-----len----'+(hid+data).length);

                    }
                    break;
                default:
                if(hid.length==16){
                  
                    channel.sendToQueue(EXCHANGE_NAME+protocol, Buffer.from(hid+data));
                    logger.info(hid+'-----len----'+(hid+data).length);

                }
                //logger.info(loginResponse.toCha())
            }
          

        }
    });
     
       
        });

    // When client send data complete.
    client.on('end', function () {
        logger.info('Client disconnect.');

        // Get current connections count.
        server.getConnections(function (err, count) {
            if(!err)
            {
                // Print current connection count in server console.
                logger.info("There are "+count+" connections now. ");
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

// Make the server a TCP server listening on port 1701.
server.listen(1720, async function () {

    // Get server address info.
    var serverInfo = server.address();

    var serverInfoJson = JSON.stringify(serverInfo);

    logger.info('TCP server listen on address : ' + serverInfoJson);

    server.on('close', function () {
        if(conn!=null){
            conn.close();
        }
        logger.info('TCP server socket is closed.');
    });

    server.on('error', function (error) {
        logger.info(JSON.stringify(error));
    });
    await initmq();
 

});
