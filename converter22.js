
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
//0358979100015984787822221402160B2027C7028BBDF709B38C840014EF01D601523500B505010000000736970D0A from-bike-database
//0358979100015984787822221402160B2027C7028BBDF709B38C840014EF01D601523500B505010000000736970D0A  from-documentation
const convert = {
  bin2dec : s => parseInt(s, 2).toString(10),
  bin2hex : s => parseInt(s, 2).toString(16),
  dec2bin : s => parseInt(s, 10).toString(2),
  dec2hex : s => parseInt(s, 10).toString(16),
  hex2bin : s => parseInt(s, 16).toString(2),
  hex2dec : s => parseInt(s, 16).toString(10)
};

//Protocol-22 (Location)
let dataWithHwId_22 = "0358979100015984787822221402160B2027C7028BBDF709B38C840014EF01D601523500B505010000000736970D0A";
let bytes = [];
//converter for String to Byte Array
String.prototype.getBytes = function (){
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
      bytes.push(this.charCodeAt(i));
    }
    return bytes;
  };

  //followed by Concox-JAVA (PacketreaderVR)
  let h_id = dataWithHwId_22.slice(0,16);
  let raw_data_22 = dataWithHwId_22.slice(16,dataWithHwId_22.length);//withoutHID
  console.log("====================================");
  console.log("HID: "+h_id);
  console.log("Raw Data-22: "+raw_data_22);
  console.log("Protocol: "+raw_data_22.slice(6,8));


  //according to documentation
console.log("Year: "+convert.hex2dec(raw_data_22.slice(8,10))+" Month: "+convert.hex2dec(raw_data_22.slice(10,12))+" Date: "+convert.hex2dec(raw_data_22.slice(12,14)));
console.log("Hour: "+convert.hex2dec(raw_data_22.slice(14,16))+" Minute: "+convert.hex2dec(raw_data_22.slice(16,18))+" Second: "+convert.hex2dec(raw_data_22.slice(18,20)));
console.log("GPS: "+convert.hex2dec(raw_data_22.slice(21,22))); //1-bit(2nd) -> available GPS
console.log("Lat: "+convert.hex2dec(raw_data_22.slice(22,30))/1800000); //decimal devided by 1800000
console.log("Lon: "+convert.hex2dec(raw_data_22.slice(30,38))/1800000); //decimal devided by 1800000
console.log("Speed: "+convert.hex2dec(raw_data_22.slice(38,40)));

let course_22 = convert.hex2bin(raw_data_22.slice(40,44));//ignoring prefix (0)
if(course_22.length<16){
  const diff = 16 - course_22.length; //find out missing zero(s)
  for(let i=0;i<diff;i++) // adding Zero(s)
  course_22='0'+course_22;
}
console.log("Total Course: "+course_22); //course and status
console.log("Real-time or Differential? "+course_22[2]);
console.log("GPS positioned or not? "+course_22[3]);
console.log("East or West?"+course_22[4]);//Zero-East
console.log("South or North? "+course_22[5]);//Zero-South
console.log("Only Course: "+convert.bin2dec(course_22.slice(6,course_22.length))+" degree(s)"); //converting to decimal

console.log("ACC: "+convert.hex2dec(raw_data_22.slice(60,62))); //After MCC,MNC,LAC,Cell-ID
console.log("Mileage: "+convert.hex2dec(raw_data_22.slice(66,68))); //After Data Upload Mode,GPS Real-Time Re-upload
console.log("====================================");


//Protocol-26 (Alarm-UTC)
let dataWithHwId_26 = "03589791000159847878252612030C063816C3026C10540C38C9700144030901CC002866000EEE0C06040302000DA2DB0D0A";

  //followed by Concox-JAVA (PacketreaderVR)
  let raw_data_26 = dataWithHwId_26.slice(16,dataWithHwId_26.length);//withoutHID
  console.log("====================================");
  console.log("Raw Data-26: "+raw_data_26);
  console.log("Protocol: "+raw_data_26.slice(6,8));

  //according to documentation
console.log("Year: "+convert.hex2dec(raw_data_26.slice(8,10))+" Month: "+convert.hex2dec(raw_data_26.slice(10,12))+" Date: "+convert.hex2dec(raw_data_26.slice(12,14)));
console.log("Hour: "+convert.hex2dec(raw_data_26.slice(14,16))+" Minute: "+convert.hex2dec(raw_data_26.slice(16,18))+" Second: "+convert.hex2dec(raw_data_26.slice(18,20)));
console.log("GPS: "+convert.hex2dec(raw_data_26.slice(21,22))); //1-bit(2nd) -> available GPS
console.log("Lat: "+convert.hex2dec(raw_data_26.slice(22,30))/1800000); //decimal devided by 1800000
console.log("Lon: "+convert.hex2dec(raw_data_26.slice(30,38))/1800000); //decimal devided by 1800000
console.log("Speed: "+convert.hex2dec(raw_data_26.slice(38,40)));

let course_26 = convert.hex2bin(raw_data_26.slice(40,44));//ignoring prefix (0)
if(course_26.length<16){
  const diff = 16 - course_26.length; //find out missing zero(s)
  for(let i=0;i<diff;i++) // adding Zero(s)
  course_26='0'+course_26;
}
console.log("Total Course: "+course_26); //course and status
console.log("Real-time or Differential? "+course_26[2]);
console.log("GPS positioned or not? "+course_26[3]);
console.log("East or West?"+course_26[4]);//Zero-East
console.log("South or North? "+course_26[5]);//Zero-South
console.log("Only Course: "+convert.bin2dec(course_26.slice(6,course_26.length))+" degree(s)"); //converting to decimal
//Difference from Here
let terminal_info_26 = convert.hex2bin(raw_data_26.slice(62,64));//ignoring prefix (0)
if(terminal_info_26.length<8){
  const diff = 16 - terminal_info_26.length; //find out missing zero(s)
  for(let i=0;i<diff;i++) // adding Zero(s)
  terminal_info_26='0'+terminal_info_26;
}
console.log("Terminal Info: "+terminal_info_26);
console.log("Oil and electricity connected or not? "+terminal_info_26[0]);
console.log("GPS tracking is on or off? "+terminal_info_26[1]);
let condition = terminal_info_26[2]+terminal_info_26[3]+terminal_info_26[4];
console.log("Low Battery or Normal? "+condition); //000  for Normal
console.log("Charging or Not? "+terminal_info_26[5]);
console.log("ACC Status: "+terminal_info_26[6]);
console.log("Defence active or not? "+terminal_info_26[7]);


console.log("Battery Voltage: "+raw_data_26.slice(64,66)); //Value Range (0-6)
console.log("GSM Strength: "+raw_data_26.slice(66,68)); //Value Range(0-4)
console.log("ALarm Language: "+raw_data_26.slice(68,70)); //first byte for Alarm type AND second byte for Language (Ex-03 for vibration alarm)

console.log("====================================");