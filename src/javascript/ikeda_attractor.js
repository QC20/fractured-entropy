// ===== ENHANCED IKEDA ATTRACTOR SYSTEM =====
// Multiple attractor instances with dynamic evolution and visual effects

var dots = 12000;
var x = new Array(dots);
var y = new Array(dots);
var z = new Array(dots);
var px = new Array(dots);
var py = new Array(dots);
var pz = new Array(dots);
var age = new Array(dots);
var velocity = new Array(dots);
var attractorType = new Array(dots);

// Enhanced Ikeda parameters with evolution
var a = 1.0;
var b = 0.9;
var k = 0.4;
var p = 6.0;
var dt = 0.015;

// Parameter evolution system
var parameterTime = 0;
var aBase = 1.0, aRange = 0.5;
var bBase = 0.9, bRange = 0.3;
var kBase = 0.4, kRange = 0.6;
var pBase = 6.0, pRange = 4.0;

// Multi-attractor system
var numAttractors = 3;
var attractorParams = [];
var attractorCenters = [];

// Visual parameters
var r = 25;
var l = 1; // Start with lines for more dynamic look
var s = 1;
var per = "xz";
var trailLength = 0.95; // Trail fade factor
var pulsePhase = 0;

// Camera/view controls
var rotationX = 0.2;
var rotationY = 0;
var autoRotate = true;
var autoRotateSpeed = 0.005;
var zoom = 1.2;
var isDragging = false;
var lastMouseX = 0;
var lastMouseY = 0;
var centerX, centerY;

// Enhanced visual effects
var colorShift = 0;
var wavePhase = 0;
var bloomIntensity = 1.0;
var particleSize = 1;

// Adaptive performance system
var frameTimeHistory = [];
var targetFPS = 60;
var currentDots = dots;
var performanceCheckInterval = 60;
var frameCounter = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 1);
    
    centerX = width / 2;
    centerY = height / 2;
    
    // Initialize multiple attractor parameter sets
    initializeAttractors();
    
    // Initialize particles with varied starting conditions
    for (var i = 0; i < dots; i++) {
        // Distribute particles across different attractors
        attractorType[i] = floor(i / (dots / numAttractors));
        if (attractorType[i] >= numAttractors) attractorType[i] = numAttractors - 1;
        
        var center = attractorCenters[attractorType[i]];
        x[i] = random(center.x - 3, center.x + 3);
        y[i] = random(center.y - 3, center.y + 3);
        z[i] = random(center.z - 3, center.z + 3);
        
        age[i] = random(0, 1000);
        velocity[i] = 0;
    }
}

function initializeAttractors() {
    attractorParams = [];
    attractorCenters = [];
    
    for (var i = 0; i < numAttractors; i++) {
        attractorParams.push({
            a: aBase + random(-aRange, aRange),
            b: bBase + random(-bRange, bRange),
            k: kBase + random(-kRange, kRange),
            p: pBase + random(-pRange, pRange),
            phase: random(0, TWO_PI)
        });
        
        var angle = (i / numAttractors) * TWO_PI;
        attractorCenters.push({
            x: cos(angle) * 2,
            y: sin(angle) * 2,
            z: random(-2, 2)
        });
    }
}

function draw() {
    var startTime = millis();
    
    // Dynamic background with trails
    if (l === 0) {
        background(0, 0, 5); // Dark background
    } else {
        // Fade previous frame for trail effect
        push();
        fill(0, 0, 5, 1 - trailLength);
        noStroke();
        rect(0, 0, width, height);
        pop();
    }
    
    // Update global parameters
    updateGlobalParameters();
    
    // Apply transformations
    push();
    translate(centerX, centerY);
    scale(zoom);
    
    // Auto-rotation
    if (autoRotate) {
        rotationY += autoRotateSpeed;
    }
    
    // Update and render particles
    updateParticles();
    renderParticles();
    
    pop();
    
    // Performance monitoring
    var frameTime = millis() - startTime;
    frameTimeHistory.push(frameTime);
    if (frameTimeHistory.length > 30) {
        frameTimeHistory.shift();
    }
    
    frameCounter++;
    if (frameCounter % performanceCheckInterval === 0) {
        adjustQuality();
    }
    
    // Display info
    displayInfo();
}

