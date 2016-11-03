/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * @see {Paul Lewis}
 */

var _WORKSPACE = _WORKSPACE || {};
var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};

_WORKSPACE.preLayout = function(window, document) {
    this.document = document;
    this.window = window;
    
    this.rowNumber = function(mbyn) {
        return Math.floor(mbyn / this.rowCount);
    };
    
    this.columnNumber = function(mbyn) {
        return (mbyn % this.columnCount) == 0 ? this.columnCount : (mbyn % this.columnCount);
    };
    
    this.setCanvas = function(canvas) {
        this.deciderCanvas = canvas;
        
        this.totalWidth = $(window).width();
        this.totalHeight = $(window).height();
        this.screenWidth = window.screen.width;
        this.screenHeight = window.screen.height;
        
        canvas.width = this.screenWidth / 3;
        canvas.height = this.screenHeight / 2;
        this.canvasWidth = $(canvas).width();
        this.canvasHeight = $(canvas).height();

        return canvas;
    };

    this.createLayout = function() {
        var uiC = document.createElement("canvas"), 
            docC = document.createElement("canvas"),
            metaC = document.createElement("canvas"),
            exportC = document.createElement("canvas"),
            tempC = document.createElement("canvas"),
            spaceC = document.createElement("canvas");
        uiC.id = "canvas-grid-1_1";
        docC.id = "canvas-grid-1_2";
        metaC.id = "canvas-grid-1_3";
        exportC.id = "canvas-grid-2_1";
        tempC.id = "canvas-grid-2_2";
        spaceC.id = "canvas-grid-2_3";
        uiC.className = docC.className = metaC.className = exportC.className = tempC.className = spaceC.className = "grid-canvas";

        var uiC_container = document.createElement("div"), 
            docC_container = document.createElement("div"),
            metaC_container = document.createElement("div"),
            exportC_container = document.createElement("div"),
            tempC_container = document.createElement("div"),
            spaceC_container = document.createElement("div");
        uiC_container.id = "div-grid-1_1";
        docC_container.id = "div-grid-1_2";
        metaC_container.id = "div-grid-1_3";
        exportC_container.id = "div-grid-2_1";
        tempC_container.id = "div-grid-2_2";
        spaceC_container.id = "div-grid-2_3";
        uiC_container.className = docC_container.className = metaC_container.className = exportC_container.className = tempC_container.className = spaceC_container.className = "grid-div";

        $(uiC_container).append(uiC);
        $(docC_container).append(docC);
        $(metaC_container).append(metaC);
        $(exportC_container).append(exportC);
        $(tempC_container).append(tempC);
        $(spaceC_container).append(spaceC);
        
        $('#page_body').append(uiC_container).append(docC_container).append(metaC_container).append(exportC_container).append(tempC_container).append(spaceC_container);
    };
    
};

(function(window, document, $) {
    
    _WORKSPACE.ROWSET = [];
    var preLayout = new _WORKSPACE.preLayout(window, document);
    preLayout.setCanvas(CONVERTDRAWING.canvas);

    preLayout.createLayout();
    
    _WORKSPACE.PRELAYOUT = preLayout;
    
})(window, document, jQuery);