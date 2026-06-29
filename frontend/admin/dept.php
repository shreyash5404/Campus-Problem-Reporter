<?php
include "../../backend/db.php";

$result = $conn->query("SELECT * FROM dept_complaints ORDER BY created_at DESC");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Department Complaints</title>
    <style>
        body {
            font-family: Arial;
            background: #f4f6f9;
            padding: 20px;
        }

        h1 {
            text-align: center;
        }

        .card {
            background: white;
            padding: 15px;
            margin: 10px auto;
            border-radius: 8px;
            max-width: 600px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .dept {
            font-weight: bold;
            color: #0ea5a4;
        }

        .priority {
            float: right;
            font-size: 12px;
            padding: 3px 8px;
            border-radius: 5px;
            color: white;
        }

        .low { background: green; }
        .medium { background: orange; }
        .high { background: red; }

        .date {
            font-size: 12px;
            color: gray;
        }
    </style>
</head>
<body>

<h1>Department Complaints</h1>

<?php
if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        echo "
        <div class='card'>
            <div class='dept'>{$row['department']}</div>
            <div class='priority {$row['priority']}'>{$row['priority']}</div>

            <h3>{$row['title']}</h3>
            <p>{$row['description']}</p>

            <div class='date'>{$row['created_at']}</div>
        </div>
        ";
    }
} else {
    echo "<p>No complaints yet</p>";
}
?>

</body>
</html>