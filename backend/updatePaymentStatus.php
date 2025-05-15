<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gearzone";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['order_id']) || !isset($data['selected_item_ids'])) {
        throw new Exception("Missing required fields");
    }

    $conn->beginTransaction();

    // 1. Update order status
    $stmt = $conn->prepare("UPDATE `order` 
                           SET status = 'Processing', 
                               payment_status = 'completed' 
                           WHERE order_id = ?");
    $stmt->execute([$data['order_id']]);

    if ($stmt->rowCount() === 0) {
        throw new Exception("Order not found");
    }

    // 2. Copy cart items to order_detail
    $stmt = $conn->prepare("INSERT INTO order_detail (order_id, product_id, quantity, total_price)
                           SELECT ?, product_id, quantity, total_price 
                           FROM cart 
                           WHERE id IN (" . str_repeat('?,', count($data['selected_item_ids']) - 1) . '?)');
    
    $params = array_merge([$data['order_id']], $data['selected_item_ids']);
    $stmt->execute($params);

    // 3. Delete items from cart
    $placeholders = str_repeat('?,', count($data['selected_item_ids']) - 1) . '?';
    $stmt = $conn->prepare("DELETE FROM cart WHERE id IN ($placeholders)");
    $stmt->execute($data['selected_item_ids']);

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Order processed successfully"
    ]);

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->rollBack();
    }
    error_log("Error processing order: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>