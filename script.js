class BreathingSpace {
    constructor() {
        this.container = document.getElementById('parametric-breath');
        if (!this.container) return;
        
        this.points = [];
        this.mouse = { x: 0.5, y: 0.5 };
        this.time = 0;
        
        this.init();
    }
    
    init() {
        for (let i = 0; i < 7; i++) {
            const point = document.createElement('div');
            point.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #000;
                border-radius: 50%;
                opacity: 0;
                transition: opacity 2s ease;
            `;
            this.container.appendChild(point);
            this.points.push({
                element: point,
                x: Math.random(),
                y: Math.random(),
                vx: 0,
                vy: 0
            });
            
            setTimeout(() => {
                point.style.opacity = '0.3';
            }, i * 200 + 3000);
        }
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX / window.innerWidth;
            this.mouse.y = e.clientY / window.innerHeight;
        });
        
        this.animate();
    }
    
    animate() {
        this.time += 0.001;
        const rect = this.container.getBoundingClientRect();
        
        this.points.forEach((point, i) => {
            const angle = this.time + (i * Math.PI * 2 / this.points.length);
            const radius = 0.3 + Math.sin(this.time * 2 + i) * 0.1;
            
            const targetX = 0.5 + Math.cos(angle) * radius;
            const targetY = 0.5 + Math.sin(angle) * radius;
            
            point.vx += (targetX - point.x) * 0.02;
            point.vy += (targetY - point.y) * 0.02;
            
            point.vx *= 0.95;
            point.vy *= 0.95;
            
            point.x += point.vx;
            point.y += point.vy;
            
            const mouseDistance = Math.sqrt(
                Math.pow(point.x - this.mouse.x, 2) + 
                Math.pow(point.y - this.mouse.y, 2)
            );
            
            if (mouseDistance < 0.1) {
                const angle = Math.atan2(point.y - this.mouse.y, point.x - this.mouse.x);
                point.vx += Math.cos(angle) * 0.02;
                point.vy += Math.sin(angle) * 0.02;
            }
            
            point.element.style.left = (point.x * rect.width) + 'px';
            point.element.style.top = (point.y * rect.height) + 'px';
            
            const size = 2 + Math.sin(this.time * 3 + i) * 1;
            point.element.style.width = size + 'px';
            point.element.style.height = size + 'px';
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

class EphemeralLines {
    constructor() {
        this.silence = document.getElementById('silence-space');
        if (!this.silence) return;
        
        this.lines = [];
        this.init();
    }
    
    init() {
        for (let i = 0; i < 3; i++) {
            const line = document.createElement('div');
            line.style.cssText = `
                position: absolute;
                height: 1px;
                background: #000;
                opacity: 0.05;
                transform-origin: left center;
                pointer-events: none;
            `;
            this.silence.appendChild(line);
            this.lines.push({
                element: line,
                progress: 0,
                delay: i * 0.3
            });
        }
        
        this.animate();
    }
    
    animate() {
        this.lines.forEach((line, i) => {
            line.progress += 0.002;
            
            if (line.progress > line.delay && line.progress < line.delay + 1) {
                const progress = (line.progress - line.delay);
                const width = Math.sin(progress * Math.PI) * 80;
                const x = 10 + (progress * 80);
                const y = 50 + Math.sin(progress * Math.PI * 2 + i) * 20;
                
                line.element.style.width = width + '%';
                line.element.style.left = x + '%';
                line.element.style.top = y + '%';
                line.element.style.transform = `rotate(${Math.sin(progress * Math.PI) * 5}deg)`;
            }
            
            if (line.progress > line.delay + 1.5) {
                line.progress = 0;
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

class WormholeViz {
    constructor(canvas, type) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.type = type;
        this.particles = [];
        this.time = 0;
        this.mouse = { x: 0.5, y: 0.5 };
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.width = rect.width;
        this.height = rect.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
    }
    
    createParticles() {
        const count = this.type === 'less' ? 800 : this.type === 'clear' ? 1200 : 1600;
        this.particles = [];
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                angle: (i / count) * Math.PI * 2,
                radius: Math.random() * 80 + 20,
                originalRadius: Math.random() * 80 + 20,
                depth: Math.random(),
                speed: 0.001 + Math.random() * 0.002,
                alpha: 0.1 + Math.random() * 0.3
            });
        }
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) / rect.width;
            this.mouse.y = (e.clientY - rect.top) / rect.height;
        });
        
        window.addEventListener('resize', () => this.resize());
    }
    
    animate() {
        this.time += 0.005;
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Create vortex effect
        this.particles.forEach((particle, i) => {
            // Spiral motion with depth
            const spiralFactor = this.type === 'less' ? 2 : this.type === 'clear' ? 3 : 4;
            const depthInfluence = particle.depth * 0.5 + 0.5;
            
            // Mouse interaction
            const mouseInfluence = 1 + (this.mouse.x - 0.5) * 0.2;
            
            // Calculate position
            const radius = particle.originalRadius * depthInfluence * mouseInfluence;
            const angle = particle.angle + this.time * spiralFactor * particle.speed;
            
            const x = this.centerX + Math.cos(angle) * radius * (1 - particle.depth * 0.3);
            const y = this.centerY + Math.sin(angle) * radius * (1 - particle.depth * 0.3);
            
            // Size based on depth and type
            let size = (1 - particle.depth) * 2;
            if (this.type === 'clear') size *= 0.7;
            if (this.type === 'less') size *= 0.5;
            
            // Alpha based on depth and breathing
            const breathe = Math.sin(this.time * 2 + i * 0.1) * 0.1 + 0.9;
            const alpha = particle.alpha * (1 - particle.depth * 0.7) * breathe;
            
            // Draw particle
            this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Update particle
            particle.radius += particle.speed;
            if (particle.radius > 100) {
                particle.radius = 10;
                particle.angle = Math.random() * Math.PI * 2;
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BreathingSpace();
    // Removed EphemeralLines - keeping static separator line only
    
    // Initialize wormhole visualizations
    setTimeout(() => {
        const lessCanvas = document.getElementById('wormhole-less');
        const clearCanvas = document.getElementById('wormhole-clear');
        const foreverCanvas = document.getElementById('wormhole-forever');
        
        if (lessCanvas) new WormholeViz(lessCanvas, 'less');
        if (clearCanvas) new WormholeViz(clearCanvas, 'clear');
        if (foreverCanvas) new WormholeViz(foreverCanvas, 'forever');
    }, 2000); // Start after other animations
    
    let scrollY = 0;
    let targetScrollY = 0;
    
    document.addEventListener('wheel', (e) => {
        targetScrollY += e.deltaY * 0.5;
        targetScrollY = Math.max(0, Math.min(targetScrollY, document.body.scrollHeight - window.innerHeight));
    });
    
    function smoothScroll() {
        scrollY += (targetScrollY - scrollY) * 0.1;
        window.scrollTo(0, scrollY);
        
        const parallaxElements = document.querySelectorAll('.thought, .truth, .conversation-fragment, .final-thought');
        parallaxElements.forEach((el, i) => {
            const speed = 0.5 + (i * 0.1);
            el.style.transform = `translateY(${scrollY * speed * 0.1}px)`;
        });
        
        requestAnimationFrame(smoothScroll);
    }
    
    smoothScroll();
    
    const workVoids = document.querySelectorAll('.work-void');
    workVoids.forEach((void_, i) => {
        void_.addEventListener('mouseenter', function() {
            this.style.transform = `scale(${1 / 1.618})`;
        });
        void_.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Conversation link now points to conversation.html
});