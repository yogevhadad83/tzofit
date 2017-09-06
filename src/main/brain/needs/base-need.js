import HowDoIGetIt from "./how-do-i-get-it"
import NeedsLogger from "../loggers/needsLogger/needs-logger"
import Need from "../loggers/needsLogger/need";
import Result from "../loggers/needsLogger/result";

class BaseNeed {

    constructor(name) {
        this.name = name;
        this.howDoIgetIt = new HowDoIGetIt();
    }

    registerHow(how, after) {
        this.howDoIgetIt.register(how, after);
    }

    getIt(subject, offsetSize) {
        let result;
        let need = new Need(this.name, subject);
        let oldNeed = NeedsLogger.getNeed(this.name, subject);

        let offset = (() => {
            let ret = "";
            for (let i=0; i < offsetSize; i++) {
                ret += " ";
            }
            return ret;
        })();

        function getOld() {
            console.warn(offset, "need > old >", this.name, subject);
            return oldNeed.getResult() || Result.FAILED_RESULT;
        }

        function getNew() {
            let result;
            let hows = this.howDoIgetIt.getHows();


            console.warn(offset, "need > new > ", this.name, subject);

            for (let i = 0; i < hows.length; i++) {

                console.warn(offset, " _ how > ", hows[i].name, subject);
                result = hows[i].execute(subject, offsetSize + 5);
                console.warn(offset, "|_ how > ", hows[i].name, subject, "result > ", result.getValue());

                if (result.isFailed()) {
                    continue;
                } else {
                    this.gotResult(subject, result);
                    break;
                }
            }

            return result;
        }

        document.dispatchEvent(new Event("needStart"));

        //NeedsLogger.printAll();
        if (oldNeed) {
            result = getOld.call(this);
        } else {
        NeedsLogger.addNeed(need);
            result = getNew.call(this);

            //NOTE: We do need to add the need to the NeedsLogger beforehand, since we want child needs to know it's still running
            if (result.isFailed()) {
                NeedsLogger.removeNeed(this.name, subject);
            } else {
        need.setResult(result);
            }
        }

        console.warn(offset, "need > ", this.name, subject, "result > ", result.getValue());

        let eventData = result.isFailed() ? {
            status: "FAIL"
        } : {
            status: "SUCCESS",
            whatDidINeed: this.parseNeed(subject),
            solution: this.parseSolution(subject, result),
            justification: result.getJustification()
        };

        document.dispatchEvent( new CustomEvent("needEnd", {detail: eventData}) );

        return result;
    }
}

export default BaseNeed;