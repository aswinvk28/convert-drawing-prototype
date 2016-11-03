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
    
    for(var index in _WORKSPACE.POINTEVENTS) {
        _WORKSPACE.event[_WORKSPACE.POINTEVENTS[index]] = $.Event(index + 'Point');
        _WORKSPACE.event[_WORKSPACE.POINTEVENTS[index]].translate = true;
    }
    
    for(var index in _WORKSPACE.SPACEEVENTS) {
        _WORKSPACE.event[_WORKSPACE.SPACEEVENTS[index]] = $.Event(index + 'Space');
    }
    
    for(var index in _WORKSPACE.MAPEVENTS) {
        _WORKSPACE.event[_WORKSPACE.MAPEVENTS[index]] = $.Event(index + 'Map');
    }
    
    var showCanvas = function(id) {
        switch(id) {
            case 'canvas-grid-1_1': // UI
                $('.grid-column').hide();
                $('#column-grid-1_1').show();
                $('#column-grid-1_1').css({
                    width: _WORKSPACE.PRELAYOUT.screenWidth,
                    height: _WORKSPACE.PRELAYOUT.screenHeight
                });
                $('#canvas-grid-1_1').css({
                    width: 'auto',
                    height: 'auto'
                });
                break;
            case 'canvas-grid-1_2': // Document
                break;
            case 'canvas-grid-1_3': // Metadata
                break;
            case 'canvas-grid-2_1': // Export
                break;
            case 'canvas-grid-2_2': // Temp
                break;
            case 'canvas-grid-2_3': // Space
                break;
            default:
                break;
        }
    };
    
    for(index in _WORKSPACE.ROUTES) {
        if(window.location.href.indexOf(_WORKSPACE.ROUTES[index]) !== -1) {
            showCanvas(index);
        }
    }
    
    DOMSUPPORT.UIDocument = window.PubSub.subscribe("drawing/document", function(dataTransfer) {
        
    });
    
    DOMSUPPORT.UITemp = window.PubSub.subscribe("drawing/temp", function(dataTransfer) {
        
    });
    
    DOMSUPPORT.UIMetadata = window.PubSub.subscribe("drawing/document/metadata", function(metadata) {
        
    });
    
    _WORKSPACE.ACTIVITYHISTORY = new _WORKSPACE.activityHistory();
    
})(window, jQuery);

(function() {
    CONVERTDRAWING.Line.prototype.bindEvents();
    // CONVERTDRAWING.Point.prototype.bindEvents();

    var currentState = "";

    $('.ui-element').click(function(event) {
        currentState = this;
    });

    $(_DRAWING.UI.canvasObject.dom).click(function(event) {
        $(_DRAWING.UI.canvasObject.dom).trigger("click." + currentState.title, event);
    });
})();