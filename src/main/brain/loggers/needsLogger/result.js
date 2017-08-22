class Result {
    static get FAILED_RESULT() {
        return new Result(this.FAIL);
    }

    static get FAIL() {
        return -1;
    }

    // static get EXPRESSION() {
    //     return -2;
    // }

    static get GIVEN() {
        return "נתון";
    }

    constructor(value, justification) {
        this.value = value;
        this.justification = justification;
    }

    setFailed() {
        this.value = Result.FAIL;
    }

    isNumber() {
        return !isNaN(this.value);
    }

    isFailed() {
        return this.value == Result.FAIL;
    }

    // isExpression() {
    //     return this.value == Result.EXPRESSION;
    // }

    getValue() {
        return this.value;
    }

    getJustification() {
        return this.justification;
    }

    getCopy() {
        return new Result(this.value, this.justification);
    }
}

export default Result;