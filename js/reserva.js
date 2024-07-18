document.addEventListener('DOMContentLoaded', function() {
    function cargarReservas() {
        fetch('php/ver_reservas.php')
            .then(response => response.json())
            .then(data => {
                const listaReservas = document.getElementById('listaReservas');
                if (listaReservas) {
                    listaReservas.innerHTML = '';
                    data.forEach(reserva => {
                        const div = document.createElement('div');
                        div.className = 'card';
                        div.innerHTML = `
                            <div class="card-body">
                                <h5>${reserva.servicio}</h5>
                                <div>
                                    <button class="btn btn-sm btn-warning" onclick="editarReserva(${reserva.id})">Editar</button>
                                    <button class="btn btn-sm btn-danger" onclick="eliminarReserva(${reserva.id})">Eliminar</button>
                                </div>
                            </div>`;
                        listaReservas.appendChild(div);
                    });
                }
            })
            .catch(error => console.error('Error:', error));
    }
 
function editarReserva(id) {
    fetch(`php/ver_reserva.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const reserva = data.reserva;
                document.getElementById('cliente_id').value = reserva.cliente_id;
                document.getElementById('fecha_reserva').value = reserva.fecha_reserva;
                document.getElementById('servicio').value = reserva.servicio;
                $('#modalReserva').modal('show');
            } else {
                console.error('Error al cargar la reserva:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

    function eliminarReserva(id) {
        if (confirm("¿Está seguro de que desea eliminar esta reserva?")) {
            const data = `id=${id}`;
            fetch('php/eliminar_reserva.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: data
            })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
                if (result.status === 'success') {
                    cargarReservas();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }
    function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const url = form.getAttribute('action');
        let data = new URLSearchParams(new FormData(form)).toString();

        if (form.dataset.reservaId) {
            data += `&id=${form.dataset.reservaId}`;
            fetch('php/editar_reserva.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: data
            })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
                if (result.status === 'success') {
                    cargarReservas();
                }
                form.reset();
                delete form.dataset.reservaId;
                $('#modalReserva').modal('hide');
            })
            .catch(error => console.error('Error:', error));
        } else {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: data
            })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
                if (result.status === 'success') {
                    cargarReservas();
                }
                form.reset();
                $('#modalReserva').modal('hide');
            })
            .catch(error => console.error('Error:', error));
        }
    }

    const formReserva = document.getElementById('formReserva');
    if (formReserva) {
        formReserva.addEventListener('submit', handleFormSubmit);
    }

    cargarReservas();
});
