<?php
include "db.php";

// prevent undefined error
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// check if empty
if(empty($email) || empty($password)){
    echo "❌ Please fill all fields";
    exit();
}

// check admin table
$sql = "SELECT * FROM admin WHERE email='$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {

    $row = $result->fetch_assoc();

    // verify password
    if (password_verify($password, $row['password'])) {

        // ✅ SUCCESS → redirect
        header("Location: http://localhost/CAMPUS-PROBLEM-REPORTER/frontend/admin/admin-dashboard.html");
        exit();

    } else {
        echo "❌ Incorrect Password";
    }

} else {
    echo "❌ Admin not found";
}

$conn->close();
?>