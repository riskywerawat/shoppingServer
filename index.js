const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "shopping"
}) 

// Upload image
const multer = require('multer');

const storage = multer.diskStorage({ 
destination: function (req, file, cb) {
cb(null, 'uploads/')
},
filename: function (req, file, cb) {
cb(null, Date.now() + ".png")
}
})
const upload = multer({ storage: storage }) 
app.get('/', (req, res) => {
res.send('Hello Upload')
})
app.post('/upload', upload.single('file'),  (req, res) => { 

res.send(req.file)
})

// 

app.get('/user99',(req,res)=>{
    db.query("SELECT * FROM config WHERE id=1",(err,result)=>{
        if(err) {
            console.log(err);
        }else {
            res.send(result);
        }
    })
});

app.get('/getAllProduct',(req,res)=>{
    db.query("SELECT pr.id AS id , pr.name AS name , pr.price AS price , pr.fullPrice AS fullPrice , pr.productKey AS productKey, pr.stock AS stock, pr.img AS img, pr.status AS status, b.name AS brand, pt.name_th AS typeName FROM products AS pr INNER JOIN brand AS b ON pr.brand = b.id INNER JOIN product_type AS pt ON pr.type = pt.id WHERE pr.status = 'Y'",(err,result)=>{
        if(err) {
            console.log(err);
        }else {
            res.send(result);
        }
    })
})
app.get('/getBrand',(req,res)=>{
    db.query("SELECT * FROM brand",(err,result)=>{
        if(err) {
            console.log(err);
        }else {
            res.send(result);
        }
    })
})
app.get('/getProductType',(req,res)=>{
    db.query("SELECT * FROM product_type",(err,result)=>{
        if(err) {
            console.log(err);
        }else {
            res.send(result);
        }
    })
})

app.get('/getConfig/:name',(req,res)=>{
    const configName = req.params.name;
    db.query(`SELECT * FROM config WHERE name='${configName}'`,(err,result)=>{
        if(err) {
            console.log(err);
        }else {
            res.send(result);
        }
    })
})

app.post('/login',(req,res)=>{
    console.log('function : /login');
    db.query("SELECT * FROM config WHERE name='OFFROAD'",(err,result)=>{
        if(err) {
            console.log(err);
            res.send({
                status : "error",
                message : "error",
                code : 0
            });
        }else {
            let md5 = require('md5');
            const userName = req.body.userName;
            const password = req.body.password;
            let logCode = md5(result[0].value+password);
            db.query(`SELECT * FROM admin WHERE userName='${userName}' AND password='${logCode}'`,(err,result)=>{
                if(err) {
                    console.log(err);
                    res.send({
                        status : "error",
                        message : "error",
                        code : 0
                    });
                }else {
                    console.log(result);
                    if(result.length > 0) {
                        res.send({
                            status : "success",
                            message : "login สำเร็จ",
                            name : result.name,
                            code : 1
                        });
                    }else {
                        res.send({
                            status : "fail",
                            message : "user name หรือ password ไม่ถูกต้อง",
                            code : 0
                        });
                    }
                    
                }
            });
            
            //res.send(result);
        }
    })
})

var uploader = require('base64-image-upload');

app.post('/uploadImages',(req,res)=>{
    
 
var image = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
uploader.setApiUrl("https://yourimageapi.com/upload");
uploader.upload(image, {mime:"image/png", headers: {'X-Access-Token': '123456789'}}, function(err, response){
  if (!err && response.statusCode == 200){
    console.log(JSON.parse(response.body));
    // handle response
  } else {
    console.log(err, response);
    // handle errors
  }
});
})

app.listen('3001',()=>{
    console.log('Server is running on port 3001')
})