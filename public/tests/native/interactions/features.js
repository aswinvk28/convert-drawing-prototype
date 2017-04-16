/**
 * Created by aswin.vijayakumar on 13/04/2017.
 */

describe("The split of an element must be based on the specifications", function() {
    beforeAll(function() {
        var levent = $.Event("click.Line", {pageX: 600, pageY: 400});
        this.el = ConvertDrawing(new CONVERTDRAWING.Line([levent.pageX, levent.pageY]), [null, CONVERTDRAWING.Line.prototype.storageType, levent]);
        this.el.storageType = "temp";
        this.el.setMidPoint([800,800]);

        this.el.processType = "temp";
        this.el.draw.call(this.el, {pageX: 600, pageY: 400});
        this.el.boundedArea.setData();

        this.LineElement = new _WORKSPACE.ELEMENTS.Element(this.el);

        this.split = new CONVERTDRAWING.FEATURES._1DSplit(this.el);

        var revent = $.Event("click.Rectangle", {pageX: 500, pageY: 500});

        this.rectangle = ConvertDrawing(new CONVERTDRAWING.Rectangle([revent.pageX, revent.pageY], [null, CONVERTDRAWING.Rectangle.prototype.storageType, revent]));
        this.rectangle.storageType = "temp";
        this.rectangle.setMidPoint([800,800]);

        this.rectangle.processType = "temp";
        this.rectangle.call(this.rectangle, {pageX: 500, pageY: 500});
        this.rectangle.boundedArea.setData();

        this.RectangleElement = new _WORKSPACE.ELEMENTS.Element(this.rectangle);

        this.rectSplit = new CONVERTDRAWING.FEATURES._2DSplit(this.rectangle);

        var circleEvent = $.Event("click.Circle", {pageX: 100, pageY: 400});

        this.circle = ConvertDrawing(new CONVERTDRAWING.Circle([circleEvent.pageX, circleEvent.pageY]), [null, CONCVERTDRAWING.Circle.prototype.storageType, circleEvent]);
        thuis.circle.storageType = "temp";
        this.circle.setMidPoint();
    });

    it("should match the expected specification for a line for an implicit split", function() {
        var Spec = this.split.setSpecification();

        expect(Spec.hasOwnProperty("start")).toBeTruthy();
        expect(Spec.hasOwnProperty("end")).toBeTruthy();

        expect(Spec["start"]["splitAt"]).toEqual([600, 400]);
        expect(Spec["end"]["splitAt"]).toEqual([800, 800]);
    });

    it("should match the expected specification for a rectangle for an implicit split", function() {
        var Spec = this.rectSplit.setSpecification();

        expect(Spec.hasOwnProperty("leftUpper")).toBeTruthy();
        expect(Spec.hasOwnProperty("rightUpper")).toBeTruthy();
        expect(Spec.hasOwnProperty("rightLower")).toBeTruthy();
        expect(Spec.hasOwnProperty("leftMiddleLower")).toBeTruthy();
        expect(Spec.hasOwnProperty("leftMiddle")).toBeTruthy();

        expect(Spec["leftUpper"]["splitAt"]).toEqual([600, 400]);
        expect(Spec["rightUpper"]["splitAt"]).toEqual([800, 400]);
        expect(Spec["leftMiddleLower"]["splitAt"]).toEqual([700, 800]);
        expect(Spec["leftMiddle"]["splitAt"]).toEqual([600, 600]);
        expect(Spec["rightMiddle"]["splitAt"]).toEqual([800, 600]);
    });

    it("should match the expected specification for a line for an explicit split", function() {
        var point = [700, 600];
        var Spec = this.split.nodeSpecification(point);

        expect(Spec.hasOwnProperty("start")).toBeTruthy();
        expect(Spec.hasOwnProperty("end")).toBeTruthy();

        expect(Spec["start"]["splitAt"]).toEqual([600, 400]);
        expect(Spec["end"]["splitAt"]).toEqual([800, 800]);
        expect(Spec["700_600"]["splitAt"]).toEqual(point);
    });

    it("should match the expected specification for a rectangle for an explicit split", function() {
        var segment = {start: [550, 700], end: [750, 500]};
        var Spec = this.rectSplit.nodeSpecification(segment);

        expect(Spec["leftUpper"]["splitAt"]).toEqual([[600, 400]]);
        expect(Spec["600_600"]["splitAt"]).toEqual([600, 600]);
        expect(Spec["700_400"]["splitAt"]).toEqual([700, 400]);
        expect(Spec["leftMiddleUpper"]["splitAt"]).toEqual([700, 400]);
        expect(Spec["leftMiddle"]["splitAt"]).toEqual([600, 600]);
    });

    it("should match the nodes created during the split operation of a line", function() {
        var document = _DRAWING.UI.document.rowset[0];
        GLOBALS.Paper = Raphael(-(document.xC), -(document.yC), document.width, document.height, GLOBALS.PAPER_CREATE_CALLBACK);

        var point = [700, 600];
        this.Split = new CONVERTDRAWING.FEATURES._1DSplit(this.LineElement, SPLIT_TYPE_POINT, point);

        PubSub.publish("/node/create", GLOBALS.Paper, this.Split, this.LineElement);

        expect(this.LineElement.splitState).toBeTruthy();
        expect(this.Split.Element).toEqual(this.LineElement);
        expect(this.Split.Element.set).toBeDefined();

        expect(this.Split.Element.set.length).toEqual(3);
        expect(this.Split.Element.set.data("uuid")).toEqual(this.LineElement.uuid);

        expect(_.size(this.Split.nodes)).toEqual(1);
        expect(this.Split.nodes.hasOwnProperty("700_600")).toBeTruthy();

        expect(this.Split.nodes["700_600"]["splitAt"]).toEqual([700, 600]);
    });

    it("should match the nodes created during the split operation of a rectangle", function() {
        var document = _DRAWING.UI.document.rowset[0];
        GLOBALS.Paper = Raphael(-(document.xC), -(document.yC), document.width, document.height, GLOBALS.PAPER_CREATE_CALLBACK);

        var segment = {start: [550, 700], end: [750, 500]};
        this.RectangleSplit = new CONVERTDRAWING.FEATURES._2DSplit(this.RectangleElement, SPLIT_TYPE_SLANT, segment);

        PubSub.publish("/node/create", GLOBALS.Paper, this.RectangleSplit, this.RectangleElement);

        expect(this.RectangleElement.splitState).toBetruthy();
        expect(this.RectangleSplit.Element).toEqual(this.RectangleElement);
        expect(this.RectangleElement.set).toBeDefined();

        expect(this.RectangleSplit.Element.set.length).toEqual(10);
        expect(this.RectangleSplit.Element.set.data("uuid")).toEqual(this.RectangleElement.uuid);

        expect(_.size(this.RectangleSplit.nodes)).toEqual(2);
        expect(this.RectangleSplit.nodes.hasOwnProperty("600_600")).toBeTruthy();
        expect(this.RectangleSplit.nodes.hasOwnProperty("700_400")).toBeTruthy();

        expect(this.RectangleSplit.nodes["700_400"]["splitAt"]).toEqual([700, 400]);
        expect(this.RectangleSplit.nodes["600_600"]["splitAt"]).toEqual([600, 600]);
    });
});

