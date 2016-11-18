/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var _WORKSPACE = _WORKSPACE || {};
var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};
var _DRAWING = _DRAWING || {};
var _DOCUMENT = _DOCUMENT || {};

_DOCUMENT.nodeLink = function(src, dest, reverse) {
    this.reverse = !reverse ? false : true;
    this.src = src;
    this.dest = dest;
};

_DOCUMENT.nodeLink.prototype = {
    setMetadata: function(metadata) {
        this.metadata = metadata;
        return this;
    },
    getMetadata: function(absolute) {
        if(absolute !== true) {
            var metadata = new _WORKSPACE.metadata({}, this.dest);
            return metadata;
        }
        return this.metadata;
    },
    /** based on backup of data, dest - master and src - slave */
    switch: function(context, processType) {
        var src = this.src;
        this.src = this.dest;
        this.dest = src;
        if(!this.reverse) {
            this.reverse = true;
        } else {
            this.reverse = false;
        }
        context._init();
        return this;
    }
};

_DOCUMENT.dataTransfer = function(src, dest, reverse) {
    this.parent.call(this, src, dest, reverse);
};

_DOCUMENT.dataTransfer.prototype = {
    setData: function(data) {
        this.data = data;
        return this;
    },
    transferData: function() {
        if(this.reverse) {
            
        } else {
            
        }
    }
};

_DOCUMENT.dataTransfer = _DOCUMENT.extend(_DOCUMENT.dataTransfer, _DOCUMENT.nodeLink);

_DOCUMENT.channel = function(name, object) {
    this.name = name;
    object.channel = this;
    if(object instanceof _DOCUMENT.dataTransfer) {
        this.dataTransfer = object;
        this.key = 'dataTransfer';
    } else if(object instanceof _DOCUMENT.nodeLink) {
        this.node = object;
        this.key = 'node';
    } else if(object instanceof _WORKSPACE.activity) {
        this.activity = object;
        this.key = 'activity';
    }
};

_DOCUMENT.channel.prototype = {
    changeContext: function() {
        
    }
};