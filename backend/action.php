<?php
include "db.php";

$id = $_POST['id'];
$action = $_POST['action'];

if($action == "reject"){
    $conn->query("DELETE FROM complaints WHERE id=$id");
}
else if($action == "accept"){
    $conn->query("UPDATE complaints SET status='accepted' WHERE id=$id");
}

echo "done";
?>