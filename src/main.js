import './style.css';
import { loadSlim } from 'tsparticles-slim';

// =========================================
// Configuration
// =========================================
const CONFIG = {
    targetName: 'IYYAN ANUGRAH',
    scrambleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*',
    telegramWorkerUrl: 'https://portfolio-telegram-notifier.galbatorix.workers.dev/',
    bootMessages: [
        { text: '> Initializing system...', type: 'info', delay: 100 },
        { text: '> Loading kernel modules...', type: 'success', delay: 200 },
        { text: '> [OK] Network interface eth0 UP', type: 'success', delay: 150 },
        { text: '> [OK] Mounting filesystems...', type: 'success', delay: 100 },
        { text: '> Starting security services...', type: 'info', delay: 180 },
        { text: '> [OK] Firewall rules applied', type: 'success', delay: 120 },
        { text: '> [OK] SSH daemon started', type: 'success', delay: 100 },
        { text: '> Connecting to remote servers...', type: 'info', delay: 250 },
        { text: '> [OK] Connection established: 192.168.1.1', type: 'success', delay: 80 },
        { text: '> [OK] Connection established: 10.0.0.42', type: 'success', delay: 80 },
        { text: '> [OK] Connection established: 172.16.0.100', type: 'success', delay: 80 },
        { text: '> Scanning network topology...', type: 'info', delay: 200 },
        { text: '> [OK] 24 nodes discovered', type: 'success', delay: 150 },
        { text: '> ....', type: 'success', delay: 100 },
        { text: '> ....', type: 'success', delay: 100 },
        { text: '\n> Loading user profile...', type: 'info', delay: 180 },
        { text: '> [OK] Profile: IYYAN ANUGRAH', type: 'success', delay: 100 },
        { text: '> [OK] Access level: ADMINISTRATOR', type: 'warning', delay: 120 },
        { text: '> Rendering portfolio interface...', type: 'info', delay: 200 },
        { text: '> [OK] All systems operational', type: 'success', delay: 150 },
        { text: '\n> Welcome, VISITOR.', type: 'success', delay: 300 },
    ]
};

// =========================================
// Visitor Data Tracking
// =========================================
const visitorData = {
    ip: null,
    country: null,
    city: null,
    isp: null,
    isProxy: false,
    userAgent: navigator.userAgent,
    startTime: Date.now(),
    reported: false
};

// =========================================
// Scramble Text Effect (Sequential Reveal)
// =========================================
class TextScrambler {
    constructor(element, customChars = null) {
        this.element = element;
        this.chars = customChars || CONFIG.scrambleChars;
        this.frameRequest = null;
        this.resolve = null;
    }

    setText(newText, framesPerChar = 8, scrambleFrames = 6) {
        const length = newText.length;

        this.queue = [];
        for (let i = 0; i < length; i++) {
            this.queue.push({
                target: newText[i],
                revealFrame: scrambleFrames + (i * framesPerChar),
                currentChar: this.chars[Math.floor(Math.random() * this.chars.length)],
                locked: false
            });
        }

        this.totalFrames = scrambleFrames + (length * framesPerChar);
        this.frame = 0;

        cancelAnimationFrame(this.frameRequest);

        return new Promise(resolve => {
            this.resolve = resolve;
            this.update();
        });
    }

    update() {
        let output = '';
        let allLocked = true;

        for (let i = 0; i < this.queue.length; i++) {
            const item = this.queue[i];

            if (this.frame >= item.revealFrame) {
                item.locked = true;
                output += item.target;
            } else {
                allLocked = false;
                if (Math.random() < 0.4) {
                    item.currentChar = this.chars[Math.floor(Math.random() * this.chars.length)];
                }
                output += item.currentChar;
            }
        }

        this.element.textContent = output;

        if (allLocked) {
            if (this.resolve) this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(() => this.update());
            this.frame++;
        }
    }
}

// =========================================
// Looping Typewriter Effect
// =========================================
class LoopingTypewriter {
    constructor(element, text, options = {}) {
        this.element = element;
        this.text = text;
        this.typeSpeed = options.typeSpeed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.running = false;
    }

