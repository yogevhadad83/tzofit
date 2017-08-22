import Connector from "../../../data/connector"
import DataManager from "../../dataManager"
import BaseDataSource from "../baseDataSource"

class SegmentEqualsSize extends BaseDataSource {

    constructor() {
        super();
        this.name = "segmentEqualsSize";
        this.label = "XX = X קטע";
    }

    parseNewData () {
        let vertices = document.getElementsByClassName("new-vertex-name");
        let name = vertices[0].value + vertices[1].value;
        let size = document.getElementsByClassName("new-vertex-size")[0].value;
        Connector.addSegment(name, size);

        return name + " = " + size;
    };
}

DataManager.addDataSource(new SegmentEqualsSize);
