<?php
include "db.php";

$first_name = $_POST['first_name'];
$last_name  = $_POST['last_name'];
$phone      = $_POST['phone'];
$email      = $_POST['email'];
$password   = $_POST['password'];

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO add_students (first_name, last_name, phone, email, password)
        VALUES ('$first_name', '$last_name', '$phone', '$email', '$hashed_password')";


?>