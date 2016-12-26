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

CONVERTDRAWING.Emulator = function(refContext, instance) {
    this.instance = new Object();
    this.instance = jQuery.extend(this.instance, instance);
    this.instance.prototype = jQuery.extend(this.instance.prototype, instance.prototype);
    this.instance.refContext = refContext;

    this.draw = function(event, refContext) {
        if(refContext) {
            this.instance.refContext = refContext;
        }
        this.instance.currentProcessType = this.currentProcessType;
        this.instance.draw(event);
    };
};

CONVERTDRAWING.Emulator.prototype = {
    currentProcessType: "temp"
};

CONVERTDRAWING.Emulator.prototype = jQuery.extend(CONVERTDRAWING.Emulator.prototype, CONVERTDRAWING.Helper.prototype);