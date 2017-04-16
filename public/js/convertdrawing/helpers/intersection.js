/**
 * Created by aswin.vijayakumar on 10/04/2017.
 */

var INTERSECTION_CONSTRAINT_POINT = "point", INTERSECTION_CONSTRAINT_PATH = "path", INTERSECTION_CONSTRAINT_CONTOUR = "contour", INTERSECTION_CONSTRAINT_MESH = "mesh";
var _WORKSPACE = _WORKSPACE || {};
var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};
var _DRAWING = _DRAWING || {};
var _DOCUMENT = _DOCUMENT || {};

CONVERTDRAWING.Intersection = function() {

    var x = null, y = null, curve_first, curve_second, moveSpecification;

    if(this instanceof CONVERTDRAWING.Intersection) {
        this.active_curve = null, this.passive_curve = null;
        this.active_curve_point = "", this.passive_curve_point = "";
        this.x = x;
        this.y = y;

        this.initiate = function(control_point) {
            if(curve_first.isPointInCurve(control_point) == true) {
                this.active_curve = curve_first;
                this.passive_curve = curve_second;
            } else if(curve_second.isPointInCurve(control_point) == true) {
                this.active_curve = curve_second;
                this.passive_curve = curve_first;
            }
            if(control_point[0] == this.active_curve.start[0] && control_point[1] == this.active_curve.start[1]) {
                this.active_curve_point = "start";
                this.passive_curve_point = "endPoint";
            } else if(control_point[0] == this.active_curve.endPoint[0] && control_point[1] == this.active_curve.endPoint[1]) {
                this.active_curve_point = "endPoint";
                this.passive_curve_point = "start";
            }
        };

        this.moveSpecification = moveSpecification;

        return this;
    }

    /**
     * The intersection point that depends on the curves
     */
    var LineToLinePoint = function(curve_first, curve_second) {
        curve_first = curve_first, curve_second = curve_second;

        x = function(yIntercept1, yIntercept2, slope1, slope2) {
            return (yIntercept1 - yIntercept2) / (slope2 - slope1);
        };

        y = function(slope1, yIntercept1, x) {
            return slope1 * x + yIntercept1;
        };

        moveSpecification = function(control_point) {
            this.active_curve[this.active_curve_point] = control_point;
            if(this.active_curve_point == "start") {
                this.active_curve.setMidPoint(this.active_curve[this.passive_curve_point]);
            } else if(this.passive_curve_point == "start") {
                this.active_curve.setMidPoint(this.active_curve[this.active_curve_point]);
            }
            this.active_curve.setSlope();

            var Spec = null;
            var yIntercept1 = this.active_curve.findYIntercept(), slope1 = this.active_curve.slope;
            var yIntercept2 = this.passive_curve.findYIntercept(), slope2 = this.passive_curve.slope;
            var x_calc = this.x(yIntercept1, yIntercept2, slope1, slope2);
            Spec[this.active_curve.splitType[0]] = {
                x: x_calc,
                y: this.y(slope1, yIntercept1, x_calc)
            };
            return Spec;
        };

        return new CONVERTDRAWING.Intersection();
    };

    // var LineToQBezierPoint = function(curve_first, curve_second) {
    //     curve_first = curve_first, curve_second = curve_second;
    //
    //     var p0 = curve_second.p0, p1 = curve_second.p1, p2 = curve_second.p2;
    //
    //     x = function(slope1, yIntercept1, t) {
    //         return (((1 - t)^2 * p0[0] + 2*t*(1 - t)*p1[0] + t^2 * p2[0]) - yIntercept1) / slope1;
    //     };
    //
    //     y = function(slope1, yIntercept1, x) {
    //         return slope1 * x + yIntercept1;
    //     };
    // };

    var LineToCBezierPoint = function(curve_first, curve_second) {

    };

    // var QBezierToQBezierPoint = function(curve_first, curve_second) {
    //     curve_first = curve_first, curve_second = curve_second;
    //
    //     var pTwo0 = curve_second.p0, pTwo1 = curve_second.p1, pTwo2 = curve_second.p2;
    //     var pOne0 = curve_first.p0, pOne1 = curve_first.p1, pOne2 = curve_first.p2;
    //
    //     x = function(t1) {
    //         return ;
    //     };
    //
    //     y = function(x) {
    //         return ;
    //     };
    // };

    var QBezierToCBezierPoint = function(curve_first, curve_second) {

    };

    var CBezierToCBezierPoint = function(curve_first, curve_second) {

    };

    var FlangeIntersection = function(curve_first, curve_second) {

        moveSpecification = function(control_point) {

        };

    };

    var ConnectorIntersection = function(curve_first, curve_second) {

        moveSpecification = function(control_point) {

        };

    };

    return {
        "LineToLinePoint": LineToLinePoint
    };

};

CONVERTDRAWING.Intersection.prototype = {

};