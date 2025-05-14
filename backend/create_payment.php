<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['orderCode']) || !isset($data['amount'])) {
        throw new Exception("Missing required fields");
    }

    $orderCode = $data["orderCode"];
    $amount = isset($data["amount"]) ? floatval($data["amount"]) : 0;
    
    // Generate VietQR URL
    $bankId = "970422"; // MB Bank
    $accountNo = "0387364164";
    $accountName = urlencode("NGO CHI THUAN");
    
    $qrUrl = "https://api.vietqr.io/image/{$bankId}-{$accountNo}-qr_only.jpg?amount={$amount}&addInfo=GZO{$orderCode}";

    echo json_encode([
        "success" => true,
        "paymentInfo" => [
            "bankName" => "MB Bank",
            "accountNumber" => "0387364164",
            "accountName" => "NGO CHI THUAN",
            "amount" => $amount,
            "content" => "GZO{$orderCode}",
            "qrCode" => $qrUrl
        ]
    ]);

} catch (Exception $e) {
    error_log("Payment Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>