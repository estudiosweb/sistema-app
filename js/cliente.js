document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar clientes
    function cargarClientes() {
        fetch('php/ver_clientes.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const listaClientes = document.getElementById('listaClientes');
                if (!listaClientes) {
                    console.error('Elemento listaClientes no encontrado');
                    return;
                }
                listaClientes.innerHTML = '';
                if (data.status === 'success') {
                    if (data.clientes.length === 0) {
                        listaClientes.innerHTML = '<p>No hay clientes disponibles</p>';
                    } else {
                        data.clientes.forEach(cliente => {
                            const item = document.createElement('div');
                            item.className = 'list-group-item';
                            item.dataset.nombre = cliente.nombre.toLowerCase();
                            item.innerHTML = `
                                <h5>${cliente.nombre}</h5>
                                <p>${cliente.telefono}</p>
                                <button onclick="editarCliente(${cliente.id})" class="btn btn-sm btn-primary">Editar</button>
                                <button onclick="eliminarCliente(${cliente.id})" class="btn btn-sm btn-danger">Eliminar</button>
                            `;
                            listaClientes.appendChild(item);
                        });
                    }
                } else {
                    console.error('Error al cargar los clientes:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Función para cargar servicios
    function cargarServicios() {
        fetch('php/ver_servicios.php')
            .then(response => response.json())
            .then(data => {
                const servicioPreferido = document.getElementById('servicio_preferido');
                const servicioPreferidoModal = document.getElementById('servicio_preferidoModal');
                if (servicioPreferido && servicioPreferidoModal) {
                    servicioPreferido.innerHTML = '';
                    servicioPreferidoModal.innerHTML = '';
                    if (data.status === 'success') {
                        data.servicios.forEach(servicio => {
                            const option = document.createElement('option');
                            option.value = servicio.id;
                            option.text = servicio.nombre;
                            servicioPreferido.appendChild(option);

                            const optionModal = document.createElement('option');
                            optionModal.value = servicio.id;
                            optionModal.text = servicio.nombre;
                            servicioPreferidoModal.appendChild(optionModal);
                        });
                    }
                }
            })
            .catch(error => console.error('Error:', error));
    }

    cargarClientes();
    cargarServicios();

    // Función para editar cliente
    window.editarCliente = function(id) {
        fetch(`php/ver_cliente.php?id=${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    const cliente = data.cliente;
                    const modal = document.getElementById('modalCliente');
                    if (modal) {
                        const nombre = modal.querySelector('#nombreModal');
                        const telefono = modal.querySelector('#telefonoModal');
                        const email = modal.querySelector('#emailModal');
                        const direccion = modal.querySelector('#direccionModal');
                        const fechaNacimiento = modal.querySelector('#fecha_nacimientoModal');
                        const sexo = modal.querySelector('#sexoModal');
                        const servicioPreferido = modal.querySelector('#servicio_preferidoModal');
                        const notas = modal.querySelector('#notasModal');

                        if (nombre) nombre.value = cliente.nombre;
                        if (telefono) telefono.value = cliente.telefono;
                        if (email) email.value = cliente.email;
                        if (direccion) direccion.value = cliente.direccion;
                        if (fechaNacimiento) fechaNacimiento.value = cliente.fecha_nacimiento;
                        if (sexo) sexo.value = cliente.sexo;
                        if (servicioPreferido) servicioPreferido.value = cliente.servicio_preferido;
                        if (notas) notas.value = cliente.notas;

                        $('#modalCliente').modal('show');
                    }
                } else {
                    console.error('Error al cargar el cliente:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Función para eliminar cliente
    window.eliminarCliente = function(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            fetch(`php/eliminar_cliente.php?id=${id}`, {
                method: 'GET'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    alert('Cliente eliminado exitosamente');
                    cargarClientes();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    const formAgregarCliente = document.getElementById('formAgregarCliente');
    if (formAgregarCliente) {
        formAgregarCliente.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(formAgregarCliente);

            fetch('php/crear_cliente.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    alert('Cliente agregado exitosamente');
                    formAgregarCliente.reset();
                    $('#modalAgregarCliente').modal('hide');
                    cargarClientes();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    const buscadorClientes = document.getElementById('buscadorClientes');
    if (buscadorClientes) {
        buscadorClientes.addEventListener('input', function(event) {
            const query = event.target.value.toLowerCase();
            const items = document.querySelectorAll('#listaClientes .list-group-item');
            items.forEach(item => {
                const nombre = item.dataset.nombre;
                if (nombre.includes(query)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});
