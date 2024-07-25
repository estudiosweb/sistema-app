// Función para cargar los servicios
function cargarServicios() {
    fetch('php/ver_servicios.php')
        .then(response => response.json())
        .then(data => {
            const listaServicios = document.getElementById('listaServicios');
            listaServicios.innerHTML = '';
            if (data.status === 'success') {
                data.servicios.forEach(servicio => {
                    const item = document.createElement('div'); // Definir el elemento item
                    item.className = 'list-group-item d-flex justify-content-between align-items-center';
                    const imagen = servicio.imagen ? `images/${servicio.imagen}` : 'images/servicios/servicio-nn.png';
                    item.innerHTML = `
                        <div class="d-flex align-items-center">
                            <img src="${imagen}" alt="${servicio.nombre}" class="img-thumbnail me-3" style="width: 50px; height: 50px;" onerror="this.src='/ewreservas/images/servicios/servicio-nn.png';">
                            <div>
                                <h5>${servicio.nombre}</h5>
                                <p><i class="fas fa-clock"></i> ${servicio.duracion} min - <i class="fas fa-dollar-sign"></i> ${Math.floor(servicio.precio)}</p>
                            </div>
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
        .catch(error => {
            console.error('Error al cargar los servicios:', error);
            toastr.error('Ocurrió un error al cargar los servicios.');
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
            console.log('Respuesta del servidor:', text); // Añade esta línea para depuración
            try {
                return JSON.parse(text);
            } catch (error) {
                console.error('Error parsing JSON:', text);
                throw error;
            }
        });
    })
    .then(data => {
        if (data.status === 'success') {
            toastr.success('Servicio guardado correctamente');
            $('#modalAgregarServicio').modal('hide'); // Cerrar el modal
            cargarServicios();
        } else {
            toastr.error(data.message || 'Error al guardar el servicio');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        toastr.error('Hubo un problema al guardar el servicio');
    });
});

// Función para editar un servicio
function editarServicio(id) {
    fetch(`php/ver_servicio.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('editarServicioId').value = data.servicio.id;
                document.getElementById('editarNombre').value = data.servicio.nombre;
                seleccionarCategoria(data.servicio.categoria_id);
                document.getElementById('editarDuracion').value = data.servicio.duracion;
                document.getElementById('editarPrecio').value = Math.floor(data.servicio.precio);
                document.getElementById('editarDescripcion').value = data.servicio.descripcion;
                $('#modalEditarServicio').modal('show');
            } else {
                toastr.error('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos del servicio:', error);
            toastr.error('Ocurrió un error al cargar los datos del servicio.');
        });
}

// Función para cargar y seleccionar la categoría almacenada en la edición del servicio
function seleccionarCategoria(idCategoria) {
    const editarCategoriaSelect = document.getElementById('editarCategoria');
    const opciones = editarCategoriaSelect.options;
    for (let i = 0; i < opciones.length; i++) {
        if (opciones[i].value == idCategoria) {
            editarCategoriaSelect.selectedIndex = i;
            break;
        }
    }
}

// Función para guardar los cambios en un servicio editado
document.getElementById('formEditarServicio').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('php/editar_servicio.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            toastr.success('Cambios guardados correctamente');
            $('#modalEditarServicio').modal('hide'); // Cerrar el modal
            cargarServicios();
        } else {
            toastr.error('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        toastr.error('Ocurrió un error al guardar los cambios.');
    });
});

// Función para eliminar un servicio
function eliminarServicio(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
        fetch(`php/eliminar_servicio.php?id=${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                cargarServicios();
                toastr.success('Servicio eliminado con éxito.');
            } else {
                toastr.error('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error al eliminar el servicio:', error);
            toastr.error('Ocurrió un error al eliminar el servicio.');
        });
    }
}
// Función para cargar las categorías
function cargarCategorias() {
    fetch('php/ver_categorias.php')
        .then(response => response.json())
        .then(data => {
            const listaCategorias = document.getElementById('listaCategorias');
            const categoriaSelect = document.getElementById('categoria');
            const editarCategoriaSelect = document.getElementById('editarCategoria');
            const alertaCategorias = document.getElementById('alertaCategorias');

            listaCategorias.innerHTML = '';
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
            console.error('Error al cargar las categorías:', error);
            categoriaSelect.innerHTML = '<option>Error al cargar categorías</option>';
            editarCategoriaSelect.innerHTML = '<option>Error al cargar categorías</option>';
            document.getElementById('btnAgregarServicio').disabled = true;
            alertaCategorias.classList.remove('d-none');
            toastr.error('Ocurrió un error al cargar las categorías.');
        });
}

// Función para agregar una categoría
document.getElementById('formAgregarCategoria').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('php/crear_categoria.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        return response.text().then(text => {
            try {
                return JSON.parse(text);
            } catch (error) {
                console.error('Error parsing JSON:', text);
                throw error;
            }
        });
    })
    .then(data => {
        if (data.status === 'success') {
            $('#modalAgregarCategoria').modal('hide');
            cargarCategorias();
            toastr.success('Categoría agregada con éxito.');
        } else {
            toastr.error('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error al guardar la categoría:', error);
        toastr.error('Ocurrió un error al guardar la categoría.');
    });
});

// Función para editar una categoría
function editarCategoria(id) {
    fetch(`php/ver_categoria.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('editarCategoriaId').value = data.categoria.id;
                document.getElementById('editarNombreCategoria').value = data.categoria.nombre;
                $('#modalEditarCategoria').modal('show');
            } else {
                toastr.error('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos de la categoría:', error);
            toastr.error('Ocurrió un error al cargar los datos de la categoría.');
        });
}

document.getElementById('formEditarCategoria').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('php/guardar_categoria.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        return response.text().then(text => {
            try {
                return JSON.parse(text);
            } catch (error) {
                console.error('Error parsing JSON:', text);
                throw error;
            }
        });
    })
    .then(data => {
        if (data.status === 'success') {
            $('#modalEditarCategoria').modal('hide');
            cargarCategorias();
            toastr.success('Categoría editada con éxito.');
        } else {
            toastr.error('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error al guardar los cambios de la categoría:', error);
        toastr.error('Ocurrió un error al guardar los cambios de la categoría.');
    });
});

// Función para eliminar una categoría
function eliminarCategoria(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría? Esta acción eliminará todos los servicios asociados.')) {
        fetch(`php/eliminar_categoria.php?id=${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                cargarCategorias();
                cargarServicios();
                toastr.success('Categoría eliminada con éxito.');
            } else {
                toastr.error('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error al eliminar la categoría:', error);
            toastr.error('Ocurrió un error al eliminar la categoría.');
        });
    }
}

// Cargar los servicios y categorías al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarServicios();
    cargarCategorias();
});
