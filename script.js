var url = 'http://localhost:3000/meters';
var url2 = 'http://localhost:3000/insert';

function insert() {
    var send = {
        "name": "meters",
        "flat": document.getElementById("flat").value,
        "resources": [
            {
                "name": "water",
                "water": document.getElementById("water").value
                ,
            },
            {
                "name": "energy",
                "day": document.getElementById("day").value,
                "night": document.getElementById("night").value
            },
            {
                "name": "gas",
                "gas": document.getElementById("gas").value,
            }
        ],
    };
    var oReq = new XMLHttpRequest();
    oReq.open("PUT", url2);
    oReq.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    oReq.send(JSON.stringify(send));
    if (!document.getElementById('table_div').hidden)
        queryHandbook(url)
}

function queryHandbook(request) {

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
    document.getElementById('table_div').hidden = false;
}

function hideTable() {
    document.getElementById('table_div').hidden = true;
}