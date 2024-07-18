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

    const busqueda = document.getElementById('busqueda');
    const reservasContainer = document.getElementById('reservas');

    const cargarReservas = (query = '') => {
        fetch(`php/obtener_reservas.php?busqueda=${query}`)
            .then(response => response.json())
            .then(data => {
                reservasContainer.innerHTML = '';
                if (data.length === 0) {
                    reservasContainer.innerHTML = '<p class="text-center">No se encontraron reservas</p>';
                } else {
                    data.forEach(reserva => {
                        const reservaElement = document.createElement('div');
                        reservaElement.className = 'list-group-item';
                        reservaElement.innerHTML = `
                            <h5>${reserva.nombre_cliente}</h5>
                            <p>${reserva.servicio}</p>
                            <p>${reserva.fecha} ${reserva.hora}</p>
                        `;
                        reservasContainer.appendChild(reservaElement);
                    });
                }
            });
    };

    busqueda.addEventListener('input', function () {
        cargarReservas(this.value);
    });

    cargarReservas();
});