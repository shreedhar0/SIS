function validation(){
    var password = document.register.password.value;
    var contact = document.register.contact.value;
    var pass = document.login.pass.value;
    if(pass.length < 9){
        alert("Password must be at least 8 characters.");
    }

    if(password.length < 6){
        alert("Password must be at least 6 characters.");
        return false;
    }
    
    else if(contact.length != 10){
        
        alert("Add correct contact number.");
        return false;
    }

    
}
function reset(){
    document.getElementById("register").reset();
}