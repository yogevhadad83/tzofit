import GetSegmentLength from "./needs/segment/segmentLength/segment-length.need"

class Brain {

    solve(whatDoIneed) {
        return new Promise((resolve) => {
                setTimeout(() => {
                    GetSegmentLength.getIt(whatDoIneed, 0);
                    resolve();
                }, 500);
            }
        );
    }
}

export default Brain;