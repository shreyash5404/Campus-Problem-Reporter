// Toggle Password Visibility
document.querySelectorAll(".toggle").forEach(icon => {
    icon.addEventListener("click", function () {
        const targetId = this.getAttribute("data-target");
        const input = document.getElementById(targetId);

        if (input.type === "password") {
            input.type = "text";
            this.textContent = "🙈";
        } else {
            input.type = "password";
            this.textContent = "👁";
        }
    });
});

// Form Validation
document.getElementById("resetForm")
.addEventListener("submit", function(e){
    e.preventDefault();

    const newPass = document.getElementById("newPassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;

    if(newPass.length < 6){
        alert("Password must be at least 6 characters long.");
        return;
    }

    if(newPass !== confirmPass){
        alert("New Password and Confirm Password do not match.");
        return;
    }

    alert("Password Updated Successfully!");
    window.location.href = "index.html";
});
