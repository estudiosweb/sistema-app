<?php
include 'conectar.php';

$response = array();

try {
    // Obtener parámetros de la solicitud
    $fecha = filter_input(INPUT_GET, 'fecha', FILTER_SANITIZE_STRING);
    $servicio_id = filter_input(INPUT_GET, 'servicio_id', FILTER_VALIDATE_INT);

    // Validar entradas
    if (empty($fecha) || empty($servicio_id)) {
        throw new Exception("Parámetros inválidos");
    }

    // Obtener el nombre del día de la semana (en español)
    $dias_es = array("Sunday" => "Domingo", "Monday" => "Lunes", "Tuesday" => "Martes", "Wednesday" => "Miércoles", "Thursday" => "Jueves", "Friday" => "Viernes", "Saturday" => "Sábado");
    $dia_en = date('l', strtotime($fecha));
    $dia = $dias_es[$dia_en] ?? null;

    if (!$dia) {
        throw new Exception("Día inválido");
    }

    // Obtener el horario del negocio para el día de la semana seleccionado
    $stmt = $conn->prepare("SELECT * FROM horarios WHERE dia = ?");
    $stmt->bind_param("s", $dia);
    $stmt->execute();
    $horario_query = $stmt->get_result();
    
    if ($horario_query->num_rows > 0) {
        $horario = $horario_query->fetch_assoc();
        $horas_disponibles = array();

        // Generar intervalos de tiempo según el horario del negocio
        if ($horario['tipo_jornada'] == 'continuo') {
            $hora_inicio = new DateTime($horario['hora_inicio']);
            $hora_fin = new DateTime($horario['hora_fin']);
            while ($hora_inicio < $hora_fin) {
                $horas_disponibles[] = $hora_inicio->format('H:i');
                $hora_inicio->modify('+1 hour'); // Suponiendo que cada reserva dura 1 hora
            }
        } else if ($horario['tipo_jornada'] == 'partido') {
            $hora_inicio_m = new DateTime($horario['hora_inicio_m']);
            $hora_fin_m = new DateTime($horario['hora_fin_m']);
            while ($hora_inicio_m < $hora_fin_m) {
                $horas_disponibles[] = $hora_inicio_m->format('H:i');
                $hora_inicio_m->modify('+1 hour');
            }
            $hora_inicio_t = new DateTime($horario['hora_inicio_t']);
            $hora_fin_t = new DateTime($horario['hora_fin_t']);
            while ($hora_inicio_t < $hora_fin_t) {
                $horas_disponibles[] = $hora_inicio_t->format('H:i');
                $hora_inicio_t->modify('+1 hour');
            }
        }

        // Eliminar horas que ya están reservadas
        $stmt_reservas = $conn->prepare("SELECT hora_reserva FROM reservas WHERE fecha_reserva = ?");
        $stmt_reservas->bind_param("s", $fecha);
        $stmt_reservas->execute();
        $reservas_query = $stmt_reservas->get_result();
        $reservas = array();
        while ($row = $reservas_query->fetch_assoc()) {
            $reservas[] = $row['hora_reserva'];
        }
        $horas_disponibles = array_diff($horas_disponibles, $reservas);

        $response['status'] = 'success';
        $response['horas'] = array_values($horas_disponibles);
    } else {
        $response['status'] = 'success';
        $response['horas'] = [];
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
