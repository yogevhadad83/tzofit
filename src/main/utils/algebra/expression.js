import Factor from "./factor";

class Expression {
    static parse(rawString) {
        let expressionString = rawString.replace(/ |\*/g,'');
        let rawFactors = expressionString.match(/-?(\d+(\.\d+)?)?[a-zA-Z]+/g);
        let rawConstant = expressionString.match(/-?\d+(\.\d+)?(?!(\d*(\.\d+)?[a-zA-Z]))/g);
        let factors = [];

        if (rawFactors) {
            for (let i=0; i < rawFactors.length; i++) {
                factors.push(Factor.parse(rawFactors[i]));
            }
        }
        if (rawConstant) {
            factors.push(new Factor(rawConstant));
        }

        return new Expression(factors);
    }

    constructor(factors) {
        this.factors = [];
        for (let i=0; i < factors.length; i++) {
            if (factors[i].scalar != 0) {
                this.factors.push(factors[i]);
            }
        }
    }

    getVariables() {
        let variables = [];
        for (let i=0; i < this.factors.length; i++) {
            variables.push(this.factors[i].variable);
        }
        return variables;
    }

    getFactors() {
        return this.factors;
    }

    getFactor(variable = "") {
        for (let i=0; i < this.factors.length; i++) {
            if (this.factors[i].variable == variable) {
                return this.factors[i];
            }
        }
    }

    getScalar(subexpString) {
        let subexp = Expression.parse(subexpString);
        let subexpFactors = subexp.getFactors();
        let factorScalar, scalar;

        for (let i=0; i < subexpFactors.length; i++) {
            factorScalar = 0;
            for (let j=0; j < this.factors.length; j++) {
                if (this.factors[j].variable == subexpFactors[i].variable) {
                    factorScalar = this.factors[j].scalar;
                    break;
                }
            }

            if (factorScalar == 0) {
                return 0;
            }

            //Check if it's the first found scalar. If not - make sure it matches the other ones
            if (scalar) {
                if (scalar != factorScalar / subexpFactors[i].scalar) {
                    return 0;
                }
            } else {
                scalar = factorScalar / subexpFactors[i].scalar;
            }
        }

        return scalar || 0;
    }

    containsVariable(variable) {
        for (let i=0; i < this.factors.length; i++) {
            if (this.factors[i].variable == variable) {
                return true;
            }
        }
    }

    scale(scalar) {
        let factors = [];
        for (let i=0; i < this.factors.length; i++) {
            factors.push(this.factors[i].scale(scalar));
        }
        return new Expression(factors);
    }

    eval(values) {
        let factors = [];
        let factor;
        let accum = 0;

        for (let i=0; i < this.factors.length; i++) {
            factor = this.factors[i];
            if (factor.variable == "") {
                accum += parseFloat(factor.scalar);
            } else if (values[factor.variable]) {
                accum += parseFloat(factor.scalar) * values[factor.variable];
            } else {
                factors.push(factor);
            }
        }

        factors.push(new Factor(accum));
        return new Expression(factors);
    }

    equals(expression) {
        let foundMatchingFactor;
        let factors = expression.getFactors();
        for(let i=0; i < factors.length; i++) {
            foundMatchingFactor = false;
            for (let j=0; j < this.factors.length; j++) {
                if (this.factors[j].variable == factors[i].variable) {
                    foundMatchingFactor = true;
                    if (this.factors[j].variable != factors[i].variable) {
                        return false;
                    }
                }
            }
            if (!foundMatchingFactor) {
                return false;
            }
        }
    }

    toString() {
        let str;
        let factor;
        str = this.factors[0].toString();
        for (let i=1; i < this.factors.length; i++) {
            factor = this.factors[i];
            str += " " + factor.getSign() + " " + factor.toStringAbs();
        }
        return str;
    }
}

export default Expression;