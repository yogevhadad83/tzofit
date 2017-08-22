class HowDoIGetIt {
    constructor() {
        this.hows = [];
    }

    register(how) {
        this.hows[how.index] = how;
    }

    getHows() {
        return this.hows;
    }
}

export default HowDoIGetIt