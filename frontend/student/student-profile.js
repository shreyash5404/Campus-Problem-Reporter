






const inputs = document.querySelectorAll("input, select");
const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");

// Start in readonly mode
setReadOnly(true);

// Edit button
editBtn.addEventListener("click", function(){
    setReadOnly(false);
});

// Save button
saveBtn.addEventListener("click", function(){

    const profileData = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        bloodGroup: document.getElementById("bloodGroup").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        pincode: document.getElementById("pincode").value,
        rollNo: document.getElementById("rollNo").value,
        department: document.getElementById("department").value,
        year: document.getElementById("year").value,
        division: document.getElementById("division").value,
        fatherName: document.getElementById("fatherName").value,
        motherName: document.getElementById("motherName").value,
        parentContact: document.getElementById("parentContact").value,
        parentEmail: document.getElementById("parentEmail").value,
        medicalCondition: document.getElementById("medicalCondition").value,
        emergencyName: document.getElementById("emergencyName").value,
        emergencyContact: document.getElementById("emergencyContact").value
    };

    console.log("Profile Data:", profileData);

    // Later you can send this to backend:
    /*
    fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
    })
    */

    setReadOnly(true);
});

// Function to toggle readonly mode
function setReadOnly(status){
    inputs.forEach(input => {
        input.disabled = status;
    });
}