    async start() {
        if (this.running) return;
        this.running = true;

        while (this.running) {
            // Type out
            for (let i = 0; i <= this.text.length; i++) {
                if (!this.running) return;
                this.element.textContent = this.text.substring(0, i);
                await this.sleep(this.typeSpeed);
            }

            // Pause
            await this.sleep(this.pauseTime);

            // Delete
            for (let i = this.text.length; i >= 0; i--) {
                if (!this.running) return;
                this.element.textContent = this.text.substring(0, i);
                await this.sleep(this.deleteSpeed);
            }

            // Small pause before restart
            await this.sleep(500);
        }
    }

    stop() {
        this.running = false;
    }

    sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
}

// =========================================
// Network Canvas Animation
// =========================================
const initNetworkCanvas = (canvas) => {
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    let animationId;

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };

    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 65, 0.6)';
            ctx.fill();
        }
    }

    const init = () => {
        resize();
        nodes = [];
        for (let i = 0; i < 50; i++) {
            nodes.push(new Node());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(0, 255, 65, ${0.3 - dist / 500})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    init();
    animate();

    return () => cancelAnimationFrame(animationId);
};

// =========================================
// Boot Sequence Animation
// =========================================
const runBootSequence = async (outputElement) => {
    for (const msg of CONFIG.bootMessages) {
        const line = document.createElement('div');
        line.className = msg.type;
        line.textContent = msg.text;
        outputElement.appendChild(line);
        outputElement.scrollTop = outputElement.scrollHeight;
        await new Promise(r => setTimeout(r, msg.delay));
    }
};

// =========================================
// IP Detection & Visitor Tracking
// =========================================
const initVisitorTracking = async () => {
    const ipDisplay = document.getElementById('visitor-ip');

    try {
        // Use ipapi.co for IP + geolocation + proxy detection
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        visitorData.ip = data.ip;
        visitorData.country = data.country_name;
        visitorData.city = data.city;
        visitorData.isp = data.org;
        visitorData.isProxy = data.proxy === true || data.hosting === true;

        if (ipDisplay) {
            ipDisplay.textContent = data.ip;
        }
    } catch (error) {
        // Fallback to simple IP
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            visitorData.ip = data.ip;
            if (ipDisplay) {
                ipDisplay.textContent = data.ip;
            }
        } catch (e) {
            if (ipDisplay) {
                ipDisplay.textContent = 'Unknown';
            }
        }
    }
};

// =========================================
// Send Telegram Notification
// =========================================
const sendTelegramNotification = async () => {
    if (visitorData.reported || !CONFIG.telegramWorkerUrl) return;

    const timeSpent = Date.now() - visitorData.startTime;
    const hours = Math.floor(timeSpent / 3600000).toString().padStart(2, '0');
    const minutes = Math.floor((timeSpent % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((timeSpent % 60000) / 1000).toString().padStart(2, '0');

    const message = `🌐 Portfolio Visitor Report:
━━━━━━━━━━━━━━━━
📍 IP: ${visitorData.ip || 'Unknown'}
🌍 Country: ${visitorData.country || 'Unknown'}
🏙️ City: ${visitorData.city || 'Unknown'}
🏢 ISP: ${visitorData.isp || 'Unknown'}
🌐 Browser: ${getBrowserName()}
🔒 VPN/Proxy: ${visitorData.isProxy ? '✅ Yes' : '❌ No'}
⏱️ Time Spent: ${hours}:${minutes}:${seconds}
━━━━━━━━━━━━━━━━`;

    try {
        await fetch(CONFIG.telegramWorkerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        visitorData.reported = true;
    } catch (e) {
        console.log('Notification failed:', e);
    }
};

const getBrowserName = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Opera')) return 'Opera';
    return 'Unknown';
};

// =========================================
// Intro Overlay Controller
// =========================================
const initIntroOverlay = () => {
    const overlay = document.getElementById('intro-overlay');
    const enterBtn = document.getElementById('enter-btn');
    const scrambleName = document.getElementById('scramble-name');
    const bootSequence = document.getElementById('boot-sequence');
    const bootOutput = document.getElementById('boot-output');
    const networkCanvas = document.getElementById('network-canvas');
    const introScreen = document.querySelector('.intro-screen');

    if (!overlay || !enterBtn || !scrambleName) return;

    const scrambler = new TextScrambler(scrambleName);

    let scrambleInterval;
    const startScramble = async () => {
        await scrambler.setText(CONFIG.targetName);
        scrambleInterval = setInterval(async () => {
            await scrambler.setText(CONFIG.targetName);
        }, 3000);
    };
    startScramble();

    const handleEnter = async () => {
        enterBtn.disabled = true;
        clearInterval(scrambleInterval);

        introScreen.style.display = 'none';
        bootSequence.classList.add('active');

        initNetworkCanvas(networkCanvas);
        await runBootSequence(bootOutput);
        await new Promise(r => setTimeout(r, 800));

        overlay.classList.add('hidden');
        document.body.classList.add('loaded');

        initMainSite();
    };

    enterBtn.addEventListener('click', handleEnter);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !overlay.classList.contains('hidden')) {
            handleEnter();
        }
    });
};

