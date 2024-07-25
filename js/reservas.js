document.addEventListener('DOMContentLoaded', function () {
    const reservasContainer = document.getElementById('reservasContainer');
    const calendarContainer = document.getElementById('calendarContainer');
    if (!reservasContainer) {
        console.error('Reservas container not found');
        return;
    }

    let vistaActual = 'dia';
    let page = 1;
    let isLoading = false;
    let hasMore = true;
    let fechaSeleccionada = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

    window.cambiarVista = function (vista) {
        vistaActual = vista;
        page = 1;
        hasMore = true;
        reservasContainer.innerHTML = '';
        if (vista === 'mes' || vista === 'semana') {
            reservasContainer.classList.add('hidden');
            calendarContainer.classList.remove('hidden');
            mostrarCalendario(vista);
        } else {
            reservasContainer.classList.remove('hidden');
            calendarContainer.classList.add('hidden');
            loadHorariosYReservas();
        }
    };

    function loadHorariosYReservas() {
        if (isLoading || !hasMore) return;
        isLoading = true;

        fetch(`php/ver_horas_disponibles.php?fecha=${fechaSeleccionada}&servicio_id=1`)
            .then(response => response.json().then(data => ({ status: response.status, body: data })))
            .then(({ status, body }) => {
                if (status >= 200 && status < 300) {
                    if (body.status === 'success') {
                        return fetch(`php/buscar_reservas.php?vista=${vistaActual}&page=${page}&fecha=${fechaSeleccionada}`)
                            .then(response => response.json().then(data => ({ status: response.status, body: data })));
                    } else {
                        throw new Error(body.message);
                    }
                } else {
                    throw new Error(body.message);
                }
            })
            .then(({ status, body }) => {
                if (status >= 200 && status < 300) {
                    if (body.status === 'success') {
                        const horas = body.horas || [];
                        const reservas = body.reservas || [];
                        const horasReservas = mezclarYOrdenarHorariosYReservas(horas, reservas);
                        mostrarHorariosYReservas(horasReservas);
                        if (reservas.length === 0) {
                            hasMore = false;
                        } else {
                            page++;
                        }
                    } else {
                        throw new Error(body.message);
                    }
                } else {
                    throw new Error(body.message);
                }
            })
            .catch(error => {
                console.error('Error al buscar reservas:', error.message);
            })
            .finally(() => {
                isLoading = false;
            });
    }

    function mezclarYOrdenarHorariosYReservas(horas, reservas) {
        const horariosYReservas = [];
        horas.forEach(hora => {
            horariosYReservas.push({ hora, tipo: 'disponible' });
        });
        reservas.forEach(reserva => {
            horariosYReservas.push({ hora: reserva.hora_reserva, tipo: 'reservado', reserva });
        });
        horariosYReservas.sort((a, b) => a.hora.localeCompare(b.hora));
        return horariosYReservas;
    }

    function mostrarHorariosYReservas(horasReservas) {
        reservasContainer.innerHTML = ''; // Limpiar contenedor
        horasReservas.forEach(item => {
            const div = document.createElement('div');
            div.className = item.tipo === 'reservado' ? 'list-group-item list-group-item-warning' : 'list-group-item list-group-item-info';
            if (item.tipo === 'reservado') {
                div.innerHTML = `<span>${item.hora}</span> - <span>${item.reserva.servicio_nombre}</span> - <span>${item.reserva.cliente_nombre}</span>`;
                div.addEventListener('click', () => mostrarDetalleReserva(item.reserva));
            } else {
                div.innerHTML = `<span>${item.hora}</span> - Disponible`;
                div.addEventListener('click', () => abrirModalReserva(item.hora));
            }
            reservasContainer.appendChild(div);
        });
    }

    function mostrarDetalleReserva(reserva) {
        const modalReservaTitle = document.getElementById('modalReservaTitle');
        const modalReservaBody = document.getElementById('modalReservaBody');

        if (modalReservaTitle && modalReservaBody) {
            modalReservaTitle.innerText = reserva.cliente_nombre;
            modalReservaBody.innerHTML = `
                <p><strong>Fecha de reserva:</strong> ${reserva.fecha_reserva}</p>
                <p><strong>Hora de reserva:</strong> ${reserva.hora_reserva}</p>
                <p><strong>Servicio:</strong> ${reserva.servicio_nombre}</p>
                <p><strong>Personal:</strong> ${reserva.personal_nombre}</p>
                <p><strong>Duración:</strong> ${reserva.duracion} minutos</p>
                <p><strong>ID:</strong> ${reserva.id}</p>
            `;
            $('#modalReservaDetalles').modal('show');
        } else {
            console.error('Error: Elementos del modal no encontrados.');
        }
    }

    window.abrirModalReserva = function (hora) {
        resetForm();
        document.getElementById('hora_reserva').value = hora;
        $('#modalAgregarReserva').modal('show');
    };

    function mostrarCalendario(vista) {
        if (vista === 'mes') {
            const monthCalendar = document.createElement('table');
            monthCalendar.className = 'table table-bordered';
            const headerRow = document.createElement('tr');
            ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].forEach(dia => {
                const headerCell = document.createElement('th');
                headerCell.textContent = dia;
                headerRow.appendChild(headerCell);
            });
            monthCalendar.appendChild(headerRow);

            const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
            const lastDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

            let date = 1;
            for (let i = 0; i < 6; i++) {
                const weekRow = document.createElement('tr');
                for (let j = 0; j < 7; j++) {
                    const dayCell = document.createElement('td');
                    if (i === 0 && j < firstDay) {
                        dayCell.textContent = '';
                    } else if (date > lastDate) {
                        dayCell.textContent = '';
                    } else {
                        dayCell.textContent = date;
                        dayCell.addEventListener('click', () => {
                            fechaSeleccionada = new Date(new Date().getFullYear(), new Date().getMonth(), date).toISOString().split('T')[0];
                            cambiarVista('dia');
                        });
                        date++;
                    }
                    weekRow.appendChild(dayCell);
                }
                monthCalendar.appendChild(weekRow);
            }

            calendarContainer.innerHTML = '';
            calendarContainer.appendChild(monthCalendar);
        } else if (vista === 'semana') {
            const weekCalendar = document.createElement('table');
            weekCalendar.className = 'table table-bordered';
            const headerRow = document.createElement('tr');
            ['Hora', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].forEach(dia => {
                const headerCell = document.createElement('th');
                headerCell.textContent = dia;
                headerRow.appendChild(headerCell);
            });
            weekCalendar.appendChild(headerRow);

            for (let i = 0; i < 24; i++) {
                const hourRow = document.createElement('tr');
                for (let j = 0; j < 8; j++) {
                    const cell = document.createElement('td');
                    if (j === 0) {
                        cell.textContent = i + ':00';
                    }
                    hourRow.appendChild(cell);
                }
                weekCalendar.appendChild(hourRow);
            }

            calendarContainer.innerHTML = '';
            calendarContainer.appendChild(weekCalendar);
        }
    }

    reservasContainer.addEventListener('scroll', function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadHorariosYReservas();
        }
    });

    window.buscarReservas = function () {
        page = 1;
        hasMore = true;
        reservasContainer.innerHTML = '';
        loadHorariosYReservas();
    };

    document.getElementById('formReserva').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);

        const clienteId = document.getElementById('cliente_id').dataset.id;
        const servicioId = document.getElementById('servicio').dataset.id;
        const personalId = document.getElementById('personal').value;
        const fechaReserva = document.getElementById('fecha_reserva').value;
        const horaReserva = document.getElementById('hora_reserva').value;
        const comentario = document.getElementById('comentario').value;

        if (!clienteId || !servicioId || !personalId || !fechaReserva || !horaReserva) {
            console.error('Error: Faltan datos necesarios para crear la reserva.');
            alert('Error: Faltan datos necesarios para crear la reserva.');
            return;
        }

        formData.set('cliente_id', clienteId);
        formData.set('servicio', servicioId);
        formData.set('personal', personalId);
        formData.set('fecha_reserva', fechaReserva);
        formData.set('hora_reserva', horaReserva);
        formData.set('comentario', comentario);

        fetch('php/crear_reserva.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Reserva guardada correctamente.');
                    $('#modalAgregarReserva').modal('hide');
                    loadHorariosYReservas();
                } else {
                    console.error('Error: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    });

    window.buscarClientes = function (query) {
        fetch(`php/ver_datos_res.php?type=cliente&q=${query}`)
            .then(response => response.json())
            .then(data => {
                const clienteResults = document.getElementById('cliente_results');
                if (clienteResults) {
                    clienteResults.innerHTML = '';
                    if (data.status === 'success') {
                        data.clientes.forEach(cliente => {
                            const li = document.createElement('li');
                            li.classList.add('list-group-item', 'list-group-item-action');
                            li.textContent = cliente.nombre;
                            li.dataset.id = cliente.id;
                            li.onclick = function () {
                                document.getElementById('cliente_id').value = cliente.nombre;
                                document.getElementById('cliente_id').dataset.id = cliente.id;
                                clienteResults.innerHTML = '';
                            };
                            clienteResults.appendChild(li);
                        });
                    } else {
                        const li = document.createElement('li');
                        li.classList.add('list-group-item', 'list-group-item-action');
                        li.textContent = 'No se encontraron resultados';
                        clienteResults.appendChild(li);
                    }
                } else {
                    console.error('Error: Elementos del cliente_results no encontrados.');
                }
            })
            .catch(error => console.error('Error al buscar clientes:', error));
    };

    window.buscarServicios = function (query) {
        fetch(`php/ver_datos_res.php?type=servicio&q=${query}`)
            .then(response => response.json())
            .then(data => {
                const servicioResults = document.getElementById('servicio_results');
                if (servicioResults) {
                    servicioResults.innerHTML = '';
                    if (data.status === 'success') {
                        data.servicios.forEach(servicio => {
                            const li = document.createElement('li');
                            li.classList.add('list-group-item', 'list-group-item-action');
                            li.textContent = servicio.nombre;
                            li.dataset.id = servicio.id;
                            li.onclick = function () {
                                document.getElementById('servicio').value = servicio.nombre;
                                document.getElementById('servicio').dataset.id = servicio.id;
                                servicioResults.innerHTML = '';
                                cargarPersonalDisponible(servicio.id);
                                const fecha = document.getElementById('fecha_reserva').value;
                                if (fecha) {
                                    cargarHorasDisponibles(fecha);
                                }
                            };
                            servicioResults.appendChild(li);
                        });
                    } else {
                        const li = document.createElement('li');
                        li.classList.add('list-group-item', 'list-group-item-action');
                        li.textContent = 'No se encontraron resultados';
                        servicioResults.appendChild(li);
                    }
                } else {
                    console.error('Error: Elementos del servicio_results no encontrados.');
                }
            })
            .catch(error => console.error('Error al buscar servicios:', error));
    };

    window.cargarHorasDisponibles = function (fecha) {
        const servicioId = document.getElementById('servicio').dataset.id;
        fetch(`php/ver_horas_disponibles.php?fecha=${fecha}&servicio_id=${servicioId}`)
            .then(response => response.json())
            .then(data => {
                const horaSelect = document.getElementById('hora_reserva');
                if (horaSelect) {
                    horaSelect.innerHTML = '';
                    if (data.status === 'success') {
                        data.horas.forEach(hora => {
                            const option = document.createElement('option');
                            option.value = hora;
                            option.textContent = hora;
                            horaSelect.appendChild(option);
                        });
                    } else {
                        const option = document.createElement('option');
                        option.textContent = 'No hay horas disponibles';
                        horaSelect.appendChild(option);
                    }
                    if (servicioId) {
                        cargarPersonalDisponible(servicioId);
                    }
                } else {
                    console.error('Error: Elemento hora_reserva no encontrado.');
                }
            })
            .catch(error => console.error('Error al cargar horas disponibles:', error));
    };

    window.cargarPersonalDisponible = function (servicioId) {
        const fecha = document.getElementById('fecha_reserva').value;
        const hora = document.getElementById('hora_reserva').value;
        if (!fecha || !hora) return;

        fetch(`php/ver_personal_disponible.php?servicio_id=${servicioId}&fecha=${fecha}&hora=${hora}`)
            .then(response => response.json())
            .then(data => {
                const personalSelect = document.getElementById('personal');
                if (personalSelect) {
                    personalSelect.innerHTML = '';
                    if (data.status === 'success') {
                        data.personal.forEach(persona => {
                            const option = document.createElement('option');
                            option.value = persona.id;
                            option.textContent = persona.nombre;
                            personalSelect.appendChild(option);
                        });
                    } else {
                        const option = document.createElement('option');
                        option.textContent = 'No hay personal disponible';
                        personalSelect.appendChild(option);
                    }
                } else {
                    console.error('Error: Elemento personal no encontrado.');
                }
            })
            .catch(error => console.error('Error al cargar personal disponible:', error));
    };

    function resetForm() {
        const formReserva = document.getElementById('formReserva');
        if (formReserva) {
            formReserva.reset();
        } else {
            console.error('Error: Elemento formReserva no encontrado.');
        }
        const clienteResults = document.getElementById('cliente_results');
        const servicioResults = document.getElementById('servicio_results');
        if (clienteResults) clienteResults.innerHTML = '';
        if (servicioResults) servicioResults.innerHTML = '';
        const clienteId = document.getElementById('cliente_id');
        const servicioId = document.getElementById('servicio');
        if (clienteId) clienteId.dataset.id = '';
        if (servicioId) servicioId.dataset.id = '';
    }

    function obtenerEstadisticas() {
        fetch('php/obtener_estadisticas.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const totalReservasHoy = document.getElementById('totalReservasHoy');
                    const horasDisponibles = document.getElementById('horasDisponibles');
                    const profesionalesDisponibles = document.getElementById('profesionalesDisponibles');
                    const totalReservas = document.getElementById('totalReservas');
                    const reservasPorDiaChartCtx = document.getElementById('reservasPorDiaChart') ? document.getElementById('reservasPorDiaChart').getContext('2d') : null;
    
                    if (totalReservasHoy) totalReservasHoy.textContent = data.totalReservasHoy;
                    if (horasDisponibles) horasDisponibles.textContent = data.horasDisponibles;
                    if (profesionalesDisponibles) profesionalesDisponibles.textContent = data.profesionalesDisponibles;
                    if (totalReservas) totalReservas.textContent = data.totalReservas;
    
                    if (reservasPorDiaChartCtx) {
                        const labels = data.reservasPorDia.map(item => item.dia);
                        const valores = data.reservasPorDia.map(item => item.cantidad);
    
                        new Chart(reservasPorDiaChartCtx, {
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
            .catch(error => console.error('Error al obtener estadísticas:', error));
    }
    
    

    obtenerEstadisticas();
    cambiarVista(vistaActual);
});
