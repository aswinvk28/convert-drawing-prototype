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

CONVERTDRAWING.Object = function() {
    
};

CONVERTDRAWING.Object.prototype = Object.create(CONVERTDRAWING.Helper.prototype, {
    bindPostEvents: function() {
        var instance = this, args = arguments;
        $(this.tempContext.canvas).on("click." + this.name, function(clickEvent) {
            instance.storageType = "document";
            instance.setMidPoint(clickEvent.pageX, clickEvent.pageY);
            instance.setBoundedArea(instance.storageType);
            instance.activity.execute.apply(instance, [null, clickEvent]);
            instance.viewPort.temp.clearRect();
            $(_DRAWING.UI.temp.rowSet[0].dom).css({
                zIndex: '400'
            });
            if(instance.hasOwnProperty("onClick")) {
                instance.onClick.call(instance, clickEvent);
            }
        });
        $(this.tempContext.canvas).on("mouseover." + this.name, function(mouseOverEvent) {
            instance.viewPort.temp.clearRect();
            if(instance.hasOwnProperty("onMouseOver")) {
                instance.onMouseOver.call(instance, mouseOverEvent);
            }
            instance.setMidPoint(mouseOverEvent.pageX, mouseOverEvent.pageY);
            instance.draw.call(instance, mouseOverEvent);
        });
    },
    setMidPoint: function(endPoint) {
        var startPoint = this.start;
        this.xDistance = (endPoint[0] - startPoint[0]); this.yDistance = (endPoint[1] - startPoint[1]);
        this.boundedArea
                .setPivot((startPoint[0] > endPoint[0] ? startPoint[0] : endPoint[0]), (startPoint[1] > endPoint[1] ? startPoint[1] : endPoint[1]));
        this.point = [this.boundedArea.pivot[0] + this.xDistance / 2, this.boundedArea.pivot[1] + this.yDistance / 2];
        this.size = [Math.abs(this.xDistance), Math.abs(this.yDistance)];
        return this;
    },
    bindEvents: function() {
        $(_DRAWING.UI.canvasObject.dom).on(this.triggerMethod + "." + this.name, function(event) {
            $(_DRAWING.UI.temp.rowSet[0].dom).css({
                zIndex: '1001'
            });
            var instance = window.ConvertDrawing(new this.definition([event.pageX, event.pageY], [null, this.processType, event, null], function(params) {
                instance.bindPostEvents.apply(instance, params);
            }));
        });
    }
});