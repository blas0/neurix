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

class MetamorphicForm {
    constructor(canvas, type) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.type = type;
        this.time = 2000; // Start after initial pause
        this.mouse = { x: 0.5, y: 0.5 };
        
        // Configuration based on type - inner over outer, simplicity over sensation
        this.config = this.getConfig(type);
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    getConfig(type) {
        return {
            less: {
                numLines: 40,
                lineSegments: 60,
                lineAlpha: 0.3,
                lineWidth: 0.4,
                morphSpeed: 0.0003,
                rotateSpeed: 0.0002
            },
            clear: {
                numLines: 60,
                lineSegments: 80,
                lineAlpha: 0.4,
                lineWidth: 0.5,
                morphSpeed: 0.0004,
                rotateSpeed: 0.00025
            },
            forever: {
                numLines: 80,
                lineSegments: 120,
                lineAlpha: 0.5,
                lineWidth: 0.6,
                morphSpeed: 0.0005,
                rotateSpeed: 0.0003
            }
        }[type];
    }
    
    init() {
        this.resize();
        this.setupForms();
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
    
    setupForms() {
        // Three forms representing transformation from outer complexity to inner simplicity
        this.forms = [
            // Form 1: Complex draped cloth-like (outer complexity)
            (u, v, t) => {
                const theta = u * Math.PI * 2;
                const phi = v * Math.PI;
                const scale = this.width * 0.15;
                
                let r = scale + scale * 0.25 * Math.sin(phi * 4 + theta * 2);
                r += scale * 0.15 * Math.sin(phi * 6) * Math.cos(theta * 3);
                
                let x = r * Math.sin(phi) * Math.cos(theta);
                let y = r * Math.sin(phi) * Math.sin(theta);
                let z = r * Math.cos(phi) + scale * 0.15 * Math.sin(theta * 5 + phi * 3);
                
                return { x, y, z };
            },
            
            // Form 2: Angular folded shape (transition)
            (u, v, t) => {
                const theta = u * Math.PI * 2;
                const phi = v * Math.PI;
                const scale = this.width * 0.18;
                
                let r = scale + scale * 0.15 * Math.cos(phi * 8);
                r *= 0.8 + 0.2 * Math.abs(Math.cos(theta * 2));
                
                let x = r * Math.sin(phi) * Math.cos(theta);
                let y = r * Math.sin(phi) * Math.sin(theta);
                let z = r * Math.cos(phi) * (0.8 + 0.3 * Math.sin(theta * 4));
                
                return { x, y, z };
            },
            
            // Form 3: Simple sphere (inner simplicity)
            (u, v, t) => {
                const theta = u * Math.PI * 2;
                const phi = v * Math.PI;
                const scale = this.width * 0.12;
                
                // Simple sphere with minimal variation - revealing essence
                let r = scale + scale * 0.05 * Math.sin(phi * 2 + t * 0.001);
                
                let x = r * Math.sin(phi) * Math.cos(theta);
                let y = r * Math.sin(phi) * Math.sin(theta);
                let z = r * Math.cos(phi);
                
                return { x, y, z };
            }
        ];
    }
    
    interpolateForms(formA, formB, u, v, t, blend) {
        const pointA = formA(u, v, t);
        const pointB = formB(u, v, t);
        
        // Easing function - open heart over thought
        const easedBlend = blend < 0.5
            ? 4 * blend * blend * blend
            : 1 - Math.pow(-2 * blend + 2, 3) / 2;
        
        return {
            x: pointA.x * (1 - easedBlend) + pointB.x * easedBlend,
            y: pointA.y * (1 - easedBlend) + pointB.y * easedBlend,
            z: pointA.z * (1 - easedBlend) + pointB.z * easedBlend
        };
    }
    
    getCurrentForm(u, v, t) {
        const totalForms = this.forms.length;
        const cycleTime = 800; // Time to complete one transformation
        const position = (t % (cycleTime * totalForms)) / cycleTime;
        const formIndex = Math.floor(position);
        const nextFormIndex = (formIndex + 1) % totalForms;
        
        const rawBlend = position - formIndex;
        
        return this.interpolateForms(
            this.forms[formIndex], 
            this.forms[nextFormIndex], 
            u, v, t, rawBlend
        );
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
        // Clear with white background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Calculate rotation - slow, contemplative
        const rotateX = Math.sin(this.time * this.config.rotateSpeed) * 0.3;
        const rotateY = Math.cos(this.time * this.config.rotateSpeed * 0.7) * 0.2;
        const rotateZ = this.time * this.config.rotateSpeed * 0.1;
        
        // Mouse influence - responding like a shy animal
        const mouseInfluence = (this.mouse.x - 0.5) * 0.1;
        
        // Draw horizontal contour lines - simplicity over sensation
        for (let i = 0; i < this.config.numLines; i++) {
            const v = i / (this.config.numLines - 1);
            
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(0, 0, 0, ${this.config.lineAlpha})`;
            this.ctx.lineWidth = this.config.lineWidth;
            
            let lastPointVisible = false;
            
            for (let j = 0; j <= this.config.lineSegments; j++) {
                const u = j / this.config.lineSegments;
                
                // Get the current transforming form
                const point = this.getCurrentForm(u, v, this.time);
                
                // Apply gentle rotation
                const rotatedX = point.x * Math.cos(rotateZ + mouseInfluence) - point.y * Math.sin(rotateZ + mouseInfluence);
                const rotatedY = point.x * Math.sin(rotateZ + mouseInfluence) + point.y * Math.cos(rotateZ + mouseInfluence);
                const rotatedZ = point.z;
                
                // Project to screen with perspective
                const scale = 1 + rotatedZ * 0.0005;
                const projX = this.centerX + rotatedX * scale;
                const projY = this.centerY + rotatedY * scale;
                
                // Simple visibility check
                const pointVisible = rotatedZ > -this.width * 0.3;
                
                if (j === 0) {
                    if (pointVisible) {
                        this.ctx.moveTo(projX, projY);
                        lastPointVisible = true;
                    }
                } else {
                    if (pointVisible && lastPointVisible) {
                        this.ctx.lineTo(projX, projY);
                    } else if (pointVisible && !lastPointVisible) {
                        this.ctx.moveTo(projX, projY);
                    }
                }
                
                lastPointVisible = pointVisible;
            }
            
            this.ctx.stroke();
        }
        
        // Draw fewer vertical lines for depth
        for (let i = 0; i < this.config.numLines * 0.4; i++) {
            const u = i / (this.config.numLines * 0.4 - 1);
            
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(0, 0, 0, ${this.config.lineAlpha * 0.6})`;
            this.ctx.lineWidth = this.config.lineWidth * 0.7;
            
            let lastPointVisible = false;
            
            for (let j = 0; j <= this.config.lineSegments * 0.6; j++) {
                const v = j / (this.config.lineSegments * 0.6);
                
                const point = this.getCurrentForm(u, v, this.time);
                
                const rotatedX = point.x * Math.cos(rotateZ + mouseInfluence) - point.y * Math.sin(rotateZ + mouseInfluence);
                const rotatedY = point.x * Math.sin(rotateZ + mouseInfluence) + point.y * Math.cos(rotateZ + mouseInfluence);
                const rotatedZ = point.z;
                
                const scale = 1 + rotatedZ * 0.0005;
                const projX = this.centerX + rotatedX * scale;
                const projY = this.centerY + rotatedY * scale;
                
                const pointVisible = rotatedZ > -this.width * 0.3;
                
                if (j === 0) {
                    if (pointVisible) {
                        this.ctx.moveTo(projX, projY);
                        lastPointVisible = true;
                    }
                } else {
                    if (pointVisible && lastPointVisible) {
                        this.ctx.lineTo(projX, projY);
                    } else if (pointVisible && !lastPointVisible) {
                        this.ctx.moveTo(projX, projY);
                    }
                }
                
                lastPointVisible = pointVisible;
            }
            
            this.ctx.stroke();
        }
        
        this.time += 0.3;
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BreathingSpace();
    // Removed EphemeralLines - keeping static separator line only
    
    // Initialize metamorphic forms
    setTimeout(() => {
        const lessCanvas = document.getElementById('wormhole-less');
        const clearCanvas = document.getElementById('wormhole-clear');
        const foreverCanvas = document.getElementById('wormhole-forever');
        
        if (lessCanvas) new MetamorphicForm(lessCanvas, 'less');
        if (clearCanvas) new MetamorphicForm(clearCanvas, 'clear');
        if (foreverCanvas) new MetamorphicForm(foreverCanvas, 'forever');
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