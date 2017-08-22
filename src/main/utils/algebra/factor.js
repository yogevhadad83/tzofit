class Factor {

    static parse(rawFactorStr) {
        let symbol = rawFactorStr.match(/[a-zA-Z]+/);
        if (symbol) {
            return new Factor(rawFactorStr.substring(0, symbol.index), symbol[0]);
        } else {
            return new Factor(rawFactorStr);
        }
    }

    constructor(scalar, variable = "") {
        this.scalar = (scalar == "-") ? "-1" : (scalar + "" || "1");
        this.variable = variable;
    }

    flipSign() {
        return this.scale(-1);
    }

    scale(scalar) {
        return new Factor(this.scalar * scalar, this.variable);
    }

    getSign() {
        return 0 < this.scalar ? "+" : "-";
    }

    toString() {
        let scalar;
        switch (this.scalar) {
            case "1": {
                scalar = "";
                break;
            }
            case "-1": {
                scalar = "-";
                break;
            }
            default: {
                scalar = this.scalar;
            }
        }
        return scalar + this.variable;
    }

    toStringAbs() {
        let scalar = Math.abs(this.scalar);
        if (scalar == 1) {
            scalar = "";
        }
        return scalar + this.variable;
    }
}

export default Factor;