const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const { dirname } = require('path');
const { request } = require('http');
const { response } = require('express');
const urlencoded = require('body-parser/lib/types/urlencoded');

const app = express();
const port = 3000

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'password',
  database : 'sis'
});



app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set('view engine','ejs');

app.use(express.static('bootstrap'));

app.use(express.static('src'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended : true}));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  res.end();
});

app.get('/dashboard-student', function(req , res){
  res.render(__dirname + '/src/dashboard-student');
  //if (request.session.loggedin) {
  //  res.render(__dirname + '/src/dashboard-student');
  //}else{
  //  response.send('Please login to view this page!');
  //}
  res.end();
});

app.get('/grades', function(req , res){
  res.render(__dirname + '/src/grades');
  res.end();
});

app.get('/messages', function(req , res){
  res.render(__dirname + '/src/messages');
  res.end();
});

app.get('/preferences', function(req , res){
  res.render(__dirname + '/src/preferences');
  res.end();
});

app.get('/src/register.html', (req, res) => {
  res.sendFile(__dirname + '/src/register.html');
});

// Connecting to database
app.post('/src/register.html', function(req ,res){
  var name = req.body.name;
  var address = req.body.address;
  var email = req.body.email;
  var prn = req.body.prn;
  var password = req.body.password;
  var contact = req.body.contact;
  var course = req.body.course;

  connection.connect(function(error){
    if(error) throw error;
    var sql = "INSERT INTO userinfo (full_name ,address, email, prn, password, contact, course) VALUES ('"+name+"','"+address+"','"+email+"','"+prn+"','"+password+"','"+contact+"','"+course+"')";
    connection.query(sql, function(error, result){
      if (error) throw error;
      res.redirect('/src/login.html');
    });
  });
  
});

app.get('/src/login.html', function(req,res){
  res.sendFile(__dirname + '/src/login.html');
  
});

//Login authintication

app.post('/src/login.html' ,function(req , res){
  var prn = req.body.prn;
  var password = req.body.password;
  connection.query('SELECT * FROM userinfo WHERE prn=? AND password=?',[prn , password],function(error, results, fields){
    if (error) throw error;
    if(results.length > 0){
      res.redirect('/dashboard-student');
    }else{
      res.redirect('/src/login.html');
  //    res.send('Please enter correct PRN and password.');
    }
    res.end();
  });


  //if(prn && password){
  //  connection.connect(function(error){
  //    if (error) throw error;
  //      var sql = 'SELECT * FROM userinfo WHERE prn=? AND password=?';
  //      connection.query(sql, [prn, password], function(error, results){
  //        if(error) throw error;
  //        if(results.length > 0){
  //          request.session.loggedin = true;
  //          request.session.username = prn;
  //          response.redirect('/dashboard-student');
  //        }else{
  //          response.send('Incorrect prn and pass.')
  //        }
  //        response.end();
  //      });
  //    });
  //}else{
  //  response.send('Please enter Username and Password!');
	//	response.end();
  //}
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})