<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AHP by Yusnar Setiyadi</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Analytical Hierarchy Process (AHP) By Yusnar Setiyadi</h1>
        <button onclick="window.location.href='user.php';">As User</button>
        <button onclick="showAdminPopup();">As Admin</button>
    </div>

    <!-- Admin Popup -->
    <div id="adminPopup" class="hidden">
        <div class="container">
            <h2>Enter Access Code</h2>
            <form action="admin.php" method="POST">
                <input type="text" name="access_code" placeholder="Enter 8-character code" required>
                <button type="submit">Submit</button>
            </form>
        </div>
    </div>

    <script>
        function showAdminPopup() {
            document.getElementById('adminPopup').classList.remove('hidden');
        }
    </script>
</body>
</html>
