<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$database = "gearzone";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT id, image, title, price, description, category, images FROM products";
$result = $conn->query($sql);

$products = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $row["list_anh"] = json_decode($row["images"]);
        unset($row["images"]); 
        $products[] = $row;
    }
}

echo json_encode($products);
$conn->close();
?>
