<?php
include 'conectar.php';

$id = $_POST['id'];

$sql = "DELETE FROM clientes WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
    echo "Cliente eliminado exitosamente";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>

