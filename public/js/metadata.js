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

_WORKSPACE.metadata = function(object, context) {
    this.isTransformed = false;
    this.context = context;
    this.boundedArea = this.context.boundedArea;
    this.setBoundedArea = function(boundedArea) {
        this.boundedArea = boundedArea;
        return this;
    };
    this.setActivity = function(activity) {
        this.activity = activity;
        return this;
    };
    _.extend(this, object);
};

_WORKSPACE.data = function(metadata) {
    
};

_WORKSPACE.boundedArea = function(context) {
    if(!!CONVERTDRAWING.Element && context.parent instanceof CONVERTDRAWING.Element) {
        this.type = 'element';
    } else if(!!CONVERTDRAWING.Block && context.parent instanceof CONVERTDRAWING.Block) {
        this.type = 'block';
    } else if(!!_WORKSPACE.canvasObject && context.parent instanceof _WORKSPACE.canvasObject) {
        this.type = 'canvas';
    } else if(!!CONVERTDRAWING.Helper && context.parent instanceof CONVERTDRAWING.Helper) {
        this.type = 'helper';
    }
    else {
        this.type = 'default';
    }
    this.context = context;
    this.imagedata = null;
    
    this.setPivot = function(pivotX, pivotY) {
        this.pivot = [pivotX, pivotY];
        this.context.pivot = [pivotX, pivotY];
    };
    
    this.setControlPoint = function(controlX, controlY) {
        this.controlPoint = [controlX, controlY];
    };
    
    this.setArea = function(xC, yC, width, height) {
        this.xC = xC;
        this.yC = yC;
        this.width = width;
        this.height = height;
        this.aspectRatio = this.width / this.height;
        return this;
    };
    
    this.getAreaArguments = function() {
        return [this.xC - 4, this.yC - 4, this.width + 8, this.height + 8];
    };
    
    this.moveArea = function(xC, yC) {
        this.xC += xC;
        this.yC += yC;
    };
    
    this.resizeAreaWithAspectRatio = function(percentage) {
        this.height *= (percentage/100) * this.height;
        this.width *= (percentage/100) * this.height * this.aspectRatio;
        return this;
    };
    
    this.resizeWidth = function(percentage) {
        this.width *= (percentage/100) * this.width;
        return this;
    };
    
    this.resizeHeight = function(percentage) {
        this.height *= (percentage/100) * this.height;
        return this;
    };
    
    this.setData = function(create, data) {
        if(!create && !data) {
            this.imagedata = this.context[this.context.storageType + "Context"]()
                .getImageData(
                    this.xC - (_WORKSPACE.GRID.Size.spread + 1),
                    this.yC - (_WORKSPACE.GRID.Size.spread + 1),
                    this.width + 2 * (_WORKSPACE.GRID.Size.spread + 1),
                    this.height + 2 * (_WORKSPACE.GRID.Size.spread + 1)
                );
        } else {
            this.imagedata = data;
        }
        return this;
    };
    
    this.getData = function() {
        return this.imagedata;
    };
};

_WORKSPACE.boundedArea.prototype = {
    
};