<?php
include "db.php";

$email = $_POST['email'];
$password = $_POST['password'];

// Step 1: check email in students table
$sql = "SELECT * FROM add_students WHERE email='$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {

    $row = $result->fetch_assoc();

    // Step 2: verify password
    if (password_verify($password, $row['password'])) {

        // ✅ Login success
        header("Location: http://localhost/CAMPUS-PROBLEM-REPORTER/frontend/student/student-dashboard.html?#section-title");
        exit();

    }

} 
$conn->close();
?>