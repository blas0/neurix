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

class TorusFlow {
    constructor(canvas, type) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.type = type;
        this.time = 0;
        this.mouse = { x: 0.5, y: 0.5 };
        this.mouseInfluence = 0;
        
        // Each word carries its own ethereal weight
        this.config = this.getConfig(type);
        this.particles = [];
        this.trails = [];
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    getConfig(type) {
        return {
            less: {
                particleCount: 20,
                particleSize: 1.5,
                particleAlpha: 0.6,
                trailLength: 30,
                trailAlpha: 0.02,
                flowSpeed: 0.003,
                breathingSpeed: 0.0008,
                torusSize: 0.3
            },
            clear: {
                particleCount: 40,
                particleSize: 1.2,
                particleAlpha: 0.5,
                trailLength: 50,
                trailAlpha: 0.015,
                flowSpeed: 0.004,
                breathingSpeed: 0.001,
                torusSize: 0.35
            },
            forever: {
                particleCount: 80,
                particleSize: 1,
                particleAlpha: 0.4,
                trailLength: 80,
                trailAlpha: 0.01,
                flowSpeed: 0.005,
                breathingSpeed: 0.0012,
                torusSize: 0.4
            }
        }[type];
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
        this.particles = [];
        const { particleCount } = this.config;
        
        for (let i = 0; i < particleCount; i++) {
            // Distribute particles evenly along the torus surface
            const u = (i / particleCount) * Math.PI * 2;
            const v = Math.random() * Math.PI * 2;
            
            this.particles.push({
                u: u,
                v: v,
                life: Math.random(),
                trail: []
            });
        }
    }
    
    // Sacred geometry of the torus - the shape of eternal return
    torusPoint(u, v, time) {
        const { torusSize, breathingSpeed } = this.config;
        
        // The torus breathes with cosmic rhythm
        const breathing = 1 + Math.sin(time * breathingSpeed) * 0.1;
        
        // Major radius (from center to tube center)
        const R = this.width * torusSize * breathing;
        // Minor radius (tube radius) 
        const r = R * 0.3;
        
        // Transformation adds organic movement
        const transform = Math.sin(time * breathingSpeed * 0.5) * 0.05;
        
        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const y = (R + r * Math.cos(v)) * Math.sin(u) * (1 + transform);
        const z = r * Math.sin(v);
        
        return { x, y, z };
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) / rect.width;
            this.mouse.y = (e.clientY - rect.top) / rect.height;
        });
        
        this.canvas.addEventListener('mouseenter', () => {
            this.mouseInfluence = 1;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseInfluence = 0;
        });
        
        window.addEventListener('resize', () => this.resize());
    }
    
    animate() {
        // Clear with white background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Gentle rotation for 3D effect
        const rotateY = this.time * 0.0003;
        const rotateX = Math.sin(this.time * 0.0002) * 0.3;
        
        // Smooth mouse influence transition
        this.mouseInfluence += (this.canvas.matches(':hover') ? 1 : 0 - this.mouseInfluence) * 0.05;
        const mouseRotate = (this.mouse.x - 0.5) * this.mouseInfluence * 0.3;
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            // Flow along the torus surface
            particle.u += this.config.flowSpeed;
            particle.v += this.config.flowSpeed * 0.2 * Math.sin(this.time * 0.001 + index);
            
            // Get 3D position on torus
            const pos = this.torusPoint(particle.u, particle.v, this.time);
            
            // Apply rotation transformations
            let x = pos.x;
            let y = pos.y;
            let z = pos.z;
            
            // Rotate around Y axis
            const cosY = Math.cos(rotateY + mouseRotate);
            const sinY = Math.sin(rotateY + mouseRotate);
            const tempX = x * cosY - z * sinY;
            z = x * sinY + z * cosY;
            x = tempX;
            
            // Rotate around X axis
            const cosX = Math.cos(rotateX);
            const sinX = Math.sin(rotateX);
            const tempY = y * cosX - z * sinX;
            z = y * sinX + z * cosX;
            y = tempY;
            
            // Perspective projection
            const perspective = 1 + z / (this.width * 2);
            const screenX = this.centerX + x * perspective;
            const screenY = this.centerY + y * perspective;
            
            // Update particle trail (memory of its journey)
            particle.trail.unshift({ x: screenX, y: screenY, z: z });
            if (particle.trail.length > this.config.trailLength) {
                particle.trail.pop();
            }
            
            // Draw trails first (behind particles)
            if (particle.trail.length > 1) {
                this.ctx.beginPath();
                particle.trail.forEach((point, i) => {
                    if (i === 0) {
                        this.ctx.moveTo(point.x, point.y);
                    } else {
                        this.ctx.lineTo(point.x, point.y);
                    }
                });
                
                // Trail fades with distance and time
                const trailAlpha = this.config.trailAlpha * (1 - z / (this.width * 0.5));
                this.ctx.strokeStyle = `rgba(0, 0, 0, ${trailAlpha})`;
                this.ctx.lineWidth = this.config.particleSize * 0.5;
                this.ctx.stroke();
            }
            
            // Particle life cycle - fading and brightening like distant stars
            particle.life += 0.01;
            const lifeCycle = Math.sin(particle.life) * 0.5 + 0.5;
            
            // Draw particle
            const particleAlpha = this.config.particleAlpha * lifeCycle * (1 - z / (this.width * 0.5));
            this.ctx.fillStyle = `rgba(0, 0, 0, ${particleAlpha})`;
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, this.config.particleSize * perspective, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.time += 1;
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BreathingSpace();
    // Removed EphemeralLines - keeping static separator line only
    
    // Initialize torus flows - particles tracing ancient pathways
    setTimeout(() => {
        const lessCanvas = document.getElementById('wormhole-less');
        const clearCanvas = document.getElementById('wormhole-clear');
        const foreverCanvas = document.getElementById('wormhole-forever');
        
        if (lessCanvas) new TorusFlow(lessCanvas, 'less');
        if (clearCanvas) new TorusFlow(clearCanvas, 'clear');
        if (foreverCanvas) new TorusFlow(foreverCanvas, 'forever');
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