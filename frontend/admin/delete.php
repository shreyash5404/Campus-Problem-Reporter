<?php
$conn = new mysqli("localhost","root","","campus_db");

$id = $_GET['id'] ?? '';

if($id){
    $conn->query("DELETE FROM complaints WHERE complaint_id='$id'");
}

echo "deleted";
?>