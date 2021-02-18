function checkLogin(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST","/loginCheck",false);
    xhttp.setRequestHeader("Content-type","application/json");
    xhttp.send(JSON.stringify({url:window.location.href}));
    var resp = xhttp.responseText;
    console.log(resp === "false");
    if(resp === "false"){
        window.location.assign("/login.html");
    }
}
$("#logout").click(function(){
    window.location.assign("/logout");
})