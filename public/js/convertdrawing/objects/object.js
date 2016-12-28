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
    return "object";
};

CONVERTDRAWING.Object.prototype = {
    setMidPoint: function(endPoint, storageType) {
        this._setMidPoint.call(this, endPoint, storageType);
        this.setSlope.call(this);
        if(this.hasOwnProperty("setQuadrant")) {
            this.setQuadrant.call(this);
        }
        this.dimensions[1] = Math.sqrt((this.size[0]) ^ 2 + (this.size[1]) ^ 2); // width
    },
    setSlope: function() {
        this.yDistance = -this.yDistance;
        this._setSlope.call(this);
    }
};

CONVERTDRAWING.Object.prototype._setMidPoint = CONVERTDRAWING.Element.prototype.setMidPoint;
CONVERTDRAWING.Object.prototype._setSlope = CONVERTDRAWING.Element.prototype.setSlope;

CONVERTDRAWING.Object.prototype = jQuery.extend(CONVERTDRAWING.Element.prototype, CONVERTDRAWING.Object.prototype);