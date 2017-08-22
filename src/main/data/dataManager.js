class DataManager {

    constructor() {
        this.onDataReady;
        this.numberOfSources = 0;
        this.numberOfLoaded = 0;
        this.sources = {};
    }

    getDataSources() {
        return new Promise((resolve, reject) => {
            this.onDataReady = resolve;
        });
    }

    getDataSourceByName(name) {
        return this.sources[name];
    }

    addDataSource(src) {
        this.sources[src.name] = src;
        this.numberOfSources++;
        src.load().then(() => {
                this.numberOfLoaded++;
                if (this.numberOfSources == this.numberOfLoaded) {
                    if (this.onDataReady) {
                        this.onDataReady(this.sources);
                    }
                }
            },
            (err) => {
                delete this.sources[src.name];
                console.error(err);
            }
        );
    }
}

export default new DataManager();