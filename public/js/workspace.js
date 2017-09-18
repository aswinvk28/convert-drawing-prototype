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

_DOCUMENT.extend = function(child, parent) {
    child.prototype = jQuery.extend(parent.prototype, child.prototype)
    function descendant() {
        this.parent = parent;
        child.apply(this, arguments);
        return this;
    }
    descendant.prototype = {};
    descendant.prototype = jQuery.extend(descendant.prototype, child.prototype);
    descendant.prototype["definition"] = descendant;
    return descendant;
};

_WORKSPACE.extend = function(child, params) {
    this.constructor = child.constructor;
    this._init.apply(child, params);
    return child;
};

_WORKSPACE.extend.prototype = {
    _init: function() {
        if(!!this.parent && this.parent.prototype.hasOwnProperty('_init')) {
            this.parent.prototype._init.apply(this, arguments);
        }
        this.constructor.apply(this, arguments);
    }
};

CONVERTDRAWING.base = {
    viewPort: function() {
        return _DRAWING.UI;
    },
    tempChannel: function() {
        return _DRAWING.UI.channel['temp'];
    },
    documentChannel: function() {
        return _DRAWING.UI.channel['document'];
    },
    metadataChannel: function() {
        return _DRAWING.UI.channel['metadata'];
    },
    viewContext: function() {
        return _DRAWING.UI.canvasObject.dom.getContext("2d");
    },
    uiContext: function() {
        return _DRAWING.UI.canvasObject.dom.getContext("2d");
    },
    documentContext: function() {
        return _DRAWING.UI.document.rowSet[0].dom.getContext("2d");
    },
    metadataContext: function() {
        return _DRAWING.UI.metadata.rowSet[0].dom.getContext("2d");
    },
    tempContext: function() {
        return _DRAWING.UI.temp.rowSet[0].dom.getContext("2d");
    },
    domain: CONVERTDRAWING,
    domsupport: DOMSUPPORT,
    workspace: _WORKSPACE
};
