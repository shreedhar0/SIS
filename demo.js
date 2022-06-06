const express = require('express')
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.get('/demo',function(req, res){
    res.sendFile(__dirname+'/src/login.html');
});
app.post('/demo',function(req, res){
    console.log(req.body);
});
app.listen(8000);