function updateGlobalParameters() {
    parameterTime += 0.01;
    colorShift += 0.5;
    wavePhase += 0.03;
    pulsePhase += 0.05;
    
    // Evolve attractor parameters
    for (var i = 0; i < numAttractors; i++) {
        var params = attractorParams[i];
        var time = parameterTime + params.phase;
        
        params.a = aBase + sin(time * 0.3) * aRange * 0.5;
        params.b = bBase + cos(time * 0.2) * bRange * 0.5;
        params.k = kBase + sin(time * 0.4 + PI) * kRange * 0.3;
        params.p = pBase + cos(time * 0.15) * pRange * 0.4;
    }
    
    // Dynamic trail length
    trailLength = 0.85 + 0.1 * sin(parameterTime * 0.5);
}

function updateParticles() {
    for (var i = 0; i < currentDots; i++) {
        px[i] = x[i];
        py[i] = y[i];
        pz[i] = z[i];
        
        age[i] += 1;
        
        var attractor = attractorType[i];
        var params = attractorParams[attractor];
        var center = attractorCenters[attractor];
        
        // Enhanced Ikeda equations with perturbations
        var t = params.k - params.p / (1 + x[i]*x[i] + y[i]*y[i]);
        var cosT = cos(t);
        var sinT = sin(t);
        
        var newX = params.a + params.b * (x[i] * cosT - y[i] * sinT);
        var newY = params.b * (x[i] * sinT + y[i] * cosT);
        
        // Add wave-based perturbations for more organic movement
        var waveX = 0.1 * sin(wavePhase + x[i] * 0.1) * cos(age[i] * 0.01);
        var waveY = 0.1 * cos(wavePhase + y[i] * 0.1) * sin(age[i] * 0.01);
        
        newX += waveX;
        newY += waveY;
        
        // Enhanced Z-axis evolution with coupling to X,Y
        var zForce = 0.02 * sin(x[i] + y[i] + wavePhase) * cos(age[i] * 0.005);
        zForce += 0.01 * (newX - x[i]) + 0.01 * (newY - y[i]); // Couple to XY motion
        var newZ = z[i] + zForce;
        
        // Calculate velocity for visual effects
        velocity[i] = sqrt((newX - x[i])*(newX - x[i]) + (newY - y[i])*(newY - y[i]) + (newZ - z[i])*(newZ - z[i]));
        
        x[i] = newX;
        y[i] = newY;
        z[i] = newZ;
        
        // Boundary management with soft constraints
        if (abs(x[i]) > 15) x[i] *= 0.9;
        if (abs(y[i]) > 15) y[i] *= 0.9;
        if (abs(z[i]) > 10) z[i] *= 0.8;
        
        // Occasionally reset particles for continuous evolution
        if (age[i] > 2000 && random() < 0.001) {
            x[i] = center.x + random(-2, 2);
            y[i] = center.y + random(-2, 2);
            z[i] = center.z + random(-2, 2);
            age[i] = 0;
        }
    }
}

function renderParticles() {
    for (var i = 0; i < currentDots; i++) {
        renderParticle(i);
    }
}

