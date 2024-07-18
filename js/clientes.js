document.addEventListener('DOMContentLoaded', function () {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeSwitch.checked = true;
    }

    darkModeSwitch.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    const busquedaClientes = document.getElementById('busquedaClientes');
    const clientesContainer = document.getElementById('clientes');

    const cargarClientes = (query = '') => {
        fetch(`php/ver_clientes.php?busqueda=${query}`)
            .then(response => response.json())
            .then(data => {
                clientesContainer.innerHTML = '';
                if (!Array.isArray(data)) {
                    clientesContainer.innerHTML = '<p class="text-center">No se encontraron clientes</p>';
                    return;
                }
                if (data.length === 0) {
                    clientesContainer.innerHTML = '<p class="text-center">No se encontraron clientes</p>';
                } else {
                    data.forEach(cliente => {
                        const clienteElement = document.createElement('div');
                        clienteElement.className = 'list-group-item';
                        clienteElement.innerHTML = `
                            <h5>${cliente.nombre}</h5>
                            <p>${cliente.email}</p>
                            <p>${cliente.telefono}</p>
                        `;
                        clientesContainer.appendChild(clienteElement);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                clientesContainer.innerHTML = '<p class="text-center">Error al cargar los clientes</p>';
            });
    };

    busquedaClientes.addEventListener('input', function () {
        cargarClientes(this.value);
    });

    cargarClientes();
});
