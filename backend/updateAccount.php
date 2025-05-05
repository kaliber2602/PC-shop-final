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

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id']) || !isset($data['first_name']) || !isset($data['last_name']) || !isset($data['email']) || !isset($data['role'])) {
        echo json_encode(["error" => "Invalid input"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE account SET first_name = :first_name, last_name = :last_name, email = :email, admin = :role WHERE ID_account = :id");
    $stmt->bindParam(':first_name', $data['first_name'], PDO::PARAM_STR);
    $stmt->bindParam(':last_name', $data['last_name'], PDO::PARAM_STR);
    $stmt->bindParam(':email', $data['email'], PDO::PARAM_STR);
    $stmt->bindParam(':role', $data['role'], PDO::PARAM_INT); 
    $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>