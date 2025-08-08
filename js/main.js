/**
 * Main application entry point
 * Initializes the AdvancedParticleSphere visualizer and sets up the modern control panel
 */

// Global variables
let particleSphere;
let fpsCounter = 0;
let lastFpsTime = performance.now();

/**
 * Initialize the application when the page loads
 */
function init() {
    console.log('Initializing Advanced 3D Particle Sphere Visualizer...');
    
    // Hide loading message
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // Get the container element
    const container = document.getElementById('container');
    if (!container) {
        console.error('Container element not found!');
        return;
    }
    
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded!');
        return;
    }
    
    // Create the advanced particle sphere visualizer
    try {
        particleSphere = new AdvancedParticleSphere(container);
        console.log('AdvancedParticleSphere created successfully');
    } catch (error) {
        console.error('Error creating AdvancedParticleSphere:', error);
        return;
    }
    
    // Setup the control panel
    setupControlPanel();
    
    // Start FPS counter
    startFpsCounter();
    
    console.log('Advanced 3D Particle Sphere Visualizer initialized successfully!');
}

/**
 * Setup the modern control panel with collapsible functionality
 */
function setupControlPanel() {
    // Get control panel elements
    const controlPanelCta = document.getElementById('controlPanelCta');
    const controlPanel = document.getElementById('controlPanel');
    const closeButton = document.getElementById('closeControlPanel');
    
    // Control panel toggle functionality
    controlPanelCta.addEventListener('click', () => {
        controlPanel.classList.add('open');
        controlPanelCta.style.display = 'none';
    });
    
    closeButton.addEventListener('click', () => {
        controlPanel.classList.remove('open');
        controlPanelCta.style.display = 'block';
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', (event) => {
        if (!controlPanel.contains(event.target) && 
            !controlPanelCta.contains(event.target) && 
            controlPanel.classList.contains('open')) {
            controlPanel.classList.remove('open');
            controlPanelCta.style.display = 'block';
        }
    });
    
    // Setup all slider controls
    setupMaterialControls();
    setupParticleControls();
    setupMorphingControls();
    setupLightspeedControls();
    setupPresetButtons();
    setupShapeButtons();
}

/**
 * Setup material property controls
 */
function setupMaterialControls() {
    // Metalness slider
    const metalnessSlider = document.getElementById('metalnessSlider');
    const metalnessValue = document.getElementById('metalnessValue');
    
    metalnessSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        metalnessValue.textContent = value.toFixed(2);
        if (particleSphere && typeof particleSphere.updateMaterialProperties === 'function') {
            particleSphere.updateMaterialProperties({ metalness: value });
        }
    });
    
    // Roughness slider
    const roughnessSlider = document.getElementById('roughnessSlider');
    const roughnessValue = document.getElementById('roughnessValue');
    
    roughnessSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        roughnessValue.textContent = value.toFixed(2);
        if (particleSphere && typeof particleSphere.updateMaterialProperties === 'function') {
            particleSphere.updateMaterialProperties({ roughness: value });
        }
    });
    
    // Clearcoat slider
    const clearcoatSlider = document.getElementById('clearcoatSlider');
    const clearcoatValue = document.getElementById('clearcoatValue');
    
    clearcoatSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        clearcoatValue.textContent = value.toFixed(2);
        if (particleSphere && typeof particleSphere.updateMaterialProperties === 'function') {
            particleSphere.updateMaterialProperties({ clearcoat: value });
        }
    });
    
    // IOR (Refraction Index) slider
    const iorSlider = document.getElementById('iorSlider');
    const iorValue = document.getElementById('iorValue');
    
    iorSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        iorValue.textContent = value.toFixed(2);
        if (particleSphere && typeof particleSphere.updateMaterialProperties === 'function') {
            particleSphere.updateMaterialProperties({ ior: value });
        }
    });
    
}

/**
 * Setup particle system controls
 */
function setupParticleControls() {
    // Particle size slider
    const particleSizeSlider = document.getElementById('particleSizeSlider');
    const particleSizeValue = document.getElementById('particleSizeValue');
    
    particleSizeSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        particleSizeValue.textContent = value.toFixed(3);
        if (particleSphere && typeof particleSphere.setParticleSize === 'function') {
            particleSphere.setParticleSize(value);
        }
    });
    
    // Particle count slider
    const particleCountSlider = document.getElementById('particleCountSlider');
    const particleCountValue = document.getElementById('particleCountValue');
    
    particleCountSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        particleCountValue.textContent = value;
        if (particleSphere && typeof particleSphere.setParticleCount === 'function') {
            particleSphere.setParticleCount(value);
        }
    });
}

/**
 * Setup lightspeed effect controls
 */
