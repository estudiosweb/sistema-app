<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

function sanitizeInput($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

function logFailedLoginAttempt($ip, $reason) {
    $log_dir = 'logs';
    $log_file = $log_dir . '/failed_logins.log';

    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $entry = sprintf("[%s] IP: %s, Reason: %s\n", date('Y-m-d H:i:s'), $ip, $reason);
    file_put_contents($log_file, $entry, FILE_APPEND);
}

function logSuccessfulLogin($username, $ip) {
    $log_dir = 'logs';
    $log_file = $log_dir . '/successful_logins.log';

    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $entry = sprintf("[%s] Username: %s, IP: %s\n", date('Y-m-d H:i:s'), $username, $ip);
    file_put_contents($log_file, $entry, FILE_APPEND);
}

function checkSession() {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    if (!isset($_SESSION['username'])) {
        header("Location: login.html");
        exit();
    }
}

function verificarSesion($role = 'user') {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    if (!isset($_SESSION['username']) || $_SESSION['role'] != $role) {
        return false;
    }
    return true;
}
?>
