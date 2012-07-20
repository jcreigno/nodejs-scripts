var jsonrpc = require('./json-rpc'), util = require('util');

//var cli = new Client('wse1162.maafprod.e-corail.com','/trac/framework/jsonrpc');
var cli = jsonrpc('http://xp-dev.com/trac/devianne/rpc');

cli.callRpc('system.getAPIVersion',[],function(err,res,body){
    if(err){
        console.log(err);
    }
    console.log(body);
});
cli.on('ready',function(p){
    console.log(util.inspect(p));
});
cli.proxy();

