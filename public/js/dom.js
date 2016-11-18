/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var _WORKSPACE = _WORKSPACE || {};
var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};

_WORKSPACE.rowObject = function() {
    this.rowSet = [];
    this.next = null;
    this.previous = null;
};

_WORKSPACE.rowObject.prototype = {
    pushObject: function(canvas) {
        canvas.previous = (this.rowSet.length - 1) > 0 ? this.rowSet[this.rowSet.length - 1] : null;
        if((this.rowSet.length - 1) > 0) {
            this.rowSet[this.rowSet.length - 1].next = canvas;
        }
        this.rowSet.push(canvas);
        return this;
    },
    
    unshiftObject: function(canvas) {
        canvas.next = this.rowSet[0];
        this.rowSet[0].previous = canvas;
        this.rowSet.unshift(canvas);
        return this;
    },
    
    popObject: function() {
        if((this.rowSet.length - 1) > 0) {
            this.rowSet[this.rowSet.length - 1].next = null;
        }
        return this.rowSet.pop();
    },
    
    shiftObject: function() {
        if((this.rowSet.length - 1) > 0) {
            this.rowSet[this.rowSet.length - 1].previous = null;
        }
        return this.rowSet.shift();
    },
    
    appendRow: function(rowObject) {
        rowObject.previous = this;
        this.next = rowObject;
        return rowObject;
    },
    
    prependRow: function(rowObject) {
        rowObject.next = this;
        this.previous = rowObject;
        return rowObject;
    }
}

_WORKSPACE.columnObject = function(column) {
    this.colSet = []; // set of canvasObjects
    this.column = column;
    this.next = null;
    this.previous = null;
    this.populated = false;
    
    this.populate = function(forced) {
        if(_WORKSPACE.ROWSET.length > 0 && (!forced || this.populated == false)) {
            for(var index = 0; index < _WORKSPACE.ROWSET; index++) {
                this.colSet.push(_WORKSPACE.ROWSET[index].rowSet[this.column]);
            }
            this.populated = true;
        }
        return this.colSet;
    };
    
    this.identifyOperation = function(column) {
        var icolumn = column ? column : this.column, operation = '';
        if(icolumn == 0) {
            operation = 'unshift';
        } else if(icolumn > this.colSet.length) {
            operation = 'push';
        }
        return operation;
    };
    
    this.addColumn = function(column) {
        var icolumn = column ? column : this.column, operation = this.identifyOperation(icolumn);
        for(var index = 0; index < _WORKSPACE.ROWSET.length; index++) {
            Array.prototype[operation].call(this.colSet, _WORKSPACE.ROWSET[index].rowSet[icolumn]);
        }
        if(operation == 'unshift') {
            _WORKSPACE.COLSET[icolumn].prev = this.colSet;
            this.colSet.next = _WORKSPACE.COLSET[icolumn];
        } else if(operation == 'push') {
            _WORKSPACE.COLSET[icolumn].next = this.colSet;
            this.colSet.prev = _WORKSPACE.COLSET[icolumn];
        }
        Array.prototype[operation].call(_WORKSPACE.COLSET, this.colSet);
        return this.colSet;
    };
};

_WORKSPACE.canvasObject = function(current) { // setCanvas on Instantiation
    this.dom = current;
    
    this.coordinates = [];
    
    this.width = _WORKSPACE.PRELAYOUT.screenWidth;
    this.height = _WORKSPACE.PRELAYOUT.screenHeight;
    
    this.initialXC = 0;
    this.initialYC = 0;

    this.xC = 0;
    this.yC = 0;
    
    this.setCanvas();
    
};

_WORKSPACE.canvasObject.prototype = {
    getCoordinates: function() {
        
    },
    setCanvas: function() {
        this.dom.width = this.width;
        this.dom.height = this.height;
        this.dom.getContext("2d").translate(this.xC, this.yC);
        this.dom.getContext("2d").save();

        this.setBoundedArea();
    },
    setBoundedArea: function(endPoint) {
        this.boundedArea = (new _WORKSPACE.boundedArea(this))
            .setArea(this.xC, this.yC, this.width, this.height);
    },
    clearRect: function() {
        this.dom.getContext("2d").clearRect(this.xC, this.yC, this.width, this.height);
    }
};

_WORKSPACE.documentObject = function(current) {
    this.dom = current;
    this.coordinates = [];
    
    this.width = _WORKSPACE.PRELAYOUT.screenWidth * 7;
    this.height = _WORKSPACE.PRELAYOUT.screenHeight * 7;
    
    this.initialXC = this.width * 3 / 7;
    this.initialYC = this.height * 3 / 7;

    this.xC = this.width * 3 / 7;
    this.yC = this.height * 3 / 7;
    
    this.setCanvas();
    
    this.loadData = function() {
        
    };
};

_WORKSPACE.documentObject.prototype = {
    setBoundedArea: function(endPoint) {
        this.boundedArea = (new _WORKSPACE.boundedArea(this))
            .setArea(this.xC, this.yC, this.width / 7, this.height / 7);
    }
};

_WORKSPACE.documentObject = _DOCUMENT.extend(_WORKSPACE.documentObject, _WORKSPACE.canvasObject);

_WORKSPACE.metadataObject = function(current) {
    this.dom = current;
    this.coordinates = [];
    
    this.width = _WORKSPACE.PRELAYOUT.screenWidth * 7;
    this.height = _WORKSPACE.PRELAYOUT.screenHeight * 7;
    
    this.initialXC = this.width * 3 / 7;
    this.initialYC = this.height * 3 / 7;

    this.xC = this.width * 3 / 7;
    this.yC = this.height * 3 / 7;
    
    this.setCanvas();
    
    this.loadData = function() {
        
    };
};

_WORKSPACE.metadataObject.prototype = {
    setBoundedArea: function(endPoint) {
        this.boundedArea = (new _WORKSPACE.boundedArea(this))
            .setArea(this.xC, this.yC, this.width / 7, this.height / 7);
    }
};

_WORKSPACE.metadataObject = _DOCUMENT.extend(_WORKSPACE.metadataObject, _WORKSPACE.canvasObject);

_WORKSPACE.spaceObject = function(current) {
    this.dom = current;
    this.coordinates = [];
    
    this.width = _WORKSPACE.PRELAYOUT.screenWidth * 7;
    this.height = _WORKSPACE.PRELAYOUT.screenHeight * 7;
    
    this.initialXC = this.width * 3 / 7;
    this.initialYC = this.height * 3 / 7;
    
    this.setCanvas();
};

_WORKSPACE.spaceObject.prototype = {
    gridSize: 20,
    setGrid: function(grid) {
        
    },
    setBoundedArea: function(endPoint) {
        this.boundedArea = (new _WORKSPACE.boundedArea(this))
            .setArea(this.xC, this.yC, this.width / 7, this.height / 7);
    }
};

_WORKSPACE.spaceObject = _DOCUMENT.extend(_WORKSPACE.spaceObject, _WORKSPACE.canvasObject);