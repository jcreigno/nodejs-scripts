var fs = require('fs'), util = require('util');
var EventEmitter = require('events').EventEmitter;
var carrier = require('carrier');

function Extractor(ac) {
    EventEmitter.call(this);
    this.matchers = [];
    this.vars = ac || {};
}
util.inherits(Extractor, EventEmitter);
module.exports = Extractor;

Extractor.prototype.matches = function(regexp,cb){
    this.matchers.push({re:regexp,callback:cb});
    return this;
};

Extractor.prototype.start = function(stream){
    var self = this;
    if(!stream){
        stream = process.stdin;
        stream.resume();
    }
    var car = carrier.carry(stream);
    car.on('end', function(data){ 
        self.emit('end', data);
    });
    car.on('line',  function(line) {
        for(i=0;i<self.matchers.length;i++){
            var matcher = self.matchers[i];
            var m = matcher.re.exec(line);
            if(m && matcher.callback){
                matcher.callback(m, self.vars);
                break;
            }
        }
    });
    return self;
};
