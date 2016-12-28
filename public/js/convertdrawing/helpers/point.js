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

CONVERTDRAWING.Point = function(point) {
    this.point = point;
    this.start = point;

    this.onMenuPick = function(event) {
        
    };
    
    this.onCanvasSelect = function(event) {
        
    };
    
    this.onCanvasPick = function(event) {
        
    };
    
    this.draw = function() {
        this.refContext.beginPath();
        this.refContext.moveTo(this.point[0] - this.size[0] / 2,this.point[1] - this.size[1] / 2);
        this.refContext.lineTo(this.point[0] + this.size[0] / 2,this.point[1] + this.size[1] / 2); //+,+
        this.refContext.moveTo(this.point[0] - this.size[0] / 2,this.point[1] + this.size[1] / 2); //-,+
        this.refContext.lineTo(this.point[0] + this.size[0] / 2,this.point[1] - this.size[1] / 2); //-,+
        this.refContext.stroke();
        this.refContext.restore();
        return this;
    };
};

CONVERTDRAWING.Point.prototype = {
    name: 'Point',
    isProcess: false,
    triggerMethod: 'click',
    size: [16,16],
    ACTIVITY_NAME: 'create',
    ACTIVITY_TYPE: 'native',
    ACTIVITY_METHOD: 'draw',
    ACTIVITY_OPERATION: '',
    storageType: "metadata",
    bindEvents: function() {
        var proto = this;
        $(_DRAWING.UI.canvasObject.dom).on(proto.triggerMethod + "." + proto.name, function(event) {
            $(_DRAWING.UI.canvasObject.dom).css({
                zIndex: '1001'
            });
            var instance = window.ConvertDrawing(new proto.definition([event.pageX, event.pageY]), [null, proto.processType, event, null], function(params) {
                // this.bindPostEvents.apply(this, params);
            });
        });
    },
    undo: {
        meta: {
            
        },
        preUndo: function() {

        },
        postUndo: function() {

        }
    }
};

CONVERTDRAWING.Point = _DOCUMENT.extend(CONVERTDRAWING.Point, CONVERTDRAWING.Helper);