//Required modules

const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const { dirname } = require('path');
const { request } = require('http');
const { response } = require('express');
const urlencoded = require('body-parser/lib/types/urlencoded');
const res = require('express/lib/response');
const cookieParser = require("cookie-parser");
const { contentType } = require('express/lib/response');

const oneDay = 1000 * 60 * 60 * 24;
const app = express();
const port = 3000;

//Connection to MySQL

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

app.use(session({
  secret : "key",
  saveUninitialized : true,
  cookie :{maxAge : oneDay},
  resave : false
}));

app.use(cookieParser());

//Starting point of a project

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  res.end();
});

//Routes 
app.get('/src/dashboard-student', function(req , res){
  if(req.session.loggedin){
    connection.query("SELECT full_name FROM userinfo WHERE prn=? AND password=?",[req.session.PRN, req.session.PASSWORD],function(error, results){
      res.render(__dirname + '/src/dashboard-student', {studentdata : results});
    })
  }else{
    res.sendFile(__dirname+'/src/login.html');
  }
});

app.get('/src/index.html', function(req, res){
  res.sendFile(__dirname+'/src/index.html');
});

app.get('/src/grades', function(req , res){
  res.render(__dirname + '/src/grades');
  res.end();
});

app.get('/src/messages', function(req , res){
  res.render(__dirname + '/src/messages');
  res.end();
});

app.get('/src/preferences', function(req , res){
  res.render(__dirname + '/src/preferences');
  res.end();
});

app.get('/src/register.html', (req, res) => {
  res.sendFile(__dirname + '/src/register.html');
});

//Inserting registration form in database

app.post('/src/register.html', function(req ,res){
  res.setHeader('Content-Type', 'text/html');
  var name = req.body.name;
  var address = req.body.address;
  var email = req.body.email;
  var prn = req.body.prn;
  var password = req.body.password;
  var contact = req.body.contact;
  var course = req.body.course;
  
//Registration with email and prn authintication

  if(password.length > 7 && contact.length == 10 ){
    connection.query("SELECT COUNT(*) AS cnt FROM userinfo WHERE email = ?" , [email] , function(error , results){
      if(error){
         console.log(err);
      }else{
            if(results[0].cnt > 0){  
              res.end(`This email is already in use, try with another email. <br><a href="/src/register.html">Click me to register again..</a>`);  
            }else{
              connection.query("SELECT COUNT(*) AS cnt FROM userinfo WHERE prn = ?" , [prn] , function(error , results){
                if(error){
                  console.log(err);
                }else{
                      if(results[0].cnt > 0){  
                        res.end(`This prn is already in use, try with another prn. <br><a href="/src/register.html">Click me to register again..</a>`);  
                      }else{
                        var sql = "INSERT INTO userinfo (full_name ,address, email, prn, password, contact, course) VALUES ('"+name+"','"+address+"','"+email+"','"+prn+"','"+password+"','"+contact+"','"+course+"')";
                        connection.query(sql, function(error, result){
                          if (error) throw error;
                          res.redirect('/src/login.html');
                        });
                      }
                }
              });
            }
        }
  });
  }else{
      res.end(`Password must be at least 8 characters and contact number must be 10 characters long ..<br><a href="/src/register.html">Click me to register again..</a>`);  
  }
    
});

app.get('/src/login.html', function(req,res){
  res.sendFile(__dirname + '/src/login.html'); 

});

//Login authintication
app.post('/authlogin' ,function(req , res){
  var prn = req.body.prn;
  var password = req.body.password;
  if(prn && password){
    connection.query('SELECT * FROM userinfo WHERE prn=? AND password=?',[prn , password],function(error, results, fields){
      if (error) throw error;
      if(results.length > 0){
        req.session.PRN = prn;
        req.session.PASSWORD = password;
        req.session.loggedin = true;
        res.redirect('/src/dashboard-student');
              
      }else{
        res.redirect('/src/login.html');
      }
    });  
  }else{
    res.redirect('/src/login.html');
  }
});

//Setting up profiles
app.get('/src/profile', function(req, res){
    connection.query('SELECT * FROM userinfo WHERE prn =? AND password=?;',[req.session.PRN, req.session.PASSWORD],function(error, results){
        if(error) throw error;
        res.render(__dirname + '/src/profile',{ studentdata : results});
        res.end();
    });
});



//Port for project

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})