var url = 'http://localhost:3000/meters';
var url2 = 'http://localhost:3000/insert';
var url3 = "http://localhost:3000/initial_load";
var url4 = "http://localhost:3000/change_config";
var url5 = "http://localhost:3000/list_config";
var valuesSize = 0;
var values = [];

function insert() {
    var array = [];
    for (var i = 0; i < values.length; i++) {
        array.push(document.getElementById(values[i]).value);
    }
    var oReq = new XMLHttpRequest();
    oReq.open("PUT", url2);
    oReq.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    oReq.send(JSON.stringify(array));
    valuesSize = 0;
}

function loadTable(request) {
    function reqListener(event) {
        var data = JSON.parse(this.responseText);
        var table = document.getElementById("table_data");
        table.innerHTML = '';


        if (data.length > 0) {
            var header = table.createTHead();
            var hrow = header.insertRow();
            console.log(header);
            for (var k in data[0]) {
                var cell = hrow.insertCell();
                cell.innerHTML = k;
            }
        }

        for (var i = 0; i < data.length; i++) {
            var newRow = table.insertRow();
            for (j in data[i]) {
                var cell = newRow.insertCell();
                cell.innerHTML = data[i][j];
            }
        }
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", request);
    oReq.send();
}

function showTable() {
    loadTable(url);
    if (document.getElementById('table_div').hidden != false)
        document.getElementById('table_div').hidden = false;
    else
        document.getElementById('table_div').hidden = true;
}

function createSubFieldset(data) {
    var fieldset = document.createElement("fieldset");
    var legend = fieldset.appendChild(document.createElement("legend"));
    legend.appendChild(document.createTextNode(data.name));
    var keys = Object.keys(data);
    var counter = 0;
    for (var k in data) {
        if (counter > 0) {
            //console.log(k);
            fieldset.appendChild(document.createTextNode(keys[counter]));
            var input = fieldset.appendChild(document.createElement("input"));
            input.type = "text";
            input.id = valuesSize.toString();
            valuesSize++;
            values.push(input.id);
            console.log(input.id);
        }
        counter += 1;
    }
    return fieldset;
}

function createFieldset(data) {
    var fieldset = document.createElement("fieldset");
    fieldset.id = "fieldset";
    var legend = fieldset.appendChild(document.createElement("legend"));
    legend.appendChild(document.createTextNode(data.name));
    var keys = Object.keys(data);
    fieldset.appendChild(document.createTextNode(keys[1]));
    var input = fieldset.appendChild(document.createElement("input"));
    input.type = "text";
    input.id = valuesSize.toString();
    valuesSize++;
    values.push(input.id);
    console.log(input.id);
    for (var j in data.resources) {
        fieldset.appendChild(createSubFieldset(data.resources[j]));
    }
    valuesSize = 0;
    return fieldset;
}

function initialLoad() {
    function loader(event) {
        var data = JSON.parse(this.responseText);
        var form = document.getElementById("form");
        var fieldset = createFieldset(data);
        form.appendChild(fieldset);
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", loader);
    oReq.open("GET", url3);
    oReq.send();
}

function changeConfig(file_name) {
    values = [];
    valuesSize = 0;

    function loader(event) {
        var data = JSON.parse(this.responseText);
        var form = document.getElementById("form");
        var fieldset = createFieldset(data);
        form.appendChild(fieldset);
    }

    document.getElementById("fieldset").remove();
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", loader);
    oReq.open("POST", url4);
    oReq.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    oReq.send(JSON.stringify([file_name]));
    document.getElementById('table_div').hidden = true;
}

function getConfigs() {
    document.getElementById("list").style.display = 'block';

    function loader(event) {
        var data = JSON.parse(this.responseText);
        var list = document.getElementById("list");
        list.innerHTML = '';
        item = document.createElement('option');
        for (var i = 0; i < data.length; i++) {
            item.innerHTML = data[i];
            list.appendChild(item.cloneNode(true));
        }
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", loader);
    oReq.open("GET", url5);
    oReq.send();
}
