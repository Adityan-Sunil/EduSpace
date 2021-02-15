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
    var email = document.getElementById("login-form").Email.value;
    var password = document.getElementById("login-form").Password.value;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST","http://localhost:3000/login", false);
    xhttp.setRequestHeader("Content-type","application/json");
    console.log(JSON.stringify({"email":email,"password":password}));
    xhttp.send(JSON.stringify({"email":email,"password":password}));   
    console.log(xhttp.responseText);
})
