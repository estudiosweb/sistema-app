document.addEventListener('DOMContentLoaded', function() {
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
                            <p>${servicio.categoria} - ${servicio.duracion} min - $${servicio.precio}</p>
                            <p>${servicio.descripcion}</p>
                        `;
                        listaServicios.appendChild(item);
                    });
                } else {
                    listaServicios.innerHTML = '<p>No hay servicios disponibles</p>';
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function cargarPersonal() {
        fetch('php/ver_personal.php')
            .then(response => response.json())
            .then(data => {
                const listaPersonal = document.getElementById('listaPersonal');
                listaPersonal.innerHTML = '';
                if (data.status === 'success') {
                    data.personal.forEach(persona => {
                        const item = document.createElement('div');
                        item.className = 'list-group-item';
                        item.innerHTML = `
                            <h5>${persona.nombre}</h5>
                            <p>${persona.cargo} - ${persona.email} - ${persona.telefono}</p>
                            <p>${persona.bio}</p>
                        `;
                        listaPersonal.appendChild(item);
                    });
                } else {
                    listaPersonal.innerHTML = '<p>No hay personal disponible</p>';
                }
            })
            .catch(error => console.error('Error:', error));
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
                            <h5>${horario.dia}</h5>
                            <p>${horario.hora_inicio} - ${horario.hora_fin}</p>
                        `;
                        listaHorarios.appendChild(item);
                    });
                } else {
                    listaHorarios.innerHTML = '<p>No hay horarios disponibles</p>';
                }
            })
            .catch(error => console.error('Error:', error));
    }

    const formConfigTienda = document.getElementById('formConfigTienda');
    if (formConfigTienda) {
        formConfigTienda.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);

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
    }

    cargarServicios();
    cargarPersonal();
    cargarHorarios();
});
