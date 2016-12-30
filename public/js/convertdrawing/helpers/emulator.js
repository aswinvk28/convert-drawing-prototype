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
    var setInstance = function(instance) {
        this.instance = jQuery.extend(this.instance, instance);
        this.instance.prototype = jQuery.extend(this.instance.prototype, instance.prototype);
    };
    var setContext = function(refContext) {
        this.instance.refContext = refContext;
    };
    this.instance = new Object();
    setInstance.call(this, instance);
    setContext.call(this, refContext);

    this.draw = function(event, instance, refContext) {
        if(instance) {
            setInstance.call(this, instance);
        }
        if(refContext) {
            setContext.call(this, refContext);
        }
        this.instance.currentProcessType = this.currentProcessType;
        this.instance.draw(event);
    };
};

CONVERTDRAWING.Emulator.prototype = {
    currentProcessType: "temp"
};

CONVERTDRAWING.Emulator.prototype = jQuery.extend(CONVERTDRAWING.Emulator.prototype, CONVERTDRAWING.Helper.prototype);