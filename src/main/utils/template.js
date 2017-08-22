class Template {
    constructor(templateStr) {
        this.templateStr = templateStr;
    }

    replace(values) {

        if (!values) {
            return this.templateStr;
        }

        if (!Array.isArray(values)) {
            values = [values];
        }

        return this.templateStr.replace(/\{(\d+)\}/g, function(_,m) {
            return values[m--];
        });
    }
}

export default Template