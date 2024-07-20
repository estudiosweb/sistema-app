document.addEventListener('DOMContentLoaded', function() {
    // Inicializar FullCalendar
    var calendarEl = document.getElementById('calendarioReservas');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        events: function(fetchInfo, successCallback, failureCallback) {
            fetch('php/ver_reservas.php')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        successCallback(data.reservas);
                    } else {
                        failureCallback(data.message);
                    }
                })
                .catch(error => failureCallback(error));
        },
        dateClick: function(info) {
            $('#fecha_reserva').val(info.dateStr);
            $('#modalAgregarReserva').modal('show');
            cargarHorasDisponibles(info.dateStr);
        }
    });
    calendar.render();

    // Inicializar Select2 para buscar clientes
    $('#cliente_id').select2({
        ajax: {
            url: 'php/ver_clientes.php',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    q: params.term // Término de búsqueda
                };
            },
            processResults: function(data) {
                return {
                    results: data.clientes.map(function(cliente) {
                        return {
                            id: cliente.id,
                            text: cliente.nombre
                        };
                    })
                };
            },
            cache: true
        },
        minimumInputLength: 1,
        placeholder: 'Buscar cliente',
        width: '100%'
    });

    // Inicializar Select2 para buscar servicios
    $('#servicio').select2({
        ajax: {
            url: 'php/ver_servicios.php',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    q: params.term // Término de búsqueda
                };
            },
            processResults: function(data) {
                return {
                    results: data.servicios.map(function(servicio) {
                        return {
                            id: servicio.id,
                            text: servicio.nombre
                        };
                    })
                };
            },
            cache: true
        },
        minimumInputLength: 1,
        placeholder: 'Buscar servicio',
        width: '100%'
    });

    // Cargar lista de reservas
    cargarReservas();

    // Manejar el envío del formulario
    document.getElementById('formReserva').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);

        fetch('php/crear_reserva.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Reserva guardada correctamente.');
                $('#modalAgregarReserva').modal('hide');
                cargarReservas();
                calendar.refetchEvents(); // Recargar eventos en el calendario
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Cargar reservas
    function cargarReservas() {
        fetch('php/ver_reservas.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    let listaReservas = document.getElementById('listaReservas');
                    listaReservas.innerHTML = '';
                    data.reservas.forEach(reserva => {
                        let div = document.createElement('div');
                        div.className = 'list-group-item d-flex justify-content-between align-items-center';
                        div.innerHTML = `
                            <div onclick="verReserva(${reserva.id})" style="cursor: pointer;">
                                <h5>${reserva.cliente_nombre}</h5>
                                <p style="margin: 0;">${reserva.fecha_reserva} ${reserva.hora_reserva}</p>
                            </div>
                            <div class="dropdown">
                                <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton${reserva.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton${reserva.id}">
                                    <li><a class="dropdown-item" href="#" onclick="editarReserva(${reserva.id})">Editar</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="eliminarReserva(${reserva.id})">Eliminar</a></li>
                                </ul>
                            </div>
                        `;
                        listaReservas.appendChild(div);
                    });
                } else {
                    console.error('Error al cargar reservas:', data.message);
                }
            })
            .catch(error => console.error('Error al cargar reservas:', error));
    }

    // Cargar horas disponibles para una fecha específica
    function cargarHorasDisponibles(fecha) {
        fetch(`php/ver_horas_disponibles.php?fecha=${fecha}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    let horaSelect = document.getElementById('hora_reserva');
                    horaSelect.innerHTML = '';
                    data.horas.forEach(hora => {
                        let option = document.createElement('option');
                        option.value = hora;
                        option.textContent = hora;
                        horaSelect.appendChild(option);
                    });
                } else {
                    console.error('Error:', data.message);
                }
            })
            .catch(error => console.error('Error al cargar horas disponibles:', error));
    }

    window.verReserva = function(id) {
        fetch(`php/ver_reserva.php?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const reserva = data.reserva;
                    alert(`Cliente: ${reserva.cliente_nombre}\nServicio: ${reserva.servicio_nombre}\nFecha: ${reserva.fecha_reserva}\nHora: ${reserva.hora_reserva}`);
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    };

    window.editarReserva = function(id) {
        fetch(`php/ver_reserva.php?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const reserva = data.reserva;
                    $('#cliente_id').val(reserva.cliente_id).trigger('change');
                    $('#servicio').val(reserva.servicio_id).trigger('change');
                    $('#fecha_reserva').val(reserva.fecha_reserva);
                    cargarHorasDisponibles(reserva.fecha_reserva);
                    $('#hora_reserva').val(reserva.hora_reserva);
                    $('#modalAgregarReserva').modal('show');

                    // Cambiar el comportamiento del formulario para editar en lugar de agregar
                    document.getElementById('formReserva').removeEventListener('submit', agregarReserva);
                    document.getElementById('formReserva').addEventListener('submit', function(event) {
                        event.preventDefault();
                        const formData = new FormData(this);
                        formData.append('id', id);

                        fetch('php/editar_reserva.php', {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 'success') {
                                alert('Reserva editada correctamente.');
                                $('#modalAgregarReserva').modal('hide');
                                cargarReservas();
                                calendar.refetchEvents(); // Recargar eventos en el calendario
                            } else {
                                alert('Error: ' + data.message);
                            }
                        })
                        .catch(error => console.error('Error:', error));
                    });
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    };

    window.eliminarReserva = function(id) {
        if (confirm('¿Está seguro de que desea eliminar esta reserva?')) {
            fetch(`php/eliminar_reserva.php?id=${id}`, {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Reserva eliminada correctamente.');
                    cargarReservas();
                    calendar.refetchEvents();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    };

    function agregarReserva(event) {
        event.preventDefault();
        const formData = new FormData(this);

        fetch('php/crear_reserva.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Reserva guardada correctamente.');
                $('#modalAgregarReserva').modal('hide');
                cargarReservas();
                calendar.refetchEvents(); // Recargar eventos en el calendario
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
});
