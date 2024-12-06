<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Data</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Upload Data</h1>
        <p>Please fill out the form below and upload your files.</p>
        <form action="process_user.php" method="POST" enctype="multipart/form-data">
            <label for="title">Title:</label>
            <input type="text" name="title" id="title" required>

            <label for="description">Description:</label>
            <textarea name="description" id="description" required></textarea>

            <label for="images">Upload Images:</label>
            <input type="file" name="images[]" id="images" multiple accept="image/*" required>

            <button type="submit">Submit</button>
        </form>
    </div>
</body>
</html>
