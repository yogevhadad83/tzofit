import BaseHow from "../../../base-how"
import Connector from "../../../../../data/connector"
import EvaluateSegmentsExpession from "../segments-expression.need"
import GetSegmentLength from "../../segmentLength/segment-length.need"
import Result from "../../../../loggers/needsLogger/result"

class Evaluated extends BaseHow {
    constructor() {
        super("Evaluated", Result.GIVEN);
        this.index = 0;
    }

    getResult(expression, offsetSize) {
        let evaluation, evaluationResult;

        for (let i=0; i < Connector.equations.length; i++) {

            evaluation = Connector.equations[i].solveFor(expression.toString());

            if (!evaluation) {
                continue;
            }

            if (!/[A-Z][A-Z]/g.test(evaluation)) { //The evaluation is a number
                evaluationResult = new Result(parseFloat(evaluation));
            } else if (/^[A-Z][A-Z]$/g.test(evaluation)) { //The evaluation is a segment's name (i.e AB)
                evaluationResult = GetSegmentLength.getIt(evaluation, offsetSize);
            } else { //The evaluation is an expression (i.e AB + BD)
                evaluationResult = EvaluateSegmentsExpession.getIt(evaluation, offsetSize);
            }
            // if (sizeResult.isExpression()) {
            //     evaluationResult = EvaluateSegmentsExpession.getIt(sizeResult.getValue());
            // } else if (sizeResult.isNumber()) {
            //     evaluationResult = sizeResult;
            // }

            if (!evaluationResult.isFailed()) {
                return super.getResult(evaluationResult.getValue());
            }
        }
    }
}

EvaluateSegmentsExpession.registerHow(new Evaluated);