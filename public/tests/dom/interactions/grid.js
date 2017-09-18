/**
 * Created by aswin.vijayakumar on 10/04/2017.
 */

describe("The grid must be identifiable", function() {

    beforeAll(function() {
        this.parameters = {start: [300, 200], end: [600, 400], type: "ui", dimensions: [1, 1]};
        this.Grid = new _WORKSPACE.GRID.Element(this.parameters);

        this.event = $.Event("click", {pageX: 650, pageY: 450});
        this.LocatedGrid = _WORKSPACE.GRID.Locate(this.event, "ui");
    });

    it("and should have the correct UUID Path", function() {
        var gridUuid = this.Grid.getUUIDPath();
        expect(gridUuid).toEqual("1_1");

        expect(this.Grid.dimensions).toEqual(this.parameters.dimensions);
        expect(this.Grid.start).toEqual(this.parameters.start);
        expect(this.Grid.end).toEqual(this.parameters.end);

        var actualCoordinates = _WORKSPACE.GRID.actualCoordinates(this.event, "ui");
        expect(actualCoordinates).toEqual([_DRAWING.UI.canvasObject.boundedArea.xC, _DRAWING.UI.canvasObject.boundedArea.yC]);
    });

    it("and should be created from the provided point", function() {
        var width = _WORKSPACE.GRID.Size.width, height = _WORKSPACE.GRID.Size.height;

        var gridUuid = this.LocatedGrid.getUUIDPath();

        expect(this.LocatedGrid.dimensions[0] + "_" + this.LocatedGrid.dimensions[1]).toEqual(gridUuid);
    });

});

describe("The grid must contain its elements", function() {

    beforeAll(function() {
        this.event = $.Event("click", {pageX: 600, pageY: 400});
        this.LocatedGrid = _WORKSPACE.GRID.Locate(this.event, "ui");

        var levent = $.Event("click.Line", {pageX: 600, pageY: 400});

        this.el = ConvertDrawing(new CONVERTDRAWING.Line([levent.pageX, levent.pageY]), [null, CONVERTDRAWING.Line.prototype.storageType, levent]);
        this.el.storageType = "ui";
        this.el.setMidPoint([800,800]);

        this.el.processType = "temp";
        this.el.refContext = _DRAWING.UI.canvasObject.dom.getContext("2d");
        this.el.currentProcessType = "ui";
        this.el.draw.call(this.el, {pageX: 800, pageY: 800});
        this.el.boundedArea.setData();

        this.el.refContext = _DRAWING.UI.temp.rowSet[0].dom.getContext("2d");
        this.el.currentProcessType = "temp";
        this.el.draw.call(this.el, {pageX: 800, pageY: 800});

        this.Element = new _WORKSPACE.ELEMENTS.Element(this.el);

        this.LocatedGrid.addElement(this.Element);
    });

    it("and should contain the added element", function() {
        expect(this.Element).toEqual(this.LocatedGrid.ELEMENTS.elements[this.Element.uuid]);
    });

    it("and should not locate the provided element", function() {
        var event = $.Event("click", {pageX: 620, pageY: 440});
        var Element = this.LocatedGrid.spotElement(this.Element, event);

        expect(Element).toBeFalsy();
    });

    it("and should locate the provided element from its set", function() {
        var event = $.Event("click", {pageX: 600, pageY: 400});
        var Element = this.LocatedGrid.spotElement(this.Element, event);
        expect(!Element).toBeFalsy();
        expect(Element).toEqual(this.Element);
    });

    it("and should detect whether the point is in the canvas", function() {
        var event = $.Event("click", {pageX: 600, pageY: 400});
        var context = _DRAWING.UI.canvasObject.dom.getContext("2d");
        var found = _WORKSPACE.GRID.FindInCanvas(event, context);
        expect(found).toBeTruthy();
    });

    it("and should detect whether the point is in the path", function() {
        var levent = $.Event("click", {pageX: 600, pageY: 400});
        var context = _DRAWING.UI.canvasObject.dom.getContext("2d");
        var element = ConvertDrawing(new CONVERTDRAWING.Line([levent.pageX, levent.pageY]), [null, CONVERTDRAWING.Line.prototype.storageType, levent]);
        var found = _WORKSPACE.GRID.FindInCurrent(levent, context);
        expect(found).toBeTruthy();
    });

    it("and should check whether the given point is not on the grid elements' context", function() {
        var event = $.Event("click", {pageX: 620, pageY: 410, target: this.el});
        var found_ui = _WORKSPACE.GRID.isPointInGrid(event, "ui");
        var found_temp = _WORKSPACE.GRID.isPointInGrid(event, "temp");
        expect(found_ui).toBeFalsy();
        expect(found_temp).toBeFalsy();
    });

    it("and should check whether the given point is in the grid elements' context", function() {
        var event = $.Event("click", {pageX: 600, pageY: 400, target: this.el});
        var found_ui = _WORKSPACE.GRID.isPointInGrid(event, "ui");
        var found_temp = _WORKSPACE.GRID.isPointInGrid(event, "temp");
        expect(found_ui).toBeTruthy();
        expect(found_temp).toBeTruthy();
    });

    it("and should be able to search by provided element", function() {
        var event = $.Event("click", {pageX: 600, pageY: 400});
        var found = _WORKSPACE.GRID.SearchByElement(event, this.el);
        expect(found).toEqual(this.el.e);
    });

    it("and should be able to search the elements by Point", function() {
        var event = $.Event("click", {pageX: 600, pageY: 400});
        var found_ui = _WORKSPACE.GRID.SearchElementsByPoint(event, "ui");
        var found_temp = _WORKSPACE.GRID.SearchElementsByPoint(event, "temp");

        expect(found_ui).toBeDefined();
        expect(found_temp).toBeDefined();
    });

    it("and should remove the element from its set", function() {
        var Element = this.Element;
        this.LocatedGrid.removeElement(Element);
        expect(this.LocatedGrid.ELEMENTS.elements.hasOwnProperty(Element.uuid)).toBeFalsy();
    });

});

