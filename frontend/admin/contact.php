<?php
include "../../backend/db.php";

$result = $conn->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Admin - Contact Messages</title>

<style>
body {
    font-family: 'Segoe UI', 'Tahoma', 'sans-serif';
    background: #f4f6f9;
    margin: 0;
    padding: 0;
}

.container {
    width: 90%;
    margin: 30px auto;
}

h2 {
    text-align: center;
    margin-bottom: 25px;
    color: #333;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.badge {
    display: inline-block;
    background: #007bff;
    color: #fff;
    padding: 5px 12px;
    font-size: 13px;
    border-radius: 20px;
    margin-bottom: 10px;
}

.info {
    font-size: 14px;
    margin: 6px 0;
}

.message {
    background: #f1f3f6;
    padding: 10px;
    border-radius: 8px;
    margin-top: 10px;
}

.date {
    margin-top: 12px;
    font-size: 12px;
    color: #888;
    text-align: right;
}

/* BUTTONS */
.delete-btn{
    margin-top:10px;
    padding:6px 10px;
    border:none;
    background:#ef4444;
    color:white;
    border-radius:6px;
    cursor:pointer;
}

.mail-btn{
    margin-top:10px;
    padding:6px 10px;
    border:none;
    background:#0ea5a4;
    color:white;
    border-radius:6px;
    cursor:pointer;
}

/* POPUP */
.popup{
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.6);
    display:none;
    justify-content:center;
    align-items:center;
}

.popup-box{
    background:white;
    padding:20px;
    border-radius:10px;
    width:300px;

    /* ✅ FONT FIX */
    font-family: 'Segoe UI', Tahoma, sans-serif;
    position: relative;
}

.popup-box input,
.popup-box textarea{
    width:100%;
    padding:8px;
    margin-bottom:10px;
}

.popup-box button{
    width: 80%;
    padding:10px;
    background:#0ea5a4;
    color:white;
    border:none;
    
}

/* BACK BUTTON */
.back-btn{
    position:absolute;
    top:10px;
    left:22px;
    background:none;
    border:none;
    font-size:14px;
    cursor:pointer;
    color:#0ea5a4;
}

.empty {
    text-align:center;
    color:#888;
}
</style>
</head>

<body>

<div class="container">
<h2>📩 Contact Messages</h2>

<div class="grid">

<?php
if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        echo "
        <div class='card'>

            <div class='badge'>{$row['subject']}</div>

            <div class='info'><b>Name:</b> {$row['name']}</div>
            <div class='info'><b>Email:</b> {$row['email']}</div>

            <div class='message'>{$row['message']}</div>

            <div class='date'>{$row['created_at']}</div>

            <button class='delete-btn' onclick='deleteMessage({$row['id']}, this)'>
                Delete
            </button>

            <button class='mail-btn' onclick=\"openMailPopup('{$row['email']}')\">
                Send Email
            </button>

        </div>
        ";
    }
} else {
    echo "<p class='empty'>No messages yet</p>";
}
?>

</div>
</div>

<!-- EMAIL POPUP -->
<div class="popup" id="mailPopup">
    <div class="popup-box">

        <!-- ✅ BACK BUTTON -->
        <button class="back-btn" onclick="closePopup()">⬅ Back</button><br>

        <h3 style="margin-top:30px;">Send Email</h3>

        <input type="email" id="popupEmail" readonly>

        <textarea id="popupMessage" placeholder="Enter message"></textarea>

        <button onclick="sendEmail()">Send</button>
    </div>
</div>

<script>

// DELETE FUNCTION
function deleteMessage(id, btn){
    if(!confirm("Delete this message?")) return;

    fetch("../../backend/delete_message.php?id=" + id)
    .then(res => res.text())
    .then(data => {
        if(data.includes("success")){
            let card = btn.closest(".card");
            card.style.opacity = "0";
            setTimeout(()=> card.remove(), 300);
        } else {
            alert("Error: " + data);
        }
    });
}

// OPEN POPUP
function openMailPopup(email){
    document.getElementById("mailPopup").style.display = "flex";
    document.getElementById("popupEmail").value = email;
}

// ✅ CLOSE POPUP (BACK BUTTON)
function closePopup(){
    document.getElementById("mailPopup").style.display = "none";
    document.getElementById("popupMessage").value = "";
}

// CLICK OUTSIDE CLOSE
window.onclick = function(e){
    let popup = document.getElementById("mailPopup");
    if(e.target == popup){
        closePopup();
    }
}

// SEND EMAIL
function sendEmail(){
    let email = document.getElementById("popupEmail").value;
    let message = document.getElementById("popupMessage").value;

    if(!message){
        alert("Enter message");
        return;
    }

    let f = new FormData();
    f.append("email", email);
    f.append("message", message);

    fetch("../../backend/send_mail.php",{
        method:"POST",
        body:f
    })
    .then(res => res.text())
    .then(data=>{
        if(data.includes("success")){
            alert("Email sent!");
            closePopup();
        } else {
            alert("Failed: " + data);
        }
    });
}

</script>

</body>
</html>