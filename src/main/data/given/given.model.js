class Given {
    constructor() {
        this.objects = {
            vertices: [],
            segments: []
        };

        this.equations = [];
    }

    getObjects () {
        // let objects = {
        //     vertices: [],
        //     segments: []
        // };
        //
        // for (let type in this.objects) {
        //     for (let i=0; i < this.objects[type].length; i++) {
        //         objects[type].push(this.objects[type][i]);
        //     }
        // }
        //
        // return objects;
        return this.objects;
    }

    getEquations () {
        // let equations = [];
        //
        // for (let i=0; i < this.equations.length; i++) {
        //     equations.push(this.equations[i]);
        // }
        // return equations;

        return this.equations;
    }

    setObjects (objects) {
        for (let type in this.objects) {
            for (let i=0; i < this.objects[type].length; i++) {
                objects[type].push(this.objects[type][i]);
            }
        }

        return objects;
    }

    setEquations (equations) {
        this.equations = equations;
    }
}

export default Given;