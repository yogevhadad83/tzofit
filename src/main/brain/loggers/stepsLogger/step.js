import Common from "../../../utils/common"

class Step {
    constructor() {
        this.whatDidINeed;
        this.solution;
        this.justification = data.justification;
        this.reduction = [];
    }

    setSolution(data) {
        this.whatDidINeed = data.whatDidINeed;
        this.solution = data.solution;
        this.justification = data.justification;
    }

    addReduction(step) {
        this.reduction.unshift(step);
    }

    parse(depth = 0) {
        const MARGIN_FACTOR = 30;

        let reduction = "";
        let margin = depth * MARGIN_FACTOR;
        let color = Common.getRandomColor();

        if (this.reduction.length == 0) {
            return Common.createParagraph(this.solution + " " + this.justification, margin, color);
        }

        for (let i=0; i < this.reduction.length; i++) {
            reduction += this.reduction[i].parse(depth + 1);
        }

        return Common.createParagraph(this.whatDidINeed, margin, color) +
            Common.createParagraph(this.justification, margin, color) +
            reduction +
            Common.createParagraph("=> " + this.solution, margin, color);
    }
}

export default Step