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

CONVERTDRAWING.Text = function(startPoint, text, refContext) {
    this.start = startPoint;
    this.point = startPoint;
    this.setText = function(text) {
        this.text = text;
    };
    if(text) {
        this.setText(text);
    }
    
    this.drawRect = function(event) {
        this.refContext.beginPath();
        this.refContext.stroke();
    };
    this.draw = function(event, refContext) {
        if(!refContext) {
            refContext = this.refContext;
        }
        refContext.font = "18px Helvettica";
        refContext.fillText(this.text, event.pageX, event.pageY, this.boundedArea.width);
        refContext.stroke();
        refContext.restore();
    };
};

CONVERTDRAWING.Text.prototype = {
    name: 'Text',
    releaseObject: function(element) {
        var proto = this;
        $(element).click(function() {
            settings(proto.definition).setText($('#text_entry').val());
            proto.setText(settings(proto.definition).getText());
            proto.draw({
                pageX: proto.start[0],
                pageY: proto.start[1]
            }, proto.viewContext());
            $(_DRAWING.UI.canvasObject.dom).off("click");
            $(_DRAWING.UI.canvasObject.dom).off("mousemove");
            $(_DRAWING.UI.canvasObject.dom).off("mouseup");
            $(_DRAWING.UI.canvasObject.dom).off("mousedown");
            // move to required order
            proto.moveToRequiredOrder("temp");
        });
    },
    triggerMethod: "click",
    releaseMethod: "click",
    bindMethod: "mousemove",
    ACTIVITY_NAME: 'create',
    ACTIVITY_TYPE: 'native',
    ACTIVITY_METHOD: 'drawRect',
    storageType: "document",
    processType: "temp",
    bindEvents: function() {
        var proto = this;
        $(_DRAWING.UI.canvasObject.dom).on(proto.triggerMethod + "." + proto.name, function(event) {
            proto.setCanvasesToPosition();
            var instance = new proto.definition([event.pageX, event.pageY], $('#text_entry').val()); // activity creation and drawing initiation
            var proto_uuid = proto.name + "_" + uuid.v1();
            CONVERTDRAWING.active_element = proto_uuid;
            if(instance.hasOwnProperty('on' + proto.triggerMethod + 'Start')) {
                instance['on' + proto.triggerMethod + 'Start'].call(instance, event);
            }
            instance.isStorage = false;
            instance.isProcess = false;
            instance = window.ConvertDrawing(instance, [null, proto.processType, event, null], function(params) {
                this.bindPostEvents.call(this, params);
                this.bindInteractions.call(this, params);
            });
            _WORKSPACE.ELEMENTS.List[proto_uuid] = instance;
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
    },
    bindPostEvents: function(preCallback, processType, prevEvent, postCallback) {
        var proto = this;
        // move to top
        this.moveToTop("temp");
        $(_DRAWING.UI.targetObject.dom).off(proto.releaseMethod + "." + proto.name);
        this.releaseObject(document.getElementById("text_submit"));
    },
};

CONVERTDRAWING.Text = _DOCUMENT.extend(CONVERTDRAWING.Text, CONVERTDRAWING.Element);