/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};
var _WORKSPACE = _WORKSPACE || {};
var _DRAWING = _DRAWING || {};
var _DOCUMENT = _DOCUMENT || {};

(function(window, $) {
    
    _WORKSPACE.event = {};
    _WORKSPACE.POINTEVENTS = ['click', 'mousemove'];
    _WORKSPACE.SPACEEVENTS = ['mouseover', 'mouseleave', 'mouseenter'];
    _WORKSPACE.MAPEVENTS = ['mousedown', 'mouseup'];
    _WORKSPACE.ROUTES = {'canvas-grid-1_1': '/#/presentation'};
    
    DOMSUPPORT.UIDocument = window.PubSub.subscribe("drawing/document", function(dataTransfer) {
        
    });
    
    DOMSUPPORT.UITemp = window.PubSub.subscribe("drawing/temp", function(dataTransfer) {
        
    });
    
    DOMSUPPORT.UIMetadata = window.PubSub.subscribe("drawing/document/metadata", function(metadata) {
        
    });
    
    _WORKSPACE.ACTIVITYHISTORY = new _WORKSPACE.activityHistory();

    // $(_DRAWING.UI.canvasObject.dom).on('mousedown.Wall', function(event) {
    //     $(_DRAWING.UI.canvasObject.dom).on('mousemove.Wall', function(event) {
    //         event.type = 'drag.Wall';
    //         /*$(_DRAWING.UI.canvasObject.dom).trigger(event, settings(proto.definition).getThickness(), jQuery.extend({
    //             option: settings(proto.definition, true).getOption(),
    //             axis: settings(proto.definition, true).getAxis(),
    //             quadrant: settings(proto.definition, true).getQuadrant()
    //         }, settings(proto.definition, true).getProperties()));*/
    //         $(_DRAWING.UI.canvasObject.dom).trigger(event, [null, jQuery.extend({
    //             option: "Single Disconnected",
    //             axis: "X",
    //             quadrant: "A"
    //         }, {})]);
    //     });
    // });

    // $(_DRAWING.UI.canvasObject.dom).on('mouseup.Wall', function(event) {
    //     $(_DRAWING.UI.canvasObject.dom).off('mousedown.Wall');
    // });
    
})(window, jQuery);

var currentState = "", instance, found = false;

(function() {
    // CONVERTDRAWING.Line.prototype.bindEvents();
    // CONVERTDRAWING.Point.prototype.bindEvents();
    // CONVERTDRAWING.Circle.prototype.bindEvents();
    // CONVERTDRAWING.Rectangle.prototype.bindEvents();
    // CONVERTDRAWING.Wall.prototype.bindEvents();
    CONVERTDRAWING.Door.prototype.bindEvents();

    $('.ui-element').click(function(event) {
        currentState = this;
    });

    $(_DRAWING.UI.canvasObject.dom).click(function(event) {
        $(_DRAWING.UI.canvasObject.dom).trigger("click." + currentState.title, event);
    });

})();