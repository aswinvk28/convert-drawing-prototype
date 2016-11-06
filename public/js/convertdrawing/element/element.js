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
        $(_DRAWING.UI.canvasObject.dom).off(proto.triggerMethod + proto.name);
        $(_DRAWING.UI.canvasObject.dom).on(proto.triggerMethod + proto.name, function(clickEvent) {
            var boundedArea = _WORKSPACE.boundedArea(_DRAWING.TEMP.rowSet[0].dom), imagedata = null;
            proto.storageType = "document";
            proto.setMidPoint(clickEvent.pageX, clickEvent.pageY);
            boundedArea.setArea(proto.pivot[0], proto.pivot[1], proto.size[0], proto.size[1]);
            proto.activity.execute.apply(proto, ["temp", clickEvent, proto.parent() !== "helper"]);
            imagedata = _DRAWING.TEMP.rowSet[0].dom.getContext("2d").getImageData.apply(boundedArea.getAreaArguments());
            proto.boundedArea.setData(true, imagedata);
            proto.viewPort.temp.clearRect();
            $(_DRAWING.UI.temp.rowSet[0].dom).css({
                zIndex: '400'
            });
            if(proto.hasOwnProperty("onClick")) {
                proto.onClick.call(proto, clickEvent);
            }
            proto.bindEvents();
        });
        // $(_DRAWING.UI.canvasObject.dom).on("mouseover." + this.name, function(mouseOverEvent) {
        //     proto.viewPort.temp.clearRect();
        //     if(proto.hasOwnProperty("onMouseOver")) {
        //         proto.onMouseOver.call(proto, mouseOverEvent);
        //     }
        //     proto.setMidPoint(mouseOverEvent.pageX, mouseOverEvent.pageY);
        //     proto.draw.call(proto, mouseOverEvent);
        // });
    },
    setMidPoint: function(endPoint) {
        var startPoint = this.start;
        var position = this.directedPosition(this.storageType);
        this.endPoint = endPoint;
        this.xDistance = (endPoint[0] - startPoint[0]); this.yDistance = (endPoint[1] - startPoint[1]);
        this.size = [Math.abs(this.xDistance), Math.abs(this.yDistance)];
        this.boundedArea
                .setPivot((startPoint[0] < endPoint[0] ? position[0] + startPoint[0] : position[0] + endPoint[0]), (startPoint[1] < endPoint[1] ? position[1] + startPoint[1] : position[1] + endPoint[1]));
        this.point = [this.boundedArea.pivot[0] + this.size[0] / 2, this.boundedArea.pivot[1] + this.size[1] / 2];
        this.setBoundedArea(this.storageType);
        return this;
    },
    setBoundedArea: function(processType) {
        var position = this.directedPosition(processType);
        if(!this.boundedArea) {
            this.boundedArea = (new _WORKSPACE.boundedArea(this));
        }
        this.boundedArea.setArea(position[0] + this.point[0], position[1] + this.point[1], this.size[0], this.size[1]);
    },
    bindEvents: function() {
        var proto = this;
        $(_DRAWING.UI.canvasObject.dom).on(proto.triggerMethod + "." + proto.name, function(event) {
            proto.setCanvasesToPosition();
            var instance = new proto.definition([event.pageX, event.pageY]);
            instance = window.ConvertDrawing(instance, [null, proto.processType, event, null], function(params) {
                this.bindPostEvents.call(this, params);
            });
        });
    },
    size: [0,0]
});

CONVERTDRAWING.Element.prototype = jQuery.extend(CONVERTDRAWING.Element.prototype, CONVERTDRAWING.Helper.prototype);