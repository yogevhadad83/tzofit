import Connector from "../../../../data/connector"
import BaseNeed from "../../../needs/base-need"
import Template from "../../../../utils/template"

class EvaluateSegmentsExpession extends BaseNeed {

    constructor() {
        super("evaluateSegmentsExpession");
        this.needTemplate = new Template("{0} נחשב את");
        this.solutionTemplate = new Template("{0} = {1}");
    }

    gotResult(expression, result) {
        Connector.addEquation(expression + "=" + result.getValue())
    }

    parseNeed(expression) {
        return this.needTemplate.replace(expression);
    }

    parseSolution(expression, result) {
        return this.solutionTemplate.replace([expression, result.getValue()]);
    }
}

export default new EvaluateSegmentsExpession