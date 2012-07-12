var Client = require('./json-rpc'), util = require('util');

//var cli = new Client('wse1162.maafprod.e-corail.com','/trac/framework/jsonrpc');
var cli = Client('www.freenet.org.nz','/dojo/pyjson/jsonrpctest.cgi');

cli.call("pow",[2,3],function(err,data){
    console.log(data);
});