function setupLightspeedControls() {
    // Streak length slider
    const streakLengthSlider = document.getElementById('streakLengthSlider');
    const streakLengthValue = document.getElementById('streakLengthValue');
    
    streakLengthSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        streakLengthValue.textContent = value.toFixed(2);
        if (particleSphere && typeof particleSphere.setStreakLength === 'function') {
            particleSphere.setStreakLength(value);
        }
    });
    
    // Streak intensity slider
    const streakIntensitySlider = document.getElementById('streakIntensitySlider');
    const streakIntensityValue = document.getElementById('streakIntensityValue');
    
    streakIntensitySlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        streakIntensityValue.textContent = value.toFixed(2);
        if (particleSphere && typeof particleSphere.setStreakIntensity === 'function') {
            particleSphere.setStreakIntensity(value);
        }
    });
    
    // Motion blur slider
    const motionBlurSlider = document.getElementById('motionBlurSlider');
    const motionBlurValue = document.getElementById('motionBlurValue');
    
    motionBlurSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        motionBlurValue.textContent = value.toFixed(2);
        if (particleSphere && typeof particleSphere.setMotionBlur === 'function') {
            particleSphere.setMotionBlur(value);
        }
    });
    
    // Lightspeed zoom slider
    const lightspeedZoomSlider = document.getElementById('lightspeedZoomSlider');
    const lightspeedZoomValue = document.getElementById('lightspeedZoomValue');
    
    lightspeedZoomSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        lightspeedZoomValue.textContent = value.toFixed(2);
        if (particleSphere && typeof particleSphere.setLightspeedZoom === 'function') {
            particleSphere.setLightspeedZoom(value);
        }
    });
}

/**
 * Setup morphing controls
 */
function setupMorphingControls() {
    // Scatter slider
    const scatterSlider = document.getElementById('scatterSlider');
    const scatterValue = document.getElementById('scatterValue');
    
    scatterSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        scatterValue.textContent = value.toFixed(2);
        if (particleSphere && typeof particleSphere.setScatterValue === 'function') {
            particleSphere.setScatterValue(value);
        }
    });
    
    // Cluster slider
    const clusterSlider = document.getElementById('clusterSlider');
    const clusterValue = document.getElementById('clusterValue');
    
    clusterSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        clusterValue.textContent = value.toFixed(2);
        if (particleSphere && typeof particleSphere.setClusterValue === 'function') {
            particleSphere.setClusterValue(value);
        }
    });
}

/**
 * Setup preset buttons with active state management
 */
