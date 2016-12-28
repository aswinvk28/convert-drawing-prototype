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

CONVERTDRAWING.Element = function() { // content
    return "element";
};

CONVERTDRAWING.Element.prototype = jQuery.extend(CONVERTDRAWING.Helper.prototype, {
    bindPostEvents: function(preCallback, processType, prevEvent, postCallback) {
        var proto = this;
        // move to top
        this.moveToTop("temp");
        $(_DRAWING.UI.targetObject.dom).off(proto.releaseMethod + "." + proto.name);
        $(_DRAWING.UI.targetObject.dom).on(proto.releaseMethod + "." + proto.name, function(clickEvent) {
            var instance = _WORKSPACE.ELEMENTS.List[CONVERTDRAWING.active_element];
            var boundedArea = instance.boundedArea, imagedata = null;
            
            instance.storageType = "document";
            instance.setMidPoint([clickEvent.pageX, clickEvent.pageY], instance.storageType);
            instance.activity.execute.apply(instance, ["temp", clickEvent, instance.parent() !== "helper"]);
            imagedata = _DRAWING.TEMP.rowSet[0].dom.getContext("2d").getImageData(boundedArea.xC, boundedArea.yC, instance.size[0], instance.size[1]);
            instance.boundedArea.setData(true, imagedata);
            instance.viewPort().temp.rowSet[0].clearRect();
            
            // move to required order
            proto.moveToRequiredOrder("temp");
            
            if(instance.hasOwnProperty('on' + proto.triggerMethod + 'Finish')) {
                instance['on' + proto.triggerMethod + 'Finish'].call(instance, clickEvent);
            }
            $(_DRAWING.UI.targetObject.dom).off(proto.bindMethod + "." + proto.name);
            // CONVERTDRAWING.Rectangle.prototype.bindEvents();
        });
    },
    bindInteractions: function(preCallback, processType, prevEvent, postCallback) {
        var proto = this;
        var emulator = new CONVERTDRAWING.Emulator(_DRAWING.UI.targetObject.dom.getContext("2d"), proto);
        $(_DRAWING.UI.targetObject.dom).off(proto.bindMethod + "." + proto.name);
        $(_DRAWING.UI.targetObject.dom).on(proto.bindMethod + "." + proto.name, function(mouseOverEvent) {
            proto.viewPort().temp.rowSet[0].clearRect();
            if(proto.hasOwnProperty("onMouseOver")) {
                proto.onMouseOver.call(proto, mouseOverEvent);
            }
            proto.setMidPoint([mouseOverEvent.pageX, mouseOverEvent.pageY], emulator.currentProcessType);
            emulator.draw(mouseOverEvent);
        });
    },
    setMidPoint: function(endPoint, storageType) {
        var startPoint = this.start;
        var position = this.directedPosition(storageType);
        this.endPoint = endPoint;
        this.xDistance = (endPoint[0] - startPoint[0]); this.yDistance = (endPoint[1] - startPoint[1]);
        this.size = [Math.abs(this.xDistance), Math.abs(this.yDistance)];
        this.boundedArea
                .setPivot((startPoint[0] < endPoint[0] ? position[0] + startPoint[0] : position[0] + endPoint[0]), (startPoint[1] < endPoint[1] ? position[1] + startPoint[1] : position[1] + endPoint[1]));
        
        // this.boundedArea.grid = _WORKSPACE.GRID.Locate({pageX: this.boundedArea.pivot[0], pageY: this.boundedArea.pivot[1]}, this.storageType); /* grid object */

        this.point = [this.boundedArea.pivot[0] + this.size[0] / 2, this.boundedArea.pivot[1] + this.size[1] / 2];
        this.setBoundedArea(this.storageType);
        return this;
    },
    getQuadrant: function(angle) {
        var quadrant = '';
        if(angle < 90) {
            quadrant = 'A';
        } else if(angle < 180) {
            quadrant = 'S'
        } else if(angle < 270) {
            quadrant = 'T';
        } else if(angle < 360) {
            quadrant = 'C';
        }
        return quadrant;
    },
    setSlope: function() {
        var angle;
        if(this.xDistance == 0) {
            angle = 0;
        } else {
            this.slope = this.yDistance / this.xDistance;
            if(this.yDistance >= 0 && this.xDistance > 0) {
                angle = Math.atan(this.slope) / (Math.PI/180);
            } else if(this.yDistance >= 0 && this.xDistance < 0) {
                angle = Math.atan(this.slope) / (Math.PI/180) + 90;
            } else if(this.yDistance <= 0 && this.xDistance < 0) {
                angle = Math.atan(this.slope) / (Math.PI/180) + 180;
            } else if(this.yDistance <= 0 && this.xDistance > 0) {
                angle = Math.atan(this.slope) / (Math.PI/180) + 270;
            }
        }
        this.angle = Math.fround(angle);
    },
    setBoundedArea: function(processType) {
        var position = this.directedPosition(processType);
        if(!this.boundedArea) {
            this.boundedArea = (new _WORKSPACE.boundedArea(this));
            this.boundedArea.pivot = this.start;
        }
        this.boundedArea.setArea(position[0] + this.point[0], position[1] + this.point[1], this.size[0], this.size[1]);
        // this.boundedArea.grid = _WORKSPACE.GRID.Locate({pageX: this.boundedArea.pivot[0], pageY: this.boundedArea.pivot[1]}, this.storageType); /* grid object */
    },
    bindEvents: function() {
        var proto = this;
        $(_DRAWING.UI.canvasObject.dom).on(proto.triggerMethod + "." + proto.name, function(event) {
            proto.setCanvasesToPosition();
            var instance = new proto.definition([event.pageX, event.pageY]); // activity creation and drawing initiation
            var proto_uuid = proto.name + "_" + uuid.v1();
            CONVERTDRAWING.active_element = proto_uuid;
            if(instance.hasOwnProperty('on' + proto.triggerMethod + 'Start')) {
                instance['on' + proto.triggerMethod + 'Start'].call(instance, event);
            }
            instance = window.ConvertDrawing(instance, [null, proto.processType, event, null], function(params) {
                this.bindPostEvents.call(this, params);
                this.bindInteractions.call(this, params);
            });
            _WORKSPACE.ELEMENTS.List[proto_uuid] = instance;
        });
    },
    size: [0,0]
});