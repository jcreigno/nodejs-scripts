var util = require('util'), 
    extractor = require('../lib/main.js'),
    fs = require('fs');

//var s = fs.createReadStream('./sample.csv',{});

extractor().matches(/;(?!(?:[^",]|[^"],[^"])+")/,function(m){console.log(m)}).start();
