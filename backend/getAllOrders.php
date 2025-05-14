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

    // Chỉnh sửa câu lệnh SELECT để khớp với cấu trúc bảng trong database
    $stmt = $conn->prepare("
        SELECT 
            od.order_detail_id,
            o.order_id,
            o.user_id,
            p.title,
            p.price,
            od.quantity,
            od.total_price,
            o.order_date,
            o.expect_date,
            o.status,
            o.address,
            a.first_name,
            a.last_name,
            o.payment_status
        FROM order_detail od
        JOIN `order` o ON od.order_id = o.order_id
        JOIN products p ON p.id = od.product_id 
        JOIN account a ON o.user_id = a.ID_account
        ORDER BY o.order_date DESC
    ");
    
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "orders" => $orders
    ]);

} catch(PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error occurred",
        "error" => $e->getMessage()
    ]);
} finally {
    $conn = null;
}
?>