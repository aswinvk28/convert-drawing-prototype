/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var SPLIT_TYPE_POINT = "point", SPLIT_TYPE_LINE = "line", SPLIT_TYPE_SLANT = "slant", SPLIT_TYPE_VERTEX = "vertex";
var _WORKSPACE = _WORKSPACE || {};
var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};
var _DRAWING = _DRAWING || {};
var _DOCUMENT = _DOCUMENT || {};

(function($, window) { // Need UI for Rectangle to determine the angle of transformation or rotation before drawing in the context
    
    CONVERTDRAWING.Rectangle = function(startPoint, fillStyle) {
        var instance = this;
        this.start = startPoint;
        this.point = startPoint;
        
        // this.create = function(event) {
        //     var position = this.directedPosition(this.currentProcessType);
        //     this.refContext.moveTo(position[0] + this.start[0], position[1] + this.start[1]);
        //     return this;
        // };

        this.draw = function(event) {
            var position = this.directedPosition(this.currentProcessType);
            this.refContext.beginPath();
            this.refContext.moveTo(position[0] + this.start[0], position[1] + this.start[1]);
            this.refContext.rect(position[0] + this.start[0], position[1] + this.start[1], event.pageX - this.start[0], event.pageY - this.start[1]);
            this.refContext.stroke();
            this.refContext.restore();
            return this;
        };
    };

    CONVERTDRAWING.Rectangle.prototype = {
        name: 'Rectangle',
        ACTIVITY_NAME: 'create',
        ACTIVITY_TYPE: 'native',
        ACTIVITY_METHOD: 'draw',
        storageType: "document",
        size: [16,16],
        triggerMethod: 'click',
        bindMethod: 'mousemove',
        releaseMethod: 'click',
        splitType: [SPLIT_TYPE_LINE, SPLIT_TYPE_SLANT]
    };

    CONVERTDRAWING.Rectangle = _DOCUMENT.extend(CONVERTDRAWING.Rectangle, CONVERTDRAWING.Element);
    
})(jQuery, window);
