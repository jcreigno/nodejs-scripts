
var _ = require('underscore')._,
    croc = require('./croc').croc,
    sax = require('sax'),
    request = require('request');

/**
 * == Constants ==
 *
 * host = 'http://www.croquemonster.com'
**/

var host = 'http://www.croquemonster.com';


/** 
 * class CroqueMonster
**/

/**
 * new CroqueMonster(agency, key)
 * - a (String) : agency name
 * - key (String) : api key
 *
 **/
var CroqueMonster = exports.CroqueMonster = function(a,key){

    function wrapHandler (tagName, handler){
        return function(err,res,str){
            if(err){
                handler(err);
                return;
            }
            var parser = sax.parser(true);
            var coll = [];
            parser.onopentag = function (node) {
                if(node.name === tagName){
                    coll.push(node.attributes);
                }
            };
            parser.write(str).close();
            handler(null,coll);
        };
    }

    function buildurl(resource,agency,api) {
        return { url : host + resource, qs:{name:agency,pass:api}};
    }

    return {
        agency:a,
        api:key,
        listMonsters: function(handler){
            request(buildurl('/api/monsters.xml',this.agency,this.api), wrapHandler('monster',handler));
        },
        listContracts: function(handler){
            request(buildurl('/api/contracts.xml',this.agency,this.api), wrapHandler('contract',handler));
        },
        affecter: function(monsters, contracts, options){
            //console.log('monsters : '+monsters.length + ' contract : '+contracts.length);
            var result = [];
            _(monsters).chain()
                .select(function(m){return !m.contract;})
                .each(function(m){
                    var finRepos = m.fatigue * 3600;
                    var max = 0;
                    var aff;
                    _(contracts).chain()
                        .select(function(c){
                            var dispo = !c.monster || !c.accepted;
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
        }
    };
};

