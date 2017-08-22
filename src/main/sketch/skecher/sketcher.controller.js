import sketchService from "../sketch.service"
import SketcherModel from "./sketcher.model"
import SketcherView from "./sketcher.view"
import Point from "../geometry/point"
import Line from "../geometry/line"

class Sketcher {
    constructor() {
        let that = this;
        let anchorPoint, geoBuffer, charCodeBuffer;
        let types = sketchService.getTypes();
        let colors = sketchService.getColors();

        function onMouseDown(x, y) {
            let mousePoint;

            loadModel();
            mousePoint = new Point(x, y, charCodeBuffer);
            anchorPoint = adjustPoint(mousePoint);

            //Anchor point is a new one
            if (anchorPoint == mousePoint) {
                geoBuffer.points.push(anchorPoint);
                saveModel();
            }

            debug();
            that.view.draw(geoBuffer);
        }

        function onMouseMove(x, y) {
            let mousePoint, adjusedMousePoint;
            let lineFromAnchor, snappedToLine;

            loadModel();

            mousePoint = new Point(x, y, charCodeBuffer);
            adjusedMousePoint = adjustPoint(mousePoint);

            if (anchorPoint) {
                if (anchorPoint.isCloseTo(adjusedMousePoint)) {
                    //If the mouse point is too close to the anchor point - change nothing
                    adjusedMousePoint = null;
                } else {
                    lineFromAnchor = new Line(anchorPoint, adjusedMousePoint);
                    lineFromAnchor.setDash(true);

                    //TODO: Fix the co-relation between snap mousePoint to line and snap newLine to grid
                    //Only adjust line in case of new point
                    if (adjusedMousePoint == mousePoint) {
                        lineFromAnchor.snapToGrid();
                        sketchService.forEachObjectOfType(geoBuffer, types.LINE, (line) => {
                            if (!snappedToLine && lineFromAnchor.snapToLine(line)) {
                                line.setColor(colors.SNAP);
                                snappedToLine = true;
                            }
                        });
                    }

                    geoBuffer.lines.push(lineFromAnchor);
                }
            }

            //Only add point in case of new point
            if (adjusedMousePoint && adjusedMousePoint == mousePoint) {
                geoBuffer.points.push(mousePoint);
                charCodeBuffer++;
            }

            that.view.draw(geoBuffer);

            sketchService.forEachObject(geoBuffer, (object) => {
                object.reset();
            });
            debug();
        }

        function onMouseUp() {
            let geometry = that.model.getGeometry();
            anchorPoint = null;
            saveModel(geoBuffer.points.length - geometry.points.length);

            debug();
            that.view.draw();
        }

        function adjustPoint(p) {
            let lineSnapped;
            let snappedToPoint;
            //if the point is close to an existing line - snap to it
            sketchService.forEachObjectOfType(geoBuffer, types.LINE, (line) => {
                if (!lineSnapped && p.snapToLine(line)) {
                    lineSnapped = line;
                }
            });

            //if the point is close to an existing point - make that point our target point, and no new point
            sketchService.forEachObjectOfType(geoBuffer, types.POINT, (point) => {
                if (!snappedToPoint && p.isCloseTo(point)) {
                    p = point;
                    p.mark(true);
                    p.setColor(colors.SNAP);
                    snappedToPoint = true;
                }
            });

            //Only split line in case of a new point
            if (lineSnapped && !snappedToPoint) {
                splitLine(lineSnapped, p);
            }

            return p;
        }

        function splitLine(line, p) {

            //TODO: fix logic of lines that cross an existing point, and lines that connect to other lines

            let index = geoBuffer.lines.indexOf(line);
            let p1 = line.p1;
            let p2 = line.p2;
            let line1, line2;

            geoBuffer.lines.splice(index, 1);
            line1 = new Line(p1, p);
            line2 = new Line(p, p2);
            geoBuffer.lines.push(line1);
            geoBuffer.lines.push(line2);
        }

        function saveModel(charCode) {
            // that.model.addToCharCode(charCode);
            that.model.setGeometry(geoBuffer);
        }

        function loadModel() {
            geoBuffer = that.model.getGeometry();
            charCodeBuffer = that.model.getCharCode();
        }

        function debug() {
            let div = document.getElementById("debug");
            div.innerHTML = "";
            sketchService.forEachObjectOfType(geoBuffer, sketchService.getTypes().LINE, (line) => {
                div.innerHTML += " " + line.name;
            });
        }

        that.model = new SketcherModel();
        that.view = new SketcherView(that.model, {
            mouseDown: onMouseDown,
            mouseMove: onMouseMove,
            mouseUp: onMouseUp
        });
    }

    getModel() {
        return this.model;
    }

    draw() {
        this.view.draw();
    }
}

export default Sketcher