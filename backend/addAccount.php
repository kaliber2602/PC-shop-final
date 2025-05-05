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

    if (
        !isset($data['first_name']) || 
        !isset($data['last_name']) || 
        !isset($data['user_name']) || 
        !isset($data['phone_number']) || 
        !isset($data['address']) || 
        !isset($data['email']) || 
        !isset($data['password']) || 
        !isset($data['gender']) || 
        !isset($data['admin'])
    ) {
        echo json_encode(["error" => "Invalid input"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO account (first_name, last_name, user_name, phone_number, address, email, password, gender, admin) 
                            VALUES (:first_name, :last_name, :user_name, :phone_number, :address, :email, :password, :gender, :admin)");
    $stmt->bindParam(':first_name', $data['first_name'], PDO::PARAM_STR);
    $stmt->bindParam(':last_name', $data['last_name'], PDO::PARAM_STR);
    $stmt->bindParam(':user_name', $data['user_name'], PDO::PARAM_STR);
    $stmt->bindParam(':phone_number', $data['phone_number'], PDO::PARAM_STR);
    $stmt->bindParam(':address', $data['address'], PDO::PARAM_STR);
    $stmt->bindParam(':email', $data['email'], PDO::PARAM_STR);
    $stmt->bindParam(':password', $data['password'], PDO::PARAM_STR);
    $stmt->bindParam(':gender', $data['gender'], PDO::PARAM_STR);
    $stmt->bindParam(':admin', $data['admin'], PDO::PARAM_INT);
    $stmt->execute();

    $lastInsertId = $conn->lastInsertId();

    echo json_encode(["success" => true, "id" => $lastInsertId]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>