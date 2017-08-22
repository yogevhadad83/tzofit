import StepsLogger from "../brain/loggers/stepsLogger/steps-logger"

class View {

    parseDataOptions(sources) {
        let html = "<option disabled selected>...בחר</option>";
        for (let s in sources) {
            html += "<option value='" + sources[s].name + "'>" + sources[s].label + "</option>";
        }
        return (html);
    }

    updateTemplate(source) {
        let firstInput;
        let newDataTemplateWrapper = document.getElementById("new-data-template-wrapper");
        newDataTemplateWrapper.innerHTML = source.template;
        firstInput = newDataTemplateWrapper.getElementsByClassName("first-input")[0];
        firstInput.focus();
    }

    formatData(element) {
        element.value = element.value.toUpperCase();
    }

    moveToNextInput(element) {
        let parent = element.parentNode;
        let index = parseInt(parent.dataset.index);
        let wrappers = parent.parentNode.getElementsByClassName("single-input-box");
        if (index < wrappers.length - 1) {
            wrappers[index + 1].getElementsByTagName("input")[0].focus();
        }
    }

    clearTemplate() {
        let firstInput;
        let template = document.getElementsByClassName("new-data-template")[0];
        let inputs = template.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        }
        firstInput = template.getElementsByClassName("first-input")[0];
        firstInput.focus();
    }

    writeSolution() {
        let output = document.getElementById("output");
        output.innerHTML = StepsLogger.parse();
    }
}

export default View