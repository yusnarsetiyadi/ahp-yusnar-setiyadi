<?php
$servername = "localhost:3307";
$username = "root";
$password = "";
$database = "ahp_db";

// $servername = "103.84.207.118";
// $username = "yusnar";
// $password = "Yusnar12345*";
// $database = "ahp_db";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
