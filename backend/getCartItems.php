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

    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

    if (!$user_id) {
        echo json_encode(["cartItems" => []]); // Nếu không có user_id, trả về mảng rỗng
        exit;
    }

    if ($user_id === 0) {
        echo json_encode([]);
        exit;
    }

    $stmt = $conn->prepare("SELECT cart.id, cart.user_id, cart.product_id, cart.quantity, cart.total_price, products.title, products.image, products.price 
                            FROM cart 
                            JOIN products ON cart.product_id = products.id 
                            WHERE cart.user_id = :user_id");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // if ($cartItems.Number)
    echo json_encode(["cartItems" => $cartItems]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>