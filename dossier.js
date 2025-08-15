document.addEventListener('DOMContentLoaded', () => {
    // Only execute if dossier-container exists
    if (!document.querySelector('.dossier-container')) {
        document.body.classList.add('dossier-page'); // Ensure dossier-page class for index.html
        return;
    }

    // Add dossier-page class for styling
    document.body.classList.add('dossier-page');

    // Passwords for sections and master access
    const sectionPasswords = {
        'psychological': 'joemoldberg',
        'network': 'quinntorres',
        'surveillance': 'mooneylove',
        'operations': 'beckglass',
        'interactions': 'therapistcentral'
    };
    const masterPasswords = ['younetflix', 'joegoldberg'];

    let currentSection = null;
    const modal = document.getElementById('password-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const passwordInput = document.getElementById('password-input');
    const passwordForm = document.getElementById('password-form');
    const closeModalButton = document.querySelector('.close-modal');

    const hasMasterAccess = () => localStorage.getItem('masterAccess') === 'true';
    const isSectionUnlocked = (section) => localStorage.getItem(`section_${section}`) === 'unlocked' || hasMasterAccess();

    const openModal = (section) => {
        currentSection = section;
        const sectionTitle = document.querySelector(`[data-section="${section}"]`).previousElementSibling.textContent;
        if (modalTitle) modalTitle.textContent = '🔐 Acesso Restrito';
        if (modalSubtitle) modalSubtitle.textContent = `Digite a senha para: ${sectionTitle}`;
        if (modal) modal.classList.add('active');
        if (passwordInput) passwordInput.focus();
    };

    const closeModal = () => {
        if (modal) modal.classList.remove('active');
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.classList.remove('shake');
        }
        currentSection = null;
    };

    const showSection = (section) => {
        const lockedDiv = document.getElementById(`${section}-locked`);
        const unlockedDiv = document.getElementById(`${section}-unlocked`);
        const button = document.querySelector(`[data-section="${section}"]`);

        if (lockedDiv) lockedDiv.style.display = 'none';
        if (unlockedDiv) unlockedDiv.classList.add('visible');
        if (button) {
            button.classList.add('unlocked');
            button.innerHTML = '✅ Desbloqueado';
            button.disabled = true;
        }
    };

    const showAllSections = () => {
        Object.keys(sectionPasswords).forEach(section => {
            if (!isSectionUnlocked(section)) {
                localStorage.setItem(`section_${section}`, 'unlocked');
            }
            showSection(section);
        });
    };

    const checkPassword = (event) => {
        event.preventDefault();
        if (!passwordInput || !currentSection) return;
        const password = passwordInput.value.toLowerCase().trim();

        if (masterPasswords.includes(password)) {
            localStorage.setItem('masterAccess', 'true');
            showAllSections();
            closeModal();
            return;
        }

        if (sectionPasswords[currentSection] === password) {
            localStorage.setItem(`section_${currentSection}`, 'unlocked');
            showSection(currentSection);
            closeModal();
        } else {
            passwordInput.classList.add('shake');
            setTimeout(() => passwordInput.classList.remove('shake'), 820);
        }
    };

    // Event Listeners
    document.querySelectorAll('.unlock-button').forEach(button => {
        button.addEventListener('click', () => openModal(button.dataset.section));
    });

    if (passwordForm) passwordForm.addEventListener('submit', checkPassword);
    if (closeModalButton) closeModalButton.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal();
    });

    // Scroll Animations
    const initScrollAnimations = () => {
        const sections = document.querySelectorAll('.dossier-section');
        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => observer.observe(section));
    };

    // Initialize on dossier page
    initScrollAnimations();

    // Check unlocked sections on load
    Object.keys(sectionPasswords).forEach(section => {
        if (isSectionUnlocked(section)) {
            showSection(section);
        }
    });
});