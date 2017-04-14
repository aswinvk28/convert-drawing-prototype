/**
 * Created by aswin.vijayakumar on 07/04/2017.
 */

var GLOBALS = GLOBALS || {};
GLOBALS.SPLIT_TOKEN_SIZE = 5;
GLOBALS.PAPER_CREATE_CALLBACK = function() {
    var paper = this, svg = this.svg;
    var document = _DRAWING.UI.document.rowset[0], view = _DRAWING.UI.canvasObject;
    svg.style.position = "absolute";
    svg.id = "presentation";
    svg.className = "presentation";
    paper.setViewBox(0,0,view.width, view.height);
    PubSub.publish("/svg/create", paper);
};

/**
 * Set of nodes created temporarily on an element
 */
PubSub.subscribe("/set/create", function(paper, split, element) {
    if(element != undefined) {
        split.element = element;
    }
    var Spec = split.setSpecification();
    var Set = paper.set();
    split.element.set = Set;
    if(Spec != null) {
        for(var index in Spec) {
            var x = Spec[index]["splitAt"][0];
            var y = Spec[index]["splitAt"][1];
            var token = paper.circle(x, y, GLOBALS.SPLIT_TOKEN_SIZE);
            token.data("position", index);
            Set.push(token);
        }
        Set.data("uuid", element.e.uuid);
    }
});

PubSub.subscribe("/set/delete", function(paper, split) {
    var Set = split.element.set;
    if(Set != undefined) {
        Set.remove();
    }
});

(function() {
    var document = _DRAWING.UI.document.rowset[0];
    GLOBALS.Paper = Raphael(-(document.xC), -(document.yC), document.width, document.height, GLOBALS.PAPER_CREATE_CALLBACK);
});