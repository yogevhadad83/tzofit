import Algebra from "../../utils/algebra/algebra"

class SegmentsEquation {

    static solveSystemFor(eq1, eq2, v1, v2) {
        let solution = Algebra.Equation.solveSystemFor(eq1.equation, eq2.equation, v1, v2);
        let ret = {};

        ret[v1] = solution[v1] ? solution[v1].toString() : solution[v1];
        ret[v2] = solution[v2] ? solution[v2].toString() : solution[v2];

        return ret;
    }

    constructor(equationString) {
        this.equation = Algebra.Equation.parse(equationString);
        this.segments = this.equation.expression.getVariables();
    }

    getSegments() {
        return this.segments;
    }

    parseTheSameAsString(eqString) {
        let eq = Algebra.Equation.parse(eqString);
        return this.equation.expression.equals(eq.expression);
    }

    solveFor(expression) {
        let solutionExpression = this.equation.solveFor(expression);
        return solutionExpression ? solutionExpression.toString() : "";
    }

    toString() {
        return this.equation.toString();
    }
}

export default SegmentsEquation