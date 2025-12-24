

document.addEventListener('DOMContentLoaded', function () {
    
    // 1. Ambil semua elemen dengan class .dropdown-toggle
    const dropdownToggles = document.querySelectorAll('.cr-drop-toggle');

    dropdownToggles.forEach((toggle) => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault(); // Mencegah perilaku default (misal jika tag <a>)
            e.stopPropagation(); // Mencegah event bubbling ke window (agar tidak langsung tertutup)

            // Cari elemen menu (dropdown-menu) yang bersaudara dengan tombol ini
            // Kita cari parent terdekat (.dropdown), lalu cari .dropdown-menu di dalamnya
            const parent = this.closest('.cr-dropdown'); 
            const menu = parent.querySelector('.cr-drop-menu');

            // Opsional: Tutup semua dropdown LAIN yang sedang terbuka (perilaku asli Bootstrap)
            closeAllDropdowns(menu);

            // Toggle class 'show' pada menu milik tombol ini saja
            menu.classList.toggle('show');
        });
    });

    // 2. Event Listener pada Window untuk menutup dropdown saat klik di luar
    window.addEventListener('click', function () {
        closeAllDropdowns(null);
    });

    // Helper function untuk menutup dropdown
    function closeAllDropdowns(exceptMenu) {
        const allMenus = document.querySelectorAll('.cr-drop-menu');
        allMenus.forEach((menu) => {
            // Jika menu ini bukan menu yang sedang kita klik, maka tutup
            if (menu !== exceptMenu) {
                menu.classList.remove('show');
            }
        });
    }

});