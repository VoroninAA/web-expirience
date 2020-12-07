var express = require("express");
var app = express();
var connection = require("./db");
var bodyParser = require('body-parser');
var fs = require("fs");
var globalValues = [];
var defaultConfig = 'test.json';

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));


function parseSubConfig(data) {
    var keys = Object.keys(data);
    var counter = 0;
    for (var k in data) {
        if (counter > 0) {
            globalValues.push(keys[counter]);
        }
        counter += 1;
    }

}

function parseConfig(data) {
    var keys = Object.keys(data);
    globalValues.push(keys[1]);
    for (var j in data.resources) {
        parseSubConfig(data.resources[j]);
    }
}

app.get("/meters", function (req, res) {
    connection.query("select * from meters", function (err, rows) {
        if (err) {
            console.log(err);
            return;
        }
        res.end(JSON.stringify(rows));
    });

});


app.put("/insert", function (req, res) {
    var str = "insert into meters values (";
    for (var i = 0; i < req.body.length; i++) {
        str += req.body[i];
        if (i != req.body.length - 1) str += ", "
    }
    str += ")";
    connection.query(str, function (err, rows) {
        if (err) {
            console.log(err);
            return;
        }
        res.end(JSON.stringify(rows));
    });
});

app.get("/initial_load", function (req, res) {
    str = "./configs/" + defaultConfig;
    var json = require(str);
    res.end(JSON.stringify(json));
});

app.post("/change_config", function (req, res) {
    globalValues = [];
    valuesSize = 0;
    path = './configs/';
    path += req.body;
    defaultConfig = req.body;
    var json = require(path);
    parseConfig(json);
    str = "create table meters( "
    connection.query("drop table meters", function (err, rows) {
        if (err) {
            console.log(err);

        }
    });
    for (var i = 0; i < globalValues.length; i++) {
        str += globalValues[i];
        if (i != globalValues.length - 1) {
            str += " varchar(20), ";
        } else {
            str += " varchar(20));";
        }
    }
    console.log(str);
    connection.query(str, function (err, rows) {
        if (err) {
            console.log(err);

        }
    });
    res.end(JSON.stringify(json));
});

app.get("/list_config", function (req, res) {
    console.log("GET /list_config called");
    fs.readdir("./configs", function (err, items) {
        res.end(JSON.stringify(items));
    });
});

app.listen(3000);