var util = require('util'),
    colors = require('colors'),
    CroqueMonster = require('./CroqueMonster').CroqueMonster,
    _ = require('underscore')._,
    Seq = require('seq');


String.prototype.rightpad = function (len, char){
    if(this.length >= len){
        return this;
    }
    return this + new Array(len + 1 - this.length).join(char||' ');
};

String.prototype.abbrev = function (len, char){
    if(this.length <= len){
        return this;
    }
    return this.substring(0,len-1) + (char||'.');
};

function afficherMonstres(mons){
  var sum = _(mons).chain()
    .select(function(m){return !m.contract;})
    .reduce(function(memo, num){ return memo + 1; }, 0).value();
  console.log(sum + ' monstres disponibles');
}

function afficherContratsInfernaux(cs){
  var sum = _(cs).chain()
    .select(function(c){return c.kind === 5;})
    .reduce(function(memo, num){ return memo + 1; }, 0).value();
  console.log(sum + ' contrat infernal');
}

// Command line args
var USERNAME = process.argv[2];
var APIKEY = process.argv[3];

if (!USERNAME || !APIKEY) {
  return console.log("Usage: node croquemonster.js <croc_username> <croc_apikey>");
}

var croc = new CroqueMonster(USERNAME, APIKEY);
Seq([croc])
    .par(function(croqmonstre) { croqmonstre.listMonsters(this) })
    .par(function(croqmonstre) { croqmonstre.listContracts(this) })
    .seq(function(monsters, contracts){
        afficherMonstres(monsters);
        afficherContratsInfernaux(contracts);

        _(croc.affecter(monsters, contracts, {'treshold':89,'min':4500})).each(function(aff){
            console.log(
                aff.contract.name.rightpad(6).abbrev(6).green
                + ' ('+aff.gain.toFixed()+') '
                + aff.monster.name.rightpad(8).abbrev(8).red + ' '
                + aff.estimation.toFixed().toString().rightpad(3) 
                + '% http://www.croquemonster.com/contract?cid='+aff.contract.id+';mid='+aff.monster.id);
        });
    });



