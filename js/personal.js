document.addEventListener('DOMContentLoaded', function() {
    cargarPersonal();
    cargarServicios();
});

// Función para cargar los servicios en los radio buttons
function cargarServicios() {
    fetch('php/ver_servicios.php')
        .then(response => {
            console.log('Respuesta de servicios:', response);
            if (!response.ok) {
                throw new Error('Error en la red al intentar cargar los servicios');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos de servicios:', data);
            if (data.status === 'success') {
                const servicios = data.servicios;
                const contenedorServiciosAgregar = document.getElementById('servicios');
                const contenedorServiciosEditar = document.getElementById('editarServicios');
                
                contenedorServiciosAgregar.innerHTML = '';
                contenedorServiciosEditar.innerHTML = '';

                servicios.forEach(servicio => {
                    const radioAgregar = document.createElement('div');
                    radioAgregar.className = 'form-check';
                    radioAgregar.innerHTML = `
                        <input class="form-check-input" type="radio" name="servicio" id="servicioAgregar${servicio.id}" value="${servicio.id}">
                        <label class="form-check-label" for="servicioAgregar${servicio.id}">
                            ${servicio.nombre}
                        </label>
                    `;
                    contenedorServiciosAgregar.appendChild(radioAgregar);

                    const radioEditar = document.createElement('div');
                    radioEditar.className = 'form-check';
                    radioEditar.innerHTML = `
                        <input class="form-check-input" type="radio" name="editarServicio" id="servicioEditar${servicio.id}" value="${servicio.id}">
                        <label class="form-check-label" for="servicioEditar${servicio.id}">
                            ${servicio.nombre}
                        </label>
                    `;
                    contenedorServiciosEditar.appendChild(radioEditar);
                });
            } else {
                console.error('Error al cargar los servicios: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para cargar el personal
function cargarPersonal() {
    fetch('php/ver_personal.php')
        .then(response => {
            console.log('Respuesta de personal:', response);
            if (!response.ok) {
                throw new Error('Error en la red al intentar cargar el personal');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos de personal:', data);
            const listaPersonal = document.getElementById('listaPersonal');
            listaPersonal.innerHTML = '';

            if (data.status === 'success') {
                data.personal.forEach(personal => {
                    const foto = personal.foto ? `images/${personal.foto}` : 'images/perfiles/usuario-nn.png';
                    const item = document.createElement('div');
                    item.className = 'list-group-item d-flex justify-content-between align-items-center';
                    item.innerHTML = `
                        <div class="d-flex align-items-center" onclick="mostrarDetallePersonal(${personal.id})" style="cursor: pointer;">
                            <img src="${foto}" alt="${personal.nombre}" class="profile-img me-3"/>
                            <div>
                                <h5>${personal.nombre}</h5>
                                <p>${personal.cargo}</p>
                            </div>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-link dropdown" type="button" id="dropdownMenuButtonPersonal${personal.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButtonPersonal${personal.id}">
                                <li><a class="dropdown-item" href="#" onclick="editarPersonal(${personal.id})">Editar</a></li>
                                <li><a class="dropdown-item" href="#" onclick="eliminarPersonal(${personal.id})">Eliminar</a></li>
                            </ul>
                        </div>
                    `;
                    listaPersonal.appendChild(item);
                });
            } else {
                listaPersonal.innerHTML = '<p>No hay personal disponible</p>';
                console.error('Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const listaPersonal = document.getElementById('listaPersonal');
            listaPersonal.innerHTML = '<p>Error al cargar el personal. Por favor, inténtelo de nuevo más tarde.</p>';
        });
}


// Función para mostrar el detalle del personal
function mostrarDetallePersonal(id) {
    fetch(`php/ver_personal.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const personal = data.personal;
                const detalleFoto = document.getElementById('detalleFoto');
                const detalleNombre = document.getElementById('detalleNombre');
                const detalleCargo = document.getElementById('detalleCargo');
                const detalleBio = document.getElementById('detalleBio');
                const detalleEmail = document.getElementById('detalleEmail');
                const detalleTelefono = document.getElementById('detalleTelefono');
                const detalleDireccion = document.getElementById('detalleDireccion');
                const detalleServicios = document.getElementById('detalleServicios');

                if (detalleFoto && detalleNombre && detalleCargo && detalleBio && detalleEmail && detalleTelefono && detalleDireccion && detalleServicios) {
                    detalleFoto.src = personal.foto ? `images/${personal.foto}` : 'images/perfiles/usuario-nn.png';
                    detalleNombre.innerText = personal.nombre;
                    detalleCargo.innerText = personal.cargo;
                    detalleBio.innerText = personal.bio;
                    detalleEmail.innerText = personal.email;
                    detalleTelefono.href = `tel:${personal.telefono}`;
                    detalleTelefono.innerText = personal.telefono;
                    detalleDireccion.innerText = personal.direccion;

                    // Limpiar lista de servicios antes de agregar nuevos
                    detalleServicios.innerHTML = '';
                    personal.servicios.forEach(servicio => {
                        const li = document.createElement('li');
                        li.innerText = servicio.nombre;
                        detalleServicios.appendChild(li);
                    });

                    new bootstrap.Offcanvas(document.getElementById('offcanvasDetallePersonal')).show();
                } else {
                    console.error('Error: Elementos del offcanvas no encontrados.');
                }
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para agregar personal
document.getElementById('formAgregarPersonal').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const servicioSeleccionado = document.querySelector('input[name="servicio"]:checked');
    if (servicioSeleccionado) {
        formData.append('servicio', servicioSeleccionado.value);
    }

    fetch('php/crear_personal.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Respuesta de agregar personal:', response);
        if (!response.ok) {
            throw new Error('Error en la red al intentar agregar el personal');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos de agregar personal:', data);
        if (data.status === 'success') {
            $('#modalAgregarPersonal').modal('hide');
            cargarPersonal();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// Función para editar personal
function editarPersonal(id) {
    fetch(`php/ver_personal.php?id=${id}`)
        .then(response => {
            console.log('Respuesta de editar personal:', response);
            if (!response.ok) {
                throw new Error('Error en la red al intentar cargar los detalles del personal');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos de editar personal:', data);
            if (data.status === 'success') {
                const personal = data.personal;
                document.getElementById('editarPersonalId').value = personal.id;
                document.getElementById('editarNombre').value = personal.nombre;
                document.getElementById('editarCargo').value = personal.cargo;
                document.getElementById('editarBio').value = personal.bio;
                document.getElementById('editarEmail').value = personal.email;
                document.getElementById('editarTelefono').value = personal.telefono;
                document.getElementById('editarDireccion').value = personal.direccion;

                // Limpiar el campo de archivo
                document.getElementById('editarFoto').value = '';

                // Cargar servicios del personal
                const editarServicios = document.getElementById('editarServicios');
                const personalServicios = personal.servicios.map(s => s.id);
                for (let option of editarServicios.getElementsByTagName('input')) {
                    option.checked = personalServicios.includes(parseInt(option.value));
                }

                $('#modalEditarPersonal').modal('show');
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para enviar los datos editados
document.getElementById('formEditarPersonal').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const servicioSeleccionado = document.querySelector('input[name="editarServicio"]:checked');
    if (servicioSeleccionado) {
        formData.append('servicio', servicioSeleccionado.value);
    }

    fetch('php/editar_personal.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Respuesta de enviar datos editados:', response);
        if (!response.ok) {
            throw new Error('Error en la red al intentar editar el personal');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos de enviar datos editados:', data);
        if (data.status === 'success') {
            $('#modalEditarPersonal').modal('hide');
            cargarPersonal();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// Función para eliminar personal
function eliminarPersonal(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este miembro del personal?')) {
        fetch(`php/eliminar_personal.php?id=${id}`, {
            method: 'GET'
        })
        .then(response => {
            console.log('Respuesta de eliminar personal:', response);
            if (!response.ok) {
                throw new Error('Error en la red al intentar eliminar el personal');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos de eliminar personal:', data);
            if (data.status === 'success') {
                cargarPersonal();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
