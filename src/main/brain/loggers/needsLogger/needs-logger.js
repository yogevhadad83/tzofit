class NeedsLogger {

    constructor() {
        this.needs = [];
    }

    addNeed(need) {
        this.needs.push(need);
    }

    removeNeed(name, subject) {
        let index = this.getNeedIndex(name, subject);
        if (index > -1) {
            this.needs.splice(index, 1);
        }
    }
    getNeed(name, subject) {
        let index = this.getNeedIndex(name, subject);
        return this.needs[index];
    }
    getNeedIndex(name, subject) {
        let need;
        for (let i = 0; i < this.needs.length; i++) {
            need = this.needs[i];
            if (need.name == name && need.subject == subject) {
                return i;
            }
        }
    }
    printAll() {
        for(let i=0; i < this.needs.length; i++) {
            console.warn(i + "", this.needs[i].name, this.needs[i].subject, this.needs[i].getResult() ? "=> " + this.needs[i].getResult().getValue() : "---");
        }
        console.warn("_____________________________________________________")
    }
}

export default new NeedsLogger();