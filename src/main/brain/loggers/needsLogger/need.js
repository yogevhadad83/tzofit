class Need {

    static get DONE() {
        return "done";
    }

    static get FAILED() {
        return "failed";
    }

    static get RUNNING() {
        return "running";
    }

    constructor(name, subject) {
        this.name = name;
        this.subject = subject;
        this.status = Need.RUNNING;
        this.result;
    }

    setResult(result) {
        this.result = result;
        if(this.result.isFailed()) {
            this.status = Need.FAILED;
        } else {
            this.status = Need.DONE;
        }
    }

    getResult() {
        return this.result.getCopy();
    }

    isFailed() {
        return this.status == Need.FAILED;
    }

    isDone() {
        return this.status == Need.DONE;
    }

    isRunning() {
        return this.status == Need.RUNNING;
    }
}

export default Need;