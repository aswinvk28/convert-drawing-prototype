/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * @see {@link http://threejs.org|ThreeJS}
 */

var _WORKSPACE = _WORKSPACE || {};
var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};
var _DRAWING = _DRAWING || {};
var _DOCUMENT = _DOCUMENT || {};

self.console = self.console || {

	info: function () {},
	log: function () {},
	debug: function () {},
	warn: function () {},
	error: function () {}

};

String.prototype.trim = String.prototype.trim || function () {

	return this.replace( /^\s+|\s+$/g, '' );

};

CONVERTDRAWING.extend = function ( obj, source ) {

    // ECMAScript5 compatibility based on: http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible/
    if ( Object.keys ) {

            var keys = Object.keys( source );

            for (var i = 0, il = keys.length; i < il; i++) {

                    var prop = keys[i];
                    Object.defineProperty( obj, prop, Object.getOwnPropertyDescriptor( source, prop ) );

            }

    } else {

            var safeHasOwnProperty = {}.hasOwnProperty;

            for ( var prop in source ) {

                    if ( safeHasOwnProperty.call( source, prop ) ) {

                            obj[prop] = source[prop];

                    }

            }

    }

    return obj;

};

(function(window) {
    _WORKSPACE.drawing = '_default';
    CONVERTDRAWING.canvas = document.getElementById("document_decider");
    
    window.ConvertDrawing = function(dfObject, params, callback) {
        dfObject = new _WORKSPACE.extend(dfObject, params);
        if(typeof callback == "function") {
            callback.apply(dfObject, params);
        }
        return dfObject;
    };
})(window);