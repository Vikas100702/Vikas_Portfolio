<?php
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $name = $_POST['name'];
    $email = $_POST['_replyto'];
    $subject = $_POST['_subject'];
    $message = $_POST['message'];

    $to = "vikasverma10072002@outlook.com";
    $headers = "From: ".$email."\r\n";
    $headers .= "Reply-To: ".$email."\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    $emailContent = "
        <html>
            <body>
                <h2>Contact Form Submission</h2>
                <p><strong>Name: </strong>{$name}</p>
                <p><strong>Email: </strong>{$email}</p>
                <p><strong>Subject: </strong>{$subject}</p>
                <p><strong>Message: </strong></p>
                <p>{$message}</p>
            </body>
        </html>
    ";

    $success = mail($to, $subject, $emailContent, $headers);

    if($success){
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error"]);
    }

    exit;
}?>
