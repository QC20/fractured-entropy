// ===== ENHANCED LOZI CHAOTIC ATTRACTOR SYSTEM =====
// Multi-layered attractors with dynamic evolution and complex visual effects

var dots = 15000;
var x = new Array(dots);
var y = new Array(dots);
var z = new Array(dots);
var px = new Array(dots);
var py = new Array(dots);
var pz = new Array(dots);
var age = new Array(dots);
var velocity = new Array(dots);
var energy = new Array(dots);
var layerType = new Array(dots);

// Enhanced Lozi parameters with evolution
var a = 1.7;
var b = 0.5;
var dt = 0.01;

// Multi-layer system parameters
var numLayers = 4;
var layerParams = [];
var layerOffsets = [];

// Parameter evolution system
var evolutionTime = 0;
var aBase = 1.7, aRange = 0.8;
var bBase = 0.5, bRange = 0.4;

// Visual parameters
var r = 30;
var l = 1; // Start with lines
var s = 1;
var per = "xz";
var trailFade = 0.92;
var morphPhase = 0;
var energyPhase = 0;

// Advanced visual effects
var particleSwarm = true;
var fractalization = true;
var resonanceMode = false;
var quantumField = 0;
var gravitationalWaves = [];

// Camera/view controls
var rotationX = 0.3;
var rotationY = 0;
var rotationZ = 0;
var autoRotate = true;
var autoRotateSpeed = 0.003;
var complexRotation = true;
var zoom = 1.5;
var isDragging = false;
var lastMouseX = 0;
var lastMouseY = 0;
var centerX, centerY;

// Color and lighting system
var colorTime = 0;
var lightingPhase = 0;
var spectrumShift = 0;
var bloomEffect = 1.2;
var particleGlow = true;

// Performance system
var frameTimeHistory = [];
var targetFPS = 60;
var currentDots = dots;
var performanceCheckInterval = 60;
var frameCounter = 0;
var adaptiveQuality = true;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 1);
    
    centerX = width / 2;
    centerY = height / 2;
    
    // Initialize multi-layer system
    initializeLayers();
    initializeGravitationalWaves();
    
    // Initialize particles with sophisticated distribution
    for (var i = 0; i < dots; i++) {
        layerType[i] = floor(i / (dots / numLayers));
        if (layerType[i] >= numLayers) layerType[i] = numLayers - 1;
        
        var layer = layerParams[layerType[i]];
        var offset = layerOffsets[layerType[i]];
        
        // Initialize with slight variations based on layer
        x[i] = random(-1.5, 1.5) + offset.x;
        y[i] = random(-1.5, 1.5) + offset.y;
        z[i] = random(-3, 3) + offset.z;
        
        age[i] = random(0, 2000);
        velocity[i] = 0;
        energy[i] = random(0.5, 1.5);
    }
}

function initializeLayers() {
    layerParams = [];
    layerOffsets = [];
    
    for (var i = 0; i < numLayers; i++) {
        layerParams.push({
            a: aBase + random(-aRange * 0.3, aRange * 0.3),
            b: bBase + random(-bRange * 0.3, bRange * 0.3),
            phase: random(0, TWO_PI),
            frequency: 0.1 + random(0.05),
            amplitude: 0.2 + random(0.3)
        });
        
        var angle = (i / numLayers) * TWO_PI;
        layerOffsets.push({
            x: cos(angle) * 0.5,
            y: sin(angle) * 0.5,
            z: (i - numLayers/2) * 0.8
        });
    }
}

function initializeGravitationalWaves() {
    gravitationalWaves = [];
    for (var i = 0; i < 6; i++) {
        gravitationalWaves.push({
            amplitude: random(0.1, 0.3),
            frequency: random(0.02, 0.08),
            phase: random(0, TWO_PI),
            direction: createVector(random(-1, 1), random(-1, 1), random(-1, 1))
        });
    }
}

