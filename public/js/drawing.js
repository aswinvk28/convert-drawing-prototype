/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var _WORKSPACE = _WORKSPACE || {};
var CONVERTDRAWING = CONVERTDRAWING || {};
var DOMSUPPORT = DOMSUPPORT || {};
var _DRAWING = _DRAWING || {};
var _DOCUMENT = _DOCUMENT || {};

(function() {
    var params = [];
    params[0] = new _WORKSPACE.canvasObject(document.getElementById("canvas-grid-1_1"));
    params[1] = {};
    params[1]['document'] = new _WORKSPACE.documentObject(document.getElementById("canvas-grid-1_2")); // show data such as point, etc (initial co-ordinates are set)
    params[1]['metadata'] = new _WORKSPACE.metadataObject(document.getElementById("canvas-grid-1_3")); // show data such as grid, etc (initial co-ordinates are set)
    params[1]['export'] = new _WORKSPACE.canvasObject(document.getElementById("canvas-grid-2_1"));
    params[1]['temp'] = new _WORKSPACE.canvasObject(document.getElementById("canvas-grid-2_2")); // clear temp frequently
    params[1]['space'] = new _WORKSPACE.spaceObject(document.getElementById("canvas-grid-2_3"));
    var viewPort = new _WORKSPACE.viewPort(params);
    var documentMetadata = (new _WORKSPACE.metadata({
        
    }, viewPort.document.rowSet[0].dom.getContext('2d')));
    documentMetadata.setBoundedArea(params[1]['document'].boundedArea);
    viewPort.setMetadataForChannel('document', documentMetadata);
    var metaMetadata = (new _WORKSPACE.metadata({
        
    }, viewPort.metadata.rowSet[0].dom.getContext('2d')));
    metaMetadata.setBoundedArea(params[1]['metadata'].boundedArea);
    viewPort.setMetadataForChannel('metadata', metaMetadata);
    _DRAWING.UI = ConvertDrawing(viewPort); // goes to constructor and _init
    _DRAWING.UI.canvasObject = params[0];
    _DRAWING.TEMP = _DRAWING.UI.temp;
})();
