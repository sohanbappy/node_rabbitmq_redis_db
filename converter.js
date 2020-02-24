
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


let dataWithHwId = "0358979100015984787822221402160B2027C7028BBDF709B38C840014EF01D601523500B505010000000736970D0A";
let bytes = [];
//converter for String to Byte Array
String.prototype.getBytes = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
      bytes.push(this.charCodeAt(i));
    }
    return bytes;
  };

  //followed by Concox-JAVA (PacketreaderVR)
  bytes = dataWithHwId.getBytes();
  let raw_data = bytes.slice(8,bytes.length);
  console.log("Raw Data: "+raw_data);
  console.log(bytes[30]); //Byte  (ex-48) (In Java-> databytes[30])
  const convert = {
    bin2dec : s => parseInt(s, 2).toString(10),
    bin2hex : s => parseInt(s, 2).toString(16),
    dec2bin : s => parseInt(s, 10).toString(2),
    dec2hex : s => parseInt(s, 10).toString(16),
    hex2bin : s => parseInt(s, 16).toString(2),
    hex2dec : s => parseInt(s, 16).toString(10)
  };
  let hexValue = convert.dec2hex(bytes[30]);  //Hex (ex-30) (In Java-> String.format("%02X", databytes[30]))
  console.log(hexValue);