describe("The collision entities of an element", function() {
    beforeAll(function() {
        var levent = $.Event("click.Line", {pageX: 600, pageY: 400});
        this.el = ConvertDrawing(new CONVERTDRAWING.Line([levent.pageX, levent.pageY]), [null, CONVERTDRAWING.Line.prototype.storageType, levent]);
        this.el.storageType = "temp";
        this.el.setMidPoint([800,800]);

        this.el.processType = "temp";
        this.el.draw.call(this.el, {pageX: 600, pageY: 400});
        this.el.boundedArea.setData();

        this.LineElement = new _WORKSPACE.ELEMENTS.Element(this.el);

        var revent = $.Event("click.Rectangle", {pageX: 500, pageY: 500});

        this.rectangle = ConvertDrawing(new CONVERTDRAWING.Rectangle([revent.pageX, revent.pageY], [null, CONVERTDRAWING.Rectangle.prototype.storageType, revent]));
        this.rectangle.storageType = "temp";
        this.rectangle.setMidPoint([700,800]);

        this.rectangle.processType = "temp";
        this.rectangle.call(this.rectangle, {pageX: 500, pageY: 500});
        this.rectangle.boundedArea.setData();

        this.RectangleElement = new _WORKSPACE.ELEMENTS.Element(this.rectangle);

        var leventOther = $.Event("click.Line", {pageX: 400, pageY: 700});
        this.line = ConvertDrawing(new CONVERTDRAWING.Line([leventOther.pageX, leventOther.pageY]), [null, CONVERTDRAWING.Line.prototype.storageType, leventOther]);
        this.line.storageType = "temp";
        this.line.setMidPoint([700,200]);

        this.line.processType = "temp";
        this.line.draw.call(this.el, {pageX: 600, pageY: 400});
        this.line.boundedArea.setData();

        this.LineElementOther = new _WORKSPACE.ELEMENTS.Element(this.line);

        var reventOther = $.Event("click.Rectangle", {pageX: 500, pageY: 600});

        this.rectangleOther = ConvertDrawing(new CONVERTDRAWING.Rectangle([reventOther.pageX, reventOther.pageY], [null, CONVERTDRAWING.Rectangle.prototype.storageType, reventOther]));
        this.rectangleOther.storageType = "temp";
        this.rectangleOther.setMidPoint([900,800]);

        this.rectangleOther.processType = "temp";
        this.rectangleOther.call(this.rectangle, {pageX: 500, pageY: 500});
        this.rectangleOther.boundedArea.setData();
    });

    it("should match the expected specification resulting in a Point", function() {
        var CollisionSpec = CONVERTDRAWING.FEATURES.Collision.Intersection(this.el, this.line).getSpecification();
        this.line.setMidPoint([this.line.endPoint[0] + 10, this.line.endPoint[1] + 10]);
        var CollisionSpec_1 = CONVERTDRAWING.FEATURES.Collision.Intersection(this.el, this.line).getSpecification();

        expect(CollisionSpec.hasOwnProperty(SPLIT_TYPE_POINT)).toBeTruthy();
        expect((CollisionSpec_1[SPLIT_TYPE_POINT].x - CollisionSpec[SPLIT_TYPE_POINT].x) > 0).toBeTruthy();
        expect((CollisionSpec_1[SPLIT_TYPE_POINT].y - CollisionSpec[SPLIT_TYPE_POINT].y) > 0).toBeTruthy();
    });

    it("should match the expected specification resulting in a Link", function() {
        var CollisionSpec = CONVERTDRAWING.FEATURES.Collision.Link(this.el, this.rectangle).getSpecification();
        this.el.setMidPoint(this.el.endPoint[0] + 10, this.el.endPoint[1] + 10);
        var CollisionSpec_1 = CONVERTDRAWING.FEATURES.Collision.Link(this.el, this.rectangle).getSpecification();

        expect(CollisionSpec.hasOwnProperty(SPLIT_TYPE_POINT)).toBeTruthy();
        expect((CollisionSpec_1[SPLIT_TYPE_POINT].x - CollisionSpec[SPLIT_TYPE_POINT].x) == 0).toBeTruthy();
        expect((CollisionSpec_1[SPLIT_TYPE_POINT].y - CollisionSpec[SPLIT_TYPE_POINT].y) < 0).toBeTruthy();

        this.el.start = [300, 500];
        var CollisionSpec = CONVERTDRAWING.FEATURES.Collision.Link(this.el, this.rectangle).getSpecification();
        this.el.setMidPoint([this.el.endPoint[0] - 300, this.el.endPoint[1] - 10]);
        var CollisionSpec_2 = CONVERTDRAWING.FEATURES.Collision.Link(this.el, this.rectangle).getSpecification();

        expect(CollisionSpec.hasOwnProperty(SPLIT_TYPE_SLANT)).toBeTruthy();
        expect((CollisionSpec[SPLIT_TYPE_SLANT].start[0] - CollisionSpec_2[SPLIT_TYPE_SLANT].start[0]) == 0).toBeTruthy();
        expect((CollisionSpec[SPLIT_TYPE_SLANT].start[1] - CollisionSpec_2[SPLIT_TYPE_SLANT].start[1]) < 0).toBeTruthy();
        expect((CollisionSpec[SPLIT_TYPE_SLANT].end[0] - CollisionSpec_2[SPLIT_TYPE_SLANT].end[0]) < 0).toBeTruthy();
        expect((CollisionSpec[SPLIT_TYPE_SLANT].end[1] - CollisionSpec_2[SPLIT_TYPE_SLANT].end[1]) == 0).toBeTruthy();
        expect((CollisionSpec[SPLIT_TYPE_SLANT].y - CollisionSpec_2[SPLIT_TYPE_SLANT].y) < 0).toBeTruthy();
    });

    it("should match the expected specification resulting in a Mesh", function() {
        var CollisionSpec = CONVERTDRAWING.FEATURES.Collision.Mesh(this.rectangle, this.rectangleOther).getSpecification();
        this.rectangleOther.setMidPoint([950, 850]);
        var CollisionSpec_1 = CONVERTDRAWING.FEATURES.Collision.Mesh(this.rectangle, this.rectangleOther).getSpecification();

        expect(CollisionSpec.hasOwnProperty(SPLIT_TYPE_VERTEX)).toBeTruthy();
        expect(CollisionSpec_1.hasOwnProperty(SPLIT_TYPE_VERTEX)).toBeTruthy();
        expect((CollisionSpec_1[SPLIT_TYPE_VERTEX].pivot.x - CollisionSpec[SPLIT_TYPE_VERTEX].pivot.x) == 0).toBeTruthy();
        expect((CollisionSpec_1[SPLIT_TYPE_VERTEX].pivot.y - CollisionSpec[SPLIT_TYPE_VERTEX].pivot.y) == 0).toBeTruthy();
        expect((CollisionSpec_1[SPLIT_TYPE_VERTEX].end.x - CollisionSpec[SPLIT_TYPE_VERTEX].end.x) == 0).toBeTruthy();
        expect((CollisionSpec_1[SPLIT_TYPE_VERTEX].end.y - CollisionSpec[SPLIT_TYPE_VERTEX].end.y) == 0).toBeTruthy();

        this.rectangleOther.setMidPoint([750, 850]);

        var CollisionSpec_2 = CONVERTDRAWING.FEATURES.Collision.Mesh(this.rectangle, this.rectangleOther).getSpecification();

        expect(CollisionSpec_2.hasOwnProperty(SPLIT_TYPE_VERTEX)).toBeTruthy();
        expect((CollisionSpec_1[SPLIT_TYPE_VERTEX].pivot.x - CollisionSpec[SPLIT_TYPE_VERTEX].pivot.x) == 0).toBeTruthy();
        expect((CollisionSpec_1[SPLIT_TYPE_VERTEX].pivot.y - CollisionSpec[SPLIT_TYPE_VERTEX].pivot.y) == 0).toBeTruthy();
        expect((CollisionSpec_1[SPLIT_TYPE_VERTEX].end.x - CollisionSpec[SPLIT_TYPE_VERTEX].end.x) < 0).toBeTruthy();
        expect((CollisionSpec_1[SPLIT_TYPE_VERTEX].end.y - CollisionSpec[SPLIT_TYPE_VERTEX].end.y) == 0).toBeTruthy();
    });
});

