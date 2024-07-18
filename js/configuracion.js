document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();

    // Funciones de carga de datos
    function cargarDatos() {
        cargarServicios();
        cargarPersonal();
        cargarHorarios();
        cargarConfiguracionTienda();
    }

    function cargarServicios() {
        fetch('php/ver_servicios.php')
            .then(response => response.json())
            .then(data => {
                const listaServicios = document.getElementById('listaServicios');
                listaServicios.innerHTML = '';
                if (data.status === 'success') {
                    data.servicios.forEach(servicio => {
                        const item = document.createElement('div');
                        item.className = 'list-group-item';
                        item.innerHTML = `
                            <h5>${servicio.nombre}</h5>
                            <p>${servicio.categoria}</p>
                            <button onclick="editarServicio(${servicio.id})" class="btn btn-sm btn-primary">Editar</button>
                            <button onclick="eliminarServicio(${servicio.id})" class="btn btn-sm btn-danger">Eliminar</button>
                        `;
                        listaServicios.appendChild(item);
                    });
                } else {
                    listaServicios.innerHTML = '<p>No hay servicios disponibles</p>';
                }
            })
            .catch(error => console.error('Error al cargar los servicios:', error));
    }

    function cargarPersonal() {
        fetch('php/ver_personal.php')
            .then(response => response.json())
            .then(data => {
                const listaPersonal = document.getElementById('listaPersonal');
                listaPersonal.innerHTML = '';
                if (data.status === 'success') {
                    data.personal.forEach(personal => {
                        const item = document.createElement('div');
                        item.className = 'list-group-item';
                        item.innerHTML = `
                            <h5>${personal.nombre}</h5>
                            <p>${personal.cargo}</p>
                            <button onclick="editarPersonal(${personal.id})" class="btn btn-sm btn-primary">Editar</button>
                            <button onclick="eliminarPersonal(${personal.id})" class="btn btn-sm btn-danger">Eliminar</button>
                        `;
                        listaPersonal.appendChild(item);
                    });
                } else {
                    listaPersonal.innerHTML = '<p>No hay personal disponible</p>';
                }
            })
            .catch(error => console.error('Error al cargar el personal:', error));
    }

    function cargarHorarios() {
        fetch('php/ver_horarios.php')
            .then(response => response.json())
            .then(data => {
                const listaHorarios = document.getElementById('listaHorarios');
                listaHorarios.innerHTML = '';
                if (data.status === 'success') {
                    data.horarios.forEach(horario => {
                        const item = document.createElement('div');
                        item.className = 'list-group-item';
                        item.innerHTML = `
                            <h5>${horario.dias} - ${horario.horas}</h5>
                            <button onclick="editarHorario(${horario.id})" class="btn btn-sm btn-primary">Editar</button>
                            <button onclick="eliminarHorario(${horario.id})" class="btn btn-sm btn-danger">Eliminar</button>
                        `;
                        listaHorarios.appendChild(item);
                    });
                } else {
                    listaHorarios.innerHTML = '<p>No hay horarios disponibles</p>';
                }
            })
            .catch(error => console.error('Error al cargar los horarios:', error));
    }

    function cargarConfiguracionTienda() {
        fetch('php/ver_config_tienda.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const config = data.config;
                    document.getElementById('nombre_negocio').value = config.nombre_negocio;
                    document.getElementById('direccion_negocio').value = config.direccion_negocio;
                    document.getElementById('telefono_negocio').value = config.telefono_negocio;
                    document.getElementById('whatsapp_negocio').value = config.whatsapp_negocio;
                } else {
                    console.error('Error al cargar la configuración de la tienda:', data.message);
                }
            })
            .catch(error => console.error('Error al cargar la configuración de la tienda:', error));
    }

    // Funciones de edición
    window.editarServicio = function(id) {
        fetch(`php/ver_servicio.php?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const servicio = data.servicio;
                    const modal = document.getElementById('modalServicio');
                    const nombre = modal.querySelector('#nombreServicio');
                    const categoria = modal.querySelector('#categoriaServicio');
                    const duracion = modal.querySelector('#duracionServicio');
                    const precio = modal.querySelector('#precioServicio');
                    const descripcion = modal.querySelector('#descripcionServicio');
                    const categoria_id = modal.querySelector('#categoriaServicio');

                    if (nombre) nombre.value = servicio.nombre;
                    if (categoria) categoria.value = servicio.categoria;
                    if (duracion) duracion.value = servicio.duracion;
                    if (precio) precio.value = servicio.precio;
                    if (descripcion) descripcion.value = servicio.descripcion;
                    if (categoria_id) categoria_id.value = servicio.categoria_id;

                    $('#modalServicio').modal('show');
                } else {
                    console.error('Error al cargar el servicio:', data.message);
                }
            })
            .catch(error => console.error('Error al cargar el servicio:', error));
    }

    window.eliminarServicio = function(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
            fetch(`php/eliminar_servicio.php?id=${id}`, {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Servicio eliminado exitosamente');
                    cargarServicios();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    // Eventos de formularios
    document.getElementById('formAgregarServicio').addEventListener('submit', function(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        fetch('php/crear_servicio.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Servicio agregado exitosamente');
                form.reset();
                $('#modalAgregarServicio').modal('hide');
                cargarServicios();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    document.getElementById('formConfigTienda').addEventListener('submit', function(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        fetch('php/guardar_config_tienda.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Configuración guardada exitosamente');
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
