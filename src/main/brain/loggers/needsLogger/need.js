class Need {


    constructor(name, subject) {
        this.name = name;
        this.subject = subject;
        this.result;
    }

    setResult(result) {
        this.result = result;
    }

    getResult() {
        if (this.result) {
        return this.result.getCopy();
    }

    }

}

export default Need;