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

(function($) {
    
    CONVERTDRAWING.Helper = function() {
        
    };

    CONVERTDRAWING.Helper.prototype = jQuery.extend({
        ACTIVITY_NAME: '',
        ACTIVITY_TYPE: '',
        ACTIVITY_METHOD: '',
        ACTIVITY_OPERATION: '',
        ACTIVITY_CONTEXT: this,
        processType: "temp",
        _init: function() {
            /** Create reference attribute from the destination canvas */
            this.refContext = this[this.storageType + "Channel"]().dataTransfer.dest.dom.getContext("2d");
        },
        currentPosition: function(processType) {
            return [this.boundedArea.xC, this.boundedArea.yC];
        },
        directedPosition: function(processType) {
            return [_DRAWING.UI.getChannel(processType)
                    .dataTransfer.getMetadata()
                    .boundedArea.xC, 
            _DRAWING.UI.getChannel(processType)
                    .dataTransfer.getMetadata()
                    .boundedArea.yC];
        },
        getAreaArguments: function() {
            return this.getAreaArguments(); // from metadata bounded area
        },
        setBoundedArea: function(processType) {
            if(!this.boundedArea) {
                this.boundedArea = (new _WORKSPACE.boundedArea(this));
            }
            this.boundedArea.setArea(this.currentPosition(processType)[0] + this.point[0] - (this.size[0] / 2), this.currentPosition(processType)[1] + this.point[1] - (this.size[1] / 2), this.size[0], this.size[1]);
        },
        createElement: function(preCallback, processType, event, postCallback) { // automating create activity
            this.bindEvents();
            this.activity = new _WORKSPACE
                    .activity(this.ACTIVITY_NAME, this.ACTIVITY_TYPE, this.ACTIVITY_METHOD, this.ACTIVITY_OPERATION, this.ACTIVITY_CONTEXT);
            if(!this.size) {
                this.size = [0, 0];
            }
            this.setBoundedArea(this.storageType);
            if(this.hasOwnProperty("setMidPoint")) {
                this.setMidPoint(this.start);
            }
            if(!!this.ACTIVITY_OPERATION) {
                this.activity.registerOperation(this[this.ACTIVITY_OPERATION], preCallback, postCallback);
            }
//            var undoOperation = new _WORKSPACE.undoOperation(this.activity, 
//            new _WORKSPACE.metadata(Object.create(this.undo.meta, {
//                
//            }), this));
//            undoOperation.registerPreUndoOperation(this.undo.pre);
//            undoOperation.registerPostUndoOperation(this.undo.post);
//            this.activity.registerUndoOperation(undoOperation);
            this.activity.execute.apply(this, ["temp", event]);
        }
    }, CONVERTDRAWING.base);
    
    CONVERTDRAWING.Helper.prototype.constructor = CONVERTDRAWING.Helper.prototype.createElement;
    
})(jQuery);