/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

describe("The spec defines the activity history for the creation of any element, helper or object", function() {
    
    beforeAll(function() {
        this.point = ConvertDrawing(new CONVERTDRAWING.Point([10,20]));
    });
    
    it("should define that the activity history must have an activity object loaded upon instantiation", function() {
        expect(this.point.activity.history).toBeDefined();
        expect(_WORKSPACE.ACTIVITYHISTORY instanceof _WORKSPACE.activityHistory).toBe(true);
    });
    
});

describe("The spec defines that the activity object is linked to relevant objects", function() {
    
    beforeAll(function() {
        this.point = ConvertDrawing(new CONVERTDRAWING.Point([10,20]));
    });
    
    it("should define that the activity is linked to a context", function() {
        expect(this.point.activity.context.length).toBe(1);
    });
    
    it("should define that the activity is linked to a relevant element", function() {
        expect(this.point.activity.context instanceof CONVERTDRAWING.Point).toBe(true);
    });
    
});

describe("The spec defines that a GENERIC activity type should be associated with the helper object defined", function() {
    
    var tracker = {};
    beforeAll(function() {
        var params = [function() {
            tracker['start'] = 0;
        }, "temp", {}, function() {
            tracker['stop'] = 1;
        }];
        
        // configuration
        CONVERTDRAWING.Helper.prototype = Object.create(CONVERTDRAWING.Helper.prototype, {
            ACTIVITY_TYPE: "generic",
            ACTIVITY_NAME: 'customFunction',
            ACTIVITY_METHOD: 'draw',
            definition: CONVERTDRAWING.Helper
        });
        
        CONVERTDRAWING.Helper.customFunction = function(boundedArea) {
            this.name = "helper";
            this.imagedata = boundedArea.imagedata;
        };
        
        this.context.beginPath();
        this.context.moveTo(100, 200);
        this.context.lineTo(300, 400);
        this.context.stroke();
        
        expect(tracker['start']).toBe(0);
        expect(tracker['stop']).toBe(1);
        
        var imagedata = this.context.getImageData(100, 200, 200, 200);
        
        var boundedArea = new _WORKSPACE.boundedArea();
        boundedArea.xC = 100;
        boundedArea.yC = 200;
        boundedArea.width = 200;
        boundedArea.height = 200;
        
        this.helper = ConvertDrawing(new CONVERTDRAWING.Helper(), params);
        this.helper.boundedArea = boundedArea;
        this.helper.boundedArea.imagedata = imagedata;
        this.context = DRAWING.UI.temp.rowSet[0].dom.getContext("2d")
    });
    
    it("should execute the intended method and operations for the helper object", function() {
        for(var index in this.imagedata) {
            if(this.imagedata[index] !== 0) {
                zeroValue = false;
                break;
            }
        }
        expect(zeroValue).toBe(false);
    });
    
});