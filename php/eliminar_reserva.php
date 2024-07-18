<?php
include 'conectar.php';

$id = $_POST['id'];

$sql = "DELETE FROM reservas WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
    echo "Reserva eliminada exitosamente";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
