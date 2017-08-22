import sketchService from "../sketch.service"

class Point {
    static importPoint(parameters) {
        let point = new Point(parameters.x, parameters.y);
        point.name = parameters.name;
        point.setColor(parameters.color);
        point.mark(parameters.marked);
        return point;
    }

    constructor(x, y, nameCode) {
        this.consts = sketchService.getConsts();
        this.colors = sketchService.getColors();

        this.name = String.fromCharCode(nameCode);
        this.x = x;
        this.y = y;
        this.color = this.colors.NORMAL;
        this.marked = true;
    }

    isBetweenEndPoints(p, line) {
        //the line is of the form x = a
        if (line.equation.x) {
            return (line.p1.y <= p.y && p.y <= line.p2.y) || (line.p2.y <= p.y && p.y <= line.p1.y);
        } else {
            return (line.p1.x <= p.x && p.x <= line.p2.x) || (line.p2.x <= p.x && p.x <= line.p1.x);
        }
    }

    setColor(color) {
        this.color = color;
    }

    setVertex(bool) {
        //if it's a vertex - don't mark it
        this.mark(!bool);
    }

    mark(bool) {
        this.marked = bool;
    }

    distanceTo(p) {
        return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
    }

    distanceToLine(line) {
        //the line is of the form x = a
        if (line.equation.x) {
            return Math.abs(this.x - line.equation.x);
        }
        return Math.abs(line.equation.n + line.equation.m * this.x - this.y) / Math.sqrt(1 + Math.pow(line.equation.m, 2));
    }

    isCloseTo(p) {
        return this.distanceTo(p) < this.consts.DELTA;
    }

    //TODO: fix logic of end points in 2 following methods
    isOnLine(line, infinite) {
        var on = this.distanceToLine(line) < this.consts.EPSILON;
        var betweenEndPoints = this.isBetweenEndPoints(this, line);

        return on && (betweenEndPoints || (infinite));
    }

    isCloseToLine(line, infinite) {
        var close = this.distanceToLine(line) < this.consts.DELTA;
        var betweenEndPoints = this.isBetweenEndPoints(this, line);

        return close && (betweenEndPoints || infinite);
    }

    isAnEdge(line) {
        return this == line.p1 || this == line.p2;
    }

    isInnerPoint(line) {
        return this.isOnLine(line) && !this.isAnEdge(line);
    }

    snapToLine(line, infinite) {
        if (!this.isCloseToLine(line, infinite) || this.isAnEdge(line)) {
            return false;
        }

        var y = line.applyEquation(this.x);
        if (y) {
            this.y = y;
        } else {
            this.x = line.equation.x;
        }
        this.setColor(this.colors.SNAP);

        return true;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillText(this.name, this.x + this.consts.LETTERS_OFFSET, this.y + this.consts.LETTERS_OFFSET);
        if (this.marked) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.consts.POINT_RADIUS, 0, 2 * Math.PI);
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    }

    reset() {
        this.setColor(this.colors.NORMAL);
        this.mark(false);
    }
}

export default Point