
var http = require('http'),
    _ = require('underscore')._,
    croc = require('./croc').croc,
    sax = require('sax');

/** Connection to croquemonter API */
var headers = {
  'Host'    : "www.croquemonster.com"
};

/** Croquemonter API client */
var crocClient = http.createClient(80, "www.croquemonster.com");

/**
 * CroqueMonster constructor
 * @constructor
 */
var CroqueMonster = exports.CroqueMonster = function(agency,api){
    this.agency = agency;
    this.api = api;
};

function callCroc(resource,handler){
    var request = crocClient.request("GET", resource, headers);
    request.on('response', function (response) {
        if(response.statusCode != 200) {console.log('STATUS: ' + response.statusCode);}
        response.setEncoding('utf8');
        var str = "";
        response.on('data', function (chunk) {
            str+= chunk;
        });
        response.on('end', function () {
            handler(null,str);
        });
        response.on('error', function (e) {
            handler(e,null);
        });
    });
    request.end();
}

function wrapHandler (tagName, handler){
    return function(err,str){
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
 * @api private
 */
 
CroqueMonster.prototype.croc = function(resource,handler){
   callCroc(resource+ "?name=" + this.agency + ";pass=" + this.api, handler);
};

/**
 * récupère la liste des monstres
 * @api public
 */
 
CroqueMonster.prototype.monsters = function(handler){
    this.croc('/api/monsters.xml', wrapHandler('monster',handler));
};

/**
 * récupère la liste des contrats
 * @api public
 */
CroqueMonster.prototype.contracts = function(handler){
    this.croc('/api/contracts.xml', wrapHandler('contract',handler));
};


/**
 * récupère la liste des contrats
 * @api public
 */
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