function draw() {
    var startTime = millis();
    
    // Dynamic background with quantum field effects
    if (l === 0) {
        drawQuantumBackground();
    } else {
        // Advanced trail system with field distortion
        push();
        var fadeAlpha = 1 - trailFade;
        if (quantumField > 0) {
            fadeAlpha += quantumField * 0.1 * sin(evolutionTime * 0.5);
        }
        fill(5, 20, 8, fadeAlpha);
        noStroke();
        rect(0, 0, width, height);
        pop();
    }
    
    // Update global evolution
    updateGlobalEvolution();
    
    // Apply transformations
    push();
    translate(centerX, centerY);
    scale(zoom);
    
    // Complex rotation system
    if (autoRotate) {
        if (complexRotation) {
            rotationY += autoRotateSpeed;
            rotationX += autoRotateSpeed * 0.3 * sin(evolutionTime * 0.2);
            rotationZ += autoRotateSpeed * 0.1 * cos(evolutionTime * 0.15);
        } else {
            rotationY += autoRotateSpeed;
        }
    }
    
    // Update and render particle systems
    updateParticleSystem();
    renderParticleSystem();
    
    // Render gravitational wave effects
    if (resonanceMode) {
        renderGravitationalWaves();
    }
    
    pop();
    
    // Performance monitoring
    performanceMonitoring(startTime);
    
    // Display enhanced UI
    displayAdvancedUI();
}

function drawQuantumBackground() {
    // Quantum field background effect
    background(0, 0, 3);
    if (quantumField > 0) {
        noFill();
        for (var i = 0; i < 5; i++) {
            stroke(200 + i * 30, 30, 20, quantumField * 0.3);
            strokeWeight(0.5);
            var waveX = sin(evolutionTime * 0.1 + i) * width * 0.1;
            var waveY = cos(evolutionTime * 0.07 + i) * height * 0.1;
            ellipse(centerX + waveX, centerY + waveY, 100 + i * 50, 100 + i * 50);
        }
    }
}

function updateGlobalEvolution() {
    evolutionTime += 0.008;
    colorTime += 0.7;
    morphPhase += 0.04;
    energyPhase += 0.03;
    lightingPhase += 0.02;
    spectrumShift += 0.5;
    
    // Evolve layer parameters with complex functions
    for (var i = 0; i < numLayers; i++) {
        var layer = layerParams[i];
        var time = evolutionTime + layer.phase;
        
        layer.a = aBase + sin(time * layer.frequency) * layer.amplitude * aRange;
        layer.b = bBase + cos(time * layer.frequency * 0.7) * layer.amplitude * bRange;
        
        // Advanced parameter coupling
        if (fractalization) {
            layer.a += 0.1 * sin(time * 0.3) * cos(time * 0.17);
            layer.b += 0.05 * cos(time * 0.4) * sin(time * 0.23);
        }
    }
    
    // Dynamic trail fade based on energy
    trailFade = 0.88 + 0.08 * sin(evolutionTime * 0.3);
    
    // Quantum field evolution
    if (resonanceMode) {
        quantumField = 0.5 + 0.5 * sin(evolutionTime * 0.2);
    }
    
    // Update gravitational waves
    for (var wave of gravitationalWaves) {
        wave.phase += wave.frequency;
    }
}