describe("The grouping of elements must be based on specifications (explicit)", function() {
    beforeAll(function() {
        var revent = $.Event("click.Rectangle", {pageX: 500, pageY: 500});

        this.rectangle = ConvertDrawing(new CONVERTDRAWING.Rectangle([revent.pageX, revent.pageY], [null, CONVERTDRAWING.Rectangle.prototype.storageType, revent]));
        this.rectangle.storageType = "temp";
        this.rectangle.setMidPoint([700,800]);

        this.rectangle.processType = "temp";
        this.rectangle.call(this.rectangle, {pageX: 500, pageY: 500});
        this.rectangle.boundedArea.setData();

        this.RectangleElement = new _WORKSPACE.ELEMENTS.Element(this.rectangle);

        var reventOther = $.Event("click.Rectangle", {pageX: 500, pageY: 600});

        this.rectangleOther = ConvertDrawing(new CONVERTDRAWING.Rectangle([reventOther.pageX, reventOther.pageY], [null, CONVERTDRAWING.Rectangle.prototype.storageType, reventOther]));
        this.rectangleOther.storageType = "temp";
        this.rectangleOther.setMidPoint([900,900]);

        this.rectangleOther.processType = "temp";
        this.rectangleOther.call(this.rectangle, {pageX: 500, pageY: 500});
        this.rectangleOther.boundedArea.setData();

        this.group = CONVERTDRAWING.FEATURES._2DGroup(this.rectangle, this.rectangleOther);
    });

    it("should match the expected specifications for explicit grouping of the bounded area", function() {
        var Spec = this.group.setSpecification();
        expect(Spec["area"].pivot.x <= this.rectangle.boundedArea.xC).toBeTruthy();
        expect(Spec["area"].pivot.x <= this.rectangleOther.boundedArea.xC).toBeTruthy();
        expect(Spec["area"].pivot.y <= this.rectangle.boundedArea.yC).toBeTruthy();
        expect(Spec["area"].pivot.y <= this.rectangleOther.boundedArea.yC).toBeTruthy();

        expect(Spec["area"].pivot.x === ((this.rectangle.boundedArea.xC <= this.rectangleOther.boundedArea.xC) ? this.rectangle.boundedArea.xC : this.rectangleOther.boundedArea.xC)).toBeTruthy();
        expect(Spec["area"].pivot.y === ((this.rectangle.boundedArea.yC <= this.rectangleOther.boundedArea.yC) ? this.rectangle.boundedArea.yC : this.rectangleOther.boundedArea.yC)).toBeTruthy();
    });

    it("should match the resulting bounded area for the group", function() {
        expect(this.group.boundedArea.xC === ((this.rectangle.boundedArea.xC <= this.rectangleOther.boundedArea.xC) ? this.rectangle.boundedArea.xC : this.rectangleOther.boundedArea.xC)).toBeTruthy();
        expect(this.group.boundedArea.yC === ((this.rectangle.boundedArea.yC <= this.rectangleOther.boundedArea.yC) ? this.rectangle.boundedArea.yC : this.rectangleOther.boundedArea.yC)).toBeTruthy();
    });

    it("should match the expected specifications while resizing the grouped element", function() {
        var Spec = this.group.setSpecification();

        var CollisionSpec = CONVERTDRAWING.FEATURES.Collision.Mesh(this.rectangle, this.rectangleOther).getSpecification();
        this.group.setMidPoint([950, 950]);
        var CollisionSpec_1 = CONVERTDRAWING.FEATURES.Collision.Mesh(this.rectangle, this.rectangleOther).getSpecification();

        var Spec_2 = this.group.setSpecification();

        expect(CollisionSpec[SPLIT_TYPE_VERTEX].pivot.x - Spec["area"].pivot.x).toEqual(0);
        expect(CollisionSpec[SPLIT_TYPE_VERTEX].pivot.y - Spec["area"].pivot.y).toEqual(0);
        expect(CollisionSpec_1[SPLIT_TYPE_VERTEX].pivot.x - Spec["area"].pivot.x).toEqual(0);
        expect(CollisionSpec_1[SPLIT_TYPE_VERTEX].pivot.y - Spec["area"].pivot.y).toEqual(0);

        expect(Spec["area"].end.x - CollisionSpec[SPLIT_TYPE_VERTEX].end.x).toEqual(this.rectangleOther.boundedArea.xC - this.rectangle.boundedArea.xC);
        expect(Spec["area"].end.y - CollisionSpec[SPLIT_TYPE_VERTEX].end.y).toEqual(this.rectangleOther.boundedArea.yC - this.rectangle.boundedArea.yC);
    });
});

