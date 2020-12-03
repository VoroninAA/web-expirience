var express = require("express");
var app = express();
var connection = require("./db");
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

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
    connection.query("insert into meters values (?, ?, ?, ?, ?)",
        [req.body.flat, req.body.resources[0].water, req.body.resources[1].day,
            req.body.resources[1].night, req.body.resources[2].gas], function (err, rows) {
            if (err) {
                console.log(err);
                return;
            }
            res.end(JSON.stringify(rows));
        });
});

app.listen(3000);