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

    getIt(subject) {
        let result;
        let need = new Need(this.name, subject);
        let oldNeed = NeedsLogger.getNeed(this.name, subject);

        function getOld(oldNeed) {
            let result;
            if (oldNeed.isRunning()) {
                result = Result.FAILED_RESULT;
                console.warn("need > old(running) >", this.name, subject);
            } else {
                result = oldNeed.getResult();
                console.warn("need > old >", this.name, subject);
            }
            return result;
        }

        function getNew() {
            let result;
            let hows = this.howDoIgetIt.getHows();


            if (this.name == "evaluateSegmentsExpession" && subject.indexOf("AD - 2") == 0) {
                debugger;
            }
            console.warn("need > new >", this.name, subject);

            for (let i = 0; i < hows.length; i++) {

                console.warn("   how > ", hows[i].name, subject);
                result = hows[i].execute(subject);
                console.warn("   how > ", hows[i].name, subject, "result > ", result.getValue());

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

        //It's important to update the logger only AFTER we tried to look for an older call of this type
        NeedsLogger.addNeed(need);

        result = oldNeed ? getOld.call(this, oldNeed) : getNew.call(this);
        need.setResult(result);
        console.warn("need > ", this.name, subject, "result > ", result.getValue());

        let eventData = need.isDone() ? {
            status: "SUCCESS",
            whatDidINeed: this.parseNeed(subject),
            solution: this.parseSolution(subject, result),
            justification: result.getJustification()
        } : {
            status: "FAIL"
        };

        document.dispatchEvent( new CustomEvent("needEnd", {detail: eventData}) );

        return result;
    }
}

export default BaseNeed;