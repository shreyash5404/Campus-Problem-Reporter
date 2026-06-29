document.getElementById("adminLoginForm")
.addEventListener("submit", function(e){
    e.preventDefault();
    alert("Admin Login Successful (Demo)");
    window.location.href = " http://localhost/CAMPUS-PROBLEM-REPORTER/frontend/admin/admin-dashboard.html";
});