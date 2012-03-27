
var http = require('http'),
    _ = require('underscore')._,
    croc = require('./croc').croc,
    sax = require('sax'),
    request = require('request');

/**
 * == Constants ==
 *
 * Http host headers.
**/

var host = 'http://www.croquemonster.com';


/** section: CroqueMonster
 * Constructor
**/

var CroqueMonster = exports.CroqueMonster = function(agency,api){
    this.agency = agency;
    this.api = api;
};

function wrapHandler (tagName, handler){
    return function(err,res,str){
        var parser = sax.parser(true);
        var coll = [];
        parser.onopentag = function (node) {
            if(node.name == tagName){
                coll.push(node.attributes);
            }
        };
        parser.write(str).close();
        handler(null,coll);
    };
}

/**
 * CroqueMonster.croc([resource],[handler]) -> undefined
 * - resource (String): remote resource name
 * - handler (Function): callback handler
 **/
CroqueMonster.prototype.croc = function(resource,handler){
    request(host + resource + "?name=" + this.agency + ";pass=" + this.api, handler);
};

/** section: CroqueMonster
 * CroqueMonster.monsters([handler]) -> undefined
 * - handler (Function): callback handler
 * récupère la liste des monstres
 * @api public
 **/
CroqueMonster.prototype.monsters = function(handler){
    this.croc('/api/monsters.xml', wrapHandler('monster',handler));
};

/**
 * CroqueMonster.contracts([resource],[handler]) -> undefined
 * - handler (Function): callback handler
 * récupère la liste des contrats
 * @api public
 **/
CroqueMonster.prototype.contracts = function(handler){
    this.croc('/api/contracts.xml', wrapHandler('contract',handler));
};


/** 
 * CroqueMonster.affecter([monsters],[contracts],[options]) -> undefined
 * - monsters (Array): monsters
 * - contracts (Array): contracts
 * - options (Object): options
 *
 * Affecte les monstres à des contrats.
 **/
CroqueMonster.prototype.affecter = function(monsters, contracts, options){
    var result = [];
    _(monsters).chain()
        .select(function(m){return m.contract == null;})
        .each(function(m){
            var finRepos = m.fatigue * 3600;
            var max = 0;
            var aff;
            _(contracts).chain()
                .select(function(c){
                    var dispo = c.monster == null || !c.accepted;
                    return dispo && (finRepos < c.countdown);
                })
                .each(function(c){
                    est = croc.estimate(m, c);
                    if (est > options.treshold) {
                        var gain = est * c.prize / 100;
                        if((gain-m.bounty)>= options.min && gain>max){
                            max=gain;
                            aff = {'monster':m,'contract':c,'estimation':est,'gain':gain-m.bounty};
                        }
                    }
                });
            if(aff){
                result.push(aff);
                aff.contract.monster = aff.monster;
            }
        });
    return result;
};

