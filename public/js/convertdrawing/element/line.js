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
    
    CONVERTDRAWING.Line = function(startPoint) {
        var instance = this;
        this.start = startPoint;
        this.point = startPoint;
        this.setMidPoint = function(endPoint) {
            var startPoint = this.start;
            var xDistance = (endPoint[0] - startPoint[0]), yDistance = (endPoint[1] - startPoint[1]);
            var angle = Math.atan(yDistance / xDistance);
            this.boundedArea
                    .setPivot((startPoint[0] > endPoint[0] ? startPoint[0] : endPoint[0]), (startPoint[1] > endPoint[1] ? startPoint[1] : endPoint[1]));
            this.point = [this.boundedArea.pivot[0] + (xDistance + this.tempContext.lineWidth * Math.cos(angle)) / 2, 
                this.boundedArea.pivot[1] + (yDistance + this.tempContext.lineWidth * Math.sin(angle)) / 2];
            this.size = [Math.abs(xDistance), Math.abs(yDistance)];
            return this;
        };
        
        this.getAreaArguments = function() {
            return [this.xC, this.yC, this.width + instance.tempContext.lineWidth, this.height + instance.tempContext.lineWidth];
        },

        this.draw = function(event) {
            this.refContext.beginPath();
            this.refContext.moveTo(this.start[0], this.start[1]);
            this.refContext.lineTo(event.pageX, event.pageY);
            this.refContext.stroke();
            this.refContext.restore();
            return this;
        };
    };

    CONVERTDRAWING.Line.prototype = {
        name: 'Line',
        triggerMethod: 'click',
        ACTIVITY_NAME: 'create',
        ACTIVITY_TYPE: 'native',
        ACTIVITY_METHOD: 'draw',
        storageType: "document",
        definition: CONVERTDRAWING.Line
    };

    CONVERTDRAWING.Line = _DOCUMENT.extend(CONVERTDRAWING.Line, CONVERTDRAWING.Element);
    
})(jQuery, window);