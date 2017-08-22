import Connector from "../../../../data/connector"
import BaseNeed from "../../../needs/base-need"
import Template from "../../../../utils/template"

class GetSegmentLength extends BaseNeed {

    constructor() {
        super("getSegmentLength");
        this.needTemplate = new Template("{0} נמצא את");
        this.solutionTemplate = new Template("{0} = {1}");
    }

    gotResult(segmentName, result) {
        let segment = Connector.getSegment(segmentName);
        segment.setSize(result.getValue());
    }

    parseNeed(segmentName) {
        return this.needTemplate.replace(segmentName);
    }

    parseSolution(segmentName, result) {
        return this.solutionTemplate.replace([segmentName, result.getValue()]);
    }
}

export default new GetSegmentLength