describe("The grouping of elements should match the expected specifications (specified)", function() {
    beforeAll(function() {
        var revent = $.Event("click.Rectangle", {pageX: 500, pageY: 500});

        this.rectangle = ConvertDrawing(new CONVERTDRAWING.Rectangle([revent.pageX, revent.pageY], [null, CONVERTDRAWING.Rectangle.prototype.storageType, revent]));
        this.rectangle.storageType = "temp";
        this.rectangle.setMidPoint([700,800]);

        this.rectangle.processType = "temp";
        this.rectangle.call(this.rectangle, {pageX: 500, pageY: 500});
        this.rectangle.boundedArea.setData();

        this.rectangleBA = [this.rectangle.boundedArea.xC, this.rectangle.boundedArea.yC];

        this.RectangleElement = new _WORKSPACE.ELEMENTS.Element(this.rectangle);

        var reventOther = $.Event("click.Rectangle", {pageX: 200, pageY: 200});

        this.rectangleOther = ConvertDrawing(new CONVERTDRAWING.Rectangle([reventOther.pageX, reventOther.pageY], [null, CONVERTDRAWING.Rectangle.prototype.storageType, reventOther]));
        this.rectangleOther.storageType = "temp";
        this.rectangleOther.setMidPoint([450,450]);

        this.rectangleOther.processType = "temp";
        this.rectangleOther.call(this.rectangle, {pageX: 500, pageY: 500});
        this.rectangleOther.boundedArea.setData();

        this.rectangleOtherBA = [this.rectangleOther.boundedArea.xC, this.rectangleOther.boundedArea.yC];

        this.group = CONVERTDRAWING.FEATURES._2DGroup(this.rectangle, this.rectangleOther);
    });

    it("should match the expected specifications for specified grouping of the elements", function() {
        var Spec = this.group.setSpecification();
        expect(Spec["area"].pivot.x <= this.rectangle.boundedArea.xC).toBeTruthy();
        expect(Spec["area"].pivot.x <= this.rectangleOther.boundedArea.xC).toBeTruthy();
        expect(Spec["area"].pivot.y <= this.rectangle.boundedArea.yC).toBeTruthy();
        expect(Spec["area"].pivot.y <= this.rectangleOther.boundedArea.yC).toBeTruthy();

        expect(Spec["area"].pivot.x === ((this.rectangle.boundedArea.xC <= this.rectangleOther.boundedArea.xC) ? this.rectangle.boundedArea.xC : this.rectangleOther.boundedArea.xC));
        expect(Spec["area"].pivot.y === ((this.rectangle.boundedArea.yC <= this.rectangleOther.boundedArea.yC) ? this.rectangle.boundedArea.yC : this.rectangleOther.boundedArea.yC));
    });

    it("should match the resulting bounded area for the group", function() {
        expect(this.group.boundedArea.xC === ((this.rectangle.boundedArea.xC <= this.rectangleOther.boundedArea.xC) ? this.rectangle.boundedArea.xC : this.rectangleOther.boundedArea.xC)).toBeTruthy();
        expect(this.group.boundedArea.yC === ((this.rectangle.boundedArea.yC <= this.rectangleOther.boundedArea.yC) ? this.rectangle.boundedArea.yC : this.rectangleOther.boundedArea.yC)).toBeTruthy();
    });

    it("should match the expected specifications while resizing the grouped element", function() {
        var Spec = this.group.setSpecification();
        var CollisionSpec = CONVERTDRAWING.FEATURES.Collision.Mesh(this.rectangle, this.rectangleOther).getSpecification();
        this.group.setMidPoint([950, 950]);
        var CollisionSpec_1 = CONVERTDRAWING.FEATURES.Collision.Mesh(this.rectangle, this.rectangleOther).getSpecification();
        var Spec_2 = this.group.setSpecification();
        expect(Spec_2["area"].pivot.x - Spec["area"].pivot.x).toEqual(250);
        expect(Spec_2["area"].pivot.y - Spec["area"].pivot.y).toEqual(150);
        expect(this.rectangle.boundedArea.xC - this.rectangleBA[0]).toEqual(0);
        expect(this.rectangle.boundedArea.yC - this.rectangleBA[1]).toEqual(0);
        expect(this.rectangleOther.boundedArea.xC - this.rectangleOtherBA[0]).toEqual(0);
        expect(this.rectangleOther.boundedArea.yC - this.rectangleOtherBA[1]).toEqual(0);

        expect(CollisionSpec).toBeNull();
        expect(CollisionSpec_1).toBeNull();
    });
});

