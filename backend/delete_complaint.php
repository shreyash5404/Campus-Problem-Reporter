<?php
$conn = new mysqli("localhost","root","","campus_db");

if ($conn->connect_error) {
    die("DB Error");
}

$id = $_POST['id'] ?? '';

if(empty($id)){
    echo "no_id";
    exit;
}

// ✅ DELETE FROM CORRECT TABLE
$sql = "DELETE FROM complaints WHERE complaint_id='$id'";

if($conn->query($sql)){
    echo "success";
} else {
    echo "error: " . $conn->error;
}

$conn->close();
?>