var fs = require('fs'), util = require('util');
var EventEmitter = require('events').EventEmitter;
var carrier = require('carrier');

function Extractor(options) {
    EventEmitter.call(this);
    this.matchers = [];
}
util.inherits(Extractor, EventEmitter);
module.exports = Extractor;

Extractor.prototype.matches = function(regexp,cb){
    this.matchers.push({re:regexp,callback:cb});
    return this;
};

Extractor.prototype.start = function(stream){
    var self = this;
    var car = carrier.carry(stream);
    car.on('line',  function(line) {
        for(i=0;i<self.matchers.length;i++){
            var matcher = self.matchers[i];
            var m = matcher.re.exec(line);
            if(m && matcher.callback){
                matcher.callback(m);
                break;
            }
        }
    });
    return self;
};
