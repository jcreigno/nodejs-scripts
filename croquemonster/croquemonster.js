
var http = require('http');
var util = require('util');
var colors = require('./colours');
var CroqueMonster = require('./CroqueMonster').CroqueMonster;
var _ = require('underscore')._;

// Command line args
var USERNAME = process.argv[2];
var APIKEY = process.argv[3];

if (!USERNAME || !APIKEY)
  return console.log("Usage: node croquemonster.js <croc_username> <croc_apikey>");

//var RESOURCES = ['contracts.xml','monsters.xml','portails.xml'];
var monsters = [];
var contracts = [];

var croqmonstre = new CroqueMonster(USERNAME, APIKEY);

croqmonstre.monsters(function(err,coll){
    monsters = coll;
    afficherMonstres(coll);
});

croqmonstre.contracts(function(err,coll){
    contracts = coll;
    afficherContratsInfernaux(coll);
    _(croqmonstre.affecter(monsters,contracts,{'treshold':89,'min':4500})).each(function(aff){
        console.log(
            colours.green+aff.contract.name.rightpad(6).abbrev(6)
            +colours.reset+' ('+aff.gain.toFixed()+') '
            +colours.red+aff.monster.name.rightpad(8).abbrev(8) +' '
            +colours.reset+ aff.estimation.toFixed().toString().rightpad(3) 
            + '% http://www.croquemonster.com/contract?cid='+aff.contract.id+';mid='+aff.monster.id);
    });
});


String.prototype.rightpad = function (len, char){ 
    if(this.length >= len){
        return this;
    }
    return this + Array(len + 1 - this.length).join(char||' ');
}
String.prototype.abbrev = function (len, char){ 
    if(this.length <= len){
        return this;
    }
    return this.substring(0,len-1) + (char||'.');
}


function affecterSimple(){
  console.log(monsters[0].name +' - '+contracts[0].name+' : '+estimate(monsters[0], contracts[0]) +'%');
}


function afficherMonstres(mons){
  var sum = _(mons).chain()
    .select(function(m){return m.contract == null;})
    .reduce(function(memo, num){ return memo + 1; }, 0).value();
  console.log(sum + ' monstres disponibles');
}

function afficherContratsInfernaux(cs){
  var sum = _(cs).chain()
    .select(function(c){return c.kind == 5;})
    .reduce(function(memo, num){ return memo + 1; }, 0).value();
  console.log(sum + ' contrat infernal');
}