function updateParticleSystem() {
    for (var i = 0; i < currentDots; i++) {
        px[i] = x[i];
        py[i] = y[i];
        pz[i] = z[i];
        
        age[i] += 1;
        
        var layer = layerType[i];
        var params = layerParams[layer];
        var offset = layerOffsets[layer];
        
        // Enhanced Lozi equations with multi-dimensional coupling
        var oldX = x[i];
        var oldY = y[i];
        var oldZ = z[i];
        
        // Core Lozi transformation with layer-specific parameters
        var newX = 1 - params.a * Math.abs(oldX) + oldY;
        var newY = params.b * oldX;
        
        // Advanced 3D evolution with cross-dimensional coupling
        var zCoupling = (newX - oldX) * (newY - oldY) * 0.15;
        var newZ = oldZ + zCoupling;
        
        // Add gravitational wave influences
        if (resonanceMode) {
            for (var wave of gravitationalWaves) {
                var waveEffect = wave.amplitude * sin(wave.phase + 
                    oldX * wave.direction.x + oldY * wave.direction.y + oldZ * wave.direction.z);
                newX += waveEffect * wave.direction.x * 0.1;
                newY += waveEffect * wave.direction.y * 0.1;
                newZ += waveEffect * wave.direction.z * 0.1;
            }
        }
        
        // Particle swarm behavior
        if (particleSwarm && i % 10 === 0) {
            var swarmForce = calculateSwarmForce(i, oldX, oldY, oldZ);
            newX += swarmForce.x * 0.02;
            newY += swarmForce.y * 0.02;
            newZ += swarmForce.z * 0.02;
        }
        
        // Morphological perturbations
        var morphX = 0.05 * sin(morphPhase + oldX * 0.5) * cos(age[i] * 0.001);
        var morphY = 0.05 * cos(morphPhase + oldY * 0.5) * sin(age[i] * 0.001);
        var morphZ = 0.03 * sin(morphPhase + oldZ * 0.3 + age[i] * 0.0005);
        
        newX += morphX;
        newY += morphY;
        newZ += morphZ;
        
        // Calculate velocity and energy
        var dx = newX - oldX;
        var dy = newY - oldY;
        var dz = newZ - oldZ;
        velocity[i] = sqrt(dx*dx + dy*dy + dz*dz);
        
        // Energy evolution
        energy[i] += (velocity[i] - 0.1) * 0.01;
        energy[i] = constrain(energy[i], 0.2, 2.0);
        energy[i] *= 0.999; // Gradual energy decay
        
        x[i] = newX;
        y[i] = newY;
        z[i] = newZ;
        
        // Boundary management with energy-based constraints
        var boundary = 8 + energy[i] * 2;
        if (abs(x[i]) > boundary) x[i] *= 0.85;
        if (abs(y[i]) > boundary) y[i] *= 0.85;
        if (abs(z[i]) > boundary * 0.7) z[i] *= 0.8;
        
        // Sophisticated particle reset system
        if (age[i] > 3000 && random() < 0.0008) {
            x[i] = random(-1, 1) + offset.x;
            y[i] = random(-1, 1) + offset.y;
            z[i] = random(-2, 2) + offset.z;
            age[i] = 0;
            energy[i] = random(0.8, 1.2);
        }
    }
}

function calculateSwarmForce(index, px, py, pz) {
    var force = {x: 0, y: 0, z: 0};
    var count = 0;
    var radius = 2.0;
    
    // Sample nearby particles for swarm behavior
    for (var i = max(0, index - 50); i < min(currentDots, index + 50); i += 5) {
        if (i === index) continue;
        
        var dx = x[i] - px;
        var dy = y[i] - py;
        var dz = z[i] - pz;
        var dist = sqrt(dx*dx + dy*dy + dz*dz);
        
        if (dist < radius && dist > 0) {
            var strength = (radius - dist) / radius;
            force.x += dx * strength * 0.1;
            force.y += dy * strength * 0.1;
            force.z += dz * strength * 0.1;
            count++;
        }
    }
    
    if (count > 0) {
        force.x /= count;
        force.y /= count;
        force.z /= count;
    }
    
    return force;
}

function renderParticleSystem() {
    for (var i = 0; i < currentDots; i++) {
        renderAdvancedParticle(i);
    }
}

