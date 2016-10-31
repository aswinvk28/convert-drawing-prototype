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
        expect(this.point.activity.context[0] instanceof CONVERTDRAWING.Point).toBe(true);
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

        this.context = _DRAWING.UI.temp.rowSet[0].dom.getContext("2d");

        this.helper = ConvertDrawing(new CONVERTDRAWING.Helper(), params, function(obj, params) {
            obj.storageType = "document";
            obj.processType = "metadata";
        });

        this.helper.parent = function() {};
        this.helper.size = [0,0];
        this.helper.pivot = [0,0];
        this.helper.point = [30,30];

        var boundedArea = new _WORKSPACE.boundedArea(this.helper);
        boundedArea.xC = 100;
        boundedArea.yC = 200;
        boundedArea.width = 200;
        boundedArea.height = 200;

        this.helper.boundedArea = boundedArea;
        this.helper.boundedArea.imagedata = imagedata;

        var imagedata = this.context.getImageData(100, 200, 200, 200);
        
        // configuration
        CONVERTDRAWING.Helper.prototype = jQuery.extend(CONVERTDRAWING.Helper.prototype, {
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