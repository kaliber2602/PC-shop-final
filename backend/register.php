<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$username = "root";
$password = "";
$database = "gearzone";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

$firstName = $data['first_name'];
$lastName = $data['last_name'];
$userName = $data['user_name'];
$phoneNumber = $data['phone_number'];
$address = $data['address'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_DEFAULT); // Mã hóa mật khẩu
$gender = $data['gender'];
$admin = 0;

// Kiểm tra dữ liệu rỗng
if (empty($firstName) || empty($lastName) || empty($userName) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Vui lòng điền đầy đủ thông tin."]);
    exit();
}

// Kiểm tra trùng email, số điện thoại hoặc tên người dùng
$checkQuery = "SELECT * FROM account WHERE email = ? OR phone_number = ? OR user_name = ?";
$stmt = $conn->prepare($checkQuery);
$stmt->bind_param("sss", $email, $phoneNumber, $userName);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Kiểm tra chi tiết lỗi để trả thông báo chính xác hơn
    while ($row = $result->fetch_assoc()) {
        if ($row['email'] === $email) {
            echo json_encode(["success" => false, "message" => "Email đã được sử dụng."]);
            exit();
        }
        if ($row['phone_number'] === $phoneNumber) {
            echo json_encode(["success" => false, "message" => "Số điện thoại đã được sử dụng."]);
            exit();
        }
        if ($row['user_name'] === $userName) {
            echo json_encode(["success" => false, "message" => "Tên đăng nhập đã được sử dụng."]);
            exit();
        }
    }
}
$stmt->close();


// Lưu vào CSDL
$insertQuery = "INSERT INTO account (first_name, last_name, user_name, phone_number, address, email, password, gender, admin)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($insertQuery);
$stmt->bind_param("ssssssssi", $firstName, $lastName, $userName, $phoneNumber, $address, $email, $password, $gender, $admin);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Đăng ký thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi đăng ký: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