// =========================================
// Hero Name Scramble (Looping)
// =========================================
const initHeroScramble = () => {
    const heroName = document.querySelector('.hero__name');
    if (!heroName) return;

    const targetText = CONFIG.targetName;
    const cursor = heroName.querySelector('.cursor');
    const scrambler = new TextScrambler(heroName);

    const runScrambleLoop = async () => {
        heroName.textContent = '';
        if (cursor) heroName.appendChild(cursor.cloneNode());

        await new Promise(r => setTimeout(r, 500));
        await scrambler.setText(targetText);

        const newCursor = document.createElement('span');
        newCursor.className = 'cursor';
        heroName.appendChild(newCursor);

        setInterval(async () => {
            heroName.classList.add('scrambling');
            const cursorEl = heroName.querySelector('.cursor');
            if (cursorEl) cursorEl.remove();

            await scrambler.setText(targetText);

            const newCursorEl = document.createElement('span');
            newCursorEl.className = 'cursor';
            heroName.appendChild(newCursorEl);

            heroName.classList.remove('scrambling');
        }, 8000);
    };

    runScrambleLoop();
};

// =========================================
// Section Title Looping Typewriter
// =========================================
const initSectionTitleTypewriters = () => {
    const titles = document.querySelectorAll('h2.section__title');

    titles.forEach(title => {
        const originalText = title.textContent;
        const typewriter = new LoopingTypewriter(title, originalText, {
            typeSpeed: 80,
            deleteSpeed: 40,
            pauseTime: 3000
        });
        typewriter.start();
    });
};

// =========================================
// One-Time Scroll Scramble Effects
// =========================================
const initScrollScrambleEffects = () => {
    const scrambleableElements = [
        ...document.querySelectorAll('.terminal-window__body p'),
        ...document.querySelectorAll('.log-entry__content h3'),
        ...document.querySelectorAll('.log-entry__list li'),
        ...document.querySelectorAll('.process-card__title'),
        ...document.querySelectorAll('.process-card__desc')
    ];

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.scrambled) {
                entry.target.dataset.scrambled = 'true';
                const originalText = entry.target.textContent;
                const scrambler = new TextScrambler(entry.target);
                scrambler.setText(originalText, 0.5, 0.5);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    scrambleableElements.forEach(el => observer.observe(el));
};

// =========================================
// Contact Links Sequential Scramble
// =========================================
const initContactLinksScramble = () => {
    const contactLinks = document.querySelectorAll('.contact-actions a');
    if (contactLinks.length === 0) return;

    // Store original text and create scramblers for each link
    const items = Array.from(contactLinks).map(link => ({
        element: link,
        originalText: link.textContent.trim(),
        scrambler: new TextScrambler(link)
    }));

    let currentIndex = 0;

    const scrambleNext = async () => {
        const item = items[currentIndex];
        await item.scrambler.setText(item.originalText, 3, 2);

        // Move to next button
        currentIndex = (currentIndex + 1) % items.length;

        // Wait before scrambling the next one
        setTimeout(scrambleNext, 3000);
    };

    // Start after initial delay
    setTimeout(scrambleNext, 5000);
};

