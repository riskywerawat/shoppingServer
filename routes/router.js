
const mysql = require('mysql');
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "shopping"
});

exports.getuserFromId = (req, res) => {
    db.query("SELECT * FROM config WHERE id=1", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
};

exports.getallProduct = (req, res) => {
    db.query("SELECT pr.id AS id , pr.name AS name , pr.price AS price , pr.fullPrice AS fullPrice , pr.productKey AS productKey, pr.stock AS stock, pr.img AS img, pr.status AS status, b.name AS brand, pt.name_th AS typeName FROM products AS pr INNER JOIN brand AS b ON pr.brand = b.id INNER JOIN product_type AS pt ON pr.type = pt.id WHERE pr.status = 'Y'", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
}

