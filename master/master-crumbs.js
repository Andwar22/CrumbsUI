
// ############### DROPDOWN ###############
function initCrumbsDropdowns() {
    const dropdownSelector = '.cr-dropdown';
    let generatedId = 0;

    function getDropdownPart(dropdown, selector) {
        return Array.from(dropdown.children).find((element) => element.matches(selector))
            || dropdown.querySelector(selector);
    }

    function createUniqueId(prefix) {
        let id;

        do {
            generatedId += 1;
            id = `cr-${prefix}-${generatedId}`;
        } while (document.getElementById(id));

        return id;
    }

    function ensureUniqueId(element, prefix) {
        if (!element.id || document.getElementById(element.id) !== element) {
            element.id = createUniqueId(prefix);
        }

        return element.id;
    }

    function prepareDropdown(dropdown) {
        const toggle = getDropdownPart(dropdown, '.cr-drop-toggle');
        const menu = getDropdownPart(dropdown, '.cr-drop-menu');

        if (!toggle || !menu) return null;

        const toggleId = ensureUniqueId(toggle, 'dropdown-toggle');
        const menuId = ensureUniqueId(menu, 'dropdown-menu');
        const isOpen = menu.classList.contains('show');

        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-controls', menuId);
        menu.setAttribute('aria-labelledby', toggleId);
        menu.setAttribute('aria-hidden', String(!isOpen));

        return { toggle, menu };
    }

    function setDropdownState(dropdown, isOpen) {
        const parts = prepareDropdown(dropdown);

        if (!parts) return;

        parts.menu.classList.toggle('show', isOpen);
        parts.toggle.setAttribute('aria-expanded', String(isOpen));
        parts.menu.setAttribute('aria-hidden', String(!isOpen));
    }

    function closeAllDropdowns(exceptDropdown) {
        document.querySelectorAll(dropdownSelector).forEach((dropdown) => {
            if (dropdown !== exceptDropdown) {
                setDropdownState(dropdown, false);
            }
        });
    }

    document.querySelectorAll(dropdownSelector).forEach(prepareDropdown);

    // Event delegation membuat dropdown tetap bekerja jika markup ditambahkan setelah halaman dimuat.
    document.addEventListener('click', function (event) {
        const toggle = event.target.closest('.cr-drop-toggle');

        if (toggle) {
            const dropdown = toggle.closest(dropdownSelector);
            const parts = dropdown && prepareDropdown(dropdown);

            if (!parts) return;

            event.preventDefault();
            event.stopPropagation();

            const willOpen = !parts.menu.classList.contains('show');
            closeAllDropdowns(dropdown);
            setDropdownState(dropdown, willOpen);
            return;
        }

        if (event.target.closest('.cr-drop-item') || !event.target.closest(dropdownSelector)) {
            closeAllDropdowns(null);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;

        const openDropdown = Array.from(document.querySelectorAll(dropdownSelector)).find((dropdown) => {
            const parts = prepareDropdown(dropdown);
            return parts && parts.menu.classList.contains('show');
        });

        if (!openDropdown) return;

        const parts = prepareDropdown(openDropdown);
        closeAllDropdowns(null);
        parts.toggle.focus();
        event.preventDefault();
    });

    // Sinkronkan atribut ARIA pada dropdown yang dibuat secara dinamis.
    if (window.MutationObserver) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== 1) return;

                    if (node.matches(dropdownSelector)) {
                        prepareDropdown(node);
                    }

                    node.querySelectorAll(dropdownSelector).forEach(prepareDropdown);
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCrumbsDropdowns);
} else {
    initCrumbsDropdowns();
}

