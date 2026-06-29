<?php
include "db.php";

// Get form data
$full_name = $_POST['full_name'];
$contact   = $_POST['contact'];
$email     = $_POST['email'];
$password  = $_POST['password'];

// Hash password (IMPORTANT)
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert into admin table
$sql = "INSERT INTO admin (full_name, contact, email, password)
        VALUES ('$full_name', '$contact', '$email', '$hashed_password')";

if ($conn->query($sql) === TRUE) {
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>