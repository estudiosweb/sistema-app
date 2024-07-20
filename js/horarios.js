// Función para cargar los horarios
function cargarHorarios() {
    fetch('php/ver_horarios.php')
        .then(response => response.json())
        .then(data => {
            const listaHorarios = document.getElementById('listaHorarios');
            listaHorarios.innerHTML = '';
            if (data.status === 'success') {
                data.horarios.forEach(horario => {
                    const item = document.createElement('div');
                    item.className = 'list-group-item d-flex justify-content-between align-items-center';
                    item.innerHTML = `
                        <div>
                            <h5>${horario.dia}</h5>
                            <p>${horario.hora_inicio} - ${horario.hora_fin}</p>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButtonHorario${horario.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButtonHorario${horario.id}">
                                <li><a class="dropdown-item" href="#" onclick="editarHorario(${horario.id})">Editar</a></li>
                                <li><a class="dropdown-item" href="#" onclick="eliminarHorario(${horario.id})">Eliminar</a></li>
                            </ul>
                        </div>
                    `;
                    listaHorarios.appendChild(item);
                });
            } else {
                listaHorarios.innerHTML = '<p>No hay horarios disponibles</p>';
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para agregar horario
document.getElementById('formAgregarHorario').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('php/crear_horario.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            $('#modalAgregarHorario').modal('hide');
            cargarHorarios();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// Función para editar horario
function editarHorario(id) {
    fetch(`php/ver_horarios.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const horario = data.horario;
                document.getElementById('editarHorarioId').value = horario.id;
                document.getElementById('editarDia').value = horario.dia;
                document.getElementById('editarHoraInicio').value = horario.hora_inicio;
                document.getElementById('editarHoraFin').value = horario.hora_fin;
                $('#modalEditarHorario').modal('show');
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para eliminar horario
function eliminarHorario(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este horario?')) {
        fetch(`php/eliminar_horario.php?id=${id}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                cargarHorarios();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

// Cargar los horarios al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarHorarios();
});
