/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

describe("the spec should select the correct process cycle for the specified usage", function() {
    
    beforeAll(function() {
        this.point = ConvertDrawing(new CONVERTDRAWING.Point([10, 20]));
    });
    
    it("should select the correct process type during the initialisation of the element", function() {
        expect(this.point.parent.refContext.canvas.id).toBe("canvas-grid-2_3");
    });
    
    it("should have the pixel data cleared from the process cycle", function() {
        var boundedAreaArgs = _DRAWING.UI.temp.boundedArea.getAreaArguments();
        var imagedata = this.point.parent.refContext.getImageData(boundedAreaArgs[0], boundedAreaArgs[1], boundedAreaArgs[3], boundedAreaArgs[4]);
        var zeroValue = true;
        for(var index in imagedata) {
            if(imagedata[index] !== 0) {
                zeroValue = false;
                break;
            }
        }
        expect(zeroValue).toBe(true);
    });
    
});
