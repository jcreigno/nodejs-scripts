file-extractor
=========

> Extract data from files with regular expressions.

introduction
------------
Extractor scans file line by line. Registred callbacks are notified when a patterm matches current line.

synopsis
--------
Start extracting stdin :

```javascript
    var extractor = require('file-extractor');

    extractor().matches(/;(?!(?:[^",]|[^"],[^"])+")/,function(m){
        console.log(m);
    }).start();
```  
Using multiple patterns :

```javascript
    var extractor = require('file-extractor');

    extractor()
        .matches(/regex1/, cb1)
        .matches(/regex2/, cb2)
        .matches(/regex3/, cb3).start();
```  


installation
------------

    $ npm install file-extractor

API
===

extractor(ac={})
----------------
The constructor function creates a new `extractor`. Optionnaly pass an accumulator as parameters.


.matches(regex, callback)
--------------------------
Register a new matching pattern and corresponding callback. Each match is notified using call back. 

* First callback parameter is regex.exec result.
* Second parameter is the accumulator object.

Return value is `this` to enable method chaining.

.start(readableStream=process.stdin)
------------------------------------
Start scanning stream and notify callbacks.

Events
======

'end'
-----
Sent when end of stream is reached.

