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
    // Kết nối cơ sở dữ liệu
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Truy vấn danh sách tài khoản (không bao gồm cột status)
    $stmt = $conn->prepare("SELECT ID_account AS id, first_name, last_name, email, admin AS role FROM account");
    $stmt->execute();

    // Lấy dữ liệu và trả về JSON
    $accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($accounts);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>