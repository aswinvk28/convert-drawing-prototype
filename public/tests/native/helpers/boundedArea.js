/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

describe("The spec for boundedArea defines that", function() {
    
    describe("the definitions for data storage and data processing area are that", function() {
        
        beforeAll(function() {
            this.viewPort = _DRAWING.UI.canvasObject;
            this.document = _DRAWING.UI.document.rowSet[0];
            this.metadata = _DRAWING.UI.metadata.rowSet[0];
        });
        
        it("should show that the translation points and initial Coordinates for all data types are set to proper coordinates", function() {
            expect(this.document.initialXC).toEqual(this.document.width * 3 / 7);
            expect(this.document.initialYC).toEqual(this.document.height * 3 / 7);
            
            expect(this.metadata.initialXC).toEqual(this.metadata.width * 3 / 7);
            expect(this.metadata.initialYC).toEqual(this.metadata.height * 3 / 7);
            
            expect(this.document.width).toEqual(this.viewPort.width * 7);
            expect(this.document.height).toEqual(this.viewPort.height * 7);
            
            expect(this.metadata.width).toEqual(this.viewPort.width * 7);
            expect(this.metadata.height).toEqual(this.viewPort.height * 7);
        });
        
        it("should show that all data types have a proper bounded area defined by initial layout", function() {
            expect(this.document.boundedArea).not.toEqual(undefined);
            expect(this.document.boundedArea).not.toBeNull();
            
            expect(this.document.boundedArea.xC).toEqual(this.document.initialXC);
            expect(this.document.boundedArea.yC).toEqual(this.document.initialYC);
            
            expect(this.metadata.boundedArea.xC).toEqual(this.metadata.initialXC);
            expect(this.metadata.boundedArea.yC).toEqual(this.metadata.initialYC);
            
            // consistent bounded area and initial coordinates
            expect(this.document.initialXC).toEqual(this.metadata.initialXC);
            expect(this.document.initialYC).toEqual(this.metadata.initialYC);
            expect(this.document.boundedArea.xC).toEqual(this.metadata.boundedArea.xC);
            expect(this.document.boundedArea.yC).toEqual(this.metadata.boundedArea.yC);
        });
        
//        it("should show that scaling of the bounded area works", function() {
//            
//        });
//        
//        it("should show that moving of the bounded area works", function() {
//            
//        });
        
    });

    describe("the definitions for the bounded area for drawing elements and drawing objects are that", function() {
        
        beforeAll(function() {
            var pevent = $.Event("click.Point", {pageX: 10, pageY: 20});
            var levent = $.Event("click.Line", {pageX: 10, pageY: 20});
            var cevent = $.Event("click.Circle", {pageX: 10, pageY: 20});
            this.point = ConvertDrawing(new CONVERTDRAWING.Point([pevent.pageX, pevent.pageY]), [null, CONVERTDRAWING.Point.prototype.storageType, pevent]);
            this.line = ConvertDrawing(new CONVERTDRAWING.Line([levent.pageX, levent.pageY]), [null, CONVERTDRAWING.Line.prototype.storageType, levent]);
            this.circle = ConvertDrawing(new CONVERTDRAWING.Circle([cevent.pageX, cevent.pageY]), [null, CONVERTDRAWING.Circle.prototype.storageType, cevent]);
            this.line.setMidPoint([20,30]);
            this.circle.setMidPoint([20,30]);
        });
        
        it("the selected points for a given line should be within and outside the bounded area", function() {
            var xC = 15, yC = 15;
            expect(this.line.boundedArea.width < 12 && this.line.boundedArea.height < 12).toBe(true);
            expect(this.line.boundedArea.width > 8 && this.line.boundedArea.height > 8).toBe(true);
            expect(((this.line.boundedArea.xC - _DRAWING.UI.getChannel("document").dataTransfer.getMetadata().boundedArea.xC)) >= this.line.point[0] 
                && (this.line.boundedArea.yC - _DRAWING.UI.getChannel("document").dataTransfer.getMetadata().boundedArea.yC) >= this.line.point[1]).toBe(true);
        });
        
        it("the selected points for a given point should be within and outside the bounded area", function() {
            expect(this.point.boundedArea.width === this.point.size[0] && this.point.boundedArea.height === this.point.size[1]).toBe(true);
            expect(this.point.boundedArea.xC - this.point.start[0] <= _DRAWING.UI.getChannel("metadata").dataTransfer.getMetadata().boundedArea.xC 
                && this.point.boundedArea.yC - this.point.start[1] <= _DRAWING.UI.getChannel("metadata").dataTransfer.getMetadata().boundedArea.yC).toBeTruthy();
            expect(this.point.boundedArea.xC - _DRAWING.UI.getChannel("metadata").dataTransfer.getMetadata().boundedArea.xC === (this.point.point[0] - this.point.size[0]/2)
                && this.point.boundedArea.yC - _DRAWING.UI.getChannel("metadata").dataTransfer.getMetadata().boundedArea.yC === (this.point.point[1] - this.point.size[1]/2)).toBeTruthy();
        });

       it("the selected points for a given circle should be within and outside the bounded area", function() {
           expect(this.circle.boundedArea.width === this.circle.size[0] && this.circle.boundedArea.height === this.circle.size[1]).toBe(true);
           expect(this.circle.boundedArea.pivot[0] + this.circle.boundedArea.width < 35 && this.circle.boundedArea.pivot[1] + this.circle.boundedArea.height < 65).toBe(true);
           expect(this.circle.boundedArea.pivot[0] + this.circle.boundedArea.width > 17 && this.circle.boundedArea.pivot[1] + this.circle.boundedArea.height > 27).toBe(true);
       });

       it("should set the pixel data for the bounded area for an element", function() {
           this.line.processType = "temp";
           this.line.draw.call(this.line, {pageX: 30, pageY: 50});
           this.line.boundedArea.setData();
           
           var zeroValue = true;
           for(var index in this.line.boundedArea.imagedata) {
               if(this.line.boundedArea.imagedata[index] !== 0) {
                   zeroValue = false;
                   break;
               }
           }
           expect(zeroValue).toBe(false);
       });
        
    });
    
});
