const amqp = require('amqplib/callback_api');
const mysql = require('mysql');
//RabbitMQ access
const opt = { credentials: amqp.credentials.plain('newbappy', 'bappy') };
let queue = 'hid_current_0358979100015984'; //queue will be dynamic
let protocol_no = '22';
let status = 0;


// Convert a hex string to a Decimal bytes array (working fine)
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

// Convert a byte array to a hex bytes (working fine)
function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xF).toString(16));
    }
    return hex.join("");
}

//connection for mysql
let mysqlConn = mysql.createConnection({
    host : '192.168.10.66',
    port : '5599',
    user : 'rokomari',
    password : 'rokomari',
    database : 'prohori_bike_dev'

});
mysqlConn.connect((err)=>{
    if(err){
        console.log('MySql Connection Failed!!'+JSON.stringify(err));
    }
});


amqp.connect('amqp://localhost',opt,(err,conn)=>{
conn.createChannel((err2,ch) => {
    ch.assertQueue(queue,{durable: true}); 
    console.log(`Waiting for Message at: ${queue}`);
    ch.consume(queue,(message)=>{
        let raw_packet = message.content.toString();
        let hid = raw_packet.slice(0,16);
        let protocol_no = raw_packet.slice(22,24);
        //validation
        if(raw_packet.length < 100 && raw_packet.length > 10){
            status = 1;
        }
        console.log(`Received from ${queue} : ${raw_packet}`);
       mysqlConn.query('INSERT INTO bike_raw_packet(hardware_id,protocol_no,raw_packet,status) VALUES (?,?,?,?)',[hid,protocol_no,raw_packet,status],(err,rows,fields)=>{
           if(!err){
                console.log(`Current updated for ${hid}`); 
            }else{
                console.log(err);
            }
        });
        
    },{noAck: true});
     
    });
});

