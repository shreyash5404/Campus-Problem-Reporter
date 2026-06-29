<?php
$conn = new mysqli("localhost","root","","campus_db");

if($conn->connect_error){
    die("DB Error");
}

$id = $_GET['id'] ?? '';

if(empty($id)){
    echo "no_id";
    exit;
}

$sql = "DELETE FROM helpers WHERE id='$id'";

if($conn->query($sql)){
    echo "success";
} else {
    echo "error: " . $conn->error;
}

$conn->close();
?>