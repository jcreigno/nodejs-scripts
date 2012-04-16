var util = require('util'), 
    extractor = require('../lib/main.js'),
    fs = require('fs');

var s = fs.createReadStream(__dirname + '/sample.csv',{});
var ac = {};
ac.count = 0;
extractor(ac).matches(/;(?!(?:[^",]|[^"],[^"])+")/,function(m,vars){
    console.log(m);
    vars.count ++;
}).on('end',function(){
    console.log(ac.count + ' matches found.');
}).start(s);


