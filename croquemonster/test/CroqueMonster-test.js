var vows = require('vows'),
    util = require('util'),
    assert = require('assert');

var CroqueMonster = require('../CroqueMonster').CroqueMonster;


vows.describe('Création d\'un objet CroqueMonster').addBatch({
    'On crée un objet CroqueMonster bidon,': {
        topic: new CroqueMonster('a','b'),
        'l\'objet est bien créé': function (estim) {
            assert.ok(estim);
        },
        'Il contient les bonnes valeurs de paramétres': function (estim) {
            assert.equal(estim.agency, 'a');
            assert.equal(estim.api, 'b');
        },
        'Il contient un méthode monsters': function (estim) {
           assert.ok(estim.monsters);
        },
        'Il contient un méthode contracts': function (estim) {
           assert.ok(estim.contracts);
        },
        'on appelle la méthode monsters :': {
            topic: function(croc) { croc.monsters(this.callback)},
            'on récupère un resultat vide' : function(err, res){
                assert.ok(res);
                assert.equal(res.length,0);
            }
        },
        'on appelle la méthode contracts :': {
            topic: function(croc) { croc.monsters(this.callback)},
            'on récupère un resultat vide' : function(err, res){
                assert.ok(res);
                assert.equal(res.length,0);
            }
        },
    }
}).export(module); // Export the Suite
