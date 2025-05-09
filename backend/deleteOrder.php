<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gearzone";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Lấy dữ liệu từ request
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['order_detail_id'])) {
        echo json_encode(["success" => false, "error" => "Invalid input: order_detail_id is required"]);
        exit;
    }

    $order_detail_id = $data['order_detail_id'];

    // Lấy order_id từ order_detail_id
    $stmt = $conn->prepare("SELECT order_id FROM order_detail WHERE order_detail_id = :order_detail_id");
    $stmt->bindParam(':order_detail_id', $order_detail_id, PDO::PARAM_INT);
    $stmt->execute();
    $order_id = $stmt->fetchColumn();

    if (!$order_id) {
        echo json_encode(["success" => false, "error" => "Order detail not found"]);
        exit;
    }

    // Xóa dữ liệu trong order_detail
    $stmt = $conn->prepare("DELETE FROM order_detail WHERE order_detail_id = :order_detail_id");
    $stmt->bindParam(':order_detail_id', $order_detail_id, PDO::PARAM_INT);
    $stmt->execute();

    // Kiểm tra xem còn dữ liệu nào trong order_detail với order_id không
    $stmt = $conn->prepare("SELECT COUNT(*) FROM order_detail WHERE order_id = :order_id");
    $stmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
    $stmt->execute();
    $count = $stmt->fetchColumn();

    if ($count == 0) {
        // Nếu không còn dữ liệu nào trong order_detail, xóa dữ liệu trong order
        $stmt = $conn->prepare("DELETE FROM `order` WHERE order_id = :order_id");
        $stmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
        $stmt->execute();
    }

    echo json_encode(["success" => true, "message" => "Order detail deleted successfully"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>