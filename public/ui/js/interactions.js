var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};
var _WORKSPACE = _WORKSPACE || {};
var _DRAWING = _DRAWING || {};
var _DOCUMENT = _DOCUMENT || {};

_WORKSPACE.INTERACTIONS = {};
_WORKSPACE.ELEMENTS = {};

_WORKSPACE.GRID = {};

_WORKSPACE.GRID.List = {};

/** 
 * @point Array
 * @return Array[row,column] 
 */
_WORKSPACE.GRID.getDimensions = function(point) {
    var absoluteY = point[1] / this.height;
    var absoluteX = point[0] / this.width;

    return new Array(Math.floor(absoluteY), Math.floor(absoluteX));
};

/**
 * @context Document, Metadata, etc. context
 * @return Array
 */
_WORKSPACE.GRID.getPoints = function(event) {
    var points = [];
    for(var i = event.pageX - (this.Size.spread - 1); i <= event.pageX + (this.Size.spread - 1); i++) {
        for(var j = event.pageY - (this.Size.spread - 1); j <= event.pageY + (this.Size.spread - 1); j++) {
            points.push([i,j]);
        }
    }
    return points;
};

_WORKSPACE.GRID.findContext = function(context) {
    var type = "";
    if(context.canvas.indexOf("1_1")) {
        type = "ui";
    } else if(context.canvas.id.indexOf("1_2")) {
        type = "document";
    } else if(context.canvas.id.indexOf("1_3")) {
        type = "metadata";
    } else if(context.canvas.id.indexOf("2_1")) {
        type = "export";
    } else if(context.canvas.id.indexOf("2_2")) {
        type = "temp";
    } else if(context.canvas.id.indexOf("2_3")) {
        type = "space";
    }
    return type;
};

_WORKSPACE.GRID.isPointInGrid = function(event) {
    var found;
    if(event.type == "mousemove" || event.type == "mouseover" || event.type == "mouseleave" || event.type == "mousedown" || event.type == "mouseup") {
        found = _WORKSPACE.GRID.FindInCurrent(event, _DRAWING.UI[element.processType]);
        if(!found) {
            found = _WORKSPACE.GRID.FindInCanvas(event, _DRAWING.UI[element.processType]);
        }
    } else if(event.type == "click" || event.type == "mouseover" || event.type == "mouseenter") {
        found = _WORKSPACE.GRID.FindInCanvas(event, _DRAWING.UI[element.processType]);
    }
    return found;
};

_WORKSPACE.GRID.actualCoordinates = function(event, type) {
    var type = !type ? _WORKSPACE.GRID.findContext(event.target.getContext("2d")) : type;
    if(type !== "" && type !== "ui") {
        return CONVERTDRAWING.Helper.prototype.currentPosition(type);
    }
    return [_DRAWING.UI.canvasObject.boundedArea.xC, _DRAWING.UI.canvasObject.boundedArea.yC];
};

_WORKSPACE.GRID.SearchElementsByPoint = function(event) {
    var found = false, Grid = null, Elements = null;
    found = _WORKSPACE.GRID.isPointInGrid(event);
    if(found) {
        Grid = _WORKSPACE.GRID.Locate(event, element.storageType);
        Elements = Grid.findElement(event);
    }
    return Elements;
};

// _WORKSPACE.GRID.SearchBoundedAreasByPoint = function() {
    
// };

// _WORKSPACE.GRID.SearchElementsByBoundedArea = function() {

// };

// _WORKSPACE.GRID.SearchBoundedAreasByBoundedArea = function() {
    
// };

/**
 * 
 */
_WORKSPACE.GRID.SearchByElement = function(event, element) {
    var found = false, Grid = null, Element = null;
    found = _WORKSPACE.GRID.isPointInGrid(event);
    if(found) {
        Grid = _WORKSPACE.GRID.Locate(event, element.storageType);
        Element = Grid.spotElement(element, event);
    }
    return Element;
};

// _WORKSPACE.GRID.SearchByBoundedArea = function(event, boundedArea) {

// };

