/**
 * Created by aswin.vijayakumar on 06/04/2017.
 */

var SPLIT_TYPE_POINT = "point", SPLIT_TYPE_LINE = "line", SPLIT_TYPE_SLANT = "slant", SPLIT_TYPE_VERTEX = "vertex";
var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};
var _WORKSPACE = _WORKSPACE || {};
var _DRAWING = _DRAWING || {};
var _DOCUMENT = _DOCUMENT || {};

CONVERTDRAWING.FEATURES = {};

CONVERTDRAWING.FEATURES.Split = function() {
    /** Set object for hard splitting **/
    this.nodes = null;
    this.nodeConnections = [];


};

CONVERTDRAWING.FEATURES.Split.prototype = {
    createNodeConnection: function() {

    },
    /**
     * Returns the Specification obtained on implicit splitting
     * @returns {*}
     */
    setSpecification: function() {
        var element = this.element;
        var Spec = null;
        if(this.hasOwnProperty("initSpec")) {
            this.initSpec();
        }
        for(var i in this[this.SPLIT_TYPE]) {
            Spec[this[this.SPLIT_TYPE][i]] = {"splitAt": this["get" + this[this.SPLIT_TYPE][i].toUpperCase() + "Position"](), "defaultAction": "scale"};
        }
        return Spec;
    }
};

CONVERTDRAWING.FEATURES._1DSplit = function() {

};

CONVERTDRAWING.FEATURES._1DSplit.prototype = {
    SPLIT_TYPE: "segment",
    segment: ["start", "end"],
    getStartPosition: function() {
        return this.element.start;
    },
    getEndPositiion: function() {
        return this.element.endPoint;
    },
    /**
     * Returns the Specification obtained on explicit splitting
     * @param splitAt
     * @returns {*}
     */
    nodeSpecification: function(splitAt) {
        var element = this.element;
        var Spec = null;
        if(this.nodes.length == 0) {
            Spec = this.setSpecification();
        } else {
            for(var i in this.nodes) {
                if(this.segment.indexOf(i) == -1) {
                    Spec[i] = this.nodes[i];
                }
            }
        }
        Spec[splitAt[0] + "_" + splitAt[1]] = {"splitAt": splitAt, "defaultAction": "scale"};
        return Spec;
    }
};

CONVERTDRAWING.FEATURES._2DSplit = function() {

};

CONVERTDRAWING.FEATURES._2DSplit.prototype = {
    SPLIT_TYPE: "algorithmic",
    algorithmic: ["leftUpper", "leftMiddleUpper", "rightUpper", "leftMiddle", "rightMiddle", "leftLower", "leftMiddleLower", "rightLower"],
    initSpec: function() {
        var count = 0;
        for(var i in this[this.SPLIT_TYPE]) {
            this["get" + this[this.SPLIT_TYPE][i].toUpperCase() + "Position"] = function() {
                if(count < 3) {
                    this["get" + this[this.SPLIT_TYPE][i] + "Position"] = function() {
                        return [this.element.pivot[0] + (count/2) * this.element.size[0], this.element.pivot[1]];
                    };
                } else if(count < 5) {
                    this["get" + this[this.SPLIT_TYPE][i] + "Position"] = function() {
                        return [this.element.pivot[0] + (count - 3) * this.element.size[0], this.element.pivot[1] + (count - 2) / 2 * this.element.size[1] / 2];
                    };
                } else {
                    this["get" + this[this.SPLIT_TYPE][i] + "Position"] = function() {
                        return [this.element.pivot[0] + (count - 5)/2 * this.element.size[0], this.element.pivot[1] + this.element.size[1]];
                    };
                }
            };
        }
    },
    /**
     * Returns the Specification obtained on Specified Splitting
     * @param segment
     */
    nodeSpecification: function(segment) {
        var element = this.element;
        var Spec = null;

    }
};

CONVERTDRAWING.FEATURES.CircleSplit = function() {

};

CONVERTDRAWING.FEATURES.CircleSplit.prototype = {
    SPLIT_TYPE: "position",
    position: ["top", "bottom"],
    getTopPosition: function () {
        return [this.element.pivot[0] + this.element.size[0] / 2, this.element.pivot[1]];
    },
    getBottomPosition: function () {
        return [this.element.pivot[0] + this.element.size[0] / 2, this.element.pivot[1] + this.element.size[1]];
    }
};

CONVERTDRAWING.FEATURES.Group = function() {

};

CONVERTDRAWING.FEATURES.Group.prototype = {

};

CONVERTDRAWING.FEATURES.Collision = function() {

};

/**
 * Returns the intersection point on intersecting two 1D objects
 */
CONVERTDRAWING.FEATURES.Collision.Intersection = function(_1DObject_1, _1DObject_2) {

    var _IDObject_1 = _1DObject_1, _1DObject_2 = _1DObject_2;

    var getSpecification = function() {
        var funcName = _IDObject_1.name + "to" + _1DObject_2.name + SPLIT_TYPE_POINT.toUpperCase();
        var InterSection = CONVERTDRAWING.Intersection()[funcName]();
        InterSection.initiate();
        return InterSection.moveSpecification(_1DObject_2.endPoint);
    };

    return {
        getSpecification: getSpecification
    };
};

/**
 * Returns the Link element on intersecting a 1D and 2D object
 */
CONVERTDRAWING.FEATURES.Collision.Link = function() {



};

/**
 * Returns the Mesh element on intersecting two 2D objects
 */
CONVERTDRAWING.FEATURES.Collision.Mesh = function() {



};

CONVERTDRAWING.FEATURES.Collision.prototype = {

};

CONVERTDRAWING.FEATURES.Binding = function(BindingElement_first, BindingElement_second) {

};

CONVERTDRAWING.FEATURES.Binding.prototype = {
    Flange: function() {

        var getSpecification = function() {

        };

        var bindingSpecification = function() {

        };

    },
    Connector: function() {

        var getSpecification = function() {

        };

        var bindingSpecification = function() {

        };

    }
};

CONVERTDRAWING.FEATURES.Join = function(Element_first, Element_second, Binding) {

    var bindingSpecification;



};

CONVERTDRAWING.FEATURES.Join.prototype = {
    JOIN_METHODS: {
        "PathToPath": CONVERTDRAWING.FEATURES.Binding.prototype.Flange,
        "PointToPoint": CONVERTDRAWING.FEATURES.Binding.prototype.Connector
    }
};