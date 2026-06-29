<?php
include "db.php";

$name  = $_POST['name'] ?? '';
$hid   = $_POST['helper_id'] ?? '';
$email = $_POST['email'] ?? '';

if(empty($name) || empty($hid) || empty($email)){
    echo "error: missing fields";
    exit;
}

$sql = "INSERT INTO helpers (helper_name, helper_id, email, status)
        VALUES ('$name','$hid','$email','available')";

if ($conn->query($sql)) {
    echo "success";
} else {
    echo "error: " . $conn->error;
}
?>