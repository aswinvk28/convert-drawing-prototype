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
        defaultPositions: {
            temp: 500,
            metadata: 800,
            document: 900,
            space: 400,
            export: 700
        },
        positionIds: {
            export: 21,
            temp: 22,
            space: 23,
            metadata: 13,
            document: 12,
            ui: 11
        },
        defaultzIndexPositions: [{type: "ui", value: 1001}],
        zIndexPositions: [{type: "ui", value: 1001}],
        setCanvasesToPosition: function() {
            _DRAWING.UI.canvasObject.dom.parentNode.style.zIndex = 1001;
            $('.grid-div canvas.grid-canvas').each(function(index, element) {
                var type = _WORKSPACE.GRID.findContext(element.getContext("2d"));
                if(type != "ui") {
                    _DRAWING.UI[type].rowSet[0].dom.parentNode.style.zIndex = CONVERTDRAWING.Helper.prototype.defaultPositions[type];
                }
            });
        },
        generatezIndex: function(type) {
            var num = new Number(CONVERTDRAWING.Helper.prototype.defaultPositions[type]);
            return 1001 + num.valueOf() / 10;
        },
        resetzIndexPositions: function(type, zIndex) {
            // change the target object for further events
            _DRAWING.UI.targetObject = _DRAWING.UI[type].rowSet[0];
            CONVERTDRAWING.Helper.prototype.zIndexPositions = CONVERTDRAWING.Helper.prototype.defaultzIndexPositions;
            $('.grid-div canvas.grid-canvas').each(function(index, element) {
                var current_type = _WORKSPACE.GRID.findContext(element.getContext("2d"));
                if(current_type != "ui") {
                    if(current_type == type) {
                        CONVERTDRAWING.Helper.prototype.zIndexPositions.push({
                            type: type,
                            value: zIndex || CONVERTDRAWING.Helper.prototype.generatezIndex(type)
                        });
                    } else {
                        var number = new Number(_DRAWING.UI[current_type].rowSet[0].dom.parentNode.style.zIndex);
                        CONVERTDRAWING.Helper.prototype.zIndexPositions.push({
                            type: current_type,
                            value: number.valueOf()
                        });
                    }
                }
            });
        },
        resetSpecificzIndex: function(type, zIndex) {
            for(var index in CONVERTDRAWING.Helper.prototype.zIndexPositions) {
                if(CONVERTDRAWING.Helper.prototype.zIndexPositions[index].type == type) {
                    CONVERTDRAWING.Helper.prototype.zIndexPositions[index].value = zIndex;
                }
            }
        },
        moveToTop: function(type, zIndex) {
            if(CONVERTDRAWING.Helper.prototype.zIndexPositions.length == 1) {
                CONVERTDRAWING.Helper.prototype.resetzIndexPositions(type, zIndex);
            }
            // sort zIndex positions
            CONVERTDRAWING.Helper.prototype.zIndexPositions = CONVERTDRAWING.Helper.prototype.zIndexPositions.sort(sortCompare);
            
            // move the canvas to the top
            var topmost = CONVERTDRAWING.Helper.prototype.zIndexPositions[0];
            if(topmost.type != "ui") {
                var topmostParent = _DRAWING.UI[topmost.type].rowSet[0].dom.parentNode;
                $(topmostParent).remove();
                $('#page_body').prepend(topmostParent);
                // replace the dom object
                _DRAWING.UI[topmost.type].rowSet[0].dom = topmostParent.firstChild;
                _DRAWING.UI[topmost.type].rowSet[0].dom.parentNode.style.zIndex = topmost.value;
            }
        },
        moveToRequiredOrder: function(type) {
            var currentParent = _DRAWING.UI[type].rowSet[0].dom.parentNode, positionId = CONVERTDRAWING.Helper.prototype.positionIds[type];
            var zIndex = new Number(currentParent.style.zIndex);
            $(currentParent).remove();
            CONVERTDRAWING.Helper.prototype.zIndexPositions = CONVERTDRAWING.Helper.prototype.defaultzIndexPositions;
            CONVERTDRAWING.Helper.prototype.setCanvasesToPosition();
            CONVERTDRAWING.Helper.prototype.resetzIndexPositions(type, CONVERTDRAWING.Helper.prototype.defaultPositions[type]);
            // CONVERTDRAWING.Helper.prototype.resetSpecificzIndex(type, CONVERTDRAWING.Helper.prototype.defaultPositions[type]);
            // sort zIndex positions
            CONVERTDRAWING.Helper.prototype.zIndexPositions = CONVERTDRAWING.Helper.prototype.zIndexPositions.sort(sortCompare);
            positionId = ("" + positionId).split("");
            positionId = ((new Number(positionId[1])).valueOf() - 1) == 0 ? "" + ((new Number(positionId[0])).valueOf() - 1) + "_" + positionId[1] : positionId[0] + "_" + ((new Number(positionId[1])).valueOf() - 1);
            $('#div-grid-' + positionId).after(currentParent);
            _DRAWING.UI[type].rowSet[0].dom = currentParent.firstChild;
            _DRAWING.UI[type].rowSet[0].dom.parentNode.style.zIndex = CONVERTDRAWING.Helper.prototype.defaultPositions[type];
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