import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float mouse;
uniform float uEnableWaves;

void main() {
    vUv = uv;
    float time = uTime * 5.;

    float waveFactor = uEnableWaves;

    vec3 transformed = position;

    transformed.x += sin(time + position.y) * 0.5 * waveFactor;
    transformed.y += cos(time + position.z) * 0.15 * waveFactor;
    transformed.z += sin(time + position.x) * waveFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    vec2 pos = vUv;
    
    float move = sin(time + mouse) * 0.01;
    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;
    float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;
    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}
`;

// Math mapping utility function
function mapValue(n, start, stop, start2, stop2) {
  return ((n - start) / (stop - start)) * (stop2 - start2) + start2;
}

const PX_RATIO = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

class AsciiFilter {
  constructor(renderer, { fontSize, fontFamily, charset, invert } = {}) {
    this.renderer = renderer;
    this.domElement = document.createElement('div');
    this.domElement.style.position = 'absolute';
    this.domElement.style.top = '0';
    this.domElement.style.left = '0';
    this.domElement.style.width = '100%';
    this.domElement.style.height = '100%';

    this.pre = document.createElement('pre');
    this.domElement.appendChild(this.pre);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.domElement.appendChild(this.canvas);

    this.deg = 0;
    this.invert = invert ?? true;
    this.fontSize = fontSize ?? 12;
    this.fontFamily = fontFamily ?? "'Courier New', monospace";
    this.charset =
      charset ??
      " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

    this.context.webkitImageSmoothingEnabled = false;
    this.context.mozImageSmoothingEnabled = false;
    this.context.msImageSmoothingEnabled = false;
    this.context.imageSmoothingEnabled = false;

    this.onMouseMove = this.onMouseMove.bind(this);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.reset();

    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { x: this.center.x, y: this.center.y };
  }

  reset() {
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    const charWidth = this.context.measureText('A').width;

    this.cols = Math.floor(
      this.width / (this.fontSize * (charWidth / this.fontSize))
    );
    this.rows = Math.floor(this.height / this.fontSize);

    this.canvas.width = this.cols;
    this.canvas.height = this.rows;
    this.pre.style.fontFamily = this.fontFamily;
    this.pre.style.fontSize = `${this.fontSize}px`;
    this.pre.style.margin = '0';
    this.pre.style.padding = '0';
    this.pre.style.lineHeight = '1em';
    this.pre.style.position = 'absolute';
    this.pre.style.left = '50%';
    this.pre.style.top = '50%';
    this.pre.style.transform = 'translate(-50%, -50%)';
    this.pre.style.zIndex = '9';
    this.pre.style.backgroundAttachment = 'fixed';
    this.pre.style.mixBlendMode = 'difference';
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);

    const w = this.canvas.width;
    const h = this.canvas.height;
    this.context.clearRect(0, 0, w, h);
    if (this.context && w && h) {
      this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
    }

    this.asciify(this.context, w, h);
    this.hue();
  }

  onMouseMove(e) {
    this.mouse = { x: e.clientX * PX_RATIO, y: e.clientY * PX_RATIO };
  }

  get dx() {
    return this.mouse.x - this.center.x;
  }

  get dy() {
    return this.mouse.y - this.center.y;
  }

  hue() {
    const deg = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;
    this.deg += (deg - this.deg) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
  }

  asciify(ctx, w, h) {
    if (w && h) {
      const imgData = ctx.getImageData(0, 0, w, h).data;
      let str = '';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = x * 4 + y * 4 * w;
          const [r, g, b, a] = [
            imgData[i],
            imgData[i + 1],
            imgData[i + 2],
            imgData[i + 3],
          ];

          if (a === 0) {
            str += ' ';
            continue;
          }

          let gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
          let idx = Math.floor((1 - gray) * (this.charset.length - 1));
          if (this.invert) idx = this.charset.length - idx - 1;
          str += this.charset[idx];
        }
        str += '\n';
      }
      this.pre.innerHTML = str;
    }
  }

  dispose() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }
}

class CanvasTxt {
  constructor(txt, { fontSize = 200, fontFamily = 'Arial', color = '#fdf9f3' } = {}) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.txt = txt;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;

    this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
  }

  resize() {
    this.context.font = this.font;
    const metrics = this.context.measureText(this.txt);

    const textWidth = Math.ceil(metrics.width) + 20;
    const textHeight =
      Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + 20;

    this.canvas.width = textWidth;
    this.canvas.height = textHeight;
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;

    const metrics = this.context.measureText(this.txt);
    const yPos = 10 + metrics.actualBoundingBoxAscent;

    this.context.fillText(this.txt, 10, yPos);
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get texture() {
    return this.canvas;
  }
}

class CanvAscii {
  constructor(
    { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves },
    containerElem,
    width,
    height
  ) {
    console.log('🎨 CanvAscii: Initializing with params:', { text, asciiFontSize, textFontSize, enableWaves });
    
    this.textString = text;
    this.asciiFontSize = asciiFontSize;
    this.textFontSize = textFontSize;
    this.textColor = textColor;
    this.planeBaseHeight = planeBaseHeight;
    this.container = containerElem;
    this.width = width;
    this.height = height;
    this.enableWaves = enableWaves;

    try {
      this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
      this.camera.position.z = 30;
      console.log('✅ CanvAscii: Camera created');

      this.scene = new THREE.Scene();
      this.mouse = { x: 0, y: 0 };
      console.log('✅ CanvAscii: Scene created');

      this.onMouseMove = this.onMouseMove.bind(this);

      this.setMesh();
      this.setRenderer();
      console.log('✅ CanvAscii: Initialization complete');
    } catch (error) {
      console.error('💥 CanvAscii: Error in constructor:', error);
      throw error;
    }
  }

  setMesh() {
    try {
      console.log('🕸️ CanvAscii: Creating text canvas...');
      this.textCanvas = new CanvasTxt(this.textString, {
        fontSize: this.textFontSize,
        fontFamily: 'IBM Plex Mono',
        color: this.textColor,
      });
      this.textCanvas.resize();
      this.textCanvas.render();
      console.log('✅ CanvAscii: Text canvas created:', { width: this.textCanvas.width, height: this.textCanvas.height });

      this.texture = new THREE.CanvasTexture(this.textCanvas.texture);
      this.texture.minFilter = THREE.NearestFilter;
      console.log('✅ CanvAscii: Texture created');

      const textAspect = this.textCanvas.width / this.textCanvas.height;
      const baseH = this.planeBaseHeight;
      const planeW = baseH * textAspect;
      const planeH = baseH;
      console.log('📏 CanvAscii: Plane dimensions:', { width: planeW, height: planeH, aspect: textAspect });

      this.geometry = new THREE.PlaneGeometry(planeW, planeH, 36, 36);
      console.log('✅ CanvAscii: Geometry created');
      
      this.material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          mouse: { value: 1.0 },
          uTexture: { value: this.texture },
          uEnableWaves: { value: this.enableWaves ? 1.0 : 0.0 }
        },
      });
      console.log('✅ CanvAscii: Material created with waves:', this.enableWaves);

      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.mesh);
      console.log('✅ CanvAscii: Mesh added to scene');
    } catch (error) {
      console.error('💥 CanvAscii: Error in setMesh:', error);
      throw error;
    }
  }

  setRenderer() {
    try {
      console.log('🖼️ CanvAscii: Creating WebGL renderer...');
      this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      this.renderer.setPixelRatio(1);
      this.renderer.setClearColor(0x000000, 0);
      console.log('✅ CanvAscii: WebGL renderer created');

      console.log('🎨 CanvAscii: Creating ASCII filter...');
      this.filter = new AsciiFilter(this.renderer, {
        fontFamily: 'IBM Plex Mono',
        fontSize: this.asciiFontSize,
        invert: true,
      });
      console.log('✅ CanvAscii: ASCII filter created');

      this.container.appendChild(this.filter.domElement);
      this.setSize(this.width, this.height);
      console.log('✅ CanvAscii: Filter added to container');

      this.container.addEventListener('mousemove', this.onMouseMove);
      this.container.addEventListener('touchmove', this.onMouseMove);
      console.log('✅ CanvAscii: Event listeners added');
    } catch (error) {
      console.error('💥 CanvAscii: Error in setRenderer:', error);
      throw error;
    }
  }

  setSize(w, h) {
    this.width = w;
    this.height = h;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.filter.setSize(w, h);

    this.center = { x: w / 2, y: h / 2 };
  }

  load() {
    this.animate();
  }

  onMouseMove(evt) {
    const e = evt.touches ? evt.touches[0] : evt;
    const bounds = this.container.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    this.mouse = { x, y };
  }

  animate() {
    const animateFrame = () => {
      this.animationFrameId = requestAnimationFrame(animateFrame);
      this.render();
    };
    animateFrame();
  }

  render() {
    const time = new Date().getTime() * 0.001;

    this.textCanvas.render();
    this.texture.needsUpdate = true;

    this.mesh.material.uniforms.uTime.value = Math.sin(time);

    this.updateRotation();
    this.filter.render(this.scene, this.camera);
  }

  updateRotation() {
    const x = mapValue(this.mouse.y, 0, this.height, 0.5, -0.5);
    const y = mapValue(this.mouse.x, 0, this.width, -0.5, 0.5);

    this.mesh.rotation.x += (x - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (y - this.mesh.rotation.y) * 0.05;
  }

  clear() {
    this.scene.traverse((obj) => {
      if (
        obj.isMesh &&
        typeof obj.material === 'object' &&
        obj.material !== null
      ) {
        Object.keys(obj.material).forEach((key) => {
          const matProp = obj.material[key];
          if (matProp !== null && typeof matProp === 'object' && typeof matProp.dispose === 'function') {
            matProp.dispose();
          }
        });
        obj.material.dispose();
        obj.geometry.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    cancelAnimationFrame(this.animationFrameId);
    this.filter.dispose();
    this.container.removeChild(this.filter.domElement);
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('touchmove', this.onMouseMove);
    this.clear();
    this.renderer.dispose();
  }
}

// WebGL capability detection
function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

export default function ASCIIText({
  text = 'neurix',
  asciiFontSize = 8,
  textFontSize = 200,
  textColor = '#fdf9f3',
  planeBaseHeight = 8,
  enableWaves = true
} = {}) {
  let asciiInstance = null;

  const init = (containerElement) => {
    console.log('🎨 ASCIIText: Starting initialization...');
    
    if (!containerElement) {
      console.error('❌ ASCIIText: No container element provided');
      return;
    }

    // Check WebGL support
    if (!detectWebGL()) {
      console.error('❌ ASCIIText: WebGL not supported in this browser');
      containerElement.innerHTML = '<div style="font-family: IBM Plex Mono, monospace; color: #666; text-align: center; padding: 20px;">neurix</div>';
      return () => {};
    }

    const rect = containerElement.getBoundingClientRect();
    console.log('📏 ASCIIText: Container dimensions:', { width: rect.width, height: rect.height });
    
    if (rect.width === 0 || rect.height === 0) {
      console.warn('⚠️ ASCIIText: Container has zero dimensions, retrying in 100ms...');
      setTimeout(() => init(containerElement), 100);
      return;
    }

    try {
      console.log('🔧 ASCIIText: Creating CanvAscii instance...');
      asciiInstance = new CanvAscii(
        { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves },
        containerElement,
        rect.width,
        rect.height
      );
      console.log('✅ ASCIIText: CanvAscii instance created successfully');
      
      asciiInstance.load();
      console.log('🚀 ASCIIText: Animation started');

      const ro = new ResizeObserver((entries) => {
        if (!entries[0]) return;
        const { width: w, height: h } = entries[0].contentRect;
        console.log('📐 ASCIIText: Resizing to:', { width: w, height: h });
        if (asciiInstance) {
          asciiInstance.setSize(w, h);
        }
      });
      ro.observe(containerElement);

      return () => {
        console.log('🧹 ASCIIText: Cleaning up...');
        ro.disconnect();
        if (asciiInstance) {
          asciiInstance.dispose();
        }
      };
    } catch (error) {
      console.error('💥 ASCIIText: Error during initialization:', error);
      // Fallback to simple text
      containerElement.innerHTML = '<div style="font-family: IBM Plex Mono, monospace; color: #666; text-align: center; padding: 20px;">neurix</div>';
      return () => {};
    }
  };

  const dispose = () => {
    console.log('🗑️ ASCIIText: Disposing...');
    if (asciiInstance) {
      asciiInstance.dispose();
      asciiInstance = null;
    }
  };

  return { init, dispose };
}