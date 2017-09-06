import Result from "../loggers/needsLogger/result"
import Template from "../../utils/template"

class BaseHow {

    constructor(name, justificationTemplateStr) {
        this.name = name;
        this.justificationTemplate = new Template(justificationTemplateStr);
    }

    execute(subject, offsetSize) {
        return this.getResult(subject, offsetSize) || Result.FAILED_RESULT;
    }

    //@overidden
    getResult(value, justificationValues) {
        return new Result(value, this.justificationTemplate.replace(justificationValues));
    }
}

export default BaseHow