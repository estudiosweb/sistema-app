document.addEventListener('DOMContentLoaded', function() {
    // Función para mostrar el formulario correspondiente
    window.mostrarFormulario = function(formulario) {
        const formClienteContainer = document.getElementById('formClienteContainer');
        const formReservaContainer = document.getElementById('formReservaContainer');
        
        if (formulario === 'clientes') {
            formClienteContainer.style.display = 'block';
            formReservaContainer.style.display = 'none';
        } else if (formulario === 'reservas') {
            formClienteContainer.style.display = 'none';
            formReservaContainer.style.display = 'block';
            cargarClientesEnReserva();
        }
    };

    // Función para cargar los clientes en el formulario de reservas
    function cargarClientesEnReserva() {
        fetch('php/ver_clientes.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const clienteSelect = document.getElementById('cliente_id');
                    const clienteSelectModal = document.getElementById('cliente_id_modal');
                    clienteSelect.innerHTML = '';
                    clienteSelectModal.innerHTML = '';
                    data.clientes.forEach(cliente => {
                        const option = document.createElement('option');
                        option.value = cliente.id;
                        option.textContent = cliente.nombre;
                        clienteSelect.appendChild(option);
                        clienteSelectModal.appendChild(option.cloneNode(true));
                    });
                } else {
                    console.error('Error al cargar los clientes');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    window.mostrarFormulario = function(formulario) {
        const formClienteContainer = document.getElementById('formClienteContainer');
        const formReservaContainer = document.getElementById('formReservaContainer');
        
        if (formulario === 'clientes') {
            formClienteContainer.style.display = 'block';
            formReservaContainer.style.display = 'none';
        } else if (formulario === 'reservas') {
            formClienteContainer.style.display = 'none';
            formReservaContainer.style.display = 'block';
            cargarClientesEnReserva();
        }
    };

    // Función para cargar datos del cliente en el modal de edición
    window.editarCliente = function(clienteId) {
        fetch(`php/ver_cliente.php?id=${clienteId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    document.getElementById('nombre_modal').value = data.cliente.nombre;
                    document.getElementById('telefono_modal').value = data.cliente.telefono;
                    document.getElementById('email_modal').value = data.cliente.email;
                    document.getElementById('direccion_modal').value = data.cliente.direccion;
                    $('#modalCliente').modal('show');
                } else {
                    alert('Error al cargar los datos del cliente');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    // Función para cargar datos de la reserva en el modal de edición
    window.editarReserva = function(reservaId) {
        fetch(`php/ver_reserva.php?id=${reservaId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    document.getElementById('cliente_id_modal').value = data.reserva.cliente_id;
                    document.getElementById('fecha_reserva_modal').value = data.reserva.fecha_reserva;
                    document.getElementById('servicio_modal').value = data.reserva.servicio;
                    $('#modalReserva').modal('show');
                } else {
                    alert('Error al cargar los datos de la reserva');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    // Verificar conexión a Internet
    function checkConnection() {
        if (!navigator.onLine) {
            alert('Sin conexión a Internet');
        }
    }

    window.addEventListener('online', function() {
        alert('Conexión restablecida');
        // Aquí puedes sincronizar los datos transitorios con el servidor
    });

    window.addEventListener('offline', checkConnection);

    // Llamar checkConnection al cargar la página
    checkConnection();

    // Event listeners para los botones de gestión
    const gestionarClientesBtn = document.querySelector("button[onclick='mostrarFormulario(\"clientes\")']");
    const gestionarReservasBtn = document.querySelector("button[onclick='mostrarFormulario(\"reservas\")']");

    if (gestionarClientesBtn) {
        gestionarClientesBtn.addEventListener('click', function() {
            mostrarFormulario('clientes');
        });
    }

    if (gestionarReservasBtn) {
        gestionarReservasBtn.addEventListener('click', function() {
            mostrarFormulario('reservas');
        });
    }
});

document.getElementById('formCliente').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    fetch('php/crear_cliente.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Cliente agregado exitosamente');
            form.reset();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});
