class NeedsLogger {

    constructor() {
        this.needs = [];
    }

    addNeed(need) {
        this.needs.push(need);
    }

    getNeed(name, subject) {
        let need;
        for (let i = 0; i < this.needs.length; i++) {
            need = this.needs[i];
            if (need.name == name && need.subject == subject) {
                return need;
            }
        }
    }
}

export default new NeedsLogger();