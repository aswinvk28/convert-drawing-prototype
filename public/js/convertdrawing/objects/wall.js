var _WORKSPACE = _WORKSPACE || {};
var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};
var _DRAWING = _DRAWING || {};
var _DOCUMENT = _DOCUMENT || {};

(function($, window) {

    CONVERTDRAWING.Wall = function(startPoint, thickness, options) {
        this.options = options;
        this.option = options.option; // 'Single Disconnected', 'Double Disconnected', 'Double Enclosure', 'Triple Enclosure', 'Closed'
        this.axis = options.axis; // 'X', 'Y'
        this.quadrant = options.quadrant; // 'A', 'S', 'T', 'C'

        this.start = startPoint;
        this.point = startPoint;

        if(thickness) {
            this.thickness = thickness;
        }
        if(options.hasOwnProperty("extensionX")) {
            this.extension = options.extensionX;
        } else if(options.hasOwnProperty("extensionY")) {
            this.extension = options.extensionY;
        }

        if(!options.hasOwnProperty("sides")) {
            this.sides = this.option.indexOf("Single") !== -1 ? 1 : this.option.indexOf("Double") !== -1 ? 2 : this.option.indexOf("Triple") !== -1 ? 3 : 4; // Closed
        } else {
            this.sides = options.sides;
        }

        this.getMethod = function() {
            if(this.option == "Closed") {
                this.method = 'drawClosed';
            } else if(this.option == "Single Disconnected") {
                this.method = 'draw' + this.axis + this.quadrant + this.option.replace(" ", "");
            } else if(this.option == "Double Disconnected" || this.option == "Double Enclosure" || this.option == "Triple Enclosure") {
                this.method = 'draw' + this.option.replace(" ", "");
            }
            return this.method;
        };

        this.draw = function(event) {
            this[this.getMethod()].call(this, event);
        };

        var drawSingleDisconnected = function(event, thickness, extensionY, extensionX) {
            var position = this.directedPosition(this.currentProcessType);
            this.refContext.beginPath();
            this.refContext.moveTo(position[0] + event.pageX, position[1] + this.start[1]);
            this.refContext.lineTo(position[0] + this.start[0], position[1] + this.start[1]);
            this.refContext.lineTo(position[0] + this.start[0] + extensionX, position[1] + this.start[1] + thickness[1] + extensionY);
            this.refContext.lineTo(position[0] + this.start[0] + thickness[0] + extensionX, position[1] + this.start[1] + thickness[1] + extensionY);
            this.refContext.moveTo(position[0] + event.pageX, position[1] + this.start[1]);
            this.refContext.lineTo(position[0] + event.pageX, position[1] + this.start[1] + thickness[1]);
            this.refContext.lineTo(position[0] + this.start[0] + thickness[0], position[1] + this.start[1] + thickness[1]);
            this.refContext.lineTo(position[0] + this.start[0] + thickness[0] + extensionX, position[1] + this.start[1] + thickness[1] + extensionY);
            this.refContext.stroke();
            this.refContext.fill("evenodd");
        };

        this.drawClosed = function(event) {
            var position = this.directedPosition(this.currentProcessType);
            this.refContext.beginPath();
            this.refContext.rect(this.pivot[0], this.pivot[1], this.size[0], this.size[1]);
            this.refContext.rect(this.pivot[0] + this.thickness[0], this.pivot[1] + this.thickness[1], this.size[0] - 2 * this.thickness[0], this.size[1] - 2 * this.thickness[1]);
            this.refContext.stroke();
            this.refContext.fill("evenodd");
        };

        this.drawXASingleDisconnected = function(event) {
            drawSingleDisconnected.call(this, event, this.thickness, this.extension, 0);
        };

        this.drawXSSingleDisconnected = function(event) {
            var eventParam = {pageX: event.pageX, pageY: event.pageY}, thickness = [-this.thickness[0], this.thickness[1]];
            drawSingleDisconnected.call(this, eventParam, thickness, this.extension);
        };

        this.drawXTSingleDisconnected = function(event) {
            var eventParam = {pageX: event.pageX, pageY: event.pageY}, thickness = [-this.thickness[0], -this.thickness[1]], extension = -this.extension;
            drawSingleDisconnected.call(this, eventParam, thickness, extension);
        };

        this.drawXCSingleDisconnected = function(event) {
            var eventParam = {pageX: event.pageX, pageY: event.pageY}, thickness = [this.thickness[0], -this.thickness[1]], extension = -this.extension;
            drawSingleDisconnected.call(this, eventParam, thickness, extension);
        };

        this.drawYASingleDisconnected = function(event) {
            var eventParam = {pageX: event.pageY, pageY: event.pageX}, thickness = [this.thickness[1], this.thickness[0]];
            drawSingleDisconnected.call(this, eventParam, thickness, 0, this.extension);
        };

        this.drawYSSingleDisconnected = function(event) {
            var eventParam = {pageX: event.pageY, pageY: event.pageX}, thickness = [-this.thickness[1], this.thickness[0]], extension = -this.sextension;
            drawSingleDisconnected.call(this, eventParam, thickness, 0, this.extension);
        };

        this.drawYTSingleDisconnected = function(event) {
            var eventParam = {pageX: event.pageY, pageY: event.pageX}, thickness = [-this.thickness[1], -this.thickness[0]], extension = -this.extension;
            drawSingleDisconnected.call(this, eventParam, thickness, 0, extension);
        };

        this.drawYCSingleDisconnected = function(event) {
            var eventParam = {pageX: event.pageY, pageY: event.pageX}, thickness = [this.thickness[1], -this.thickness[0]];
            drawSingleDisconnected.call(this, eventParam, thickness, 0, this.extension);
        };

        var drawDoubleDisconnected = function(event, translateY, translateX) {
            var position = this.directedPosition(this.currentProcessType);
            this.refContext.restore();
            this.drawXASingleDisconnected(event);
            this.refContext.rect(this.pivot[0], this.pivot[1], this.size[0], this.thickness[1]);
            this.refContext.translate(translateX, translateY);
            this.refContext.stroke();
            this.refContext.fill();
            this.refContext.setTranmsform(1,0,0,1,0,0);
        };

        this.drawDoubleDisconnected = function(event) {
            var position = this.directedPosition(this.currentProcessType), translateX = 0, translateY = 0;
            this['draw' + this.axis + this.quadrant + this.option.replace(" ", "")]();
            if((this.quadrant == "A" || this.quadrant == "S") && this.axis == "X") {
                translateY = this.size[1] - this.thickness[1];
            } else if((this.quadrant == "T" || this.quadrant == "C") && this.axis == "X") {
                translateY = -(this.size[1] - this.thickness[1]);
            } else if((this.quadrant == "A" || this.quadrant == "C") && this.axis == "Y") {
                translateX = this.size[1] - this.thickness[1];
            } else if((this.quadrant == "S" || this.quadrant == "T") && this.axis == "Y") {
                translateX = -(this.size[1] - this.thickness[1]);
            }
            drawDoubleDisconnected.call(this, event, translateX, translateY);
        };

        var drawDoubleEnclosure = function(event) {
            var position = this.directedPosition(this.currentProcessType), eventParam = {}, thickness = [];
            this.refContext.restore();
            this.refContext.beginPath();
            if(this.quadrant == "A") {
                eventParam.pageX = event.pageX;
                eventParam.pageY = event.pageY;
                thickness = this.thickness;
            } else if(this.quadrant == "S") {
                eventParam.pageX = event.pageX;
                eventParam.pageY = event.pageY;
                thickness[0] = -this.thickness[0];
                thickness[1] = this.thickness[1];
            } else if(this.quadrant == "T") {
                eventParam.pageX = event.pageX;
                eventParam.pageY = event.pageY;
                thickness[0] = -this.thickness[0];
                thickness[1] = -this.thickness[1];
            } else if(this.quadrant == "C") {
                eventParam.pageX = event.pageX;
                eventParam.pageY = event.pageY;
                thickness[0] = this.thickness[0];
                thickness[1] = -this.thickness[1];
            }
            this.refContext.moveTo(position[0] + this.start[0], position[1] + eventParam.pageY);
            this.refContext.lineTo(position[0] + this.start[0] + this.thickness[0], position[1] + this.start[1]);
            this.refContext.lineTo(position[0] + this.start[0] + this.thickness[0], position[1] + this.start[1] + this.thickness[1]);
            this.refContext.lineTo(position[0] + eventParam.pageX, position[1] + this.thickness[0]);
            this.refContext.moveTo(position[0] + this.start[0], position[1] + eventParam.pageY);
            this.refContext.lineTo(position[0] + this.start[0], position[1] + this.start[1]);
            this.refContext.lineTo(position[0] + event.pageX, position[1] + this.start[1]);
            this.refContext.closePath();
        };

        this.drawDoubleEnclosure = function(event) {
            drawDoubleEnclosure.call(this, event);
        };

        var drawTripleEnclosure = function(event) {
            var position = this.directedPosition(this.currentProcessType), eventParam = {}, thickness = [];
            this.refContext.beginPath();
            this.refContext.moveTo(position[0] + this.pivot[0], position[1] + this.pivot[1]);
            this.refContext.moveTo(position[0] + this.pivot[0], position[1] + this.size[1]);
            this.refContext.moveTo(position[0] + this.thickness[0], position[1] + this.size[1]);
            this.refContext.moveTo(position[0] + this.thickness[0], position[1] + this.pivot[1] + this.thickness[1]);
            this.refContext.moveTo(position[0] + this.size[0] - this.thickness[0], position[1] + this.pivot[1] + this.thickness[1]);
            this.refContext.moveTo(position[0] + this.size[0] - this.thickness[0], position[1] + this.size[1]);
            this.refContext.moveTo(position[0] + this.size[0], position[1] + this.size[1]);
            this.refContext.moveTo(position[0] + this.size[0], position[1] + this.pivot[1]);
            this.refContext.closePath();
            this.refContext.stroke();
            this.refContext.fill("evenodd");
        };

        this.drawTripleEnclosure = function(event) {
            this.refContext.restore();
            if(this.quadrant == "A") {
                
            } else if(this.quadrant == "S") {
                this.refContext.rotate(90 * Math.PI / 2);
            } else if(this.quadrant == "T") {
                this.refContext.rotate(180 * Math.PI / 2);
            } else if(this.quadrant == "C") {
                this.refContext.rotate(270 * Math.PI / 2);
            }
            drawTripleEnclosure.call(this, event);
        };
    };

    CONVERTDRAWING.Wall.prototype = {
        name: 'Wall',
        triggerMethod: 'mousedown',
        bindMethod: 'mousemove',
        releaseMethod: 'mouseup',
        ACTIVITY_NAME: 'create',
        ACTIVITY_TYPE: 'native',
        ACTIVITY_METHOD: 'draw',
        storageType: "document",
        processType: "temp",
        thickness: [25,25],
        extension: 25,
        bindEvents: function() {
            var proto = this;
            var thickness = settings(proto.definition).getThickness(), option = settings(proto.definition).getOption(), properties = {axis: settings(proto.definition).getAxis(), quadrant: settings(proto.definition).getQuadrant()};
            $(_DRAWING.UI.canvasObject.dom).on(proto.triggerMethod + "." + proto.name, function(event) {
                proto.setCanvasesToPosition();
                var instance = new proto.definition([event.pageX, event.pageY], thickness, jQuery.extend({
                    option: option
                }, properties)); // activity creation and drawing initiation
                var proto_uuid = proto.name + "_" + uuid.v1();
                CONVERTDRAWING.active_element = proto_uuid;
                if(instance.hasOwnProperty('on' + proto.triggerMethod + 'Start')) {
                    instance['on' + proto.triggerMethod + 'Start'].call(instance, event);
                }
                instance = window.ConvertDrawing(instance, [null, proto.processType, event, null], function(params) {
                    this.bindPostEvents.call(this, params);
                    this.bindInteractions.call(this, params);
                });
                _WORKSPACE.ELEMENTS.List[proto_uuid] = instance;
            });
        },
        bindPostEvents: function(preCallback, processType, prevEvent, postCallback) {
            var proto = this;
            // move to top
            this.moveToTop("temp");
            $(_DRAWING.UI.targetObject.dom).off(proto.releaseMethod + "." + proto.name);
            $(_DRAWING.UI.targetObject.dom).on(proto.releaseMethod + "." + proto.name, function(clickEvent) {
                var instance = _WORKSPACE.ELEMENTS.List[CONVERTDRAWING.active_element];
                var boundedArea = instance.boundedArea, imagedata = null;
                
                instance.storageType = "document";
                instance.setMidPoint([clickEvent.pageX, clickEvent.pageY], instance.storageType);
                instance.activity.execute.apply(instance, ["temp", clickEvent, instance.parent() !== "helper"]);
                imagedata = _DRAWING.TEMP.rowSet[0].dom.getContext("2d").getImageData(boundedArea.xC, boundedArea.yC, instance.size[0], instance.size[1]);
                instance.boundedArea.setData(true, imagedata);
                instance.viewPort().temp.rowSet[0].clearRect();
                
                // move to required order
                proto.moveToRequiredOrder("temp");
                
                if(instance.hasOwnProperty('on' + proto.triggerMethod + 'Finish')) {
                    instance['on' + proto.triggerMethod + 'Finish'].call(instance, clickEvent);
                }
                $(_DRAWING.UI.targetObject.dom).off(proto.bindMethod + proto.name);
                // CONVERTDRAWING.Rectangle.prototype.bindEvents();
            });
        },
        bindInteractions: function(preCallback, processType, prevEvent, postCallback) {
            var proto = this;
            var emulator = new CONVERTDRAWING.Emulator(_DRAWING.UI.targetObject.dom.getContext("2d"), proto);
            $(_DRAWING.UI.targetObject.dom).off(proto.bindMethod + "." + proto.name);
            $(_DRAWING.UI.targetObject.dom).on(proto.bindMethod + "." + proto.name, function(mouseOverEvent) {
                proto.viewPort().temp.rowSet[0].clearRect();
                if(proto.hasOwnProperty("onMouseOver")) {
                    proto.onMouseOver.call(proto, mouseOverEvent);
                }
                proto.setMidPoint([mouseOverEvent.pageX, mouseOverEvent.pageY], emulator.currentProcessType);
                emulator.draw(mouseOverEvent);
            });
        }
    };

    CONVERTDRAWING.Wall = _DOCUMENT.extend(CONVERTDRAWING.Wall, CONVERTDRAWING.Object);

})(jQuery, window);