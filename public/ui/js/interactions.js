var PROCESS_CYCLE_UI = 1, PROCESS_CYCLE_DOCUMENT = 5, PROCESS_CYCLE_METADATA = 7, PROCESS_CYCLE_EXPORT = 9, PROCESS_CYCLE_TEMP = 15, PROCESS_CYCLE_SPACE = 21;
var LIFECYCLE_CREATE = 1, LIFECYCLE_CLONE = 2, ELEMENT_CREATE = 3, ELEMENT_EDIT = 4, LIFECYCLE_REMOVE = 5;
var BOUNDED_AREA_CREATE = 3, BOUNDED_AREA_EDIT = 4, BOUNDED_AREA_REMOVE = 5;
var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};
var _WORKSPACE = _WORKSPACE || {};
var _DRAWING = _DRAWING || {};
var _DOCUMENT = _DOCUMENT || {};

_WORKSPACE.INTERACTIONS = {};
_WORKSPACE.ELEMENT_REPOSITORY = {};
_WORKSPACE.ELEMENTS = {};
_WORKSPACE.GRID = {};
_WORKSPACE.BOUNDEDAREA = {};

_WORKSPACE.GRID.List = {};
_WORKSPACE.ELEMENTS.List = {};
_WORKSPACE.BOUNDEDAREA.List = {};

/** 
 * @point Array
 * @return Array[row,column] 
 */
_WORKSPACE.GRID.getDimensions = function(point) {
    var absoluteY = point[1] / this.Size.height;
    var absoluteX = point[0] / this.Size.width;

    return new Array(Math.floor(absoluteY) + 1, Math.floor(absoluteX) + 1);
};

_WORKSPACE.GRID.getUUIDPath = function() {
    return this.dimensions[0] + "_" + this.dimensions[1];
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
    if(context.canvas.id.indexOf("1_1") !== -1) {
        type = "ui";
    } else if(context.canvas.id.indexOf("1_2") !== -1) {
        type = "document";
    } else if(context.canvas.id.indexOf("1_3") !== -1) {
        type = "metadata";
    } else if(context.canvas.id.indexOf("2_1") !== -1) {
        type = "export";
    } else if(context.canvas.id.indexOf("2_2") !== -1) {
        type = "temp";
    } else if(context.canvas.id.indexOf("2_3") !== -1) {
        type = "space";
    }
    return type;
};

_WORKSPACE.GRID.getEventType = function(event) {
    var eventType = null;
    switch(event.type) {
        case "mouseover":
            eventType = ["data", "process"];
            break;
        case "mouseleave":
        case "mousedown":
        case "mouseup":
            eventType = "process";
            break;
        case "click":
        case "mouseenter":
        case "mousemove":
            eventType = "data";
            break;
        default:
            break;
    }
    return eventType;
};

_WORKSPACE.GRID.isPointInGrid = function(event, processType) {
    var found;
    if(!event.target) {
        event.target = _WORKSPACE.ELEMENTS.List[CONVERTDRAWING.active_element];
    }
    if(event.type == "mouseover" || event.type == "mouseleave" || event.type == "mousedown" || event.type == "mouseup") {
        found = _WORKSPACE.GRID.FindInCurrent(event, _DRAWING.UI[processType].rowSet[0].dom.getContext("2d"));
        if(!found) {
            found = _WORKSPACE.GRID.FindInCanvas(event, _DRAWING.UI[processType].rowSet[0].dom.getContext("2d"));
        }
    } else if(event.type == "click" || event.type == "mouseover" || event.type == "mouseenter" || event.type == "mousemove") {
        found = _WORKSPACE.GRID.FindInCanvas(event, _DRAWING.UI[processType].rowSet[0].dom.getContext("2d"));
    }
    return found;
};

_WORKSPACE.GRID.actualCoordinates = function(event, type) {
    var type = !type ? _WORKSPACE.GRID.findContext(event.helper.viewContext()) : type;
    if(type !== "" && type !== "ui") {
        return CONVERTDRAWING.Helper.prototype.directedPosition(type);
    }
    return [_DRAWING.UI.canvasObject.boundedArea.xC, _DRAWING.UI.canvasObject.boundedArea.yC];
};

