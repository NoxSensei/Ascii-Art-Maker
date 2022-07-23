const fs = require('fs');

var fileName = process.argv[2]

const text = "/* eslint-disable */\n";
var data = fs.readFileSync(fileName); //read existing contents into data
var fd = fs.openSync(fileName, 'w+');
fs.writeSync(fd, Buffer.from(text), 0, text.length, 0);
fs.writeSync(fd, data, 0, data.length, text.length);
fs.close(fd);

console.log("Disabled");
