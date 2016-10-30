/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

describe("The spec for the namespaces defines that", function() {
    
    describe("the extend functionality should work for all namespaces to enable the copy of objects, the copy of prototype and inheritance, the inheritance and the constructor for the defined class", function() {
        
        beforeAll(function() {
            this.object = {'foo': 'bar', 'function': function() {}, 'object': {'property': 'value', 'function': function() {}}};
            this.source = {
                'foo': 'newValue',
                'object': {
                    'function': function() {
                        // definitions
                    }
                }
            };

            this.parent = (function() {
                function instance() {
                    this._init = function(array) {
                        this.init = "init";
                        this.array = array;
                    };
                };

                return instance;
            })();

            this.child = (function() {
                function instance() {
                    
                };
                
                function constructor() {
                    this.name = 'constructor';
                    this.array = arguments;
                }
                
                instance.prototype = {
                    constructor: constructor
                }

                return instance;
            })();
            
            this.parentFunction = function() {
                
            };
            
            this.parentFunction.prototype = {
                
            };
            
            this.childFunction = function() {
                
            };
            
            this.childFunction.prototype = {
                
            };
        });
        
        it("that the namespace extend functions should work as specified", function() {
            this.parent = new this.parent();
            this.child = _DOCUMENT.extend(this.child, this.parent);
            this.child = new this.child();
            var instance = new _WORKSPACE.extend(this.child, ["1", "2"]);
            expect(instance.parent).toEqual(this.parent);
            expect(instance.name).toEqual("constructor");
            expect(instance.init).toEqual("init");
        });
        
        it("that the convertdrawing constructor function should work as expected", function() {
            this.parent = new this.parent();
            this.child = _DOCUMENT.extend(this.child, this.parent);
            this.child = new this.child();
            var instance = ConvertDrawing(this.child, ["2", "3"]);
            expect(instance.parent).toEqual(this.parent);
            expect(instance.array.length).toEqual(2);
        });
        
    });
        
    
});

