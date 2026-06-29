<?php
include "db.php";

$result = $conn->query("SELECT * FROM helpers");

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = [
        "id" => $row['id'],
        "helper_name" => $row['helper_name'] ?? $row['name'] ?? '',
        "helper_id" => $row['helper_id'],
        "email" => $row['email'],
        "status" => $row['status'] ?? 'available'
    ];
}

echo json_encode($data);
?>