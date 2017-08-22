import Connector from "../../../data/connector"
import DataManager from "../../dataManager"
import BaseDataSource from "../baseDataSource"

class SegmentFreeEquation extends BaseDataSource {

    constructor() {
        super();
        this.name = "segmentFreeEquation";
        this.label = "משוואת קטעים";
    }

    parseNewData () {
        let expression = document.getElementsByClassName("new-equation")[0].value;

        //check if of the form AC=3
        if (/^[A-Z][A-Z]=[0-9]+$/g.test(expression.replace(/\s/g,''))) {
            let parts = expression.split("=");
            let name = parts[0];
            let size = parts[1];
            Connector.addSegment(name, size);
        } else {
            Connector.addEquation(expression);
        }

        return expression;
    };
}

DataManager.addDataSource(new SegmentFreeEquation);