/**
 * @event jQuery Event object
 * @type type of canvas
 * @return _WORKSPACE.ELEMENTS.Grid
 */
_WORKSPACE.GRID.Locate = function(event, type) {
    var actual = _WORKSPACE.GRID.actualCoordinates(event, type);
    var dimensions = this.getDimensions([actual[0] + event.pageX, actual[1] + event.pageY]);

    var gridStart = [this.Size.height * (dimensions[0] - 1), this.Size.width * (dimensions[1] - 1)];
    var gridEnd = [this.Size.height * (dimensions[0]), this.Size.width * (dimensions[1])];

    return new _WORKSPACE.ELEMENTS.Grid({dimensions: dimensions, start: gridStart, end: gridEnd});
};

/**
 * @context Document, Metadata, etc. context
 */
_WORKSPACE.GRID.FindInCanvas = function(event, context) {
    var actual = _WORKSPACE.GRID.actualCoordinates(event);
    for(var i = actual[0] + event.pageX - (this.Size.spread - 1), j = actual[1] + event.pageY - (this.Size.spread - 1); i <= actual[0] + event.pageX + (this.Size.spread - 1), j <= actual[1] + event.pageY + (this.Size.spread - 1); i++, j++) {
        if(context.isPointInStroke(i,j)) {
            return true;
        }
    }
    return false;
};

/**
 * @context Document, Metadata, etc. context
 */
_WORKSPACE.GRID.FindInCurrent = function(event, context) {
    var actual = _WORKSPACE.GRID.actualCoordinates(event);
    for(var i = actual[0] + event.pageX - (this.Size.spread - 1), j = actual[1] + event.pageY - (this.Size.spread - 1); i <= actual[0] + event.pageX + (this.Size.spread - 1), j <= actual[1] + event.pageY + (this.Size.spread - 1); i++, j++) {
        if(context.isPointInPath(i,j)) {
            return true;
        }
    }
    return false;
};

_WORKSPACE.INTERACTIONS.Select = function(element, event) {
    
};

_WORKSPACE.INTERACTIONS.Move = function(element, event) {
    
};

_WORKSPACE.INTERACTIONS.Zoom = function(event) {
    
};

_WORKSPACE.INTERACTIONS.Pan = function(event) {
    
};

_WORKSPACE.ELEMENTS.Grid = function(object) {
    jQuery.extend(this, object);

    this.spotElement = function(element, event) {
        var actual = _WORKSPACE.GRID.actualCoordinates(event), found = false, relativeX, relativeY, points = [];
        /** Found the point is within the bounded area */
        if(actual[0] + event.pageX > element.boundedArea.xC && actual[1] + event.pageY > element.boundedArea.yC 
        && actual[0] + event.pageX < element.boundedArea.xC + element.boundedArea.width && actual[1] + event.pageY < element.boundedArea.yC + elelment.boundedArea.height) {
            found = true;
        }
        /** Find whether the point touches the element */
        if(found) {
            relativeX = actual[0] + event.pageX - element.boundedArea.xC, relativeY = actual[1] + event.pageY - element.boundedArea.yC;
            points = _WORKSPACE.GRID.getPoints({
                pageX: relativeX, 
                pageY: relativeY
            });
            for(var index in points) {
                if(element.boundedArea.imagedata[points[index][0] * point[index][1]] != 0) {
                    return element;
                }
            }
            return false;
        }
        return false;
    };

    this.findElement = function(event) {
        
    };

    return this;
};

(function() {

    _WORKSPACE.GRID.Size = {
        width: _WORKSPACE.PRELAYOUT.canvasWidth,
        height: _WORKSPACE.PRELAYOUT.canvasHeight,
        totalWidth: _WORKSPACE.PRELAYOUT.totalWidth,
        totalHeight: _WORKSPACE.PRELAYOUT.totalHeight,
        multiplier: 7,
        spread: 4,
        gridColumn: Math.ceil(this.totalWidth / this.width),
        gridRow: Math.ceil(this.totalHeight / this.height),
        coordinates: function(gridColumn, gridRow) { /* return Array */

        }
    };

})();