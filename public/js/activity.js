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

_WORKSPACE.activityHistory = function() {
    this.count = 0;
    this.historySet = new Object();
    this.create = function(activity) {
        this.historySet[new String(this.count)] = activity;
        this.count++;
    };
    
    this.getRecentActivity = function() {
        return this.historySet[new String(this.count - 1)];
    };
};

_WORKSPACE.activityHistory.prototype.CREATE = 0;
_WORKSPACE.activityHistory.prototype.UPDATE = 1;
_WORKSPACE.activityHistory.prototype.MOVE = 2;
_WORKSPACE.activityHistory.prototype.CUT = 3;
_WORKSPACE.activityHistory.prototype.COPY = 4;
_WORKSPACE.activityHistory.prototype.PASTE = 5;
_WORKSPACE.activityHistory.prototype.GROUP = 6;
_WORKSPACE.activityHistory.prototype.SPLIT = 7;
_WORKSPACE.activityHistory.prototype.MERGE = 8;

_WORKSPACE.activityHistory.prototype.ROTATE = 9;
_WORKSPACE.activityHistory.prototype.SCALE = 10;
_WORKSPACE.activityHistory.prototype.TRANSLATE = 11;
_WORKSPACE.activityHistory.prototype.TRANSFORM = 12;

_WORKSPACE.activityHistory.prototype.NATIVE = "native";
_WORKSPACE.activityHistory.prototype.GENERIC = "generic";
_WORKSPACE.activityHistory.prototype.HYBRID = "hybrid";
_WORKSPACE.activityHistory.prototype.BATCH = "batch";

_WORKSPACE.activity = function(name, type, method, operation) {
    var instance = this;
    this.history = _WORKSPACE.ACTIVITYHISTORY;
    this.name = name;
    this.type = type;
    this.method = method;
    this.operation = operation;
    this.context = [];
    this.pushContext = function(context) {
        if(this.context.length > 0) {
            this.context[this.context.length - 1].next = context;
            context.previous = this.context[this.context.length - 1];
        }
        this.context.push(context);
    };
    
    if(arguments.length > 4) {
        var context = arguments[4];
        this.pushContext(arguments[4]);
    }
    
    this.operations = [];
    this.undoOperations = [];
    
    // data related to activity
    this.setMetadata = function(metadata) {
        metadata.activity = this;
        this.metadata = metadata;
    };
    
    this.registerOperation = function(operation, pre, post, context) {
        operation.pre = pre;
        operation.post = post;
        operation.activity = this;
        operation.context = context;
        this.operations.push(operation);
        return this;
    };
    
    this.registerUndoOperation = function(undoOperation, metadata) {
        undoOperation.setMetadata(metadata);
        this.undoOperations.push(undoOperation);
        return undoOperation;
    };
    
    this.deregisterUndoOperation = function() {
        
    };
    
    this.execute = function(processType, event, storage) {
        instance.processType = processType;
        
        /** Create reference attribute from the destination canvas */
        this.refContext = this[instance.processType + "Channel"]().dataTransfer.dest.dom.getContext("2d");
        if(instance.type) {
            switch(instance.type) {
                case "native":
                    instance.executeNative.call(this, processType, event, storage);
                    break;
                case "generic":
                    instance.executeGeneric.call(this, processType, event, storage);
                    break;
                case "hybrid":
                    instance.executeHybrid.call(this, processType);
                    break;
                case "batch":
                    instance.executeBatch.call(this, processType);
                    break;
                default:
                    break;
            }
        }
    };
    
    this.executeNative = function(processType, event, storage) { // metadata to be determined earlier here
        if(!!processType) {
            if(typeof this['create'] == "function") {
                this['create'].call(this, event);
            }
            this[instance.method].call(this, event); // draw on temp
        }
        if(!!this.storageType && storage) {
            instance.storageType = this.storageType;
            this[instance.storageType + "Channel"]().dataTransfer.switch(this, instance.storageType);
            if(typeof this['create'] == "function") {
                this['create'].call(this, event);
            }
            this[instance.method].call(this, event); // draw on UI
            this[instance.storageType + "Channel"]().dataTransfer.switch(this, instance.storageType);
            if(typeof this['create'] == "function") {
                this['create'].call(this, event);
            }
            this[instance.method].call(this, event); // draw on storageType
            this[instance.storageType + "Channel"]().dataTransfer.switch(this, instance.storageType);
        }
    };
    
    this.executeGeneric = function(processType, event) {
        if(instance.operations.length > 0) {
            for(var index = 0; index < instance.operations; index++) {
                instance.operations[index].pre.call(this);
            }
        }
        // function calls for generic
        if(!event.helper) {
            var context = instance.context[instance.context.length - 1], data = {};
            while(context != undefined) {
                data = jQuery.extend(true, data, context[instance.operation].call(context, instance, context.boundedArea));
                context = context.next;
            }
            if(typeof data == "array") {
                this.boundedArea.setData(true, data);
            } else if(typeof data == "object") {
                this.setMetadata(new _WORKSPACE.metadata(data, instance));
            }
        } else {
            if(instance.method && event.helper[instance.method]) {
                event.helper[instance.method].call(event.helper, instance, event.helper.boundedArea);
            }
            if(instance.name && event.helper[instance.name]) {
                event.helper[instance.name].call(event.helper, instance, event.helper.boundedArea);
            }
            if(instance.operation && event.helper[instance.operation]) {
                event.helper[instance.operation].call(event.helper, instance, event.helper.boundedArea);
            }
        }
        if(instance.operations.length > 0) {
            for(var index = 0; index < instance.operations; index++) {
                instance.operations[index].post.call(this);
            }
        }
    };
    
    this.executeHybrid = function(processType, storageType) {
        if(instance.operations.length > 0) {
            for(var index = 0; index < instance.operations; index++) {
                instance.operations[index].pre.call(this);
            }
        }
        // function calls for hybrid
        if(instance.operations.length > 0) {
            for(var index = 0; index < instance.operations; index++) {
                instance.operations[index].post.call(this);
            }
        }
    };
    
    this.executeBatch = function(processType, storageType) {
        if(instance.operations.length > 0) {
            for(var index = 0; index < instance.operations; index++) {
                instance.operations[index].pre.call(this);
            }
        }
        // function calls for batch
        if(instance.operations.length > 0) {
            for(var index = 0; index < instance.operations; index++) {
                instance.operations[index].post.call(this);
            }
        }
    };
    
    this.history.create(this);
};

_WORKSPACE.undoOperation = function(activity) {
    this.activity = activity;
    this.registerPreUndoOperation = function(pre) {
        this.pre = pre;
        return this;
    }
    
    this.registerPostUndoOperation = function(post) {
        this.post = post;
        return this;
    };
    
    // data related to activity
    this.setMetadata = function(metadata) {
        metadata.activity = this.activity;
        metadata.undo = this;
        this.metadata = metadata;
    };
};