_WORKSPACE.GRID.SearchElementsByPoint = function(event, storageType) {
    var found = false, Grid = null, Elements = null;
    found = _WORKSPACE.GRID.isPointInGrid(event, storageType);
    if(found) {
        Grid = _WORKSPACE.GRID.Locate(event, storageType);
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
    found = _WORKSPACE.GRID.isPointInGrid(event, element.storageType);
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
 * @return _WORKSPACE.GRID.Element
 */
_WORKSPACE.GRID.Locate = function(event, type) {
    type = type || "ui";
    var actual = _WORKSPACE.GRID.actualCoordinates(event, type);
    var dimensions = this.getDimensions([event.pageX, event.pageY]);

    var gridStart = [this.Size.height * (dimensions[0] - 1), this.Size.width * (dimensions[1] - 1)];
    var gridEnd = [this.Size.height * (dimensions[0]), this.Size.width * (dimensions[1])];

    var parameters = {dimensions: dimensions, start: gridStart, end: gridEnd, type: type};
    var gridUuid = _WORKSPACE.GRID.getUUIDPath.call(parameters);

    if(gridUuid) {
        return _WORKSPACE.GRID.List[gridUuid];
    }
    return new _WORKSPACE.GRID.Element(parameters);
};

/**
 * @context Document, Metadata, etc. context
 */
_WORKSPACE.GRID.FindInCanvas = function(event, context) {
    var actual = _WORKSPACE.GRID.actualCoordinates(event, _WORKSPACE.GRID.findContext(context));
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
    var actual = _WORKSPACE.GRID.actualCoordinates(event, _WORKSPACE.GRID.findContext(context));
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

_WORKSPACE.GRID.Element = function(object) {
    var GridInstance = this;
    GridInstance = jQuery.extend(GridInstance, object);

    function create() {
        var gridData = _WORKSPACE.GRID.getUUIDPath.call(this);
        this.uuid = new UUID(1, "ns:Grid", gridData);
        var Grid = _WORKSPACE.GRID.List[this.uuid];
        if(Grid == undefined) {
            this.new = true;
            _WORKSPACE.GRID.List[this.uuid] = GridInstance;
        } else {
            this.new = false;
            return Grid;
        }
    }

    var Grid = create.apply(this);

    if(this.new == false) {
        return Grid;
    }

    /**
     * Return the element if found using element filter
     * @param element
     * @param event
     * @returns {*}
     */
    this.spotElement = function(element, event) {
        var actual = _WORKSPACE.GRID.actualCoordinates(event, this.type), found = false, relativeX, relativeY, points = [];
        /** Found the point is within the bounded area */
        if((actual[0] + event.pageX) > element.el.boundedArea.xC && (actual[1] + event.pageY) > element.el.boundedArea.yC
        && (actual[0] + event.pageX) < (element.el.boundedArea.xC + element.el.boundedArea.width) && (actual[1] + event.pageY) < (element.el.boundedArea.yC + element.el.boundedArea.height)) {
            found = true;
        }
        /** Find whether the point touches the element */
        if(found) {
            relativeX = actual[0] + event.pageX - element.el.boundedArea.xC, relativeY = actual[1] + event.pageY - element.el.boundedArea.yC;
            points = _WORKSPACE.GRID.getPoints({
                pageX: relativeX, 
                pageY: relativeY
            });
            for(var index in points) {
                if(element.el.boundedArea.imagedata[points[index][0] * points[index][1]] != 0) {
                    return element;
                }
            }
            return false;
        }
        return false;
    };

    /**
     * Return the elements if found using coordinates
     * @param event
     */
    this.findElement = function(event) {
        var Grid = _WORKSPACE.GRID.Locate(event, this.type);
        var gridUuid = _WORKSPACE.Grid.getUUIDPath.call(this);
        var Elements = _WORKSPACE.GRID.List[gridUuid].getElements(event); /* Get elements from object of type prefix_UUID: Object */

        var context = _DRAWING.UI[this.type].rowSet[0].dom.getContext("2d");
        var found = _WORKSPACE.GRID.FindInCanvas(event, context), current = null, foundElements = new Object();
        if(found && Elements.contains == true) {
            for(var element in Elements) {
                current = this.spotElement(Elements[element], event);
                if(current !== false) {
                    foundElements[Elements[element].uuid] = current;
                }
            }
            return foundElements;
        }
        return false;
    };

    /**
     * Returns the elements available to the current Grid
     */
    this.getElements = function(event) {
        return this.ELEMENTS;
    };

    /**
     * Adds an element to grid elements
     * @param element
     */
    this.addElement = function(element) {
        if(this.ELEMENTS.contains == false) {
            this.ELEMENTS.contains = true;
        }
        if(this.ELEMENTS.elements.hasOwnProperty(element.uuid) == undefined) {
            this.ELEMENTS.elements[element.uuid] = {};
        }
        this.ELEMENTS.elements[element.uuid] = element;
    };

    /**
     * Removes all the elements from the Grid with the same uuid
     * @param element
     * @returns {_WORKSPACE.GRID.Element}
     */
    this.removeElement = function(element) {
        var uuid = element.uuid;
        delete this.ELEMENTS.elements[uuid];
        return this;
    };

    /**
     * Get the elements ordered by weight
     * @param event
     */
    this.getElementsByTop = function(event) {

    };

    this.ELEMENTS = {contains: false, elements: {}};

    return this;
};

_WORKSPACE.ELEMENTS.Element = function(object) {
    this.version = 1;
    this.previousUuid = null;
    this.previousRuuid = null;
    object.e = this;
    this.el = object;

    function create() {
        var date = new Date();
        this.uuid = new UUID(1, "ns:Element", this.el.name + "_" + date.getTime());
        var Element = _WORKSPACE.ELEMENTS.List[this.uuid];
        if(Element == undefined) {
            this.new = true;
            _WORKSPACE.ELEMENTS.List[this.uuid] = this;
        } else {
            this.new = false;
            return Element;
        }
    }

    var Element = create.apply(this);

    if(this.new == false) {
        return Element;
    }

    /**
     * Get the Bounded Area for the element
     */
    this.getBoundedArea = function() {
        return this.el.boundedArea.b;
    };

    /**
     * Get the grid for the element
     */
    this.getGrid = function() {
         var point = this.el.point;
         var eventObject = {pageX: point[0], pageY: point[1]};
         var Grid = _WORKSPACE.GRID.Locate(eventObject, this.el.storageType);
         return Grid;
    };

    this.incrementVersion = function() {
        return ++this.version;
    };

    /**
     *
     * Sets the Bounded Area
     * @param b _WORKSPACE.BOUNDEDAREA.Element
     */
    this.setBoundedArea = function(b) {
        this.el = b.ba.context;
    };

    /**
     * Gets the Bounded Area from the UUID
     */
    this.getBoundedAreaGrid = function() {
        var BAruuid = new UUID(1, "ns:RepositoryElement", this.el.name + "_" + this.uuid);
        return _WORKSPACE.ELEMENT_REPOSITORY.BOUNDED_AREA.elements[BAruuid];
    };

    this.setUuid = function() {
        var date = new Date();
        this.previousUuid = this.uuid;
        this.uuid = new UUID(this.version, "ns:Element", this.el.name + "_" + date.getTime());
    };

    this.setruuid = function(ruuid) {
        this.previousRuuid = ruuid;
    };
};

_WORKSPACE.BOUNDEDAREA.Element = function(object) {
    object.b = this;
    this.ba = object;

    function create() {
        var baData = this.ba.context.e.uuid;
        this.uuid = new UUID(1, "ns:BoundedArea", baData);
        var BoundedArea = _WORKSPACE.BOUNDEDAREA.List[this.uuid];
        if(BoundedArea == false) {
            this.new = true;
            _WORKSPACE.BOUNDEDAREA.List[this.uuid] = this;
        } else {
            this.new = false;
            return BoundedArea;
        }
    }

    var BoundedArea = create.apply(this);

    if(this.new == false) {
        return BoundedArea;
    }

    /**
     * Get Pivot Coordinates from the bounded area metadata
     */
    this.getPivotCoordinates = function() {

    };

    /**
     * Get the element
     * @returns {_WORKSPACE.ELEMENTS.Element|*}
     */
    this.getElement = function() {
        return this.ba.context.e;
    };
};

_WORKSPACE.ELEMENT_REPOSITORY.Singleton = function() {

    this.ELEMENTS = {contains: false, elements: {}};
    this.BOUNDED_AREA = {contains: false, elements: {}};

    /**
     * Adds the Convert Drawing Objects to the repository
     * @param el
     */
    this.addElementToRepository = function(el, lifecycle_stage, uuid, replaceEl) {
        var Element = null, ruuid = null;
        if(lifecycle_stage == LIFECYCLE_CREATE) {
            Element = new _WORKSPACE.ELEMENTS.Element(el);
            ruuid = new UUID(1, "ns:RepositoryElement", el.name + "_" + Element.uuid);
        } else if(lifecycle_stage == LIFECYCLE_CLONE && replaceEl != undefined) {
            var previousRuuid = new UUID(Element.version, "ns:RepositoryElement", el.name + "_" + Element.uuid);
            Element = jQuery.extend(true, el.e);
            Element.incrementVersion();
            Element.setUuid();
            Element.setruuid(previousRuuid);
            Element.el = replaceEl;
            ruuid = new UUID(Element.version, "ns:RepositoryElement", el.name + "_" + Element.uuid);
        } else if(lifecycle_stage == ELEMENT_CREATE && uuid != undefined) {
            Element = _WORKSPACE.ELEMENTS.List[uuid];
            Element.el = el;
            ruuid = new UUID(Element.version, "ns:RepositoryElement", el.name + "_" + Element.uuid);
        } else if(lifecycle_stage == ELEMENT_EDIT) {
            Element = _WORKSPACE.ELEMENTS.List[uuid];
            Element.el = el;
            Element.incrementVersion();
            ruuid = new UUID(Element.version, "ns:RepositoryElement", el.name + "_" + Element.uuid);
        }
        Element.ruuid = ruuid;
        if(this.ELEMENTS.contains == false) {
            this.ELEMENTS.contains = true;
        }
        this.ELEMENTS.elements[ruuid] = Element;
    };

    this.addBoundedAreaToRepository = function(ba, lifecycle_stage, uuid, replaceBa) {
        var BoundedArea = null, ruuid = null;
        if(lifecycle_stage == LIFECYCLE_CREATE) {
            BoundedArea = new _WORKSPACE.BOUNDED_AREA.Element(ba);
            ruuid = new UUID(1, "ns:RepositoryElement", BoundedArea.getElement().el.name + "_" + BoundedArea.uuid);
        } else if(lifecycle_stage == LIFECYCLE_CLONE && replaceBa != undefined) {
            BoundedArea = jQuery.extend(true, ba.b);
            BoundedArea.ba = replaceBa;
            ruuid = new UUID(1, "ns:RepositoryElement", BoundedArea.getElement().el.name + "_" + BoundedArea.uuid);
        } else if(lifecycle_stage == BOUNDED_AREA_CREATE && uuid != undefined) {
            BoundedArea = _WORKSPACE.BOUNDED_AREA.List[uuid];
            BoundedArea.ba = ba;
            ruuid = new UUID(1, "ns:RepositoryElement", BoundedArea.getElement().el.name + "_" + BoundedArea.uuid);
        } else if(lifecycle_stage == BOUNDED_AREA_EDIT) {
            BoundedArea = _WORKSPACE.BOUNDED_AREA.List[uuid];
            BoundedArea.ba = ba;
            ruuid = new UUID(1, "ns:RepositoryElement", BoundedArea.getElement().el.name + "_" + BoundedArea.uuid);
        }
        if(this.BOUNDED_AREA.contains == false) {
            this.BOUNDED_AREA.contains = true;
        }
        this.BOUNDED_AREA.elements[ruuid] = BoundedArea;
    };

    /**
     * Removes the recent version of the element from the repository
     * @param element
     * @returns {_WORKSPACE.ELEMENT_REPOSITORY.Singleton}
     */
    this.removeRecentVersion = function(element) {
        var uuid = element.uuid;
        this.ELEMENTS.elements[uuid].pop();
        return this;
    };

};

_WORKSPACE.ELEMENT_REPOSITORY.Factory = function() {

};

_WORKSPACE.ELEMENT_REPOSITORY.Factory.create = function() {
    var ElementRepository = null;

    return function() {
        if(ElementRepository != null) {
            return ElementRepository;
        }
        ElementRepository = new _WORKSPACE.ELEMENT_REPOSITORY.Singleton();
        return ElementRepository;
    };
};

(function() {

    _WORKSPACE.GRID.Size = {
        width: _WORKSPACE.PRELAYOUT.canvasWidth,
        height: _WORKSPACE.PRELAYOUT.canvasHeight,
        totalWidth: _WORKSPACE.PRELAYOUT.totalWidth,
        totalHeight: _WORKSPACE.PRELAYOUT.totalHeight,
        multiplier: 7,
        spread: 4,
        gridColumn: Math.ceil(_WORKSPACE.PRELAYOUT.totalWidth / _WORKSPACE.PRELAYOUT.canvasWidth),
        gridRow: Math.ceil(_WORKSPACE.PRELAYOUT.totalHeight / _WORKSPACE.PRELAYOUT.canvasHeight),
        coordinates: function(gridColumn, gridRow) { /* return Array */

        }
    };

})();    