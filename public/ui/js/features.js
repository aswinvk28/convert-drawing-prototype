/**
 * Created by aswin.vijayakumar on 06/04/2017.
 */

var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};
var _WORKSPACE = _WORKSPACE || {};
var _DRAWING = _DRAWING || {};
var _DOCUMENT = _DOCUMENT || {};

CONVERTDRAWING.FEATURES = {};

CONVERTDRAWING.FEATURES.Split = function() {
    /** SVG nodes **/
    this.nodes = [];
    this.nodeConnections = [];

    
};

CONVERTDRAWING.FEATURES.Split.prototype = {
    createNodeConnection: function() {

    },
    nodeSpecification: function() {
        var element = this.element;
        var Spec = null;
        if(this.hasOwnProperty("initSpec")) {
            this.initSpec();
        }
        for(var i in this[this.SPLIT_TYPE]) {
            Spec[this[this.SPLIT_TYPE]] = {"SplitAt": this["get" + this[this.SPLIT_TYPE].toUpperCase() + "Position"](), "defaultAction": "scale"};
        }
        return Spec;
    }
};

CONVERTDRAWING.FEATURES._1DSplit = function() {

};

CONVERTDRAWING.FEATURES._1DSplit.prototype = {
    SPLIT_TYPE: "segment",
    position: ["start", "end"],
    getStartPosition: function() {
        return this.element.start;
    },
    getEndPositiion: function() {
        return this.element.endPoint;
    }
};

CONVERTDRAWING.FEATURES._2DSplit = function() {

};

CONVERTDRAWING.FEATURES._2DSplit.prototype = {
    SPLIT_TYPE: "algorithmic",
    position: ["leftUpper", "leftMiddleUpper", "rightUpper", "leftMiddle", "rightMiddle", "leftLower", "leftMiddleLower", "rightLower"],
    initSpec: function() {
        var count = 0;
        for(var i in this[this.SPLIT_TYPE]) {
            this["get" + this[this.SPLIT_TYPE].toUpperCase() + "Position"] = function() {
                if(count < 3) {
                    this["get" + this[this.SPLIT_TYPE] + "Position"] = function() {
                        return [this.element.pivot[0] + (count/2) * this.element.size[0], this.element.pivot[1]];
                    };
                } else if(count < 5) {
                    this["get" + this[this.SPLIT_TYPE] + "Position"] = function() {
                        return [this.element.pivot[0] + (count - 3) * this.element.size[0], this.element.pivot[1] + (count - 2) / 2 * this.element.size[1] / 2];
                    };
                } else {
                    this["get" + this[this.SPLIT_TYPE] + "Position"] = function() {
                        return [this.element.pivot[0] + (count - 5)/2 * this.element.size[0], this.element.pivot[1] + this.element.size[1]];
                    };
                }
            };
        }
    }
};

CONVERTDRAWING.FEATURES.CircleSplit = function() {

};

CONVERTDRAWING.FEATURES.CircleSplit.prototype = {
    SPLIT_TYPE: "position",
    position: ["top", "bottom"],
    getTopPosition: function() {
        return [this.element.pivot[0] + this.element.size[0] / 2, this.element.pivot[1]];
    },
    getBottomPosition: function() {
        return [this.element.pivot[0] + this.element.size[0] / 2, this.element.pivot[1] + this.element.size[1]];
    }
};