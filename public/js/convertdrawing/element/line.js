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

(function($, window) {
    
    CONVERTDRAWING.Line = function(startPoint) {
        var instance = this;
        this.start = startPoint;
        this.point = startPoint;
        this.setMidPoint = function(endPoint) {
            var startPoint = this.start;
            this.endPoint = endPoint;
            this.xDistance = (endPoint[0] - startPoint[0]); this.yDistance = (endPoint[1] - startPoint[1]);
            this.size = [Math.abs(this.xDistance), Math.abs(this.yDistance)];
            this.angle = (this.xDistance != 0) ? Math.atan(this.yDistance / this.xDistance) : Math.PI / 2;
            this.boundedArea
                    .setPivot((startPoint[0] < endPoint[0] ? startPoint[0] : endPoint[0]), (startPoint[1] < endPoint[1] ? startPoint[1] : endPoint[1]));

            // this.boundedArea.grid = _WORKSPACE.GRID.Locate({pageX: this.boundedArea.pivot[0], pageY: this.boundedArea.pivot[1]}, this.storageType); /* grid object */

            this.point = [this.boundedArea.pivot[0] + (this.size[0] /*+ this.tempContext().lineWidth * Math.abs(Math.cos(angle))*/) / 2, 
                this.boundedArea.pivot[1] + (this.size[1] /*+ this.tempContext().lineWidth * Math.abs(Math.sin(angle))*/) / 2];
            this.setBoundedArea(this.storageType);
            return this;
        };
        
        this.getAreaArguments = function() {
            return [this.xC, this.yC, this.width + instance.tempContext().lineWidth, this.height + instance.tempContext().lineWidth];
        },

        // this.create = function(event) {
        //     var position = this.directedPosition(this.currentProcessType);
        //     this.refContext.beginPath();
        //     this.refContext.moveTo(position[0] + this.start[0], position[1] + this.start[1]);
        //     return this;
        // };

        this.draw = function(event) {
            var position = this.directedPosition(this.currentProcessType);
            this.refContext.beginPath();
            this.refContext.moveTo(position[0] + this.start[0], position[1] + this.start[1]);
            this.refContext.lineTo(position[0] + event.pageX, position[1] + event.pageY);
            this.refContext.stroke();
            this.refContext.restore();
            return this;
        };

        this.onclickStart = function(event) {
            
        };

        this.onclickFinish = function(event) {
            CONVERTDRAWING.active_element = null;
        };
    };

    CONVERTDRAWING.Line.prototype = {
        name: 'Line',
        ACTIVITY_NAME: 'create',
        ACTIVITY_TYPE: 'native',
        ACTIVITY_METHOD: 'draw',
        storageType: "document",
        triggerMethod: 'click',
        bindMethod: 'mousemove',
        releaseMethod: 'click',
        splitType: [SPLIT_TYPE_POINT]
    };

    CONVERTDRAWING.Line = _DOCUMENT.extend(CONVERTDRAWING.Line, CONVERTDRAWING.Element);
    
})(jQuery, window);