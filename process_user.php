<?php
include 'db.php'; // Pastikan koneksi database sudah benar

// Sertakan file PHPMailer
require 'PHPMailer-6.9.3/src/PHPMailer.php';  // Ganti dengan path file yang sesuai
require 'PHPMailer-6.9.3/src/SMTP.php';       // Ganti dengan path file yang sesuai
require 'PHPMailer-6.9.3/src/Exception.php';  // Ganti dengan path file yang sesuai

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = htmlspecialchars($_POST['title']);
    $description = htmlspecialchars($_POST['description']);
    $files = $_FILES['images'];
    $random_code = rand(10000000, 99999999);

    // Menyimpan gambar yang diupload
    $upload_directory = 'uploads/';
    $file_paths = [];

    foreach ($files['tmp_name'] as $key => $tmp_name) {
        $file_name = basename($files['name'][$key]);
        $target_file = $upload_directory . $file_name;

        if (move_uploaded_file($tmp_name, $target_file)) {
            $file_paths[] = $target_file; // Menyimpan path file untuk digunakan nanti
        }
    }

    // Simpan kode akses ke database
    $stmt = $conn->prepare("INSERT INTO akses (kode) VALUES (?)");
    $stmt->bind_param("s", $random_code);
    $stmt->execute();

    // Mengirim email ke admin menggunakan PHPMailer
    $mail = new PHPMailer\PHPMailer\PHPMailer;

    try {
        // Pengaturan server SMTP Gmail
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'yusnarsetiyadi150403@gmail.com'; // Ganti dengan email pengirim Anda
        $mail->Password = 'pryh znbw rswx exda'; // Ganti dengan App Password Gmail Anda
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Pengaturan email pengirim dan penerima
        $mail->setFrom('yusnarsetiyadi150403@gmail.com', 'Yusnar Setiyadi');
        $mail->addAddress('yusnar243@gmail.com', 'Admin'); // Ganti dengan email tujuan

        // Menyusun isi email
        $message = "Title: $title\n\nDescription: $description\n\nAccess Code: $random_code\n\nImages:\n";
        foreach ($file_paths as $file_path) {
            $message .= $file_path . "\n";
            // Attach each file
            $mail->addAttachment($file_path); // Menambahkan file ke email
        }

        // Mengatur email dalam format teks biasa
        $mail->isHTML(false); 
        $mail->Subject = "New Submission - $title";
        $mail->Body = $message;

        // Mengirim email
        if ($mail->send()) {
            echo "Email sent successfully!";
        } else {
            echo "Failed to send email.";
        }

    } catch (Exception $e) {
        echo "Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }

    // Redirect ke halaman awal setelah email terkirim
    header("Location: index.php");
    exit();
}
?>
