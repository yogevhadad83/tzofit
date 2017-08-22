import Expression from "./expression"
import Factor from "./factor";

class Equation {

    static solveSystemFor(eq1, eq2, v1, v2) {
        let solution = {};
        let eqExpScaled, combinedEq;
        let v1Solution, v2Solution;

        if (eq2.expression.getScalar(v2) == 0) {
            v1Solution = null;
        } else {
            eqExpScaled = eq2.expression.scale(eq1.expression.getScalar(v2) / eq2.expression.getScalar(v2));
            combinedEq = Equation.parse(eq1.expression.toString() + "=" + eqExpScaled.toString());
            v1Solution = combinedEq.solveFor(v1);
        }

        solution[v1] = v1Solution;

        if (eq1.expression.getScalar(v1)) {
            v2Solution = null;
        } else {
            eqExpScaled = eq1.expression.scale(eq2.expression.getScalar(v1) / eq1.expression.getScalar(v1));
            combinedEq = Equation.parse(eq2.expression.toString() + "=" + eqExpScaled.toString());
            v2Solution = combinedEq.solveFor(v2);
        }

        solution[v2] = v2Solution;

        return solution;
    }

    static parse(rawString) {
        let sides = rawString.split(/\=/);
        let leftSide = Expression.parse(sides[0]);
        let rightSide = Expression.parse(sides[1]);
        let leftFactors = leftSide.getFactors();
        let rightFactors = rightSide.getFactors();
        let newFactor;

        //Normalize and simplify the equation
        //TODO: Currently assuming each variable on each expression is unique
        for (let i=0; i < rightFactors.length; i++) {
            newFactor  = rightFactors[i].flipSign();
            for (let j=0; j < leftFactors.length; j++) {
                if (newFactor.variable == leftFactors[j].variable) {
                    leftFactors[j] = new Factor(parseFloat(newFactor.scalar) + parseFloat(leftFactors[j].scalar), newFactor.variable);
                    newFactor = null;
                    break;
                }
            }

            if (newFactor) {
                leftFactors.push(newFactor);
            }
        }

        return new Equation(new Expression(leftFactors), rawString);
    }

    constructor(expression, rawString) {
        this.rawString = rawString;
        this.expression = expression
    }

    solveFor(subexpString) {
        let subexp = Expression.parse(subexpString);
        let factors = [];
        let scalar = this.expression.getScalar(subexpString);
        let scaledExpression, scaledExpressionFactors;

        if (scalar == 0) {
            return null;
        }

        scaledExpression = this.expression.scale(-1/scalar);
        scaledExpressionFactors = scaledExpression.getFactors();
        for (let i=0; i < scaledExpressionFactors.length; i++) {
            if (!subexp.containsVariable(scaledExpressionFactors[i].variable)) {
                factors.push(scaledExpressionFactors[i]);
            }
        }
        return new Expression(factors);
    }

    toString() {
        return this.rawString;
    }
}

export default Equation