function renderAdvancedParticle(i) {
    var layer = layerType[i];
    var ageNorm = (age[i] % 2000) / 2000.0;
    var velocityNorm = constrain(velocity[i] * 15, 0, 1);
    var energyNorm = constrain((energy[i] - 0.2) / 1.8, 0, 1);
    
    // Advanced color system with spectral analysis
    var baseHue = (spectrumShift + layer * 80 + ageNorm * 40) % 360;
    var velocityHue = baseHue + velocityNorm * 60;
    var energyHue = velocityHue + energyNorm * 30;
    
    var saturation = 60 + 35 * sin(energyPhase + ageNorm * TWO_PI) + energyNorm * 20;
    var brightness = 40 + 50 * velocityNorm + 30 * energyNorm;
    brightness += 20 * sin(lightingPhase + i * 0.01);
    
    var alpha = 0.6 + 0.4 * sin(ageNorm * PI) * energyNorm;
    
    // Quantum field color modulation
    if (quantumField > 0) {
        var fieldEffect = quantumField * sin(evolutionTime + x[i] + y[i] + z[i]);
        energyHue += fieldEffect * 40;
        brightness += fieldEffect * 15;
    }
    
    stroke(energyHue, saturation, brightness, alpha);
    
    // Apply 3D rotations
    var rotated = rotate3DComplex(x[i], y[i], z[i], rotationX, rotationY, rotationZ);
    var currentX = rotated.x;
    var currentY = rotated.y;
    var currentZ = rotated.z;
    
    var prevRotated = rotate3DComplex(px[i], py[i], pz[i], rotationX, rotationY, rotationZ);
    var prevX = prevRotated.x;
    var prevY = prevRotated.y;
    var prevZ = prevRotated.z;
    
    // Advanced stroke weight calculation
    var baseWeight = 0.3 + velocityNorm * 2.5 + energyNorm * 1.5;
    if (particleGlow) {
        baseWeight += 0.5 * sin(lightingPhase + ageNorm * TWO_PI);
    }
    
    if (s === 1) {
        var depthFactor;
        if (per === "xy") {
            depthFactor = map(currentZ, -r/2, r/2, 0.3, 2.5);
        } else if (per === "xz") {
            depthFactor = map(currentY, -r/2, r/2, 0.3, 2.5);
        } else {
            depthFactor = map(currentX, -r/2, r/2, 0.3, 2.5);
        }
        strokeWeight(baseWeight * depthFactor);
    } else {
        strokeWeight(baseWeight);
    }
    
    // Render based on mode with enhanced effects
    if (l === 0) {
        // Enhanced point mode
        var pointSize = baseWeight * (1 + energyNorm * 0.5);
        strokeWeight(pointSize);
        
        if (per === "xy") {
            point(map(currentX, -r, r, -centerX, centerX), map(currentY, -r, r, centerY, -centerY));
        } else if (per === "xz") {
            point(map(currentX, -r, r, -centerX, centerX), map(currentZ, -r, r, centerY, -centerY));
        } else {
            point(map(currentY, -r, r, -centerX, centerX), map(currentZ, -r, r, centerY, -centerY));
        }
        
        // Add glow effect for high-energy particles
        if (particleGlow && energyNorm > 0.7) {
            stroke(energyHue, saturation * 0.5, brightness * 0.7, alpha * 0.3);
            strokeWeight(pointSize * 2);
            if (per === "xy") {
                point(map(currentX, -r, r, -centerX, centerX), map(currentY, -r, r, centerY, -centerY));
            } else if (per === "xz") {
                point(map(currentX, -r, r, -centerX, centerX), map(currentZ, -r, r, centerY, -centerY));
            } else {
                point(map(currentY, -r, r, -centerX, centerX), map(currentZ, -r, r, centerY, -centerY));
            }
        }
    } else {
        // Enhanced line mode with energy trails
        if (per === "xy") {
            line(map(prevX, -r, r, -centerX, centerX), map(prevY, -r, r, centerY, -centerY), 
                 map(currentX, -r, r, -centerX, centerX), map(currentY, -r, r, centerY, -centerY));
        } else if (per === "xz") {
            line(map(prevX, -r, r, -centerX, centerX), map(prevZ, -r, r, centerY, -centerY), 
                 map(currentX, -r, r, -centerX, centerX), map(currentZ, -r, r, centerY, -centerY));
        } else {
            line(map(prevY, -r, r, -centerX, centerX), map(prevZ, -r, r, centerY, -centerY), 
                 map(currentY, -r, r, -centerX, centerX), map(currentZ, -r, r, centerY, -centerY));
        }
    }
}

function renderGravitationalWaves() {
    stroke(180, 50, 30, 0.4);
    strokeWeight(1);
    noFill();
    
    for (var wave of gravitationalWaves) {
        var waveRadius = 50 + wave.amplitude * 200 * sin(wave.phase);
        ellipse(0, 0, waveRadius, waveRadius);
    }
}

function rotate3DComplex(x, y, z, angleX, angleY, angleZ) {
    // Rotate around X axis
    var cosX = cos(angleX), sinX = sin(angleX);
    var y1 = y * cosX - z * sinX;
    var z1 = y * sinX + z * cosX;
    
    // Rotate around Y axis
    var cosY = cos(angleY), sinY = sin(angleY);
    var x2 = x * cosY + z1 * sinY;
    var z2 = -x * sinY + z1 * cosY;
    
    // Rotate around Z axis
    var cosZ = cos(angleZ), sinZ = sin(angleZ);
    var x3 = x2 * cosZ - y1 * sinZ;
    var y3 = x2 * sinZ + y1 * cosZ;
    
    return {x: x3, y: y3, z: z2};
}

