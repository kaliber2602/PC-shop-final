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

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gearzone";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['order_detail_id'])) {
        throw new Exception("Order Detail ID is required");
    }
    
    // Start transaction
    $conn->beginTransaction();

    // First verify the order exists and get related order_detail records
    $checkStmt = $conn->prepare("
        SELECT od.order_detail_id, o.status
        FROM order_detail od
        JOIN `order` o ON od.order_id = o.order_id 
        WHERE od.order_detail_id = :order_detail_id
    ");
    $checkStmt->bindParam(':order_detail_id', $data['order_detail_id'], PDO::PARAM_INT);
    $checkStmt->execute();

    $orderInfo = $checkStmt->fetch(PDO::FETCH_ASSOC);
    if (!$orderInfo) {
        throw new Exception("Order detail not found");
    }

    if ($orderInfo['status'] === 'Completed') {
        throw new Exception("Cannot delete completed orders");
    }

    // Delete the order detail
    $deleteDetailStmt = $conn->prepare("DELETE FROM order_detail WHERE order_detail_id = :order_detail_id");
    $deleteDetailStmt->bindParam(':order_detail_id', $data['order_detail_id'], PDO::PARAM_INT);
    $deleteDetailStmt->execute();

    // Commit transaction
    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Order detail deleted successfully"
    ]);

} catch(Exception $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
    }
    error_log("Error in deleteOrder.php: " . $e->getMessage());
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