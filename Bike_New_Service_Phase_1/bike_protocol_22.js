//properties
const amqp = require('amqplib/callback_api');
const redis = require('redis');
//RabbitMQ access
const opt = { credentials: amqp.credentials.plain('newbappy', 'bappy') };
let queue = 'bike-p22';
let status = 0;
const REDIS_PORT = process.env.PORT || 6379;
const redisClient = redis.createClient(REDIS_PORT);
//helper for converting packet
const convert = {
    bin2dec : s => parseInt(s, 2).toString(10),
    bin2hex : s => parseInt(s, 2).toString(16),
    dec2bin : s => parseInt(s, 10).toString(2),
    dec2hex : s => parseInt(s, 10).toString(16),
    hex2bin : s => parseInt(s, 16).toString(2),
    hex2dec : s => parseInt(s, 16).toString(10)
  };
  //Protocol-22
  class PacketCoverter22{
      constructor(packet){
        this.packet = packet;
        this.hid = convert.hex2dec(packet.slice(0,16));
        this.protocol = convert.hex2dec(packet.slice(22,24));
        this.packet_time = convert.hex2dec(packet.slice(24,36));
        this.no_of_gps = convert.hex2dec(packet.slice(37,38));
        this.lattitude = convert.hex2dec((packet.slice(38,46)/1800000));
        this.longitude = convert.hex2dec((packet.slice(46,54)/1800000));
        this.speed = convert.hex2dec(packet.slice(54,56));
        this.acc = convert.hex2dec(packet.slice(76,78));
        this.mileage = convert.hex2dec(packet.slice(82,84));
      }
  }


amqp.connect('amqp://localhost',opt,(err,conn)=>{
conn.createChannel((err2,ch) => {
    ch.assertQueue(queue,{durable: true});
    console.log(`Waiting for Message at: ${queue}`);
    ch.consume(queue,(message)=>{
        let raw_packet = message.content.toString(); //packet With HW_ID
        let hid = raw_packet.slice(0,16);
        //validation
        if(raw_packet.length < 100 && raw_packet.length > 10){
            status = 1;
        }

        redisClient.get(hid, function(err, data) {
          //retrieving JSON
          console.log("In cache: "+data);
        });
        console.log(`Received from ${queue} : ${raw_packet}`); // raw_packet in Hex bytes
        let constructedpacket = new PacketCoverter22(raw_packet);
                            //updating cache (Storing JSON)
                            redisClient.set(hid,JSON.stringify({"raw_packet" : constructedpacket.packet,"protocol" :constructedpacket.protocol,"gps" : constructedpacket.no_of_gps,
                            "lattitide" : constructedpacket.lattitude,"longitude":constructedpacket.longitude,"speed": constructedpacket.speed,
                            "acc" : constructedpacket.acc,"mileage" : constructedpacket.mileage})); 
                            //insert into current_queue Raw packet
                            ch.sendToQueue('bike-current-data', Buffer.from(raw_packet));
        
    },{noAck: true});
     
    });
});

