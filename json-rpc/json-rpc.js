var http = require('http'), util = require('util'), EventEmitter = require('events').EventEmitter,request = require('request');
function jsonrpc (url){
    EventEmitter.call(this);
	var self = this;
    self.request = request.defaults({'url' : url, json:true});
}
util.inherits(jsonrpc, EventEmitter);
module.exports = function(u){
    return new jsonrpc(u);
};;

jsonrpc.prototype.callRpc = function(method,params,callback){		
	this.request.post({body:JSON.stringify({'method':method,'params':params,'id':new Date().getTime()})},callback);
};

jsonrpc.prototype.proxy = function(){
    var self = this;
	self.callRpc('system.listMethods',[], function (err, res, data){
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
};
