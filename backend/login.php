<?php
// Cho phép gọi từ React app
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


// Kết nối database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gearzone"; // tên database bạn dùng

$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Nhận dữ liệu từ React
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->userName) || !isset($data->password)) {
    echo json_encode(["success" => false, "message" => "Missing username or password"]);
    exit();
}

$userName = $conn->real_escape_string($data->userName);
$password = $conn->real_escape_string($data->password);

// Truy vấn kiểm tra đăng nhập
$sql = "SELECT ID_account, first_name, last_name, phone_number, address, email, gender, admin, password FROM account WHERE user_name = '$userName' LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();

    // Kiểm tra mật khẩu bằng cách sử dụng password_verify
    if (password_verify($password, $row['password'])) {
        echo json_encode([
            "success" => true,
            "id" => $row["ID_account"],
            "first_name" => $row["first_name"],
            "last_name" => $row["last_name"],
            "phone_number" => $row["phone_number"],
            "address" => $row["address"],
            "email" => $row["email"],
            "gender" => $row["gender"],
            "admin" => boolval($row["admin"]),
            "message" => "Login successful"
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Incorrect password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Account not found"]);
}

$conn->close();
?>
