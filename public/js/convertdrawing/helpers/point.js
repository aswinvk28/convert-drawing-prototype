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
        this.refContext.moveTo(this.point[0] - this.size / 2,this.point[1] - this.size / 2);
        this.refContext.lineTo(this.point[0] + this.size / 2,this.point[1] + this.size / 2); //+,+
        this.refContext.moveTo(this.point[0] - this.size / 2,this.point[1] + this.size / 2); //-,+
        this.refContext.lineTo(this.point[0] + this.size / 2,this.point[1] - this.size / 2); //-,+
        this.refContext.stroke();
        this.refContext.restore();
        return this;
    };
};

CONVERTDRAWING.Point.prototype = {
    name: 'Point',
    triggerMethod: 'click',
    size: [16,16],
    ACTIVITY_NAME: 'create',
    ACTIVITY_TYPE: 'native',
    ACTIVITY_METHOD: 'draw',
    ACTIVITY_OPERATION: '',
    storageType: "metadata",
    bindEvents: function() {
        var instance = this;
        $(this.viewContext.canvas).on(this.triggerMethod + "." + this.name, function(event) {
            
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