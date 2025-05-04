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

    if (!isset($data['user_id']) || !isset($data['product_id']) || !isset($data['quantity']) || !isset($data['total_price'])) {
        echo json_encode(["error" => "Invalid input"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity, total_price) VALUES (:user_id, :product_id, :quantity, :total_price)");
    $stmt->bindParam(':user_id', $data['user_id'], PDO::PARAM_INT);
    $stmt->bindParam(':product_id', $data['product_id'], PDO::PARAM_INT);
    $stmt->bindParam(':quantity', $data['quantity'], PDO::PARAM_INT);
    $stmt->bindParam(':total_price', $data['total_price'], PDO::PARAM_STR);
    $stmt->execute();

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>