describe("The grid should be able to retain the elements in its repository", function() {

    beforeAll(function() {
        this.event = $.Event("click", {pageX: 650, pageY: 450});
        this.LocatedGrid = _WORKSPACE.GRID.Locate(event, "ui");

        var levent = $.Event("click.Line", {pageX: 600, pageY: 400});

        this.el = ConvertDrawing(new CONVERTDRAWING.Line([levent.pageX, levent.pageY]), [null, CONVERTDRAWING.Line.prototype.storageType, levent]);
        this.el.setMidPoint([800,800]);

        this.el.processType = "temp";
        this.el.draw.call(this.el, {pageX: 600, pageY: 400});
        this.el.boundedArea.setData();

        this.ElementRepository = GLOBALS.getElementRepository();
    });

    it("and should add the element to the repository", function() {
        this.ElementRepository.addElementToRepository(this.el, LIFECYCLE_CREATE, null, null);

        expect(this.ElementRepository.ELEMENTS.contains).toBeTruthy();
        expect(_.size(this.ElementRepository.ELEMENTS.elements)).toEqual(1);

        var keys = _.keys(this.ElementRepository.ELEMENTS.elements);
        var ruuid = keys[0];

        expect(this.ElementRepository.ELEMENTS.elements[ruuid]).toEqual(this.el.e);
    });

    it("and should add the bounded area to the repository", function() {
        this.ElementRepository.addBoundedAreaToRepository(this.el.boundedArea, LIFECYCLE_CREATE, null, null);

        expect(this.ElementRepository.BOUNDED_AREA.contains).toBeTruthy();
        expect(_.size(this.ElementRepository.BOUNDED_AREA.elements)).toEqual(1);

        var keys = _.keys(this.ElementRepository.BOUNDED_AREA.elements);
        var ruuid = keys[0];

        expect(this.ElementRepository.BOUNDED_AREA.elements[ruuid]).toEqual(this.el.boundedArea.b);
    });

});

