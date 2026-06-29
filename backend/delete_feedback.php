<?php
include "db.php";

$id = $_GET['id'] ?? '';

if(empty($id)){
    echo "no_id";
    exit;
}

$sql = "DELETE FROM feedback WHERE id='$id'";

if($conn->query($sql)){
    echo "success";
} else {
    echo "error: " . $conn->error;
}
?>