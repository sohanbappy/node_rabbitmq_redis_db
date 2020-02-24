
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

let dataWithHwId = "0358979100015984787822221402160B2027C7028BBDF709B38C840014EF01D601523500B505010000000736970D0A";
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
  let h_id = dataWithHwId.slice(0,16);
  let raw_data = dataWithHwId.slice(16,dataWithHwId.length);//withoutHID
  console.log("HID: "+h_id);
  console.log("Raw Data: "+raw_data);
  console.log("Protocol: "+raw_data.slice(6,8));
  const convert = {
    bin2dec : s => parseInt(s, 2).toString(10),
    bin2hex : s => parseInt(s, 2).toString(16),
    dec2bin : s => parseInt(s, 10).toString(2),
    dec2hex : s => parseInt(s, 10).toString(16),
    hex2bin : s => parseInt(s, 16).toString(2),
    hex2dec : s => parseInt(s, 16).toString(10)
  };
  //according to documentation
console.log("Year: "+convert.hex2dec(raw_data.slice(8,10))+" Month: "+convert.hex2dec(raw_data.slice(10,12))+" Date: "+convert.hex2dec(raw_data.slice(12,14)));
console.log("Hour: "+convert.hex2dec(raw_data.slice(14,16))+" Minute: "+convert.hex2dec(raw_data.slice(16,18))+" Second: "+convert.hex2dec(raw_data.slice(18,20)));
console.log("GPS: "+convert.hex2dec(raw_data.slice(21,22))); //1-bit(2nd) -> available GPS
console.log("GPS: "+convert.hex2dec(raw_data.slice(21,22))); //1-bit(2nd) -> available GPS
console.log("Lat: "+convert.hex2dec(raw_data.slice(22,30))/1800000); //decimal devided by 1800000
console.log("Lon: "+convert.hex2dec(raw_data.slice(30,38))/1800000); //decimal devided by 1800000
console.log("Speed: "+convert.hex2dec(raw_data.slice(38,40)));

let course = convert.hex2bin(raw_data.slice(40,44));//ignoring prefix (0)
if(course.length<16){
  const diff = 16 - course.length; //find out missing zero(s)
  for(let i=0;i<diff;i++) // adding Zero(s)
  course='0'+course;
}
console.log("Total Course: "+course); //course and status
console.log("Real-time or Differential? "+course[2]);
console.log("GPS positioned or not? "+course[3]);
console.log("East or West?"+course[4]);//Zero-East
console.log("South or North? "+course[5]);//Zero-South
console.log("Only Course: "+convert.bin2dec(course.slice(6,course.length))+" degree(s)"); //converting to decimal

console.log("ACC: "+convert.hex2dec(raw_data.slice(60,62))); //After MCC,MNC,LAC,Cell-ID
console.log("Mileage: "+convert.hex2dec(raw_data.slice(66,68))); //After Data Upload Mode,GPS Real-Time Re-upload
