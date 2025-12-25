
// ############### DROPDOWN ###############
document.addEventListener('DOMContentLoaded', function () {
    
    const dropdownToggles = document.querySelectorAll('.cr-drop-toggle');

    dropdownToggles.forEach((toggle) => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const parent = this.closest('.cr-dropdown'); 
            const menu = parent.querySelector('.cr-drop-menu');

            closeAllDropdowns(menu);

            menu.classList.toggle('show');
        });
    });

    window.addEventListener('click', function () {
        closeAllDropdowns(null);
    });

    function closeAllDropdowns(exceptMenu) {
        const allMenus = document.querySelectorAll('.cr-drop-menu');
        allMenus.forEach((menu) => {
            if (menu !== exceptMenu) {
                menu.classList.remove('show');
            }
        });
    }
});


// ############### DARK MODE SWITCH ###############
document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.querySelector('#darkModeToggle');
    const body = document.body;

    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        body.classList.add('dark');
        toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener('change', function(e) {
        if (e.target.checked) {
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    });
});