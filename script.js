// ====================== SCRIPT.JS - AgroMIP ======================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c AgroMIP carregado com sucesso!', 'color: #2e7d32; font-weight: bold');

    // ==================== TEMA (Dark/Light) ====================
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    function toggleTheme() {
        if (body.classList.contains('light')) {
            body.classList.remove('light');
            body.setAttribute('data-theme', 'dark');
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.add('light');
            body.removeAttribute('data-theme');
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    }

    // Carregar tema salvo
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.remove('light');
        body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
    }

    themeToggle.addEventListener('click', toggleTheme);

    // ==================== SAUDAÇÃO PERSONALIZADA ====================
    const greeting = document.getElementById('greeting');
    const nameInput = document.getElementById('user-name-input');
    const saveNameBtn = document.getElementById('save-name-btn');
    const nameBar = document.getElementById('name-bar');

    function loadUserName() {
        const savedName = localStorage.getItem('userName');
        if (savedName) {
            greeting.textContent = `Olá, ${savedName}! 🌱`;
            nameBar.style.display = 'none';
        } else {
            greeting.textContent = 'Olá, visitante! 👋';
        }
    }

    saveNameBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (name) {
            localStorage.setItem('userName', name);
            greeting.textContent = `Olá, ${name}! 🌱`;
            nameBar.style.display = 'none';
        }
    });

    loadUserName();

    // ==================== MENU MOBILE ====================
    const menuButton = document.getElementById('menu-button');
    const mainNav = document.getElementById('main-nav');

    menuButton.addEventListener('click', () => {
        const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');
    });

    // ==================== GALERIA - FILTROS E LIGHTBOX ====================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            galleryCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Zoom das imagens
    document.querySelectorAll('.zoom-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const img = btn.previousElementSibling;
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt;
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.hidden = true;
        document.body.style.overflow = 'visible';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.hidden = true;
            document.body.style.overflow = 'visible';
        }
    });

    // ==================== MATRIZ DE DECISÃO ====================
    const decisionForm = document.getElementById('decision-form');
    const decisionTitle = document.getElementById('decision-title');
    const decisionText = document.getElementById('decision-text');
    const decisionList = document.getElementById('decision-list');

    decisionForm.addEventListener('change', updateDecision);

    function updateDecision() {
        const crop = document.getElementById('crop-select').value;
        const pressure = document.getElementById('pressure-select').value;
        const natural = document.getElementById('natural-select').value;

        if (pressure === 'baixa' && natural === 'presentes') {
            decisionTitle.textContent = 'Monitorar';
            decisionText.textContent = 'Excelente! Inimigos naturais estão atuando. Continue o monitoramento.';
            decisionList.innerHTML = `<li>Registrar observações</li><li>Reavaliar em 5-7 dias</li>`;
        } else if (pressure === 'moderada') {
            decisionTitle.textContent = 'Ação Moderada';
            decisionText.textContent = 'Considerar controle biológico ou cultural antes de químico.';
        } else {
            decisionTitle.textContent = 'Atenção Alta';
            decisionText.textContent = 'Nível de ação atingido. Avaliar opções de controle com critério.';
        }
    }

    // ==================== GLOSSÁRIO BUSCA ====================
    const glossarySearch = document.getElementById('glossary-search');
    const glossaryArticles = document.querySelectorAll('.glossary-grid article');
    const emptyState = document.getElementById('glossary-empty');

    glossarySearch.addEventListener('input', () => {
        const term = glossarySearch.value.toLowerCase().trim();
        
        let found = false;
        glossaryArticles.forEach(article => {
            const keywords = article.getAttribute('data-keywords') || '';
            if (keywords.includes(term) || article.textContent.toLowerCase().includes(term)) {
                article.style.display = 'block';
                found = true;
            } else {
                article.style.display = 'none';
            }
        });

        emptyState.hidden = found;
    });

    // ==================== CHECKLIST PROGRESSO ====================
    const checkboxes = document.querySelectorAll('.checklist-box input[type="checkbox"]');
    const progressText = document.getElementById('check-progress');
    const progressBar = document.getElementById('progress-bar');
    const checkMessage = document.getElementById('check-message');

    function updateProgress() {
        const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
        const total = checkboxes.length;
        
        progressText.textContent = `${checked} de ${total} itens`;
        progressBar.style.width = `${(checked / total) * 100}%`;

        if (checked === total) {
            checkMessage.textContent = '✅ Checklist completo! Você está pronto para tomar uma boa decisão.';
            checkMessage.style.color = 'var(--success)';
        }
    }

    checkboxes.forEach(cb => cb.addEventListener('change', updateProgress));

    // Copiar checklist
    document.getElementById('copy-checklist').addEventListener('click', () => {
        const checkedItems = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.parentElement.textContent.trim());
        
        navigator.clipboard.writeText('Checklist AgroMIP:\n' + checkedItems.join('\n'));
        alert('✅ Checklist copiado para a área de transferência!');
    });

    // ==================== SCROLL REVEAL (animações) ====================
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));

    // ==================== TECLA ESC PARA FECHAR LIGHTBOX ====================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.hidden) {
            lightbox.hidden = true;
            document.body.style.overflow = 'visible';
        }
    });
});