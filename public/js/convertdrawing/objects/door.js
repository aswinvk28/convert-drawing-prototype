var _WORKSPACE = _WORKSPACE || {};
var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};
var _DRAWING = _DRAWING || {};
var _DOCUMENT = _DOCUMENT || {};

(function($, window) { // Need UI built into door by identifying the interaction before drawing the door

    CONVERTDRAWING.Door = function(startPoint, options) {
        this.start = startPoint;
        this.point = startPoint;
        this.option = options.option; // "Out Left", "Out Right", "In Left", "In Right"

        this.draw = function(event) {
            var position = this.directedPosition(this.currentProcessType);
            this.refContext.beginPath();
            this.refContext.rect(this.pivot[0], this.pivot[1], this.size[0], this.thickness); // draw the rectangle base for the door
            // draw the arc
            var angleDirection = this.getRotationDirection();
            this.refContext.arc(position[0] + this.endPoint[0], position[0] + this.endPoint[1], this.size[0], Math.PI, Math.PI / 2, angleDirection == "anticlockwise");
            this.refContext.moveTo(position[0] + this.endPoint[0], position[1] + this.endPoint[1]);
            this.refContext.lineTo(position[0] + this.apex[0], position[1] + this.apex[1]);
            this.refContext.stroke();
            this.refContext.restore();
        };
    };

    CONVERTDRAWING.Door.prototype = {
        name: 'Door',
        baseMethod: 'click',
        baseBindMethod: 'mousemove', // rotate the context
        triggerMethod: 'click', // translate the context
        bindMethod: 'mousemove', // set the apex coordinate
        releaseMethod: 'click',
        storageType: "document",
        processType: "temp",
        dimensions: [240,75,3],
        ACTIVITY_NAME: 'create',
        ACTIVITY_TYPE: 'native',
        ACTIVITY_METHOD: 'draw',
        getRotationDirection: function() {
            var rotation = "";
            if(this.quadrant == "A") {
                rotation = "anticlockwise";
            } else if(this.quadrant == "S") {
                rotation = "clockwise";
            } else if(this.quadrant == "T") {
                rotation = "anticlockwise";
            } else if(this.quadrant == "C") {
                rotation = "clockwise";
            }
            return rotation;
        },
        setApex: function(angle) {
            var xAngleAppend = 0, yAngleAppend = 0, width = this.size[0], rotation = this.getRotationDirection();
            if(rotation == "clockwise") {
                xAngleAppend = yAngleAppend = Math.PI/2;
            } else if(rotation == "anticlockwise") {
                xAngleAppend = yAngleAppend = - Math.PI/2;
            }
            var xCoordinate = width * Math.cos(angle * Math.PI/180 + xAngleAppend), yCoordinate = width * Math.sin(angle * Math.PI/180 + yAngleAppend);
            this.apex = [xCoordinate + this.endPoint[0], yCoordinate + this.endPoint[1]]; // translate the context
            return [xCoordinate, yCoordinate];
        },
        setQuadrant: function() {
            this.quadrant = "";
            if(this.option.indexOf("Negative Retention") !== -1 && this.option.indexOf("Left") !== -1) {
                this.quadrant = "C";
            } else if(this.option.indexOf("Negative Retention") !== -1 && this.option.indexOf("Right") !== -1) {
                this.quadrant = "T";
            } else if(this.option.indexOf("Positive Retention") !== -1 && this.option.indexOf("Left") !== -1) {
                this.quadrant = "S";
            } else if(this.option.indexOf("Positive Retention") !== -1 && this.option.indexOf("Right") !== -1) {
                this.quadrant = "A";
            }
            return this.quadrant;
        },
        bindEvents: function() {
            var proto = this, startPoint = settings(proto.definition, true).getStartPoint(), endPoint = settings(proto.definition, true).getEndPoint(), instance;
            var thickness = settings(proto.definition).getThickness(), properties = {};
            $(_DRAWING.UI.canvasObject.dom).on(proto.triggerMethod + "." + proto.name, function(event) {
                proto.setCanvasesToPosition();
                instance = new proto.definition(startPoint, _.extend({
                    option: settings(proto.definition).getOption()
                }, properties)); // activity creation and drawing initiation
                var proto_uuid = proto.name + "_" + uuid.v1();
                CONVERTDRAWING.active_element = proto_uuid;
                if(instance.hasOwnProperty('on' + proto.triggerMethod + 'Start')) {
                    instance['on' + proto.triggerMethod + 'Start'].call(instance, event);
                }
                if(!thickness) {
                    instance.thickness = instance.dimensions[2];
                }
                instance.isStorage = false;
                instance.isProcess = false;
                instance = window.ConvertDrawing(instance, [null, proto.processType, event, null], function(params) {
                    this.bindPostEvents.call(this, params);
                    this.bindInteractions.call(this, params);
                });
                instance.setMidPoint(endPoint, instance.processType); // supply with a different endPoint using UI
                instance.activity.execute.apply(instance, ["temp", event, instance.parent() === "helper"]);
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
                $(_DRAWING.UI.targetObject.dom).off(proto.bindMethod + "." + proto.name);
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
                proto.setMidPoint(proto.endPoint, emulator.currentProcessType);
                var apex = proto.setApex(180 + proto.angle);
                emulator.draw(mouseOverEvent, proto);
            });
        }
    };

    CONVERTDRAWING.Door = _DOCUMENT.extend(CONVERTDRAWING.Door, CONVERTDRAWING.Object);

})(jQuery, window);