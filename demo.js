const express = require('express')
const bodyParser = require('body-parser')
//const ejs = require('ejs')
const mysql = require('mysql')

const app = express();

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'sis'
});

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
/*
app.get('/demo',function(req, res){
    res.sendFile(__dirname+'/src/login.html');
});
app.post('/demo',function(req, res){
    console.log(req.body);
});
*/
app.get('/', function(req,res){
    connection.connect(function(error){
        if(error) throw error;
        connection.query('SELECT * FROM userinfo;',function(error, results){
            if(error) throw error;
            res.render(__dirname + '/demo', {studentdata : results});
        });
    });
});

app.listen(8000);