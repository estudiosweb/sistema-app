// Función para guardar la configuración de la tienda
document.getElementById('formConfigTienda').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('php/guardar_config_tienda.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            alert('Configuración guardada correctamente.');
            location.reload();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});
