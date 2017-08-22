import GetSegmentLength from "./needs/segment/segmentLength/segment-length.need"

class Brain {

    solve(whatDoIneed) {
        GetSegmentLength.getIt(whatDoIneed);
    }
}

export default Brain;