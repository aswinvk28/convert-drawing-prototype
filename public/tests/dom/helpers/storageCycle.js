/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

describe("the spec should select the correct storage cycle for the specified usage", function() {
    
    var object, lineObject, switchObject;
    beforeAll(function() {
        object = {
            currentPosition: CONVERTDRAWING.Point.prototype.currentPosition
        };
        spyOn(object, 'currentPosition');
        delete(CONVERTDRAWING.Point.prototype.currentPosition);
        CONVERTDRAWING.Point.prototype.currentPosition = object.currentPosition;
        this.point = ConvertDrawing(new CONVERTDRAWING.Point([10, 20]));
        
        lineObject = {
            currentPosition: CONVERTDRAWING.Line.prototype.currentPosition
        };
        spyOn(lineObject, 'currentPosition');
        delete(CONVERTDRAWING.Line.prototype.currentPosition);
        CONVERTDRAWING.Line.prototype.currentPosition = lineObject.currentPosition;
        this.line = ConvertDrawing(new CONVERTDRAWING.Line([10, 20]));
        switchObject = {
            init: this.line.parent._init
        };
        spyOn(switchObject, 'init');
        this.line.parent._init = switchObject.init;
    });
    
    it("should select the correct storage type for the selected element, helper or object while the process is in unused state", function() {
        expect(this.point.storageType).toBe("metadata");
        expect(object.currentPosition).toHaveBeenCalled();
    });
    
    it("should select the correct storage type for the chosen element, helper or object during the execution of the process ", function() {
        this.line.setMidPoint([20, 30]);
        this.line.setBoundedArea("document");
        this.line.activity.execute.call(this, "document", { pageX: 20, pageY: 30 });
        
        expect(this["documentChannel"].dataTransfer.reverse).toBe(false);
        expect(lineObject.currentPosition).toHaveBeenCalled();
        expect(switchObject.currentPosition).toHaveBeenCalled();
    });
    
});
