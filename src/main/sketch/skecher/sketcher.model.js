import sketchService from "../sketch.service"

class SketcherModel {

    static get BASE_CHAR_CODE() {
        return 65;
    };

    constructor() {
        this.charCode = SketcherModel.BASE_CHAR_CODE;
        this.geomerty = {
            points: [],
            lines: []
        };
    }

    getGeometry() {
        let ret = {
            points: [],
            lines: []
        };
        sketchService.forEachObject(this.geomerty, (obj, type) => {
            ret[type].push(obj);
        });
        return ret;
    }

    setGeometry (collection) {
        this.geomerty = {
            points: [],
            lines: []
        };

        sketchService.forEachObject(collection, (obj, type) => {
            obj.reset();
            this.geomerty[type].push(obj);
        });

        this.charCode = SketcherModel.BASE_CHAR_CODE + this.geomerty.points.length;
    }

    getCharCode () {
        return this.charCode;
    }

    // addToCharCode (num) {
    //     num = num || (num == 0 ? 0 : 1);
    //     this.charCode = this.charCode + num;
    // }
}

export default SketcherModel