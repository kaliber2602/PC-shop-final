<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gearzone";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->query("SELECT MAX(id) AS lastId FROM cart_items");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(["lastId" => $result['lastId'] ?? 0]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>