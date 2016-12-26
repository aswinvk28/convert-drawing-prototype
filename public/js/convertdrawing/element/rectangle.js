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
            this.refContext.fillStyle = '#000000';
            this.refContext.moveTo(position[0] + this.start[0], position[1] + this.start[1]);
            this.refContext.fillRect(position[0] + this.start[0], position[1] + this.start[1], position[0] + event.pageX, position[1] + event.pageY);
            this.refContext.restore();
            return this;
        };
    };

    CONVERTDRAWING.Rectangle.prototype = {
        name: 'Rectangle',
        triggerMethod: 'click',
        ACTIVITY_NAME: 'create',
        ACTIVITY_TYPE: 'native',
        ACTIVITY_METHOD: 'draw',
        storageType: "document",
        size: [16,16]
    };

    CONVERTDRAWING.Rectangle = _DOCUMENT.extend(CONVERTDRAWING.Rectangle, CONVERTDRAWING.Element);
    
})(jQuery, window);
