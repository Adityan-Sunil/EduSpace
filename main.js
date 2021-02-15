var express = require('express');
var app = express();
var parser = require('body-parser');

app.use(express.json());
app.use(express.static('Static'));

app.post('/login', (req,res)=>{
    console.log("Got POST");
    var details = req.body;
    console.log(details);
    res.send("Recieved");
})

app.listen(3000, function(){
    console.log("Server Listening at 3000\n");
})