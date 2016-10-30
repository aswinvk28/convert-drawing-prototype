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

(function($, window) {
    
    CONVERTDRAWING.Circle = function(startPoint) {
        var instance = this;
        this.start = startPoint;
        this.point = startPoint;
        
        this.onMouseOver = function(mouseOverEvent) {
            if(mouseOverEvent.pageX > mouseOverEvent.pageY) {
                mouseOverEvent.pageY = mouseOverEvent.pageX;
            } else {
                mouseOverEvent.pageX = mouseOverEvent.pageY;
            }
            unsetMarkerEvents(window.marker);
            $('#' + DOMSUPPORT.marker).on('mousemove', function(event) {
                event.pageX = mouseOverEvent.pageX;
                event.pageY = mouseOverEvent.pageY;
                marker.marker.call(this, event);
            });
            $('#page_body').find('canvas.grid-canvas').on('mousemove', function(event) {
                event.pageX = mouseOverEvent.pageX;
                event.pageY = mouseOverEvent.pageY;
                marker.page.call(this, event);
            });
        };
        
        this.onClick = function(clickEvent) {
            unsetMarkerEvents(window.marker);
            setMarkerEvents(window.marker);
        };
        
        this.draw = function(event) {
            this.refContext.fillStyle = 'transparent';
            this.refContext.beginPath();
            this.refContext.arc(this.point[0], this.point[1], 0, 2 * Math.PI, Math.abs(this.xDistance/2));
            this.refContext.stroke();
            return this;
        };
    };

    CONVERTDRAWING.Circle.prototype = {
        name: 'Circle',
        triggerMethod: 'click',
        ACTIVITY_NAME: 'create',
        ACTIVITY_TYPE: 'native',
        ACTIVITY_METHOD: 'draw',
        storageType: "document",
        definition: CONVERTDRAWING.Circle
    };

    CONVERTDRAWING.Circle = _DOCUMENT.extend(CONVERTDRAWING.Circle, CONVERTDRAWING.Element);
    
})(jQuery, window);
