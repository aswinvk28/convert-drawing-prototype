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
        return "helper";
    };

    CONVERTDRAWING.Helper.prototype = jQuery.extend({
        ACTIVITY_NAME: '',
        ACTIVITY_TYPE: '',
        ACTIVITY_METHOD: '',
        ACTIVITY_OPERATION: '',
        ACTIVITY_CONTEXT: function() {
            return this;
        },
        setCanvasesToPosition: function() {
            $(_DRAWING.UI.canvasObject.dom.parentNode).css({
                zIndex: '1001'
            });
            $(_DRAWING.UI.temp.rowSet[0].dom.parentNode).css({
                zIndex: '400'
            });
            $(_DRAWING.UI.metadata.rowSet[0].dom.parentNode).css({
                zIndex: '800'
            });
            $(_DRAWING.UI.document.rowSet[0].dom.parentNode).css({
                zIndex: '900'
            });
            $(_DRAWING.UI.space.rowSet[0].dom.parentNode).css({
                zIndex: '700'
            });
            $(_DRAWING.UI.export.rowSet[0].dom.parentNode).css({
                zIndex: '500'
            });
        },
        processType: "temp",
        _init: function() {
            /** Create reference attribute from the destination canvas */
            this.refContext = this[this.storageType + "Channel"]().dataTransfer.dest.dom.getContext("2d");
            this.currentProcessType = _WORKSPACE.GRID.findContext(this.refContext);
        },
        currentPosition: function(processType) {
            return [this.boundedArea.xC, this.boundedArea.yC];
        },
        directedPosition: function(processType) {
            if(processType == "ui") {
                return [_DRAWING.UI.canvasObject.boundedArea.xC, _DRAWING.UI.canvasObject.boundedArea.yC];
            }
            return [_DRAWING.UI.getChannel(processType)
                    .dataTransfer.getMetadata(this)
                    .boundedArea.xC, 
            _DRAWING.UI.getChannel(processType)
                    .dataTransfer.getMetadata(this)
                    .boundedArea.yC];
        },
        getAreaArguments: function() {
            return this.getAreaArguments(); // from metadata bounded area
        },
        setBoundedArea: function(processType) {
            var position = this.directedPosition(processType);
            if(!this.boundedArea) {
                this.boundedArea = (new _WORKSPACE.boundedArea(this));
                this.boundedArea.pivot = this.start;
            }
            this.boundedArea.setArea(position[0] + this.point[0] - (this.size[0] / 2), position[1] + this.point[1] - (this.size[1] / 2), this.size[0], this.size[1]);
            // this.boundedArea.grid = _WORKSPACE.GRID.Locate({pageX: this.boundedArea.pivot[0], pageY: this.boundedArea.pivot[1]}, this.storageType); /* grid object */
        },
        createElement: function(preCallback, processType, event, postCallback) { // automating create activity
            this.activity = new _WORKSPACE
                    .activity(this.ACTIVITY_NAME, this.ACTIVITY_TYPE, this.ACTIVITY_METHOD, this.ACTIVITY_OPERATION, this.ACTIVITY_CONTEXT());
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
            event.helper = this;
            this.activity.execute.apply(this, ["temp", event, this.parent() === "helper"]);
        }
    }, CONVERTDRAWING.base);
    
    CONVERTDRAWING.Helper.prototype.constructor = CONVERTDRAWING.Helper.prototype.createElement;
    
})(jQuery);