function renderParticle(i) {
    var attractor = attractorType[i];
    var ageNorm = (age[i] % 1000) / 1000.0;
    var velocityNorm = constrain(velocity[i] * 20, 0, 1);
    
    // Dynamic color based on multiple factors
    var hue = (colorShift + attractor * 120 + ageNorm * 60 + velocityNorm * 30) % 360;
    var saturation = 70 + 30 * sin(pulsePhase + ageNorm * TWO_PI);
    var brightness = 60 + 40 * velocityNorm + 20 * sin(pulsePhase * 2 + i * 0.01);
    var alpha = 0.7 + 0.3 * sin(ageNorm * PI);
    
    stroke(hue, saturation, brightness, alpha);
    
    // Apply 3D rotation
    var rotatedCoords = rotate3D(x[i], y[i], z[i], rotationX, rotationY);
    var currentX = rotatedCoords.x;
    var currentY = rotatedCoords.y;
    var currentZ = rotatedCoords.z;
    
    var prevRotatedCoords = rotate3D(px[i], py[i], pz[i], rotationX, rotationY);
    var prevX = prevRotatedCoords.x;
    var prevY = prevRotatedCoords.y;
    var prevZ = prevRotatedCoords.z;
    
    // Dynamic stroke weight based on velocity and depth
    var baseWeight = 0.5 + velocityNorm * 2;
    if (s === 1) {
        if (per === "xy") {
            strokeWeight(baseWeight * map(currentZ, -r/2, r/2, 0.5, 3));
        } else if (per === "xz") {
            strokeWeight(baseWeight * map(currentY, -r/2, r/2, 0.5, 3));
        } else {
            strokeWeight(baseWeight * map(currentX, -r/2, r/2, 0.5, 3));
        }
    } else {
        strokeWeight(baseWeight);
    }
    
    // Render based on mode
    if (l === 0) {
        // Point mode with size variation
        var pointSize = particleSize * (1 + velocityNorm);
        strokeWeight(pointSize);
        
        if (per === "xy") {
            point(map(currentX, -r, r, -centerX, centerX), map(currentY, -r, r, centerY, -centerY));
        } else if (per === "xz") {
            point(map(currentX, -r, r, -centerX, centerX), map(currentZ, -r, r, centerY, -centerY));
        } else {
            point(map(currentY, -r, r, -centerX, centerX), map(currentZ, -r, r, centerY, -centerY));
        }
    } else {
        // Line mode for trails
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

function adjustQuality() {
    if (frameTimeHistory.length < 10) return;
    
    var avgFrameTime = frameTimeHistory.reduce((a, b) => a + b, 0) / frameTimeHistory.length;
    var targetFrameTime = 1000 / targetFPS;
    
    if (avgFrameTime > targetFrameTime * 1.2 && currentDots > 2000) {
        currentDots = Math.max(2000, Math.floor(currentDots * 0.9));
    } else if (avgFrameTime < targetFrameTime * 0.8 && currentDots < dots) {
        currentDots = Math.min(dots, Math.floor(currentDots * 1.1));
    }
}

function rotate3D(x, y, z, angleX, angleY) {
    // Rotate around X axis
    var cosX = cos(angleX);
    var sinX = sin(angleX);
    var y1 = y * cosX - z * sinX;
    var z1 = y * sinX + z * cosX;
    
    // Rotate around Y axis
    var cosY = cos(angleY);
    var sinY = sin(angleY);
    var x2 = x * cosY + z1 * sinY;
    var z2 = -x * sinY + z1 * cosY;
    
    return {x: x2, y: y1, z: z2};
}

function displayInfo() {
    fill(0, 0, 100, 0.8);
    textAlign(LEFT);
    textSize(12);
    text("Particles: " + currentDots, 10, 20);
    text("Auto-rotate: " + (autoRotate ? "ON" : "OFF") + " (press R)", 10, 35);
    text("Trail mode: " + (l === 1 ? "ON" : "OFF") + " (press T)", 10, 50);
    text("Projection: " + per + " (press P)", 10, 65);
    text("Mouse: drag to rotate, wheel to zoom", 10, 80);
}

// Enhanced interaction controls
function mousePressed() {
    isDragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    autoRotate = false; // Stop auto-rotation when user interacts
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
    zoom = constrain(zoom, 0.2, 8);
    return false;
}

function keyPressed() {
    if (key === 'r' || key === 'R') {
        autoRotate = !autoRotate;
    } else if (key === 't' || key === 'T') {
        l = 1 - l; // Toggle trail mode
    } else if (key === 'p' || key === 'P') {
        // Cycle through projections
        if (per === "xy") per = "xz";
        else if (per === "xz") per = "yz";
        else per = "xy";
    } else if (key === ' ') {
        // Reset attractors with new parameters
        initializeAttractors();
        for (var i = 0; i < dots; i++) {
            age[i] = 0;
        }
    } else if (key === 's' || key === 'S') {
        s = 1 - s; // Toggle size variation
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    centerX = width / 2;
    centerY = height / 2;
}