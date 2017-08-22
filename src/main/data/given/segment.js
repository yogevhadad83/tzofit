class Segment {

    constructor(name, size) {
        this.name = name;
        this.size = size;
        this.equations = [];
    }

    setSize (size) {
        this.size = size;
    };

    assignEquation(equation) {
        this.equations.push(equation);
    }
}

export default Segment

