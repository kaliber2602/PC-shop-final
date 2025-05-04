<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gearzone"; // Thay bằng tên cơ sở dữ liệu của bạn

try {
    // Kết nối cơ sở dữ liệu
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Lấy dữ liệu từ yêu cầu POST
    $data = json_decode(file_get_contents("php://input"), true);

    // Kiểm tra dữ liệu đầu vào
    if (!isset($data['image']) || !isset($data['title']) || !isset($data['price']) || !isset($data['description']) || !isset($data['category'])) {
        echo json_encode(["error" => "Invalid input"]);
        exit;
    }

    // Chuyển đổi danh sách hình ảnh bổ sung thành JSON
    $imagesJson = isset($data['list_anh']) ? json_encode($data['list_anh']) : "[]";

    // Thêm sản phẩm vào cơ sở dữ liệu
    $stmt = $conn->prepare("INSERT INTO products (image, title, price, description, category, images) VALUES (:image, :title, :price, :description, :category, :images)");
    $stmt->bindParam(':image', $data['image'], PDO::PARAM_STR);
    $stmt->bindParam(':title', $data['title'], PDO::PARAM_STR);
    $stmt->bindParam(':price', $data['price'], PDO::PARAM_STR);
    $stmt->bindParam(':description', $data['description'], PDO::PARAM_STR);
    $stmt->bindParam(':category', $data['category'], PDO::PARAM_STR);
    $stmt->bindParam(':images', $imagesJson, PDO::PARAM_STR);
    $stmt->execute();

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>