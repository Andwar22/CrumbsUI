
// #region ################################## FUNGSI DROPDOWN

document.addEventListener('DOMContentLoaded', function () {
    // Ambil semua elemen dengan kelas "dropdown"
    const dropdowns = document.querySelectorAll('.cr-dropdown');

    // Iterasi setiap dropdown
    dropdowns.forEach(function (dropdown) {
        // Ambil elemen "toggle" dan "menu" dalam setiap dropdown
        const toggle = dropdown.querySelector('.cr-dropdown-toggle');
        const menu = dropdown.querySelector('.cr-dropdown-menu');

        // Tambahkan event listener untuk setiap tombol "toggle"
        toggle.addEventListener('click', function () {
            // Tutup dropdown lain dan buka/tutup dropdown saat ini
            closeOtherDropdowns(dropdown);
            menu.classList.toggle('show');
            toggle.classList.add('show');

            // Mengatur posisi dropdown-menu agar tidak keluar dari layar
            if (menu.classList.contains('show')) {
                adjustDropdownPosition(dropdown, menu);
            }
        });

        // Ambil setiap item menu dalam dropdown dan tambahkan event listener
        const menuItems = menu.querySelectorAll('.cr-dropdown-item');
        menuItems.forEach(function (item) {
            item.addEventListener('click', function () {
                // Tutup dropdown saat item menu dipilih
                menu.classList.remove('show');
                toggle.classList.remove('show');
            });
        });
    });

    // Tambahkan event listener saat ukuran layar diubah
    window.addEventListener('resize', function () {
        // Tutup semua dropdown saat ukuran layar diubah
        closeAllDropdowns();
    });

    // Tambahkan event listener untuk menutup dropdown saat klik di luar dropdown
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.cr-dropdown')) {
        closeAllDropdowns();
        }
    });

    // Fungsi untuk menutup dropdown lain selain dropdown saat ini
    function closeOtherDropdowns(currentDropdown) {
        dropdowns.forEach(function (dropdown) {
            if (dropdown !== currentDropdown) {
                const otherToggle = dropdown.querySelector('.cr-dropdown-toggle');
                dropdown.querySelector('.cr-dropdown-menu').classList.remove('show');
                otherToggle.classList.remove('show');
            }
        });
    }

    // Fungsi untuk menutup semua dropdown
    function closeAllDropdowns() {
        dropdowns.forEach(function (dropdown) {
            const toggle = dropdown.querySelector('.cr-dropdown-toggle');
            dropdown.querySelector('.cr-dropdown-menu').classList.remove('show');
            toggle.classList.remove('show');
        });
    }

    // Fungsi untuk menyesuaikan posisi dropdown-menu agar tidak keluar dari layar
    function adjustDropdownPosition(dropdown, menu) {
        const rect = dropdown.getBoundingClientRect();
        const isOverflowRight = rect.right + menu.offsetWidth > window.innerWidth;
        const isOverflowLeft = rect.left - menu.offsetWidth < 0;

        if (isOverflowRight) {
            menu.style.left = 'auto';
            menu.style.right = '0';
        }
        else if (isOverflowLeft) {
            menu.style.left = '0';
            menu.style.right = 'auto';
        }
    }
});

// #endregion ################################## FUNGSI DROPDOWN END