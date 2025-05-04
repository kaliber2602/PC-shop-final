<?php
header("Access-Control-Allow-Origin: *"); // Cho phép tất cả các nguồn (React, Postman, v.v.)
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Các phương thức HTTP được phép
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Các header được phép
header("Access-Control-Allow-Credentials: true"); // Cho phép gửi cookie nếu cần

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gearzone";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id']) || !isset($data['quantity']) || !isset($data['total_price'])) {
        echo json_encode(["error" => "Invalid input"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE cart SET quantity = :quantity, total_price = :total_price WHERE id = :id");
    $stmt->bindParam(':quantity', $data['quantity'], PDO::PARAM_INT);
    $stmt->bindParam(':total_price', $data['total_price'], PDO::PARAM_STR);
    $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>