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
});