describe("The joining of elements (rectangle) with Flange Connections must adhere according to the binding defined", function() {
    beforeAll(function () {
        var revent = $.Event("click.Rectangle", {pageX: 400, pageY: 400});

        this.rectangle = ConvertDrawing(new CONVERTDRAWING.Rectangle([revent.pageX, revent.pageY], [null, CONVERTDRAWING.Rectangle.prototype.storageType, revent]));
        this.rectangle.storageType = "temp";
        this.rectangle.setMidPoint([700, 800]);

        this.rectangle.processType = "temp";
        this.rectangle.call(this.rectangle, {pageX: 500, pageY: 500});
        this.rectangle.boundedArea.setData();

        this.rectangleBA = [this.rectangle.boundedArea.xC, this.rectangle.boundedArea.yC];

        this.RectangleElement = new _WORKSPACE.ELEMENTS.Element(this.rectangle);

        var reventOther = $.Event("click.Rectangle", {pageX: 200, pageY: 200});

        this.rectangleOther = ConvertDrawing(new CONVERTDRAWING.Rectangle([reventOther.pageX, reventOther.pageY], [null, CONVERTDRAWING.Rectangle.prototype.storageType, reventOther]));
        this.rectangleOther.storageType = "temp";
        this.rectangleOther.setMidPoint([300, 450]);

        this.rectangleOther.processType = "temp";
        this.rectangleOther.call(this.rectangle, {pageX: 500, pageY: 500});
        this.rectangleOther.boundedArea.setData();

        this.rectangleOtherBA = [this.rectangleOther.boundedArea.xC, this.rectangleOther.boundedArea.yC];

        var segment_1 = {
            start: [this.rectangle.pivot[0], this.rectangle.pivot[1]],
            end: [this.rectangle.pivot[0], this.rectangle.pivot[1] + this.rectangle.size[1]]
        };
        var segment_2 = {
            start: [this.rectangleOther.pivot[0] + this.rectangleOther.size[0], this.rectangleOther.pivot[1]],
            end: [this.rectangleOther.pivot[0] + this.rectangleOther.size[0], this.rectangleOther.pivot[1] + this.rectangleOther.size[1]]
        };
        this.BindingPath_1 = new CONVERTDRAWING.Binding.Path(segment_1);
        this.BindingPath_2 = new CONVERTDRAWING.Binding.Path(segment_2);
        var Binding = new CONVERTDRAWING.FEATURES.Binding(BindingPath_1, BindingPath_2);
        this.Join = CONVERTDRAWING.FEATURES.Join(this.rectangle, this, rectangleOther, Binding); // state machine
    });

    it("should create a binding successfully", function () {
        var Intersection = this.Join.getJoiningMethod().getIntersection();
        var BindingSpecification = Intersection.bindingSpecification();
        expect(Intersection.getConstraint()).toEqual(INTERSECTION_CONSTRAINT_PATH);
        expect(BindingSpecification.hasOwnProperty("get" + INTERSECTION_CONSTRAINT_PATH + "Definition")).toBeTruthy();
        expect(BindingSpecification["get" + INTERSECTION_CONSTRAINT_PATH + "Definition"]().hasOwnProperty("start")).toBeTruthy();
        expect(BindingSpecification["get" + INTERSECTION_CONSTRAINT_PATH + "Definition"]().hasOwnProperty("end")).toBeTruthy();
    });

    it("should match the expected Binding Specifications", function () {
        var Intersection_prev = this.Join.getJoiningMethod().getIntersection();
        var BindingSpecification_prev = Intersection.bindingSpecification();

        var static = this.rectangle, isStaticLarger = false;
        var slope = Infinity, staticIntercept = Infinity;
        var x_calc = BindingSpecification_prev["get" + INTERSECTION_CONSTRAINT_PATH + "Definition"]().start.x(slope, staticIntercept, static, isStaticLarger);
        expect(BindingSpecification_prev["get" + INTERSECTION_CONSTRAINT_PATH + "Definition"]().hasOwnProperty("start")).toBeTruthy();
        expect(x_calc).toEqual(300);
        expect(BindingSpecification_prev["get" + INTERSECTION_CONSTRAINT_PATH + "Definition"]().start.y(x_calc, slope, staticintercept)).toEqual(400);

        this.rectangleOther.setMidPoint([950, 850]);
        var static = this.rectangleOther, isStaticLarger = true;
        var slope = Infinity, staticIntercept = Infinity;
        var Intersection = this.Join.getJoiningMethod().getIntersection();
        var BindingSpecification = Intersection.bindingSpecification();

        expect(BindingSpecification["get" + INTERSECTION_CONSTRAINT_PATH + "Definition"]().hasOwnProperty("start")).toBeTruthy();
        var x_calc = BindingSpecification["get" + INTERSECTION_CONSTRAINT_PATH + "Definition"]().start.x(slope, staticIntercept, static, staticLarger);
        expect(x_calc).toEqual(950);
        expect(BindingSpecification["get" + INTERSECTION_CONSTRAINT_PATH + "Definition"]().start.y(x_calc, slope, staticIntercept)).toEqual(800);
    });
});

