/**
 * ParticleSphere - A 3D particle system that creates a sphere of particles
 * that can morph between different states and react to mouse interaction.
 */
class ParticleSphere {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.particles = [];
        this.particleGroup = null;
        this.raycaster = null;
        this.mouse = null;
        this.clock = null;
        
        // Particle system parameters
        this.particleCount = 500;
        this.particleSize = 0.05;
        this.sphereRadius = 2;
        this.scatterRadius = 8;
        
        // Animation parameters
        this.rotationSpeed = 0.5;
        this.morphValue = 0; // 0 = tight sphere, 1 = scattered cloud
        this.interactionRadius = 1.5;
        this.interactionStrength = 0.3;
        
        // Mouse interaction
        this.mousePosition = new THREE.Vector3();
        this.isMouseNear = false;
        
        // Initialize the system
        this.init();
    }
    
    /**
     * Initialize the Three.js scene, camera, renderer, and controls
     */
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 8);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
        
        // Create orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 20;
        this.controls.minDistance = 2;
        
        // Create lighting
        this.setupLighting();
        
        // Create particle system
        this.createParticles();
        
        // Setup raycaster for mouse interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Create clock for animations
        this.clock = new THREE.Clock();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.animate();
    }
    
    /**
     * Setup lighting for the scene
     */
    setupLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light for shadows and highlights
        const directionalLight = new THREE.DirectionalLight(0x4fc3f7, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Point light for particle glow
        const pointLight = new THREE.PointLight(0x4fc3f7, 0.8, 10);
        pointLight.position.set(0, 0, 0);
        this.scene.add(pointLight);
    }
    
    /**
     * Create the particle system
     */
    createParticles() {
        this.particleGroup = new THREE.Group();
        this.scene.add(this.particleGroup);
        
        // Create particle geometry and material
        const particleGeometry = new THREE.SphereGeometry(this.particleSize, 8, 8);
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: 0x4fc3f7,
            emissive: 0x1a4a5e,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        
        // Create particles in a spherical distribution
        for (let i = 0; i < this.particleCount; i++) {
            // Generate spherical coordinates
            const phi = Math.acos(-1 + (2 * i) / this.particleCount);
            const theta = Math.sqrt(this.particleCount * Math.PI) * phi;
            
            // Convert to Cartesian coordinates
            const x = this.sphereRadius * Math.cos(theta) * Math.sin(phi);
            const y = this.sphereRadius * Math.sin(theta) * Math.sin(phi);
            const z = this.sphereRadius * Math.cos(phi);
            
            // Create particle mesh
            const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
            particle.position.set(x, y, z);
            
            // Store original position for morphing
            particle.userData = {
                originalPosition: new THREE.Vector3(x, y, z),
                scatteredPosition: this.getScatteredPosition(),
                targetPosition: new THREE.Vector3(x, y, z),
                velocity: new THREE.Vector3(),
                isInteracting: false,
                interactionStartTime: 0
            };
            
            this.particles.push(particle);
            this.particleGroup.add(particle);
        }
    }
    
    /**
     * Generate a random scattered position for particles
     */
    getScatteredPosition() {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = this.scatterRadius * (0.5 + Math.random() * 0.5);
        
        return new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
    }
    
    /**
     * Setup event listeners for mouse interaction and window resizing
     */
    setupEventListeners() {
        // Mouse move for interaction
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            this.onMouseMove(event);
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }
    
    /**
     * Handle mouse movement for particle interaction
     */
    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Find intersection with an invisible plane at the particle sphere's center
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const intersection = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(plane, intersection);
        
        // Transform intersection to world space
        this.mousePosition.copy(intersection);
        
        // Check distance to particle group center
        const distanceToCenter = this.mousePosition.distanceTo(this.particleGroup.position);
        this.isMouseNear = distanceToCenter < this.interactionRadius;
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    /**
     * Update particle positions based on morph value and mouse interaction
     */
    updateParticles() {
        const time = this.clock.getElapsedTime();
        
        this.particles.forEach((particle, index) => {
            const userData = particle.userData;
            
            // Calculate target position based on morph value
            const targetPosition = new THREE.Vector3();
            targetPosition.lerpVectors(
                userData.originalPosition,
                userData.scatteredPosition,
                this.morphValue
            );
            
            // Apply mouse interaction
            if (this.isMouseNear) {
                const distanceToMouse = particle.position.distanceTo(this.mousePosition);
                if (distanceToMouse < this.interactionRadius) {
                    // Calculate repulsion force
                    const repulsionDirection = new THREE.Vector3()
                        .subVectors(particle.position, this.mousePosition)
                        .normalize();
                    
                    const repulsionStrength = (this.interactionRadius - distanceToMouse) / this.interactionRadius;
                    const repulsionOffset = repulsionDirection.multiplyScalar(
                        repulsionStrength * this.interactionStrength
                    );
                    
                    targetPosition.add(repulsionOffset);
                    userData.isInteracting = true;
                    userData.interactionStartTime = time;
                }
            } else {
                userData.isInteracting = false;
            }
            
            // Smooth interpolation to target position
            particle.position.lerp(targetPosition, 0.05);
            
            // Update particle appearance based on interaction
            if (userData.isInteracting) {
                const interactionTime = time - userData.interactionStartTime;
                const pulse = Math.sin(interactionTime * 10) * 0.5 + 0.5;
                particle.material.emissive.setHex(0x4fc3f7);
                particle.material.emissiveIntensity = pulse * 0.5;
                particle.scale.setScalar(1 + pulse * 0.3);
            } else {
                particle.material.emissiveIntensity = 0.2;
                particle.scale.setScalar(1);
            }
        });
    }
    
    /**
     * Rotate the entire particle group
     */
    updateRotation() {
        const time = this.clock.getElapsedTime();
        this.particleGroup.rotation.x = Math.sin(time * 0.3) * 0.2;
        this.particleGroup.rotation.y = time * this.rotationSpeed * 0.01;
        this.particleGroup.rotation.z = Math.cos(time * 0.2) * 0.1;
    }
    
    /**
     * Main animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update controls
        this.controls.update();
        
        // Update particle system
        this.updateParticles();
        this.updateRotation();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Set the morph value (0 = tight sphere, 1 = scattered cloud)
     */
    setMorphValue(value) {
        this.morphValue = Math.max(0, Math.min(1, value));
    }
    
    /**
     * Set the rotation speed
     */
    setRotationSpeed(speed) {
        this.rotationSpeed = speed;
    }
    
    /**
     * Set the interaction radius
     */
    setInteractionRadius(radius) {
        this.interactionRadius = radius;
    }
    
    /**
     * Set the interaction strength
     */
    setInteractionStrength(strength) {
        this.interactionStrength = strength;
    }
    
    /**
     * Set the particle count (requires recreation of particles)
     */
    setParticleCount(count) {
        this.particleCount = count;
        this.recreateParticles();
    }
    
    /**
     * Recreate particles with new count
     */
    recreateParticles() {
        // Remove existing particles
        this.particles.forEach(particle => {
            this.particleGroup.remove(particle);
        });
        this.particles = [];
        
        // Create new particles
        this.createParticles();
    }
    
    /**
     * Clean up resources
     */
    dispose() {
        this.renderer.dispose();
        this.controls.dispose();
        window.removeEventListener('resize', this.onWindowResize);
    }
}
