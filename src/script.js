function validation(){
    var password = document.register.password.value;
    var contact = document.register.contact.value;
    var pass = document.login.pass.value;
    if(pass.length < 9){
        alert("Password must be at least 8 characters.");
    }

    if(password.length < 9){
        alert("Password must be at least 8 characters.");
        return false;
    }
    
    else if(isNaN(contact)){
        alert("Add numbers here.");
        return false;
    }

    
}
function reset(){
    document.getElementById("register").reset();
}