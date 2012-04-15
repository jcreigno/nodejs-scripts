var vows = require('vows'),
    assert = require('assert'),
    Extractor = require('../lib/Extractor');
    
vows.describe('Extractor').addBatch({
    'Extractor object : ':{
        topic: new Extractor(),
        'as matches method :' : function(e){
            assert.ok(e.matches);
        },
        'as start method :' : function(e){
            assert.ok(e.start);
        }
    }
}).addBatch({
    'Extractor object with accumulator : ':{
        topic: new Extractor({myvar:0}),
        'as matches method :' : function(e){
            assert.ok(e.matches);
        },
        'as start method :' : function(e){
            assert.ok(e.start);
        }
    }
}).export(module);
