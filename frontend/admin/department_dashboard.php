<?php
$conn = new mysqli("localhost","root","","campus_db");
$result = $conn->query("SELECT * FROM department_complaints ORDER BY id DESC");
?>

<!DOCTYPE html>
<html>
<head>
<title>Department Complaints</title>

<style>
body{
    font-family:Arial;
    background:#f1f5f9;
    padding:30px;
}

h2{
    margin-bottom:20px;
}

table{
    width:100%;
    border-collapse:collapse;
    background:white;
    border-radius:10px;
    overflow:hidden;
    box-shadow:0 5px 20px rgba(0,0,0,0.1);
}

th,td{
    padding:12px;
    text-align:left;
}

th{
    background:#0d9488;
    color:white;
}

tr:nth-child(even){
    background:#f9fafb;
}

.priority-low{color:green;font-weight:bold;}
.priority-medium{color:orange;font-weight:bold;}
.priority-high{color:red;font-weight:bold;}

</style>
</head>

<body>

<h2>Department Complaints</h2>

<table>
<tr>
<th>Department</th>
<th>Title</th>
<th>Description</th>
<th>Priority</th>
<th>Action</th>
</tr>

<?php while($row = $result->fetch_assoc()){ ?>
<tr id="row-<?php echo $row['id']; ?>">
<td><?php echo $row['department']; ?></td>
<td><?php echo $row['title']; ?></td>
<td><?php echo $row['description']; ?></td>
<td class="priority-<?php echo $row['priority']; ?>">
    <?php echo strtoupper($row['priority']); ?>
</td>
<td>
    <button onclick="deleteComplaint(<?php echo $row['id']; ?>)">
        Delete
    </button>
</td>
</tr>
<?php } ?>

</table>

<script>
function deleteComplaint(id){

    console.log("Deleting ID:", id); // DEBUG

    fetch("/CAMPUS-PROBLEM-REPORTER/backend/delete_complaint.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "id=" + id
    })
    .then(res => res.text())
    .then(data => {
        console.log("Response:", data);

        if(data.includes("success")){
            document.getElementById("row-" + id).remove();
        } else {
            alert("Delete failed: " + data);
        }
    });
}
</script>


</body>
</html>