describe("The joining of elements (line) with Connectors must adhere according to the binding defined", function() {
    beforeAll(function() {
        var levent = $.Event("click.Line", {pageX: 200, pageY: 200});
        this.line = ConvertDrawing(new CONVERTDRAWING.Line([levent.pageX, levent.pageY], [null, CONVERTDRAWING.Line.prototype.storageType, levent]));
        this.line.storageType = "temp";
        this.line.setMidPoint([400, 400]);

        this.line.processType = "temp";
        this.line.draw.call(this.el, {pageX: 200, pageY: 200});
        this.line.boundedArea.setData();

        var leventOther = $.Event("click.Line", {pageX: 500, pageY: 400});
        this.lineOther = ConvertDrawing(new CONVERTDRAWING.Line([leventOther.pageX, leventOther.pageY], [null, CONVERTDRAWING.Line.prototype.storageType, leventOther]));
        this.lineOther.storageType = "temp";
        this.lineOther.setMidPoint([600, 200]);

        this.lineOther.processType = "temp";
        this.lineOther.draw.call(this.el, {pageX: 500, pageY: 400});
        this.lineOther.boundedArea.setData();

        var point_1 = [this.line.endPoint[0], this.line.endPoint[1]];
        var point_2 = [this.lineOther.start[0], this.lineOther.start[1]];
        this.BindingPoint_1 = new CONVERTDRAWING.Binding.Path(point_1, {static: true});
        this.BindingPoint_2 = new CONVERTDRAWING.Binding.Path(point_2);
        var Binding = new CONVERTDRAWING.FEATURES.Binding(BindingPoint_1, BindingPoint_2);

        this.Join = CONVERTDRAWING.FEATURES.Join(this.line, this.lineOther, Binding);
    });

    it("should match the expected Binding Specifications", function() {
        var Intersection = this.Join.getJoiningMethod().getIntersection();
        var BindingSpecification_prev = Intersection.bindingSpecification();

        expect(Intersection.getConstraint()).toEqual(INTERSECTION_CONSTRAINT_POINT);
        var x_calc = BindingSpecification_prev["get" + INTERSECTION_CONSTRAINT_POINT + "Definition"]().x();
        expect(x_calc).toEqual(400);
        expect(BindingSpecification_prev["get" + INTERSECTION_CONSTRAINT_POINT + "Definition"]().y(x_calc)).toEqual(400);

        this.lineOther.setMidPoint([500, 600]);

        var BindingSpecification = Intersection.bindingSpecification();

        var x_calc = BindingSpecification["get" + INTERSECTION_CONSTRAINT_POINT + "Definition"]().x();
        expect(x_calc).toEqual(400);
        expect(BindingSpecification["get" + INTERSECTION_CONSTRAINT_POINT + "Definition"]().y(x_calc)).toEqual(400);
    });
});