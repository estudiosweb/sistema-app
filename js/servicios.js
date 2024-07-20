// Función para cargar los servicios
function cargarServicios() {
    fetch('php/ver_servicios.php')
        .then(response => response.json())
        .then(data => {
            const listaServicios = document.getElementById('listaServicios');
            listaServicios.innerHTML = '';
            if (data.status === 'success') {
                data.servicios.forEach(servicio => {
                    const item = document.createElement('div');
                    item.className = 'list-group-item d-flex justify-content-between align-items-center';
                    item.innerHTML = `
                        <div>
                            <h5>${servicio.nombre}</h5>
                            <p>${servicio.categoria_nombre} - $${parseInt(servicio.precio)}</p>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-link dropdown" type="button" id="dropdownMenuButtonServicio${servicio.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButtonServicio${servicio.id}">
                                <li><a class="dropdown-item" href="#" onclick="editarServicio(${servicio.id})">Editar</a></li>
                                <li><a class="dropdown-item" href="#" onclick="eliminarServicio(${servicio.id})">Eliminar</a></li>
                            </ul>
                        </div>
                    `;
                    listaServicios.appendChild(item);
                });
            } else {
                listaServicios.innerHTML = '<p>No hay servicios disponibles</p>';
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para cargar las categorías
function cargarCategorias() {
    return fetch('php/ver_categorias.php')
        .then(response => response.json())
        .then(data => {
            const listaCategorias = document.getElementById('listaCategorias');
            listaCategorias.innerHTML = '';
            const categoriaSelect = document.getElementById('categoria');
            const editarCategoriaSelect = document.getElementById('editarCategoria');
            const alertaCategorias = document.getElementById('alertaCategorias');
            categoriaSelect.innerHTML = '';
            editarCategoriaSelect.innerHTML = '';
            if (data.status === 'success') {
                data.categorias.forEach(categoria => {
                    const option = document.createElement('option');
                    option.value = categoria.id;
                    option.textContent = categoria.nombre;
                    categoriaSelect.appendChild(option);

                    const editarOption = document.createElement('option');
                    editarOption.value = categoria.id;
                    editarOption.textContent = categoria.nombre;
                    editarCategoriaSelect.appendChild(editarOption);

                    const item = document.createElement('div');
                    item.className = 'list-group-item d-flex justify-content-between align-items-center';
                    item.innerHTML = `
                        <div>
                            <h5>${categoria.nombre}</h5>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-link dropdown" type="button" id="dropdownMenuButtonCat${categoria.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButtonCat${categoria.id}">
                                <li><a class="dropdown-item" href="#" onclick="editarCategoria(${categoria.id})">Editar</a></li>
                                <li><a class="dropdown-item" href="#" onclick="eliminarCategoria(${categoria.id})">Eliminar</a></li>
                            </ul>
                        </div>
                    `;
                    listaCategorias.appendChild(item);
                });
                document.getElementById('btnAgregarServicio').disabled = false;
                alertaCategorias.classList.add('d-none');
            } else {
                categoriaSelect.innerHTML = '<option>No hay categorías disponibles</option>';
                editarCategoriaSelect.innerHTML = '<option>No hay categorías disponibles</option>';
                document.getElementById('btnAgregarServicio').disabled = true;
                alertaCategorias.classList.remove('d-none');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const categoriaSelect = document.getElementById('categoria');
            const editarCategoriaSelect = document.getElementById('editarCategoria');
            categoriaSelect.innerHTML = '<option>Error al cargar categorías</option>';
            editarCategoriaSelect.innerHTML = '<option>Error al cargar categorías</option>';
            document.getElementById('btnAgregarServicio').disabled = true;
            document.getElementById('alertaCategorias').classList.remove('d-none');
        });
}

// Función para agregar un servicio
document.getElementById('formAgregarServicio').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('php/crear_servicio.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        return response.text().then(text => {
            try {
                return JSON.parse(text);
            } catch (err) {
                console.error('Error:', text); // Mostrar la respuesta completa para diagnóstico
                throw new Error('Respuesta no es JSON');
            }
        });
    })
    .then(data => {
        if (data.status === 'success') {
            $('#modalAgregarServicio').modal('hide');
            cargarServicios();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// Función para agregar una categoría
document.getElementById('formAgregarCategoria').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('php/agregar_categoria.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            $('#modalAgregarCategoria').modal('hide');
            cargarCategorias();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// Función para editar un servicio
function editarServicio(id) {
    fetch(`php/ver_servicio.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const servicio = data.servicio;
                document.getElementById('editarServicioId').value = servicio.id;
                document.getElementById('editarNombre').value = servicio.nombre;
                document.getElementById('editarCategoria').value = servicio.categoria;
                document.getElementById('editarDuracion').value = servicio.duracion;
                document.getElementById('editarPrecio').value = servicio.precio;
                document.getElementById('editarDescripcion').value = servicio.descripcion;

                // Cargar las categorías antes de mostrar el modal
                cargarCategorias().then(() => {
                    document.getElementById('editarCategoria').value = servicio.categoria;
                    $('#modalEditarServicio').modal('show');
                });
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para eliminar un servicio
function eliminarServicio(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
        fetch(`php/eliminar_servicio.php?id=${id}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                cargarServicios();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

// Función para editar una categoría
function editarCategoria(id) {
    fetch(`php/ver_categoria.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const categoria = data.categoria;
                document.getElementById('editarCategoriaId').value = categoria.id;
                document.getElementById('editarNombreCategoria').value = categoria.nombre;
                $('#modalEditarCategoria').modal('show');
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para eliminar una categoría
function eliminarCategoria(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría? Esto eliminará todos los servicios asociados.')) {
        fetch(`php/eliminar_categoria.php?id=${id}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                cargarCategorias();
                cargarServicios();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

// Cargar los servicios y categorías al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarServicios();
    cargarCategorias();
});
