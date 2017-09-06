import BaseHow from "../../../base-how"
import Connector from "../../../../../data/connector"
import SegmentLengthNeed from "../segment-length.need"
import GetSegmentLength from "../segment-length.need"
import EvaluateSegmentsExpession from "../../segmentsExpression/segments-expression.need"
import Result from "../../../../loggers/needsLogger/result"
import SegmentsEquation from "../../../../../data/given/segements-equation";

class HasEquations extends BaseHow {
    constructor() {
        super("HasEquations", "{0}");
        this.index = 3;
    }

    //Currently only supporting 2 equations with 2 parameters
    getResult(segmentName, offsetSize) {
        let expression;
        let sizeResult;
        let sizes;
        let segmentsParameters, otherSegment;

        let equations = Connector.getSegment(segmentName).equations;

        //@returns: Result
        function evaluateExpression(expression) {
            if (!/[A-Z][A-Z]/g.test(expression)) { //The expression is a number
                return new Result(parseFloat(expression));
            } else if (/^[A-Z][A-Z]$/g.test(expression)) { //The expression is a segment's name (i.e AB)
                return GetSegmentLength.getIt(expression, offsetSize);
            } else { //The expression is an expression (i.e AB + BD)
                return EvaluateSegmentsExpession.getIt(expression, offsetSize);
            }
        }

        switch (equations.length) {
            case 0: {
                return;
                break;
            }
            case 1: {
                expression = equations[0].solveFor(segmentName);
                sizeResult = evaluateExpression(expression);
                break;
            }
            default: {
                //TODO: extract to function
                expression = equations[0].solveFor(segmentName);
                sizeResult = evaluateExpression(expression);
                if (!sizeResult.isFailed()) {
                    break;
                }

                segmentsParameters = equations[0].segments;
                for (let i=0; i < segmentsParameters.length; i++) {
                    if (segmentsParameters[i] !== segmentName) {
                        otherSegment = segmentsParameters[i];
                        break;
                    }
                }
                sizes = SegmentsEquation.solveSystemFor(equations[0], equations[1], segmentName, otherSegment);
                if (sizes[segmentName] == null) {
                    return;
                }
                sizeResult = evaluateExpression(sizes[segmentName]);
            }
        }

        if (!sizeResult.isFailed()) {
            return super.getResult(sizeResult.getValue(), equations[0].toString() + (equations[1] ? ", " + equations[1].toString() : ""));
        }
    }
}

SegmentLengthNeed.registerHow(new HasEquations);