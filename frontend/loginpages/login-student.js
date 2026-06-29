document.getElementById("studentLoginForm")
.addEventListener("submit", function(e){
    e.preventDefault();

    // ✅ SET LOGIN FLAG
    localStorage.setItem("isLoggedIn", "true");

    alert("Login Successful (Demo)");

    // redirect
    window.location.href = "../student/student-dashboard.html";
});