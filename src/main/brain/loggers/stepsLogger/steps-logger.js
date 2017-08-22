import Step from "./step"

class StepsLogger {

    static get NO_SOLUTION() {
        return "אין פתרון";
    }

    constructor() {
        this.rootStep;
        this.stepsArray = [];

        document.addEventListener("needStart", () => {
            let step = new Step();
            if (!this.rootStep) {
                this.rootStep = step
            }
            this.stepsArray.push(step);
        });

        document.addEventListener("needEnd", (data) => {
            let step = this.stepsArray.pop();
            if (data.detail.status == "SUCCESS") {
                step.setSolution(data.detail);
                if (this.stepsArray.length > 0) {
                    this.stepsArray[this.stepsArray.length - 1].addReduction(step);
                }
            }
        });
    }

    parse() {
        if (!this.rootStep.solution) {
            return "<p>" + StepsLogger.NO_SOLUTION + "</p>";
        }
        return this.rootStep.parse();
    }
}

export default new StepsLogger();