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

document.addEventListener('DOMContentLoaded', () => {
    new BreathingSpace();
    new EphemeralLines();
    
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
});