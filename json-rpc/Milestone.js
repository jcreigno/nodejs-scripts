

function Milestone(comp, v){
  this.component = comp;
  this.version = v;
}

module.exports = Milestone;

Milestone.prototype.toString = function(){
  return this.component + '-' + this.version;
};

Milestone.parse = function(str){
  var splited = str.split('-');
  if(!splited){
    return null;
  }
  var version = splited.pop();
  var component =  splited.join('-');
  return new Milestone(component, version);
};

Milestone.prototype.next = function(){
  var nextversion = this.version.split('.');
  nextversion.push((nextversion.pop()|0) + 1);
  return new Milestone(this.component, nextversion.join('.'));
};
