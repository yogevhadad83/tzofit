class SketchServiceClass {
    constructor() {
        const CONSTS = {
            EPSILON: 30,
            DELTA: 5,
            DASH: [10, 10],
            POINT_RADIUS: 2,
            LETTERS_OFFSET: -5
        };

        const TYPES = {
            POINT: "points",
            LINE: "lines"
        };

        const COLORS = {
            NORMAL: "black",
            GRID: "yellow",
            SNAP: "blue"
        };

        this.CONSTS = CONSTS;
        this.TYPES = TYPES;
        this.COLORS = COLORS
    }

    forEachObject(collection, func) {
        for (let type in collection) {
            this.forEachObjectOfType(collection, type, func);
        }
    }

    forEachObjectOfType(collection, type, func) {
        for (let i = 0; i < collection[type].length; i++) {
            func(collection[type][i], type);
        }
    };

    getColors() {
        return this.COLORS;
    };

    getTypes() {
        return this.TYPES;
    };

    getConsts() {
        return this.CONSTS;
    };
}

let sketchService = new SketchServiceClass();
export default sketchService