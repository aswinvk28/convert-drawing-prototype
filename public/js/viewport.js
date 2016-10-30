/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var _WORKSPACE = _WORKSPACE || {};
var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};

_WORKSPACE.viewPort = function(params, channel) {
    var instance = this;
    this.channel = {};
    if(!channel) {
        this.channel['document'] = new _DOCUMENT.channel('document', new _DOCUMENT.dataTransfer(params[0], params[1]['document']));
        this.channel['metadata'] = new _DOCUMENT.channel('metadata', new _DOCUMENT.dataTransfer(params[0], params[1]['metadata']));
        this.channel['space'] = new _DOCUMENT.channel('space', new _DOCUMENT.dataTransfer(params[0], params[1]['space']));
        this.channel['temp'] = new _DOCUMENT.channel('temp', new _DOCUMENT.dataTransfer(params[0], params[1]['temp']));
    } else {
        this.channel[channel.name] = channel;
    }
    this.preLayout = _WORKSPACE.PRELAYOUT;
    var viewPort = function(params) {
        
    };
    
    this.document = (new _WORKSPACE.rowObject()).pushObject(params[1]['document']);
    this.metadata = (new _WORKSPACE.rowObject()).pushObject(params[1]['metadata']);
    this.export = (new _WORKSPACE.rowObject()).pushObject(params[1]['export']);
    this.space = (new _WORKSPACE.rowObject()).pushObject(params[1]['space']);
    this.temp = (new _WORKSPACE.rowObject()).pushObject(params[1]['temp']);
    
    this.metadata.appendRow(this.document).appendRow(this.space).appendRow(this.export);
    this.metadata.prependRow(this.export);
    
    this.constructor = viewPort;
    
    this.getDimensions = function() {
        return [this.preLayout.screenWidth, this.preLayout.screenHeight];
    };
};

_WORKSPACE.viewPort.prototype = {
    setMetadataForChannel: function(name, metadata) {
        this.channel[name][this.channel[name].key].setMetadata(metadata);
    },
    getChannel: function(name) {
        return this.channel[name];
    }
}