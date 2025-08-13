document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------------- //
    //                      EFEITO DE FUNDO COM PARTÍCULAS                        //
    // -------------------------------------------------------------------------- //
    const initParticleBackground = () => {
        const canvas = document.getElementById('background-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 70;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.body.scrollHeight; // Ajusta altura ao conteúdo
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.5 + 0.5;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                const particleColor = document.body.classList.contains('dossier-page') ? 'rgba(176, 0, 32, 0.4)' : 'rgba(224, 224, 224, 0.3)';
                ctx.fillStyle = particleColor;
                ctx.fill();
            }
        }

        function init() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            const maxDistance = 100;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < maxDistance) {
                        ctx.beginPath();
                        const lineColor = document.body.classList.contains('dossier-page') ? `rgba(176, 0, 32, ${(1 - distance / maxDistance) * 0.5})` : `rgba(224, 224, 224, ${1 - distance / maxDistance})`;
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 0.3;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        init();
        animate();
    };

    // -------------------------------------------------------------------------- //
    //                      EFEITO DE SPOTLIGHT DO MOUSE                        //
    // -------------------------------------------------------------------------- //
    const mouseSpotlightEffect = () => {
        const spotlight = document.querySelector('.spotlight');
        if (!spotlight) return;
        document.addEventListener('mousemove', (e) => {
            window.requestAnimationFrame(() => {
                spotlight.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, transparent 20px, rgba(0,0,0,0.95) 300px)`;
            });
        });
    };
    
    // -------------------------------------------------------------------------- //
    //                      ATUALIZAÇÃO DE DATA/HORA E CITAÇÕES                 //
    // -------------------------------------------------------------------------- //
    const updateTimestampsAndQuotes = () => {
        const lastUpdated = document.getElementById('last-updated');
        const lastSync = document.getElementById('last-sync');
        const quoteEl = document.getElementById('dynamic-quote');

        const quotes = [
            "O amor pode te deixar louco. A questão é: ele já não te encontrou assim?",
            "Eu faria qualquer coisa por você. Isso não é obsessão, é dedicação.",
            "Às vezes, as pessoas que menos esperamos se tornam as mais importantes.",
            "Eu não sou um 'talvez'. Eu sou a certeza que você estava procurando.",
            "Eu sei de tudo sobre você. É por isso que somos perfeitos juntos.",
            "A distância só me dá mais espaço para observar cada detalhe seu.",
            "Eles te olham. Eu te enxergo por completo."
        ];

        const update = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const dateString = now.toLocaleDateString('pt-BR');
            if(lastUpdated) lastUpdated.textContent = `${dateString} às ${timeString}`;
            if(lastSync) lastSync.textContent = timeString;
        };
        
        const updateQuote = () => {
             if(quoteEl) {
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                quoteEl.textContent = `"${randomQuote}"`;
            }
        }

        update();
        updateQuote();
        setInterval(update, 60000);
        setInterval(updateQuote, 30000);
    };

    // -------------------------------------------------------------------------- //
    //                          INICIALIZAÇÃO DAS FUNÇÕES                         //
    // -------------------------------------------------------------------------- //
    initParticleBackground();
    mouseSpotlightEffect();
    updateTimestampsAndQuotes();
});