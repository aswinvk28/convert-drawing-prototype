/**
 * Created by aswin.vijayakumar on 07/04/2017.
 */

var GLOBALS = GLOBALS || {};
GLOBALS.PAPER_CREATE_CALLBACK = function() {
    var paper = this, svg = this.svg;
    var document = _DRAWING.UI.document.rowset[0], view = _DRAWING.UI.canvasObject;
    svg.style.position = "absolute";
    svg.id = "presentation";
    svg.className = "presentation";
    paper.setViewBox(0,0,view.width, view.height);
    PubSub.publish("/svg/create", paper);
};

(function() {
    var document = _DRAWING.UI.document.rowset[0];
    GLOBALS.Paper = Raphael(-(document.xC), -(document.yC), document.width, document.height, GLOBALS.PAPER_CREATE_CALLBACK);
});