function setupPresetButtons() {
    const metallicBtn = document.getElementById('metallicBtn');
    const glassBtn = document.getElementById('glassBtn');
    const lightspeedBtn = document.getElementById('lightspeedBtn');
    const clusteredBtn = document.getElementById('clusteredBtn');
    
    // Remove active class from all buttons
    function clearActiveButtons() {
        [metallicBtn, glassBtn, lightspeedBtn, clusteredBtn].forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    // Metallic preset
    metallicBtn.addEventListener('click', () => {
        clearActiveButtons();
        metallicBtn.classList.add('active');
        
        if (particleSphere) {
            // Set metallic material properties
            particleSphere.updateMaterialProperties({
                metalness: 0.9,
                roughness: 0.1,
                clearcoat: 0.8,
                ior: 1.5
            });
            
            // Update sliders
            updateSliderValues({
                metalness: 0.9,
                roughness: 0.1,
                clearcoat: 0.8,
                ior: 1.5
            });
        }
    });
    
    // Glass preset
    glassBtn.addEventListener('click', () => {
        clearActiveButtons();
        glassBtn.classList.add('active');
        
        if (particleSphere) {
            // Set glass material properties
            particleSphere.updateMaterialProperties({
                metalness: 0.0,
                roughness: 0.0,
                clearcoat: 1.0,
                ior: 1.5
            });
            
            // Update sliders
            updateSliderValues({
                metalness: 0.0,
                roughness: 0.0,
                clearcoat: 1.0,
                ior: 1.5
            });
        }
    });
    
    // Lightspeed preset
    lightspeedBtn.addEventListener('click', () => {
        clearActiveButtons();
        lightspeedBtn.classList.add('active');
        
        if (particleSphere) {
            // Set lightspeed material properties
            particleSphere.updateMaterialProperties({
                metalness: 0.0,
                roughness: 0.0,
                clearcoat: 1.0,
                ior: 1.5
            });
            
            // Set scatter for lightspeed effect
            particleSphere.setScatterValue(0.8);
            particleSphere.setClusterValue(0.2);
            
            // Set lightspeed effect parameters
            particleSphere.setStreakLength(1.5);
            particleSphere.setStreakIntensity(0.8);
            particleSphere.setMotionBlur(0.6);
            particleSphere.setLightspeedZoom(0.3);
            
            // Update all sliders
            updateSliderValues({
                metalness: 0.0,
                roughness: 0.0,
                clearcoat: 1.0,
                ior: 1.5
            });
            
            document.getElementById('scatterSlider').value = 0.8;
            document.getElementById('clusterSlider').value = 0.2;
            document.getElementById('scatterValue').textContent = '0.80';
            document.getElementById('clusterValue').textContent = '0.20';
            document.getElementById('streakLengthSlider').value = 1.5;
            document.getElementById('streakIntensitySlider').value = 0.8;
            document.getElementById('motionBlurSlider').value = 0.6;
            document.getElementById('streakLengthValue').textContent = '1.50';
            document.getElementById('streakIntensityValue').textContent = '0.80';
            document.getElementById('motionBlurValue').textContent = '0.60';
            document.getElementById('lightspeedZoomSlider').value = 0.3;
            document.getElementById('lightspeedZoomValue').textContent = '0.30';
        }
    });
    
    // Clustered preset
    clusteredBtn.addEventListener('click', () => {
        clearActiveButtons();
        clusteredBtn.classList.add('active');
        
        if (particleSphere) {
            particleSphere.setScatterValue(0);
            particleSphere.setClusterValue(1);
            
            // Update sliders
            document.getElementById('scatterSlider').value = 0;
            document.getElementById('clusterSlider').value = 1;
            document.getElementById('scatterValue').textContent = '0.00';
            document.getElementById('clusterValue').textContent = '1.00';
        }
    });
}

/**
 * Update slider values and display values
 */
function updateSliderValues(properties) {
    if (properties.metalness !== undefined) {
        document.getElementById('metalnessSlider').value = properties.metalness;
        document.getElementById('metalnessValue').textContent = properties.metalness.toFixed(2);
    }
    if (properties.roughness !== undefined) {
        document.getElementById('roughnessSlider').value = properties.roughness;
        document.getElementById('roughnessValue').textContent = properties.roughness.toFixed(2);
    }
    if (properties.clearcoat !== undefined) {
        document.getElementById('clearcoatSlider').value = properties.clearcoat;
        document.getElementById('clearcoatValue').textContent = properties.clearcoat.toFixed(2);
    }
    if (properties.ior !== undefined) {
        document.getElementById('iorSlider').value = properties.ior;
        document.getElementById('iorValue').textContent = properties.ior.toFixed(2);
    }
}

/**
 * Start FPS counter
 */
function startFpsCounter() {
    const fpsValue = document.getElementById('fpsValue');
    
    function updateFPS() {
        fpsCounter++;
        const currentTime = performance.now();
        
        if (currentTime - lastFpsTime >= 1000) {
            const fps = Math.round((fpsCounter * 1000) / (currentTime - lastFpsTime));
            if (fpsValue) {
                fpsValue.textContent = fps;
            }
            fpsCounter = 0;
            lastFpsTime = currentTime;
        }
        
        requestAnimationFrame(updateFPS);
    }
    
    updateFPS();
}

/**
 * Setup shape buttons
 */
function setupShapeButtons() {
    const smileyBtn = document.getElementById('smileyBtn');
    const thumbsBtn = document.getElementById('thumbsBtn');
    const ringBtn = document.getElementById('ringBtn');
    const outlineModeCheckbox = document.getElementById('outlineMode');
    
    // Remove active class from all shape buttons
    function clearActiveShapeButtons() {
        [smileyBtn, thumbsBtn, ringBtn].forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    // Smiley face
    smileyBtn.addEventListener('click', () => {
        clearActiveShapeButtons();
        smileyBtn.classList.add('active');
        
        if (particleSphere && typeof particleSphere.morphToShape === 'function') {
            particleSphere.morphToShape('smiley');
        }
    });
    
    // Thumbs up
    thumbsBtn.addEventListener('click', () => {
        clearActiveShapeButtons();
        thumbsBtn.classList.add('active');
        
        if (particleSphere && typeof particleSphere.morphToShape === 'function') {
            particleSphere.morphToShape('thumbs');
        }
    });
    
    // Ring
    ringBtn.addEventListener('click', () => {
        clearActiveShapeButtons();
        ringBtn.classList.add('active');
        
        if (particleSphere && typeof particleSphere.morphToShape === 'function') {
            particleSphere.morphToShape('ring');
        }
    });
    
    // Outline mode checkbox
    outlineModeCheckbox.addEventListener('change', (e) => {
        if (particleSphere && typeof particleSphere.setOutlineMode === 'function') {
            particleSphere.setOutlineMode(e.target.checked);
        }
    });
}

/**
 * Handle window resize
 */
function onWindowResize() {
    if (particleSphere) {
        particleSphere.onWindowResize();
    }
}

/**
 * Clean up resources when the page is unloaded
 */
function cleanup() {
    if (particleSphere) {
        particleSphere.dispose();
    }
}

// Initialize when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Clean up on page unload
window.addEventListener('beforeunload', cleanup);
