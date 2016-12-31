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
        this._setMidPoint(endPoint, storageType);
        this.setSlope();
        if(this.__proto__.hasOwnProperty("setQuadrant")) {
            this.setQuadrant();
        }
    }
};

CONVERTDRAWING.Object.prototype._setMidPoint = CONVERTDRAWING.Element.prototype.setMidPoint;
CONVERTDRAWING.Object.prototype._setSlope = CONVERTDRAWING.Element.prototype.setSlope;

CONVERTDRAWING.Object.prototype = jQuery.extend(CONVERTDRAWING.Element.prototype, CONVERTDRAWING.Object.prototype);