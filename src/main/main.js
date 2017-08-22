import View from "./view/view"
import DataManager from "./data/dataManager"
import Connector from "./data/connector"
import Brain from "./brain/brain"

function requireAll(r) {
    r.keys().forEach(r);
}
requireAll(require.context('./brain/needs/segment/segmentLength/how/', true, /\.js$/));
requireAll(require.context('./brain/needs/segment/segmentsExpression/how/', true, /\.js$/));
requireAll(require.context('./data/sources/segmentEqualsSize/', true, /\.js$/));
requireAll(require.context('./data/sources/segmentFreeEquation/', true, /\.js$/));

let view = new View();

let data = DataManager;
let brain = new Brain();

let saveButton = document.getElementById("save-button");

DataManager.getDataSources().then((sources) => {
    let newDataSelect = document.getElementById("new-data-select");
    newDataSelect.innerHTML = view.parseDataOptions(sources);
});

window.TZOFIT = {};
((scope) => {

    function readNeed() {
        let needDiv = document.getElementsByClassName("new-data-need");
        let need = needDiv[0].getElementsByClassName("new-vertex-name");
        return need[0].value + need[1].value;
    }

    scope.newDataOptionSelected = function (sourceName) {
        let source = data.getDataSourceByName(sourceName);
        view.updateTemplate(source);
    };

    scope.onEnterVertexName = function (element) {
        view.formatData(element);
        view.moveToNextInput(element);
    };

    scope.onTemplateFill = function (e, sourceName) {
        if (e.key == "Enter") {
            //TODO: Make it so it does not duplicate the source name both in the template and the js files
            scope.onAddData(sourceName);
        }
    };

    scope.onSolveFill = function (e) {
        if (e.key == "Enter") {
            scope.solve();
        }
    };

    scope.onAddData = function (sourceName) {
        let source = data.getDataSourceByName(sourceName);
        let given = source.parseNewData();
        document.getElementById("given-data").innerHTML += ("<p>" + given + "</p>");
        view.clearTemplate();
    };

    scope.solve = function () {
        let need = readNeed();
        Connector.onSolve(need);
        brain.solve(need);
        view.writeSolution();
    };

    scope.saveButtonClick = function(saveButton) {
        saveButton.classList.toggle("selected");
    };

    scope.loadButtonClick = function(n) {
        if (saveButton.classList.contains("selected")) {
            Connector.save(n);
            saveButton.classList.remove("selected");
        } else {
            Connector.load(n);
        }
    };
})(window.TZOFIT);