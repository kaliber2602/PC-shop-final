<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gearzone";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $conn->setAttribute(PDO::ATTR_TIMEOUT, 5);
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

    if ($user_id === 0) {
        echo json_encode([]); // Return empty array if no user_id
        exit;
    }

    // Lấy danh sách đơn hàng
    $stmt = $conn->prepare("SELECT order_detail.order_detail_id, order_detail.product_id, products.title, products.price, order_detail.quantity, order_detail.total_price, `order`.order_date, `order`.expect_date, `order`.status, `order`.address FROM order_detail JOIN `order` ON order_detail.order_id = `order`.order_id JOIN products ON products.id = order_detail.product_id WHERE `order`.user_id = :user_id;");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($orders); // Return array directly

} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "error" => "Database error occurred",
        "message" => $e->getMessage()
    ]);
} finally {
    // Ensure connection is closed
    $conn = null;
}
?>