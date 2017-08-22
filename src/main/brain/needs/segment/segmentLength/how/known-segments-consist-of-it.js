import BaseHow from "../../../base-how"
import Connector from "../../../../../data/connector"
import SegmentLengthNeed from "../segment-length.need"
import EvaluateSegmentsExpession from "../../segmentsExpression/segments-expression.need"

class KnownSegmentsConsistOfit extends BaseHow {
    constructor() {
        super("KnownSegmentsConsistOfit", "{0} = {1} - {2}");
        this.index = 2;
    }

    getResult(segmentName) {
        let sizeResult;
        let consistingObject;

        consistingObject = Connector.getContainingSegments(segmentName);
        //Found subsegments
        for (let i = 0; i < consistingObject.length; i++) {
            sizeResult = EvaluateSegmentsExpession.getIt(consistingObject[i].contain.name + " - " + consistingObject[i].sub.name);
            //TODO: Use the template
            Connector.addEquation(segmentName + " = " + consistingObject[i].contain.name + " - " + consistingObject[i].sub.name);
            if (!sizeResult.isFailed()) {
                return super.getResult(sizeResult.getValue(), [segmentName, consistingObject[i].contain.name, consistingObject[i].sub.name]);
            }
        }
    }
}

SegmentLengthNeed.registerHow(new KnownSegmentsConsistOfit);