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

DOMSUPPORT.marker = 'marker';

function triggerCoordinatedCanvas(event) {
    
}

function translateEvent(event) {
    event.pageX = event.pageX + _WORKSPACE.ASPECTRATIO.canvasWidth / 2;
    event.pageY = event.pageY + _WORKSPACE.ASPECTRATIO.canvasHeight / 2;
}

function translateStyle(style) {
    style.top = style.top + _WORKSPACE.ASPECTRATIO.canvasHeight / 2;
    style.left = style.left + _WORKSPACE.ASPECTRATIO.canvasWidth / 2;
}

window.marker = (function($) {
    
    return {
        marker: function(event) {
            $(this).css({
                top: event.pageY - 16,
                left: event.pageX - 16
            }).show();
        }, 
        page: function(event) {
            $('#' + DOMSUPPORT.marker).css({
                top: event.pageY - 16,
                left: event.pageX - 16
            }).show();
        }
    };
    
})(jQuery);

var setMarkerEvents = function(marker) {
    $('#' + DOMSUPPORT.marker).mousemove(marker.marker);
    $("#canvas-grid-1_1").mousemove(marker.page);
};

var unsetMarkerEvents = function(marker) {
    $('#' + DOMSUPPORT.marker).off('mousemove');
    $('#' + DOMSUPPORT.marker).unbind('mousemove');
};

(function($) {
    
    // setMarkerEvents(window.marker);
    
})(jQuery);