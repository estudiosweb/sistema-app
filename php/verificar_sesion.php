<?php
session_start();

$response = array();



if (isset($_SESSION['username'])) {
    $response['status'] = 'success';
    $response['username'] = $_SESSION['username'];
    $response['role'] = $_SESSION['role'];
} else {
    $response['status'] = 'error';
}

header('Content-Type: application/json');
echo json_encode($response);
?>
