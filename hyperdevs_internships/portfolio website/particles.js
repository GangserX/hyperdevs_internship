// Advanced Particle System with Three.js
class ParticleSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.sparkles = [];
        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 5;

        // Renderer setup
        const canvas = document.getElementById('particle-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true,
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Create particle system
        this.createParticles();
        
        // Event listeners
        this.addEventListeners();
        
        // Start animation loop
        this.animate();
    }

    createParticles() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount * 3);

        // Color palette for particles
        const colorPalette = [
            new THREE.Color(0x64b5f6), // Light blue
            new THREE.Color(0x42a5f5), // Blue
            new THREE.Color(0x2196f3), // Medium blue
            new THREE.Color(0x1976d2), // Dark blue
            new THREE.Color(0x0d47a1), // Very dark blue
            new THREE.Color(0x9c27b0), // Purple
            new THREE.Color(0x673ab7)  // Deep purple
        ];

        for (let i = 0; i < particleCount; i++) {
            // Position
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

            // Color
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Size
            sizes[i] = Math.random() * 3 + 1;

            // Velocity
            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Store velocities for animation
        this.velocities = velocities;

        // Simplified material without mouse effects for better performance
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Simple floating animation without mouse interaction
                    mvPosition.y += sin(time + position.x * 0.1) * 0.1;
                    
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vec2 center = gl_PointCoord - 0.5;
                    float dist = length(center);
                    
                    if (dist > 0.5) discard;
                    
                    float alpha = 1.0 - dist * 2.0;
                    alpha *= 0.7; // Fixed alpha without time-based flickering
                    
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createRipple(x, y) {
        // Create water ripple effect using DOM elements instead of Three.js
        const rippleContainer = document.querySelector('.ripple-container');
        if (!rippleContainer) return;

        // Create multiple ripple waves for realistic water effect
        for (let i = 0; i < 3; i++) {
            const ripple = document.createElement('div');
            ripple.className = `ripple wave-${i + 1}`;
            
            // Position the ripple at click coordinates
            const rect = rippleContainer.getBoundingClientRect();
            const rippleX = x - rect.left;
            const rippleY = y - rect.top;
            
            ripple.style.left = rippleX + 'px';
            ripple.style.top = rippleY + 'px';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            rippleContainer.appendChild(ripple);
            
            // Remove ripple after animation completes
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 2500 + (i * 200));
        }
    }

    addEventListeners() {
        // Click/tap event for ripple effect
        window.addEventListener('click', (event) => {
            const homeSection = document.getElementById('home');
            const rect = homeSection.getBoundingClientRect();
            
            // Check if click is within home section
            if (event.clientX >= rect.left && event.clientX <= rect.right &&
                event.clientY >= rect.top && event.clientY <= rect.bottom) {
                this.createRipple(event.clientX, event.clientY);
            }
        });

        // Touch event for mobile devices
        window.addEventListener('touchstart', (event) => {
            const homeSection = document.getElementById('home');
            const rect = homeSection.getBoundingClientRect();
            const touch = event.touches[0];
            
            // Check if touch is within home section
            if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
                touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
                this.createRipple(touch.clientX, touch.clientY);
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Update particle system
        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Apply velocities for natural floating movement
                positions[i] += this.velocities[i];
                positions[i + 1] += this.velocities[i + 1];
                positions[i + 2] += this.velocities[i + 2];

                // Boundary wrapping
                if (positions[i] > 10) positions[i] = -10;
                if (positions[i] < -10) positions[i] = 10;
                if (positions[i + 1] > 10) positions[i + 1] = -10;
                if (positions[i + 1] < -10) positions[i + 1] = 10;
            }

            this.particles.geometry.attributes.position.needsUpdate = true;
            
            // Update shader uniforms (only time now)
            this.particles.material.uniforms.time.value = time;
        }

        // Update sparkles
        for (let i = this.sparkles.length - 1; i >= 0; i--) {
            const sparkle = this.sparkles[i];
            const userData = sparkle.userData;
            
            userData.life -= 0.02;
            
            if (userData.life <= 0) {
                this.scene.remove(sparkle);
                this.sparkles.splice(i, 1);
                continue;
            }

            // Update sparkle positions
            const positions = sparkle.geometry.attributes.position.array;
            for (let j = 0; j < positions.length; j += 3) {
                positions[j] += userData.velocities[j / 3].x;
                positions[j + 1] += userData.velocities[j / 3].y;
                positions[j + 2] += userData.velocities[j / 3].z;
                
                // Apply gravity
                userData.velocities[j / 3].y -= 0.002;
            }
            
            sparkle.geometry.attributes.position.needsUpdate = true;
            sparkle.material.opacity = userData.life / userData.maxLife;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});
