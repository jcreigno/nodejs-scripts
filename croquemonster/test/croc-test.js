var vows = require('vows'),
    assert = require('assert');

var croc = require('../lib/croc').croc;


vows.describe('Evaluation des contrats croqmonstre').addBatch({
    'un contrat difficulty 24': {
        topic: function(){return croc.estimate({'sadism':29,'ugliness':23,'power':28,'greediness':13,'control':13}, 
            {'sadism':6,'ugliness':0,'power':0,'greediness':22,'difficulty':24});},
        'est estimé à 31%': function (estim) {
            assert.equal (estim, 31);
        }
    },
    'un contrat difficulty 23': {
        topic: function(){return croc.estimate({'sadism':29,'ugliness':23,'power':28,'greediness':13,'control':13}, 
            {'sadism':0,'ugliness':19,'power':18,'greediness':17,'difficulty':23});},
        'est estimé à 55%': function (estim) {
            assert.equal (estim.toFixed(), 55);
        }
    },
    'un contrat difficulty 26': {
        topic: function(){return croc.estimate({'sadism':21,'ugliness':20,'power':21,'greediness':21,'control':13}, 
            {'sadism':9,'ugliness':11,'power':16,'greediness':14,'difficulty':26});},
        'est estimé à 99%': function (estim) {
            assert.equal (estim.toFixed(), 99);
        }
    },
    'un contrat complet de difficulty 29': {
        topic: function(){return croc.estimate({'sadism':30,'ugliness':24,'power':28,'greediness':12,'control':15}, 
            {
                city:'Minneapolis',
                power:'22',
                kind: '3',
                difficulty:'29',
                accepted:'false',
                prize:'5294',
                name:'Anthony',
                ugliness:'17',
                countdown:'22520',
                id:'929104117',
                greediness: '0',
                age:'10',
                sex:'0',
                timezone:'-6',
                sadism:'23',
                country:'Etats-Unis'
            });},
        'est estimé à 55%': function (estim) {
            assert.equal (estim.toFixed(), 55);
        }
    }
}).export(module); // Export the Suite
