var http = require('http'), util = require('util'), events = require('events');
function Client (host, path, port){
	var self = this;
	self.server = {'port': port||80, 'host':host, 'path':path||'/'},
		
	self.call = function(method,params,callback){
		
		httpResult(self.server,{'method':method,'params':params,'id':new Date().getTime()},callback);
	}
	
	self.proxy = function(){
		self.call('system.listMethods',[], function (err, data){
				if(err || !data || !data.result){
					console.log('unable to build proxy '+err);
                    self.emit('error', err);
					return;
				}
				data.result.forEach(function (method){
					var fn = (function(method){ return function (){
						var params = Array.prototype.slice.call(arguments),
							cb = params.length && typeof params[params.length-1] =="function" && params.pop();
						return self.call(method,params,function(err,data){ 
							if(data){
								cb(data.err,data.result);
							}else{
								cb(err,null);
							}
						});
					}})(method);
					if(method.indexOf('.') == -1){
						self[method] = fn;
					}else{
						curr = self;
						var parts = method.split('.');
						for(i =0 ;i<parts.length-1;i++){
							var part = parts[i];
							if(!curr[part]){
								curr[part] = {};
							}
							curr = curr[part];
						}
						curr[parts.pop()]=fn;
					}
				});
				self.emit('ready', self);
			}
		);
	}
	self.proxy();

	
	function httpResult(server,callinfo,responseHandler){
		var client = http.createClient(server.port||80, server.host);
		//console.log('url : ' + util.inspect(server));
		var headers = {'host':server.host,'Content-Type':'application/json'};
		var params = JSON.stringify(callinfo);
		headers["Content-Length"] = params.length;
		var request = client.request('POST', server.path || '/', headers);
		//console.log(params);
		request.write(params);
		request.on('response', function (response) {
		  //console.log('STATUS: ' + response.statusCode);
		  if(response.statusCode != 200){
			responseHandler({'error':response.statusCode},null);
		  }	
		  response.setEncoding('utf8');
		  var data = '';
		  response.on('data', function (chunk) {
			data +=chunk;
		  });
		  response.on('end', function () {
			responseHandler(null,JSON.parse(data));
		  });
		});
		request.end();
	}
}
util.inherits(Client, events.EventEmitter);
module.exports = Client;