function performanceMonitoring(startTime) {
    var frameTime = millis() - startTime;
    frameTimeHistory.push(frameTime);
    if (frameTimeHistory.length > 30) {
        frameTimeHistory.shift();
    }
    
    frameCounter++;
    if (frameCounter % performanceCheckInterval === 0 && adaptiveQuality) {
        adjustQuality();
    }
}

function adjustQuality() {
    if (frameTimeHistory.length < 10) return;
    
    var avgFrameTime = frameTimeHistory.reduce((a, b) => a + b, 0) / frameTimeHistory.length;
    var targetFrameTime = 1000 / targetFPS;
    
    if (avgFrameTime > targetFrameTime * 1.3 && currentDots > 3000) {
        currentDots = Math.max(3000, Math.floor(currentDots * 0.85));
        particleSwarm = false; // Disable expensive effects
    } else if (avgFrameTime < targetFrameTime * 0.7 && currentDots < dots) {
        currentDots = Math.min(dots, Math.floor(currentDots * 1.15));
        particleSwarm = true;
    }
}

function displayAdvancedUI() {
    fill(0, 0, 100, 0.9);
    textAlign(LEFT);
    textSize(11);
    
    text("Particles: " + currentDots + "/" + dots, 10, 20);
    text("Auto-rotate: " + (autoRotate ? "ON" : "OFF") + " (R)", 10, 35);
    text("Complex rotation: " + (complexRotation ? "ON" : "OFF") + " (C)", 10, 50);
    text("Trail mode: " + (l === 1 ? "ON" : "OFF") + " (T)", 10, 65);
    text("Projection: " + per + " (P)", 10, 80);
    text("Swarm behavior: " + (particleSwarm ? "ON" : "OFF") + " (W)", 10, 95);
    text("Fractalization: " + (fractalization ? "ON" : "OFF") + " (F)", 10, 110);
    text("Resonance mode: " + (resonanceMode ? "ON" : "OFF") + " (Q)", 10, 125);
    text("Glow effects: " + (particleGlow ? "ON" : "OFF") + " (G)", 10, 140);
    
    text("Controls: Mouse drag/wheel, SPACE=reset", 10, 170);
}

// Enhanced interaction system
function mousePressed() {
    isDragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    autoRotate = false;
}

function mouseReleased() {
    isDragging = false;
}

function mouseDragged() {
    if (isDragging) {
        var deltaX = mouseX - lastMouseX;
        var deltaY = mouseY - lastMouseY;
        
        rotationY += deltaX * 0.01;
        rotationX += deltaY * 0.01;
        
        rotationX = constrain(rotationX, -PI/2, PI/2);
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

function mouseWheel(event) {
    var zoomFactor = 1 - event.delta * 0.001;
    zoom *= zoomFactor;
    zoom = constrain(zoom, 0.2, 10);
    return false;
}

function keyPressed() {
    switch(key.toLowerCase()) {
        case 'r':
            autoRotate = !autoRotate;
            break;
        case 'c':
            complexRotation = !complexRotation;
            break;
        case 't':
            l = 1 - l;
            break;
        case 'p':
            if (per === "xy") per = "xz";
            else if (per === "xz") per = "yz";
            else per = "xy";
            break;
        case 'w':
            particleSwarm = !particleSwarm;
            break;
        case 'f':
            fractalization = !fractalization;
            break;
        case 'q':
            resonanceMode = !resonanceMode;
            if (resonanceMode) {
                initializeGravitationalWaves();
            }
            break;
        case 'g':
            particleGlow = !particleGlow;
            break;
        case 's':
            s = 1 - s;
            break;
        case ' ':
            // Complete system reset
            initializeLayers();
            initializeGravitationalWaves();
            for (var i = 0; i < dots; i++) {
                var layer = layerType[i];
                var offset = layerOffsets[layer];
                x[i] = random(-1.5, 1.5) + offset.x;
                y[i] = random(-1.5, 1.5) + offset.y;
                z[i] = random(-3, 3) + offset.z;
                age[i] = 0;
                energy[i] = random(0.8, 1.2);
            }
            break;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    centerX = width / 2;
    centerY = height / 2;
}