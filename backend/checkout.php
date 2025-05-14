<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Error reporting
ini_set('display_errors', 0);
error_reporting(E_ALL);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gearzone";

try {
    // Initialize connection
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_TIMEOUT, 5);

    // Get and decode POST data
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        throw new Exception("No data received");
    }

    if (!isset($data['user_id']) || !isset($data['cart_items']) || empty($data['address'])) {
        throw new Exception("Missing required fields");
    }

    // Start transaction
    $conn->beginTransaction();

    // Create order
    $stmt = $conn->prepare("INSERT INTO `order` (user_id, order_date, expect_date, address, status, payment_status) 
                           VALUES (:user_id, :order_date, :expect_date, :address, 'Processing', 'pending')");
    
    $order_date = date('Y-m-d');
    $expect_date = date('Y-m-d', strtotime('+7 days'));
    
    $stmt->execute([
        ':user_id' => $data['user_id'],
        ':order_date' => $order_date,
        ':expect_date' => $expect_date,
        ':address' => $data['address']
    ]);

    $order_id = $conn->lastInsertId();

    // Insert order details
    $stmt = $conn->prepare("INSERT INTO order_detail (order_id, product_id, quantity, total_price) 
                           VALUES (:order_id, :product_id, :quantity, :total_price)");

    foreach ($data['cart_items'] as $item) {
        $stmt->execute([
            ':order_id' => $order_id,
            ':product_id' => $item['product_id'],
            ':quantity' => $item['quantity'],
            ':total_price' => $item['total_price']
        ]);
    }

    // Commit transaction
    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Checkout successful",
        "order_id" => $order_id
    ]);

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn = null;
    }
}
?>