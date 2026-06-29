<?php
include "../../backend/db.php";
$result = $conn->query("SELECT * FROM feedback ORDER BY created_at DESC");
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Admin Feedback Panel</title>

<style>
body {
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    margin: 0;
    padding: 20px;
}

.container {
    max-width: 1100px;
    margin: auto;
}

h2 {
    text-align: center;
    color: white;
    margin-bottom: 25px;
}

.feedback-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

.card {
    background: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    transition: 0.3s;
}

.card:hover {
    transform: translateY(-5px);
}

.badge {
    display: inline-block;
    padding: 5px 10px;
    background: #4facfe;
    color: white;
    border-radius: 20px;
    font-size: 12px;
    margin-bottom: 10px;
}

.comment {
    margin: 10px 0;
    color: #444;
}

.date {
    font-size: 12px;
    color: gray;
}

/* ✅ DELETE BUTTON */
.delete-btn{
    margin-top:10px;
    padding:6px 12px;
    background:#ef4444;
    color:white;
    border:none;
    border-radius:6px;
    cursor:pointer;
}

.empty {
    text-align: center;
    color: white;
    font-size: 18px;
}
</style>

</head>

<body>

<div class="container">

<h2>📊 Student Feedback Dashboard</h2>

<div class="feedback-grid">

<?php
if($result->num_rows > 0){
    while($row = $result->fetch_assoc()) {
        echo "
        <div class='card'>

            <div class='badge'>{$row['service']}</div>

            <p><strong>Complaint ID:</strong> ".($row['complaint_id'] ?: 'N/A')."</p>

            <div class='comment'>
                {$row['comment']}
            </div>

            <div class='date'>
                {$row['created_at']}
            </div>

            <!-- ✅ DELETE BUTTON -->
            <button class='delete-btn' onclick='deleteFeedback({$row['id']}, this)'>
                Delete
            </button>

        </div>
        ";
    }
} else {
    echo "<p class='empty'>No feedback available</p>";
}
?>

</div>

</div>

<!-- ✅ DELETE SCRIPT -->
<script>
function deleteFeedback(id, btn){
    if(!confirm("Delete this feedback?")) return;

    fetch("../../backend/delete_feedback.php?id=" + id)
    .then(res => res.text())
    .then(data => {
        if(data.includes("success")){
            let card = btn.closest(".card");
            card.style.transition = "0.3s";
            card.style.opacity = "0";
            setTimeout(()=> card.remove(), 300);
        } else {
            alert("Error: " + data);
        }
    });
}
</script>

</body>
</html>