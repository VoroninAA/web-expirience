var db = require("mysql");
var connection = db.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"meters"
});

connection.connect(function(err){
    if (err) {
        console.log(err);
        return;
    }
    console.log("connection established");
})






module.exports = connection;