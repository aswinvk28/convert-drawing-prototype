/**
 * Created by aswin.vijayakumar on 10/04/2017.
 */

describe("The grid must be identifiable", function() {

    beforeAll(function() {
        var parameters = {start: [300, 200], end: [600, 400], type: "ui", dimensions: [1, 1]};
        this.Grid = new _WORKSPACE.GRID.Element(parameters);

        this.event = $.Event("click", {pageX: 650, pageY: 450});
        this.LocatedGrid = _WORKSPACE.GRID.Locate(event, "ui");
    });

    it("The grid should have the correct UUID Path", function() {
        var gridUuid = this.Grid.getUUIDPath();

        expect(gridUuid).toEqual("1_1");
    });

    it("The grid should be created from the provided point", function() {
        var width = _WORKSPACE.GRID.Size.width, height = _WORKSPACE.GRID.Size.height;

        var dimensions = [this.event.pageX / width, this.event.pageY / height];

        var gridUuid = this.LocateGrid.getUUIDPath();

        expect(dimensions[0] + "_" + dimensions[1]).toEqual(gridUuid);
    });

});

describe("The grid must contains its elements", function() {

    beforeAll(function() {
        this.event = $.Event("click", {pageX: 650, pageY: 450});
        this.LocatedGrid = _WORKSPACE.GRID.Locate(event, "ui");

        var levent = $.Event("click.Line", {pageX: 600, pageY: 400});

        this.el = ConvertDrawing(new CONVERTDRAWING.Line([levent.pageX, levent.pageY]), [null, CONVERTDRAWING.Line.prototype.storageType, levent]);
        this.el.setMidPoint([800,800]);

        this.el.processType = "temp";
        this.el.draw.call(this.el, {pageX: 600, pageY: 400});
        this.el.boundedArea.setData();

        this.Element = new _WORKSPACE.ELEMENTS.Element(this.el);

        this.LocateGrid.addElement(this.Element);
    });

    it("should contain the added element", function() {
        expect(this.Element).toEqual(this.LocateGrid.ELEMENTS.elements[this.Element.uuid]);
    });

    it("should not locate the provided element", function() {
        var event = $.Event("click", {pageX: 620, pageY: 470})
        var Element = this.LocateGrid.spotElement(this.Element, event);

        expect(Element).toBeFalsy();
    });

    it("should locate the provided element from its set", function() {
        var event = $.Event("click", {pageX: 600, pageY: 400})
        var Element = this.LocateGrid.spotElement(this.Element, event);

        expect(Element).toNotBe(false);
    });

    it("should detect whether the point is in the canvas", function() {
        var event = $.Event("click", {pageX: 600, pageY: 400});
        var context = _DRAWING.UI.canvasObject.dom.getContext("2d");
        var found = _WORKSPACE.GRID.FindInCanvas(event, context);
        expect(found).toBeTruthy();
    });

    it("should detect whether the point is in the path", function() {
        var event = $.Event("click", {pageX: 600, pageY: 400});
        var context = _DRAWING.UI.temp.rowSet[0].dom.getContext("2d");
        var element = ConvertDrawing(new CONVERTDRAWING.Line([levent.pageX, levent.pageY]), [null, CONVERTDRAWING.Line.prototype.storageType, levent]);
        var found = _WORKSPACE.GRID.FindInCurrent(event, context);
        expect(found).toBeTruthy();
    });

    it("should check whether the given point is not on the grid elements' context", function() {
        var event = $.Event("click", {pageX: 620, pageY: 410});
        var found_ui = _WORKSPACE.GRID.isPointInGrid(event, "ui");
        var found_temp = _WORKSPACE.GRID.isPointInGrid(event, "temp");
        expect(found_ui).toBeFalsy();
        expect(found_temp).toBeFalsy();
    });

    it("should check whether the given point is in the grid elements' context", function() {
        var event = $.Event("click", {pageX: 600, pageY: 400});
        var found_ui = _WORKSPACE.GRID.isPointInGrid(event, "ui");
        var found_temp = _WORKSPACE.GRID.isPointInGrid(event, "temp");
        expect(found_ui).toBeTruthy();
        expect(found_temp).toBeTruthy();
    });

    it("should be able to search by provided element", function() {
        var event = $.Event("click", {pageX: 600, pageY: 400});
        var found = _WORKSPACE.GRID.SearchByElement(event, this.el);
    });

    it("should be able to search the elements by Point", function() {
        var event = $.Event("click", {pageX: 600, pageY: 400});
        var found_doc = _WORKSPACE.GRID.SearchElementsByPoint(event, "document");
        var found_meta = _WORKSPACE.GRID.SearchElementsByPoint(event, "metadata");
        var found_ui = _WORKSPACE.GRID.SearchElementsByPoint(event, "ui");
        var found_temp = _WORKSPACE.GRID.SearchElementsByPoint(event, "temp");

        expect(found_doc).toBeTruthy();
        expect(found_meta).toBeDefined();
        expect(found_ui).toBeDefined();
        expect(found_temp).toBeDefined();
    });

    it("should remove the element from its set", function() {
        var Element = this.Element;
        this.LocateGrid.removeElement(Element);
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

        this.ElementRepository = _WORKSPACE.ELEMENT_REPOSITORY.Factory.create();
    });

    it("should add the element to the repository", function() {
        this.ElementRepository.addElementToRepository(this.el, LIFECYCLE_CREATE, null, null);

        expect(this.ElementRepository.ELEMENTS.contains).toBeTruthy();
        expect(_.size(this.ElementRepository.ELEMENTS.elements)).toEqual(1);

        var keys = _.keys(this.ElementRepository.ELEMENTS.elements);
        var ruuid = keys[0];

        expect(this.ElementRepository.ELEMENTS.elements[ruuid]).toEqual(this.el.e);
    });

    it("should add the bounded area to the repository", function() {
        this.ElementRepository.addBoundedAreaToRepository(this.el.boundedArea, LIFECYCLE_CREATE, null, null);

        expect(this.ElementRepository.BOUNDED_AREA.contains).toBeTruthy();
        expect(_.size(this.ElementRepository.BOUNDED_AREA.elements)).toEqual(1);

        var keys = _.keys(this.ElementRepository.BOUNDED_AREA.elements);
        var ruuid = keys[0];

        expect(this.ElementRepository.BOUNDED_AREA.elements[ruuid]).toEqual(this.el.boundedArea.b);
    });

});