// =========================================
// Hero Actions Looping Scramble
// =========================================
const initHeroActionsScramble = () => {
    const contactLinks = document.querySelectorAll('.hero__actions a');

    contactLinks.forEach(link => {
        const originalText = link.textContent.trim();
        const scrambler = new TextScrambler(link);

        const scrambleLoop = async () => {
            await scrambler.setText(originalText, 4, 2);
            setTimeout(scrambleLoop, 9000);
        };

        // Start after a delay
        setTimeout(scrambleLoop, 6000);
    });
};

// =========================================
// Main Site Initialization
// =========================================
const initMainSite = () => {
    initUptime();
    initVisitorTracking();
    initHeroScramble();
    initSectionTitleTypewriters();
    initScrollScrambleEffects();
    initContactLinksScramble();
    initHeroActionsScramble();
    initNavHighlight();
    initSmoothScroll();
    initScrollAnimations();
    initMobileNav();
};

// --- Mobile Nav Toggle ---
const initMobileNav = () => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('open');
        // Toggle icon between bars and X
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('open');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
};

// --- Uptime Counter ---
const initUptime = () => {
    const uptimeDisplay = document.getElementById('uptime-display');
    if (!uptimeDisplay) return;

    const startTime = Date.now();

    const updateUptime = () => {
        const elapsed = Date.now() - startTime;
        const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
        uptimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    };

    updateUptime();
    setInterval(updateUptime, 1000);
};

// --- Active Nav Link Highlighting ---
const initNavHighlight = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.status-bar__nav a');

    const highlightNav = () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNav);
    highlightNav();
};

// --- Smooth Scroll for Nav ---
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// --- Intersection Observer for Fade-In Animations ---
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.terminal-window, .log-entry, .process-card, .skill-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
};

// Add visible state styles
const addVisibleStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
};

// =========================================
// Page Unload - Send Telegram Report
// =========================================
window.addEventListener('beforeunload', () => {
    if (CONFIG.telegramWorkerUrl) {
        sendTelegramNotification();
    }
});

// Also send after 30 seconds of visit (in case they close tab quickly)
setTimeout(() => {
    if (CONFIG.telegramWorkerUrl && !visitorData.reported) {
        sendTelegramNotification();
    }
}, 30000);

// =========================================
// Particles Background (Mobile Optimized)
// =========================================
const initParticles = async () => {
    const isMobile = window.innerWidth < 768;

    // Import tsParticles engine
    const { tsParticles } = await import('tsparticles-engine');

    // Load slim preset
    await loadSlim(tsParticles);

    await tsParticles.load('tsparticles', {
        fpsLimit: 60,
        interactivity: {
            detectsOn: 'window',
            events: {
                onHover: {
                    enable: true,
                    mode: 'grab'
                },
                onClick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 200,
                    links: {
                        opacity: 0.5
                    }
                },
                push: {
                    quantity: 4
                }
            }
        },
        particles: {
            number: {
                value: isMobile ? 20 : 50,
                density: {
                    enable: true,
                    area: 800
                }
            },
            color: {
                value: '#00ff41'
            },
            links: {
                enable: true,
                color: '#00ff41',
                distance: 150,
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: isMobile ? 0.5 : 1,
                direction: 'none',
                random: true,
                straight: false,
                outModes: 'bounce',
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            },
            opacity: {
                value: 0.3
            },
            size: {
                value: { min: 1, max: 3 }
            }
        },
        detectRetina: true,
        background: {
            color: 'transparent'
        }
    });
};

// =========================================
// Initialize
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    addVisibleStyles();
    initParticles();
    initIntroOverlay();
});
