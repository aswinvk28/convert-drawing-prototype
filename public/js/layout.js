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

        $('#page_body').append(uiC).append(docC).append(metaC).append(exportC).append(tempC).append(spaceC);
    };
    
};

(function(window, document, $) {
    
    _WORKSPACE.ROWSET = [];
    var preLayout = new _WORKSPACE.preLayout(window, document);
    preLayout.setCanvas(CONVERTDRAWING.canvas);

    preLayout.createLayout();
    
    _WORKSPACE.PRELAYOUT = preLayout;
    
})(window, document, jQuery);