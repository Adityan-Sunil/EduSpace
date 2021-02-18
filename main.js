const express = require('express');
const app = express();
const axios = require('axios');
var session = require('express-session');
const typingDNA = require('typingdnaclient');
const typingDnaClient = new typingDNA('cc232a43f92f13ac0a736b97a7ed1d86','f777e09c7c4d1976aed3bd9e805f37a6');
const PORT = process.env.PORT || 3000;

app.use(session({secret:'Devpost Hackathon', resave:true, saveUninitialized:false, cookie:{}}));
app.use(express.json());
app.use(express.static('Static'));
app.use(express.urlencoded({
  extended:true
}))

app.post('/signup',(req,res)=>{
  console.log("Got Request");
  //console.log(req.body.tp);
    axios.interceptors.request.use(config => {
    return config;
  }, error => {
    return Promise.reject(error);
  });
  axios.post('https://snt1207o90.execute-api.us-east-1.amazonaws.com/development/signup',{
        email:req.body.email,
        password:req.body.password
  },{
    headers: {
        'Content-Type': 'application/json',
    }
}).then((response)=>{
    console.log(response.data);
    req.session.ID = response.data;
    enrollAPI(req.session.ID, req.body.tp,function(error, result){
      if(error){console.log(error)}
      else{console.log(result)}
    })
    res.send("success");
    },(error)=>{
    console.log(error);
  })
})

function verifyAPI(userid, tp, callback){
  console.log(userid);
  typingDnaClient.verify(userid,tp,2,callback);
}

function enrollAPI(userid, tp,callback){
    if(typeof(tp) === "object"){  
      tp.forEach(function(typingPattern, index){
        setTimeout(() => {
          typingDnaClient.save(userid, typingPattern, callback);
        },index * 1500);
    });
  }else{
    console.log("sending code");
    typingDnaClient.auto(userid, tp,callback);
  }
}

app.post('/verify', (req,res)=>{
  var tp = req.body.tp;
  var id = req.session.ID;
  verifyAPI(id, tp, function(err, result){
    if(err){"Error: ",console.log(err);}
    else{"Result: ",console.log(result.netScore);
  res.send({"result":result.netScore});}
  })
})
app.post("/loginCheck",(req,res)=>{
  if(req.session.ID == null){
    res.send(false);
  }else{
    res.send(true);
  }
})
app.post('/enroll', (req,res)=>{
  userId = req.session.ID;
  console.log(req.session.ID);
  typingPattern = req.body.tp;
  console.log(typingPattern);
  enrollAPI(req.session.ID, req.body.tp,function(error,result){
    if(error){console.log(error);}
    else{res.send(result.netScore);}
  })
})
app.get('/logout',(req,res)=>{
  // req.session.ID = null;
  // res.redirect("/login.html");
  console.log(req);
})
app.post('/login', (req,res)=>{
  console.log("Got POST");
  console.log(req.body);
  var details = (req.body);
  var resp;
  axios.interceptors.request.use(config => {
      console.log('Request was sent'); 
      return config;
    }, error => {
      return Promise.reject(error);
    });
    axios.post('https://snt1207o90.execute-api.us-east-1.amazonaws.com/development/login',{
          email: details.email,
          password: details.password
    },{
      headers: {
          'Content-Type': 'application/json',
      }
  }).then((response)=>{
      resp = response.data;
      req.session.ID = response.data;
      console.log("Login: ",req.session);
      req.session.save();
      res.send(response.data);
    },(error)=>{
      console.log(error);
    })
});
app.listen(PORT, function(){
    console.log("Server Listening\n");
})