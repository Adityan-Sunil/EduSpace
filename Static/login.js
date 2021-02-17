var userID;
var tdna = new TypingDNA();

//Adding typingPattern Targets
tdna.addTarget('test-email');
tdna.addTarget('test-name');
tdna.addTarget('test-password');
tdna.addTarget('typedna-test');
tdna.addTarget('email');
tdna.addTarget('pwd');

var startTime;
$("#typing-test").hide();
$("#test-switch").click(function(){
    tdna.stop();
    var length = $("#test-email").val().length + $("#test-password").val().length + $("#test-name").val().length;
    if(length <=0){
        $("#test-email").placeholder = "Enter Email";
    }else{
        
        var tpEmail = tdna.getTypingPattern({type:0,length:$('#test-email').val().length, targetId: 'test-email'});
        var tpPass = tdna.getTypingPattern({type:0,length:$('#test-password').val().length, targetId: 'test-password'});
        var tpName = tdna.getTypingPattern({type:0,length:$('#test-name').val().length, targetId: 'test-name'});
        var params =  {
            "email":$('#test-email').val(),
            "tp":[tpEmail,tpPass,tpName],
            "password":$('#test-password').val(),
            "name":$('#test-name').val()
        }
        ajaxCall(params,function(err){
            console.log(err);
        },"signup")
    }
    $("#user-dets").hide();
    $("#typing-test").show();
})
$("#typedna-test").keyup(function(){
    var length = $("#typedna-test").val().length;
    var wpm = length*23500/(new Date().getTime() - startTime);
    $("#wpm").css("width", wpm)
})
$("#typedna-test").focus(function(){
    tdna.start(); //start tracking
    startTime = new Date().getTime();
    console.log("Area on focus");
})
$("#code-submit").click(function(){
    tdna.stop();
    console.log($("#typedna-test").val());
    var params = {
        action:"enroll",
        tp:tdna.getTypingPattern({
            type:1,
            length:$("#typedna-test").val().length, 
            text:$("#test-code").text(), 
            targetId:'typedna-test'
        })
    }
    ajaxCall(params,function(error){
        console.log(error)
    }, "enroll")
})

var btn_switch = document.getElementsByClassName('switch-btn');
var signupForm = true;
for (let i = 0; i < btn_switch.length; i++) {
    btn_switch[i].addEventListener('click',function(e){
        e.preventDefault();
        signupForm = !signupForm;
        console.log(signupForm);
        if(signupForm){
            $('#login').hide();
            $('#signup').show();
        }else{
            $('#login').show();
            $('#signup').hide();    
        }
    });
}
$('#login-submit').click(function(e){
    e.preventDefault();
    console.log("Submitted");
    
    tdna.stop();
    var email = document.getElementById("login-form").Email.value;
    var password = document.getElementById("login-form").Password.value;
    var xhttp = new XMLHttpRequest();
    var tpMail = tdna.getTypingPattern({type:0, length: $("#email").val().length+10}, targetId = 'email');
    var params = {
        tp:tpMail,
        action:"enroll"
    }
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            console.log("Got ID from server");
            userID = this.responseText;
            ajaxCall(params,function(error){
                console.log(error);
            },"verify");
        }
    }
    xhttp.open("POST","/login", false);
    xhttp.setRequestHeader("Content-type","application/json");
    console.log(JSON.stringify({"email":email,"password":password}));
    xhttp.send(JSON.stringify({"email":email,"password":password}));   
})
function ajaxCall(params, callback, url){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST","/"+url, false);
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 || this.status == 200){
            callback(this.responseText);
        }
    }
    xhttp.setRequestHeader("Content-type","application/json");
    console.log(params);
    xhttp.send(JSON.stringify(params));

}