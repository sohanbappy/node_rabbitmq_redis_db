const amqp = require('amqplib/callback_api');
const mysql = require('mysql');
//RabbitMQ access
const opt = { credentials: amqp.credentials.plain('newbappy', 'bappy') };
let queue = 'bike-current-data';
let status = 0;


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
        console.log(`Received from ${queue} for ${hid} : ${raw_packet}`);
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

