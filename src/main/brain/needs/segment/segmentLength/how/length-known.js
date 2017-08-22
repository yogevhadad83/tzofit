import BaseHow from "../../../base-how"
import Connector from "../../../../../data/connector"
import SegmentLengthNeed from "../segment-length.need"
import Result from "../../../../loggers/needsLogger/result"

class LengthKnown extends BaseHow {
    constructor() {
        super("LengthKnown", Result.GIVEN);
        this.index = 0;
    }

    getResult(segmentName) {
        let segment = Connector.getSegment(segmentName);
        if (segment.size) {
            return super.getResult(segment.size);
        }
    }
}

SegmentLengthNeed.registerHow(new LengthKnown);