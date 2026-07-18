
document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.querySelector('#darkModeToggle');
    const body = document.body;

    if (!toggleSwitch) return;

    // 1. Cek Local Storage saat halaman dimuat
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        body.classList.add('dark');
        toggleSwitch.checked = true; // Pastikan posisi switch sesuai
    }

    // 2. Event Listener saat switch diklik
    toggleSwitch.addEventListener('change', function(e) {
        if (e.target.checked) {
            // Aktifkan Dark Mode
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            // Matikan Dark Mode
            body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    });
});