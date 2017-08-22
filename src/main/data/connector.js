import Sketch from "../sketch/sketch"
import Given from "./given/given.model"
import Vertex from "./given/vertex"
import Segment from "./given/segment"
import SegmentsEquation from "./given/segements-equation"

class Connector {

    constructor() {
        //TODO: we might not really need to use this class
        let given = new Given();
        this.objects = given.getObjects();
        this.equations = given.getEquations();
    }

    getObject (name, collection) {
        let obj;
        for (let i = 0; i < collection.length; i++) {
            if (collection[i].name == name) {
                obj = collection[i];
                break;
            }
        }
        return obj;
    }

    getEquation (equationString) {
        for (let i=0; i < this.equations.length; i++) {
            if (this.equations[i].parseTheSameAsString(equationString)) {
                return this.equations[i];
            }
        }
    }

    addVertex (name) {
        var v = this.getObject(name, this.objects.vertices);
        if (!v) {
            v = new Vertex(name);
            this.objects.vertices.push(v);
        }

        return v;
    }

    addSegment (name, size) {
        var s = this.getObject(name, this.objects.segments) || this.getObject(name[1] + name[0], this.objects.segments);
        if (!s) {
            s = new Segment(name, size);
            this.addVertex(name[0]);
            this.addVertex(name[1]);
            this.objects.segments.push(s);
        }

        if (size) {
            s.size = size;
        }

        return s;
    }

    addEquation (equationString) {
        let segmentNames;
        let eq = this.getEquation(equationString);
        if (!eq) {
            eq = new SegmentsEquation(equationString);
            segmentNames = eq.getSegments();
            for (let i = 0; i < segmentNames.length; i++) {
               this.addSegment(segmentNames[i]).assignEquation(eq);
           }

            this.equations.push(eq);
        }
        return eq;
    }

    getVertex  (name) {
        let v = this.getObject.call(this, name, this.objects.vertices);
        return v || this.addVertex(name);
    }

    getSegment (name) {
        //TODO find a better way to deal with flipped names
        let s = this.getObject.call(this, name, this.objects.segments) || this.getObject.call(this, name[1] + name[0], this.objects.segments);
        return s || this.addSegment(name);
    }

    //TODO: move logic into equation class and handle seperated parameter expressions
    getEquationsWithExpression (expression) {
        let ret = [];
        for (let i=0; i < this.equations.length; i++) {
            if (this.equations[i].containsExpression) {
                ret.push(this.equations[i]);
            }
        }
        return ret;
    }

    getSubsegments (segmentName) {
        let subsegments = [];
        let segmentsNames = Sketch.getSublines(segmentName);
        if (0 < segmentsNames.length) {
            subsegments.push(this.getSegment(segmentsNames[0]));
            subsegments.push(this.getSegment(segmentsNames[1]));
        }
        return subsegments;
    };

    getContainingSegments (segmentName) {
        var containingObjects = [];
        var containingObjectsNames = Sketch.getContainingLines(segmentName);

        function getSubName(containName) {
            if (containName[0] == segmentName[0]) {
                return segmentName[1] + containName[1];
            } else if (containName[0] == segmentName[1]) {
                return segmentName[0] + containName[1];
            } else if (containName[1] == segmentName[0]) {
                return containName[0] + segmentName[1];
            } else {
                return containName[0] + segmentName[0];
            }
        }

        for (let i = 0; i < containingObjectsNames.length; i++) {
            containingObjects.push({
                contain: this.getSegment(containingObjectsNames[i]),
                sub: this.getSegment(getSubName(containingObjectsNames[i]))
            });
        }

        return containingObjects;
    }

    onSolve(need) {
        this.addSegment(need);
        Sketch.onSketchReady();
    }

    save(n) {
        let needInputs = document.getElementsByClassName("new-data-need")[0].getElementsByTagName("input");
        let equationsStrings = [];
        let data;

        for (let i=0; i < this.equations.length; i++) {
            equationsStrings.push(this.equations.toString());
        }

        data = {
            sketchGeo: Sketch.getGeometry(),
            given: {
                objects: this.objects,
                equations: equationsStrings
            },
            html: document.getElementById("given-data").innerHTML,
            need: [needInputs[0].value, needInputs[1].value]
        };
        localStorage.setItem("saved" + n, JSON.stringify(data));
    }

    load(n) {
        let needInputs = document.getElementsByClassName("new-data-need")[0].getElementsByTagName("input");
        let data = JSON.parse(localStorage.getItem("saved" + n));
        if (data) {

            //TODO: we might not really need to use this class
            let given = new Given();
            this.objects = given.getObjects();
            this.equations = given.getEquations();

            Sketch.importGeometry(data.sketchGeo);
            for (let i=0; i < data.given.objects.vertices.length; i++) {
                this.addVertex(data.given.objects.vertices[i].name);
            }
            for (let i=0; i < data.given.objects.segments.length; i++) {
                this.addSegment(data.given.objects.segments[i].name, data.given.objects.segments[i].size);
            }
            for (let i=0; i < data.given.equations.length; i++) {
                this.addEquation(data.given.equations[i]);
            }

            document.getElementById("given-data").innerHTML = data.html;

            needInputs[0].value = data.need[0];
            needInputs[1].value = data.need[1];
        }
    }
}

export default new Connector();