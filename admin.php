<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $access_code = htmlspecialchars($_POST['access_code']);

    $stmt = $conn->prepare("SELECT * FROM akses WHERE kode = ?");
    $stmt->bind_param("s", $access_code);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        header("Location: ahp.php");
    } else {
        echo "<script>alert('Access code not found!'); window.history.back();</script>";
    }
}
?>
