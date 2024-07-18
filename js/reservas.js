document.addEventListener('DOMContentLoaded', function () {
    const busquedaReservas = document.getElementById('busquedaReservas');
    const reservasContainer = document.getElementById('reservas');

    const cargarReservas = (query = '') => {
        fetch(`php/ver_reservas.php?busqueda=${query}`)
            .then(response => response.json())
            .then(data => {
                reservasContainer.innerHTML = '';
                if (!Array.isArray(data)) {
                    reservasContainer.innerHTML = '<p class="text-center">No se encontraron reservas</p>';
                    return;
                }
                if (data.length === 0) {
                    reservasContainer.innerHTML = '<p class="text-center">No se encontraron reservas</p>';
                } else {
                    data.forEach(reserva => {
                        const reservaElement = document.createElement('div');
                        reservaElement.className = 'list-group-item';
                        reservaElement.innerHTML = `
                            <h5>${reserva.nombre_cliente}</h5>
                            <p>${reserva.servicio}</p>
                            <p>${reserva.fecha} ${reserva.hora}</p>
                        `;
                        reservasContainer.appendChild(reservaElement);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                reservasContainer.innerHTML = '<p class="text-center">Error al cargar las reservas</p>';
            });
    };

    busquedaReservas.addEventListener('input', function () {
        cargarReservas(this.value);
    });

    cargarReservas();
});
