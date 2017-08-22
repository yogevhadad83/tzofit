import sketchService from "../sketch.service"

class SketcherView  {

    constructor (model, onMouseEvents) {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.model = model;

        this.canvas.onmousedown = function (e) {
            e.preventDefault();
            onMouseEvents.mouseDown(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        };

        this.canvas.onmousemove = function (e) {
            e.preventDefault();
            onMouseEvents.mouseMove(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        };

        this.canvas.onmouseup = function (e) {
            e.preventDefault();
            onMouseEvents.mouseUp();
        };
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.draw();
    }

    draw (geometry) {
        geometry = geometry || this.model.getGeometry();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "14px Arial";

        sketchService.forEachObject(geometry, (obj) => {
            obj.draw(this.ctx);
        });
    };
}

export default SketcherView