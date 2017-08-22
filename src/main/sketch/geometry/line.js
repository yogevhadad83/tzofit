import sketchService from "../sketch.service"

function calcEquation(p1, p2) {
    let m;

    if (p2.x == p1.x) {
        return {x: p1.x};
    }

    m = (p2.y - p1.y) / (p2.x - p1.x);
    return {m: m, n: (m * -p1.x) + p1.y};
}

class Line {

    static importLine(parameters) {
        let line = new Line(parameters.p1, parameters.p2);
        line.name = parameters.name;
        line.setColor(parameters.color);
        return line;
    }

    constructor(p1, p2) {
        this.consts = sketchService.getConsts();
        this.colors = sketchService.getColors();

        this.p1 = p1;
        this.p2 = p2;
        this.name = (p1.name + p2.name).split("").sort().join("");
        this.color = this.colors.NORMAL;
        this.dash = [];

        this.setDash = function (bool) {
            this.dash = bool ? this.consts.DASH : [];
        };

        this.setColor = function (color) {
            this.color = color;
        };

        this.equation = calcEquation(this.p1, this.p2);
    }


    applyEquation(x) {
        if (this.equation.x) {
            return null;
        }
        return this.equation.m * x + this.equation.n;
    }

//            this.getLength = function () {
//                return p1.distanceTo(p2);
//            };
//
//            this.isLong = function () {
//                return DELTA < this.getLength();
//            };

    snapToGrid() {
        if (Math.abs(this.p1.x - this.p2.x) < this.consts.DELTA) {
            this.p2.x = this.p1.x;
            this.setColor(this.colors.GRID);
        }

        if (Math.abs(this.p1.y - this.p2.y) < this.consts.DELTA) {
            this.p2.y = this.p1.y;
            this.setColor(this.colors.GRID);
        }
        this.equation = calcEquation(this.p1, this.p2);
    }

    snapToLine(line) {
        //If first point is on the line - try to snap the second one to it
        if (!this.p1.isCloseToLine(line)) {
            return false;
        }

        if (this.p2.snapToLine(line, true)) {
            this.setColor(this.colors.SNAP);
            line.setColor(this.colors.SNAP);
            return true;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.setLineDash(this.dash);
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
        ctx.closePath();
    }

    reset() {
        this.setColor(this.colors.NORMAL);
        this.setDash(false);
    }
}

export default Line