import Sketcher from "./skecher/sketcher.controller"
import sketchService from "./sketch.service"
import Line from "./geometry/line"
import Point from "./geometry/point";

class Sketch {
    constructor() {
        this.sketcher = new Sketcher();
        this.model = this.sketcher.getModel();
        this.types = sketchService.getTypes();
        this.geometry;
    }

    getPoint(name) {
        let ret;
        sketchService.forEachObjectOfType(this.geometry, this.types.POINT, (point) => {
            if (!ret && point.name == name) {
                ret = point;
            }
        });
        return ret;
    }

    getLine(name) {
        let ret;
        name = name.split("").sort().join("");
        sketchService.forEachObjectOfType(this.geometry, this.types.LINE, (line) => {
            if (!ret && line.name == name) {
                ret = line;
            }
        });
        return ret;
    }

    getAllPointsOnLine(line) {
        let points = [];
        sketchService.forEachObjectOfType(this.geometry, this.types.POINT, (point) => {
            if (point.isOnLine(line, true)) {
                points.push(point);
            }
        });

        return points.sort((p1, p2) => {
            return p1.x - p2.x || p1.y - p2.y;
        });
    }

    getSublines(lineName) {
        let p1, p2, line;
        let subLines = [];

        if (this.getLine(lineName)) {
            return subLines;
        }

        p1 = this.getPoint(lineName[0]);
        p2 =  this.getPoint(lineName[1]);
        line = new Line(p1, p2);

        sketchService.forEachObjectOfType(this.geometry, this.types.POINT, (point) => {
            if (subLines.length == 0 && point.isInnerPoint(line)) {
                subLines.push(p1.name + point.name);
                subLines.push(point.name + p2.name);
            }
        });

        return subLines;
    };

    getContainingLines(lineName) {
        let p1, p2, pBuffer;
        let currentPoint, nextPoint, points;
        let leftSide;
        let containingLines = [];
        let line = this.getLine(lineName);

        if (line) {
            p1 = line.p1;
            p2 = line.p2;
        } else {
            p1 = this.getPoint(lineName[0]);
            p2 = this.getPoint(lineName[1]);
            line = new Line(p1, p2);
        }

        if (p2.x < p1.x || (p2.x == p1.x && p2.y < p1.y)) {
            pBuffer = p1;
            p1 = p2;
            p2 = pBuffer;
        }

        points = this.getAllPointsOnLine(line);
        for (let i = 0; i < points.length; i++) {
            currentPoint = points[i];
            nextPoint = points[i + 1];
            leftSide = currentPoint.x < p1.x || (currentPoint.x == p1.x && currentPoint.y < p1.y);

            if (currentPoint.isOnLine(line)) {
                continue;
            }

            containingLines.push(leftSide ? currentPoint.name + p2.name : p1.name + currentPoint.name);

            if (!nextPoint) {
                break;
            }

            //Points collection may contain points that are on a different segment than the one in subject, but still lay on the same infinite line
            //If the current point and the next one do not share a common line - reset the buffer and continue if on the left, or break if on the right
            if (!this.getLine(currentPoint.name + nextPoint.name)) {
                containingLines = [];
                if (leftSide) {
                    continue;
                }
                break;
            }
        }

        return containingLines;
    };

    //TODO: Turn into event
    onSketchReady() {
        this.geometry = this.getGeometry();
    };

    getGeometry() {
        return this.model.getGeometry();
    }

    importGeometry(geo) {
        this.geometry = {
            points: [],
            lines: []
        };

        sketchService.forEachObjectOfType(geo, this.types.POINT, (obj, type) => {
            this.geometry[type].push(Point.importPoint(obj));
        });

        sketchService.forEachObjectOfType(geo, this.types.LINE, (obj, type) => {
            obj.p1 = this.getPoint(obj.p1.name);
            obj.p2 = this.getPoint(obj.p2.name);
            this.geometry[type].push(Line.importLine(obj));
        });

        this.model.setGeometry(this.geometry);

        this.sketcher.draw()
    }
}

export default new Sketch();