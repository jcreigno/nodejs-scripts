var jsonrpc = require('trac-jsonrpc-client')
  , Seq = require('seq')
  , Milestone = require('./Milestone');

var cli = new jsonrpc('http://wse1162.maafprod.e-corail.com/trac/puma/login/rpc',{
    auth:{username:'user',password:'pass'}
});

var milestonename = process.argv[2];
if(!milestonename){
    console.log('provide a milestone name');
    return -1;
}
var milestone = Milestone.parse(milestonename); 
if(!milestone){
    console.log('unable to parse milestone %s', milestonename);
    return -1;
}
console.log('releasing %s', milestone.asString());

var nextmilestone = milestone.next();

console.log('next version is %s', nextmilestone.asString());

Seq()
    .seq('proxy', function(){
        cli.proxy(this);
    })
    .seq('milestone', function(p){
        p.ticket.milestone.get(milestone.asString(), this);
    })
    .seq(function(milestone){ //create future milestone
        var due = new Date();
        due.setMonth((due.getMonth() + 1) % 11);
        var next = { due: { __jsonclass__: [ 'datetime', due.toISOString() ] }};
        this.vars.proxy.ticket.milestone.create(nextmilestone.asString(), next, this);
    })
    .seq('activetickets', function(p){ // get active tickets
        this.vars.proxy.ticket.query('status!=closed&milestone=' + milestone.asString(), this);
    })
    .flatten()
    .forEach(function(num){ // move active tickets
      this.vars.proxy.ticket.update(num, 'ticket déplacé depuis la milestone '+ milestone.asString(),{
        'milestone': nextmilestone.asString()
      },false, 'a014739',{ __jsonclass__: [ 'datetime', new Date().toISOString() ] },this);
    })
    .par(function(){ //create version
        this.vars.proxy.ticket.version.create(milestone.asString(),{
          time:{ __jsonclass__: [ 'datetime', new Date().toISOString() ] },
          description: 'version ' + milestone.version 
              + ' pour ' + milestone.component 
        },this);
    }).par(function(){ //close milestone
        this.vars.proxy.ticket.milestone.update(milestone.asString(),{
          completed:{ __jsonclass__: [ 'datetime', new Date().toISOString() ] }
        },this);
    });
