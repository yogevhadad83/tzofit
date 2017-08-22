import BaseHow from "../../../base-how"
import Connector from "../../../../../data/connector"
import SegmentLengthNeed from "../segment-length.need"
import EvaluateSegmentsExpession from "../../segmentsExpression/segments-expression.need"


class ConsistOfKnownSegments extends BaseHow {
    constructor() {
        super("ConsistOfKnownSegments", "{0} = {1} + {2}");
        this.index = 1;
    }

    getResult(segmentName) {
        let sizeResult;
        let segments;

        segments = Connector.getSubsegments(segmentName);
        if (0 < segments.length) {
            sizeResult = EvaluateSegmentsExpession.getIt(segments[0].name + " + " + segments[1].name);
            //TODO: Use the template
            Connector.addEquation(segmentName + " = " + segments[0].name + " + " + segments[1].name);
            if (!sizeResult.isFailed()) {
                return super.getResult(sizeResult.getValue(), [segmentName, segments[0].name, segments[1].name]);
            }
        }
    }
}

SegmentLengthNeed.registerHow(new ConsistOfKnownSegments);