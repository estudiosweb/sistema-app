// Función para cargar el personal
function cargarPersonal() {
    fetch('php/ver_personal.php')
        .then(response => response.json())
        .then(data => {
            const listaPersonal = document.getElementById('listaPersonal');
            listaPersonal.innerHTML = '';
            if (data.status === 'success') {
                data.personal.forEach(personal => {
                    const item = document.createElement('div');
                    item.className = 'list-group-item d-flex justify-content-between align-items-center';
                    item.innerHTML = `
                        <div>
                            <h5>${personal.nombre}</h5>
                            <p>${personal.cargo}</p>
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
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para agregar personal
document.getElementById('formAgregarPersonal').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('php/crear_personal.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
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
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const personal = data.personal;
                document.getElementById('editarPersonalId').value = personal.id;
                document.getElementById('editarNombre').value = personal.nombre;
                document.getElementById('editarCargo').value = personal.cargo;
                document.getElementById('editarBio').value = personal.bio;
                document.getElementById('editarEmail').value = personal.email;
                document.getElementById('editarTelefono').value = personal.telefono;
                document.getElementById('editarDireccion').value = personal.direccion;
                $('#modalEditarPersonal').modal('show');
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para eliminar personal
function eliminarPersonal(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este miembro del personal?')) {
        fetch(`php/eliminar_personal.php?id=${id}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                cargarPersonal();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

// Cargar el personal al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarPersonal();
});
