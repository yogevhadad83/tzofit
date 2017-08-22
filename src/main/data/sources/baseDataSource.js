class BaseDataSource {

    constructor() {
        this.templateBaseUrl = "main/data/sources/";
    }

    bulidTemplateUrl() {
        return this.templateBaseUrl + this.name + "/" + "template.html";
    }

    createTemplate(html) {
        let container = document.createElement("DIV");
        container.innerHTML = html;
        let template = container.getElementsByClassName("new-data-template")[0];
        template.classList.add("right");
        template.innerHTML = "<span>" +
            "<button onclick='TZOFIT.onAddData(\"" + this.name + "\");'>" +
            "הוסף" +
            "</button>" +
            "</span>" + template.innerHTML;

        return container.innerHTML;
    }

    load() {
        return new Promise((resolve, reject) => {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", this.bulidTemplateUrl());
            xmlhttp.onload = function () {
                if (xmlhttp.status === 200) {
                    this.template = this.createTemplate(xmlhttp.responseText);
                    resolve();
                } else {
                    reject('Request failed. Returned status of ' + xmlhttp.status);
                }
            }.bind(this);
            xmlhttp.send();
        });
    };
}

export default BaseDataSource