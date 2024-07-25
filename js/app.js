document.addEventListener('DOMContentLoaded', function () {
    const busqueda = document.getElementById('busqueda');
    const reservasContainer = document.getElementById('reservas');
    const totalReservasHoy = document.getElementById('totalReservasHoy');
    const horasDisponibles = document.getElementById('horasDisponibles');
    const profesionalesDisponibles = document.getElementById('profesionalesDisponibles');
    const totalReservas = document.getElementById('totalReservas');
    const reservasPorDiaChartCtx = document.getElementById('reservasPorDiaChart') ? document.getElementById('reservasPorDiaChart').getContext('2d') : null;
    const detalleReservaModal = new bootstrap.Modal(document.getElementById('detalleReservaModal'));
    const detalleCliente = document.getElementById('detalleCliente');
    const detalleServicio = document.getElementById('detalleServicio');
    const detalleFecha = document.getElementById('detalleFecha');
    const detalleHora = document.getElementById('detalleHora');
    let reservasPorDiaChart;

    if (!busqueda || !reservasContainer || !totalReservasHoy || !horasDisponibles || !profesionalesDisponibles || !totalReservas) {
        console.error('Elementos necesarios no encontrados.');
        return;
    }

    const formatHora = (hora) => {
        const [hours, minutes] = hora.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    const formatFecha = (fecha) => {
        const [year, month, day] = fecha.split('-');
        return `${day}-${month}-${year.substring(2)}`; // Formato dd-mm-aa
    };

    window.cargarEstadisticas = () => {
        fetch('php/obtener_estadisticas.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    totalReservasHoy.textContent = data.totalReservasHoy;
                    horasDisponibles.textContent = data.horasDisponibles;
                    profesionalesDisponibles.textContent = data.profesionalesDisponibles;
                    totalReservas.textContent = data.totalReservas;

                    if (reservasPorDiaChartCtx) {
                        const labels = data.reservasPorDia.map(item => item.dia);
                        const valores = data.reservasPorDia.map(item => item.cantidad);

                        if (reservasPorDiaChart) {
                            reservasPorDiaChart.destroy();
                        }

                        reservasPorDiaChart = new Chart(reservasPorDiaChartCtx, {
                            type: 'bar',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: 'Reservas por Día',
                                    data: valores,
                                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        });
                    }
                } else {
                    console.error('Error al obtener estadísticas:', data.message);
                }
            })
            .catch(error => {
                console.error('Error al obtener estadísticas:', error);
            });
    };

    window.cargarReservas = (query = '') => {
        const today = new Date();
        const todayFormatted = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear().toString().substring(2)}`;

        fetch(`php/obtener_reservas.php?busqueda=${query}&fecha=${todayFormatted}`)
            .then(response => response.json())
            .then(data => {
                reservasContainer.innerHTML = '';
                if (data.status !== 'success' || !Array.isArray(data.reservas)) {
                    reservasContainer.innerHTML = '<p class="text-center">No se encontraron reservas</p>';
                    return;
                }
                if (data.reservas.length === 0) {
                    reservasContainer.innerHTML = '<p class="text-center">No se encontraron reservas</p>';
                } else {
                    data.reservas.forEach(reserva => {
                        const cliente_nombre = reserva.cliente_nombre || 'Desconocido';
                        const servicio_nombre = reserva.servicio_nombre || 'Desconocido';
                        const fecha_reserva = reserva.fecha_reserva || 'Desconocida';
                        const hora_reserva = reserva.hora_reserva || 'Desconocida';

                        const reservaElement = document.createElement('div');
                        reservaElement.className = 'list-group-item';
                        reservaElement.innerHTML = `
                            <p class="cliente-nombre"><strong>${cliente_nombre}</strong></p>
                            <p class="reserva-detalle">
                                <i class="bi bi-clock"></i> ${formatHora(hora_reserva)} 
                                <i class="bi bi-briefcase"></i> ${servicio_nombre}
                            </p>
                        `;
                        reservaElement.addEventListener('click', () => {
                            detalleCliente.textContent = `Cliente: ${cliente_nombre}`;
                            detalleServicio.textContent = `Servicio: ${servicio_nombre}`;
                            detalleFecha.textContent = `Fecha: ${formatFecha(fecha_reserva)}`;
                            detalleHora.textContent = `Hora: ${formatHora(hora_reserva)}`;
                            detalleReservaModal.show();
                        });
                        reservasContainer.appendChild(reservaElement);
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar las reservas:', error);
                reservasContainer.innerHTML = '<p class="text-center">Error al cargar las reservas</p>';
            });
    };

    window.cargarGraficoReservasPorDia = () => {
        fetch('php/obtener_reservas_por_dia.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const labels = data.reservasPorDia.map(item => item.dia);
                    const valores = data.reservasPorDia.map(item => item.cantidad);

                    if (reservasPorDiaChart) {
                        reservasPorDiaChart.destroy();
                    }

                    reservasPorDiaChart = new Chart(reservasPorDiaChartCtx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Reservas por Día',
                                data: valores,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                } else {
                    console.error('Error al obtener reservas por día:', data.message);
                }
            })
            .catch(error => console.error('Error al obtener reservas por día:', error));
    };

    busqueda.addEventListener('input', function () {
        cargarReservas(this.value);
    });

    cargarEstadisticas();
    cargarReservas();
    cargarGraficoReservasPorDia();
});
