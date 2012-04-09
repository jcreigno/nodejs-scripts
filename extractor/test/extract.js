var util = require('util'), 
    Extractor = require('./lib/Extractor'),
    fs = require('fs');

var readstream = fs.createReadStream('./sample.csv',{});

new Extractor().matches(/;(?!(?:[^",]|[^"],[^"])+")/,function(m){console.log(m)}).start(readstream);
