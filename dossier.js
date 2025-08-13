document.addEventListener('DOMContentLoaded', () => {
    // Só executa se estiver na página do dossiê
    if (!document.querySelector('.dossier-container')) {
        return;
    }

    // Adiciona uma classe ao body para estilização específica das partículas
    document.body.classList.add('dossier-page');

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
        modalTitle.textContent = '🔐 Acesso Restrito';
        modalSubtitle.textContent = `Digite a senha para: ${sectionTitle}`;
        modal.classList.add('active');
        passwordInput.focus();
    };

    const closeModal = () => {
        modal.classList.remove('active');
        passwordInput.value = '';
        passwordInput.classList.remove('shake');
        currentSection = null;
    };

    const showSection = (section) => {
        const lockedDiv = document.getElementById(`${section}-locked`);
        const unlockedDiv = document.getElementById(`${section}-unlocked`);
        const button = document.querySelector(`[data-section="${section}"]`);

        if(lockedDiv) lockedDiv.style.display = 'none';
        if(unlockedDiv) unlockedDiv.classList.add('visible');
        
        if(button) {
            button.classList.add('unlocked');
            button.innerHTML = '✅ Desbloqueado';
            button.disabled = true; // Desabilita o botão
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
        const password = passwordInput.value.toLowerCase().trim();

        if (masterPasswords.includes(password)) {
            localStorage.setItem('masterAccess', 'true');
            showAllSections();
            closeModal();
            return;
        }

        if (currentSection && sectionPasswords[currentSection] === password) {
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

    if(passwordForm) passwordForm.addEventListener('submit', checkPassword);
    if(closeModalButton) closeModalButton.addEventListener('click', closeModal);
    if(modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // Animações de Scroll
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

    // Atualizar Data/Hora e Citações
    const updateTimestampsAndQuotes = () => {
        const lastUpdated = document.getElementById('last-updated');
        const lastUpdateDisplay = document.getElementById('last-update-display');
        const footerQuote = document.getElementById('footer-quote');

        const quotes = [
            "O conhecimento é poder. E eu conheço você melhor que você mesma.",
            "A verdadeira intimidade requer vigilância constante.",
            "Eu não sou obsessivo. Eu sou dedicado.",
            "Seus segredos estão seguros comigo. Todos eles.",
            "Eu seria capaz de qualquer coisa por você. Lembre-se disso."
        ];

        const update = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const dateString = now.toLocaleDateString('pt-BR');
            const fullTimestamp = `${dateString} às ${timeString}`;
            
            if(lastUpdated) lastUpdated.textContent = fullTimestamp;
            if(lastUpdateDisplay) lastUpdateDisplay.textContent = fullTimestamp;
        };

        const updateQuote = () => {
            if(footerQuote) {
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                footerQuote.textContent = `"${randomQuote}"`;
            }
        };

        update();
        updateQuote();
        setInterval(update, 1000);
        setInterval(updateQuote, 45000);
    };

    // Inicialização na página do dossiê
    initScrollAnimations();
    updateTimestampsAndQuotes();

    // Verifica ao carregar a página quais seções já estão desbloqueadas
    Object.keys(sectionPasswords).forEach(section => {
        if (isSectionUnlocked(section)) {
            showSection(section);
        }
    });
});