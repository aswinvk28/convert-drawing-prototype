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
        
        this.draw = function(event) {
            this.refContext.fillStyle = 'transparent';
            this.refContext.fillRect(this.start[0], this.start[1], event.pageX, event.pageY);
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
        storageType: "",
        definition: CONVERTDRAWING.Rectangle
    };

    CONVERTDRAWING.Rectangle = _DOCUMENT.extend(CONVERTDRAWING.Rectangle, CONVERTDRAWING.Element);
    
})(jQuery, window);
