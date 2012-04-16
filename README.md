Extractor
=========

> Extract data from files with regular expressions.

introduction
------------
Extractor scans file line by line. Registred callbacks are notified when a patterm matches current line.

synopsis
--------

    var Extractor = require('Extractor');

    new Extractor().matches(/;(?!(?:[^",]|[^"],[^"])+")/,function(m){
        console.log(m);
    }).start();
    
installation
------------

    $ npm install extractor

