import BaseHow from "../../../base-how"
import Connector from "../../../../../data/connector"
import EvaluateSegmentsExpession from "../segments-expression.need"
import GetSegmentLength from "../../segmentLength/segment-length.need"
import Result from "../../../../loggers/needsLogger/result"
import Algebra from "../../../../../utils/algebra/algebra"
import Expression from "../../../../../utils/algebra/expression";

class GetEachSize extends BaseHow {
    constructor() {
        super("GetEachSize", "נמצא כל קטע בנפרד");
        this.index = 1;
    }

    getResult(expressionString, offsetSize) {
        let sizeResult;
        let segments = Algebra.Expression.parse(expressionString).getVariables();
        let evaluatedSegments = {};
        let evalutationExpression;
        // let isExpression = false;

        // let product = expression.match(/\d+[A-Z]/g);
        // let productsIndex = expression.indexOf(product);
        // let evaluation = product ? expression.slice(0, productsIndex + 1) + "*" + expression.slice(productsIndex + 1) : expression;

        for (let i=0; i < segments.length; i++) {
            if (segments[i]) {
                sizeResult = GetSegmentLength.getIt(segments[i], offsetSize);
                if (sizeResult.isFailed()) {
                    return;
                }
                evaluatedSegments[segments[i]] = sizeResult.getValue();
            }
        }

        evalutationExpression = Expression.parse(expressionString).eval(evaluatedSegments);
        return super.getResult(evalutationExpression.toString(), expressionString);
    }
}

EvaluateSegmentsExpession.registerHow(new GetEachSize);