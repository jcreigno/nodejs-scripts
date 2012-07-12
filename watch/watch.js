var fs = require('fs')
    , walk = require('walkdir')
    , _ = require('underscore')
    , cp = require('child_process');

var re = new RegExp(process.argv[3]);///less\/.*\.less$/;
var command = process.argv[2];//'make';
var paths = walk.sync('.');
_.chain(paths).filter(function(path){ return re.test(path);})
    .each(function(path) {
        //console.log('watching '+path);
        fs.watchFile(path,{ persistent: true, interval: 1007},function(curr,prev){
            console.log(path + ' modified : sending ' + command);
            cp.exec(command, function (error, stdout, stderr) {
              var t2 = Date.now();
              if (error) {
                console.log('failed to exec: %s', command);
                if (error.msg) { console.log(error.msg); }
                if (stderr) { console.log(stderr); } 
                return;
              }
              console.log(command + ' : done.');
            });
        });
    });
