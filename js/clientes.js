document.addEventListener('DOMContentLoaded', function() {
    function cargarClientes() {
        fetch('php/ver_clientes.php')
            .then(response => response.json())
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
                            item.className = 'list-group-item d-flex justify-content-between align-items-center';
                            item.dataset.nombre = cliente.nombre.toLowerCase();
                            item.dataset.telefono = cliente.telefono.toLowerCase();
                            item.dataset.email = cliente.email.toLowerCase();
                            item.dataset.id = cliente.id;
                            item.innerHTML = `
                                <div onclick="verCliente(${cliente.id})" style="cursor: pointer;">
                                    <h5>${cliente.nombre}</h5>
                                    <p style="margin: 0;">
                                        ${cliente.telefono}
                                        <a href="https://wa.me/${cliente.telefono}" target="_blank" style="color: #25D366; margin-left: 5px;">
                                            <i class="bi bi-whatsapp"></i>
                                        </a>
                                    </p>
                                </div>
                                <div class="dropdown">
                                    <button class="btn btn-link dropdown" type="button" id="dropdownMenuButton${cliente.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="bi bi-three-dots-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton${cliente.id}">
                                        <li><a class="dropdown-item" href="#" onclick="verCliente(${cliente.id})">Ver Detalles</a></li>
                                        <li><a class="dropdown-item" href="#" onclick="editarCliente(${cliente.id})">Editar</a></li>
                                        <li><a class="dropdown-item" href="#" onclick="eliminarCliente(${cliente.id})">Eliminar</a></li>
                                    </ul>
                                </div>
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

    window.editarCliente = function(id) {
        fetch(`php/ver_cliente.php?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const cliente = data.cliente;
                    const modal = document.getElementById('modalEditarCliente');
                    if (modal) {
                        const idInput = modal.querySelector('#idModal');
                        const nombre = modal.querySelector('#nombreModal');
                        const rut = modal.querySelector('#rutModal');
                        const telefono = modal.querySelector('#telefonoModal');
                        const email = modal.querySelector('#emailModal');
                        const direccion = modal.querySelector('#direccionModal');
                        const fechaNacimiento = modal.querySelector('#fecha_nacimientoModal');
                        const sexo = modal.querySelector('#sexoModal');
                        const servicioPreferido = modal.querySelector('#servicio_preferidoModal');
                        const notas = modal.querySelector('#notasModal');

                        if (idInput) idInput.value = cliente.id;
                        if (nombre) nombre.value = cliente.nombre;
                        if (rut) rut.value = cliente.rut; // Rut readonly en el HTML
                        if (telefono) telefono.value = cliente.telefono;
                        if (email) email.value = cliente.email;
                        if (direccion) direccion.value = cliente.direccion;
                        if (fechaNacimiento) fechaNacimiento.value = cliente.fecha_nacimiento;
                        if (sexo) sexo.value = cliente.sexo;
                        if (servicioPreferido) servicioPreferido.value = cliente.servicio_preferido;
                        if (notas) notas.value = cliente.notas;

                        $('#modalEditarCliente').modal('show');
                    }
                } else {
                    console.error('Error al cargar el cliente:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    window.eliminarCliente = function(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            fetch(`php/eliminar_cliente.php?id=${id}`, {
                method: 'GET'
            })
            .then(response => response.json())
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

    window.verCliente = function(id) {
        fetch(`php/ver_cliente.php?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const cliente = data.cliente;
                    const modal = document.getElementById('modalVerCliente');
                    if (modal) {
                        const nombre = modal.querySelector('#nombreVer');
                        const rut = modal.querySelector('#rutVer');
                        const telefono = modal.querySelector('#telefonoVer');
                        const email = modal.querySelector('#emailVer');
                        const direccion = modal.querySelector('#direccionVer');
                        const fechaNacimiento = modal.querySelector('#fecha_nacimientoVer');
                        const sexo = modal.querySelector('#sexoVer');
                        const servicioPreferido = modal.querySelector('#servicio_preferidoVer');
                        const notas = modal.querySelector('#notasVer');

                        if (nombre) nombre.textContent = cliente.nombre;
                        if (rut) rut.textContent = cliente.rut;
                        if (telefono) telefono.textContent = cliente.telefono;
                        if (email) email.innerHTML = `<a href="mailto:${cliente.email}">${cliente.email}</a>`;
                        if (direccion) direccion.textContent = cliente.direccion;
                        if (fechaNacimiento) fechaNacimiento.textContent = cliente.fecha_nacimiento;
                        if (sexo) sexo.textContent = cliente.sexo;
                        if (servicioPreferido) servicioPreferido.textContent = cliente.servicio_preferido;
                        if (notas) notas.textContent = cliente.notas;

                        $('#modalVerCliente').modal('show');
                    }
                } else {
                    console.error('Error al cargar el cliente:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function mostrarTooltip(input, mensaje) {
        const tooltip = new bootstrap.Tooltip(input, {
            title: mensaje,
            placement: 'right',
            trigger: 'manual'
        });
        tooltip.show();
        setTimeout(() => {
            tooltip.dispose();
        }, 3000);
    }

    const formAgregarCliente = document.getElementById('formAgregarCliente');
    if (formAgregarCliente) {
        formAgregarCliente.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(formAgregarCliente);
            const rutInput = document.getElementById('rut');
            const rutValue = rutInput.value.replace(/\./g, '').toUpperCase();
            const [rut, digito] = rutValue.split('-');

            if (!Rut.esValido(rut, digito)) {
                mostrarTooltip(rutInput, 'Ingrese un Rut correcto');
                return;
            }

            formData.set('rut', `${rut}-${digito}`);

            fetch('php/crear_cliente.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Cliente agregado exitosamente');
                    formAgregarCliente.reset();
                    $('#modalAgregarCliente').modal('hide');
                    cargarClientes();
                } else if (data.message === 'RUT ya registrado') {
                    mostrarTooltip(rutInput, 'RUT ya registrado');
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    const formEditarCliente = document.getElementById('formEditarCliente');
    if (formEditarCliente) {
        formEditarCliente.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(formEditarCliente);

            fetch('php/editar_cliente.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Cliente actualizado exitosamente');
                    formEditarCliente.reset();
                    $('#modalEditarCliente').modal('hide');
                    cargarClientes();
                } else if (data.message === 'RUT ya registrado') {
                    mostrarTooltip(document.getElementById('rutModal'), 'RUT ya registrado');
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    const buscadorClientes = document.getElementById('busquedaClientes');
    if (buscadorClientes) {
        buscadorClientes.addEventListener('input', function(event) {
            const query = event.target.value.toLowerCase();
            const items = document.querySelectorAll('#listaClientes .list-group-item');
            items.forEach(item => {
                const nombre = item.dataset.nombre;
                const telefono = item.dataset.telefono;
                const email = item.dataset.email;
                if (nombre.includes(query) || telefono.includes(query) || email.includes(query)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    }
});
