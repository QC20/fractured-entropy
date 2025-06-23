// Thomas Attractor Enhanced - 3D Chaotic System Visualization
// Parameters: dx/dt = sin(y) - b*x, dy/dt = sin(z) - b*y, dz/dt = sin(x) - b*z

// ===== SYSTEM PARAMETERS =====
var dots = 10000;
var x = new Array(dots);
var y = new Array(dots);
var z = new Array(dots);
var nx = new Array(dots);
var ny = new Array(dots);
var nz = new Array(dots);
var px = new Array(dots);
var py = new Array(dots);
var pz = new Array(dots);

// Thomas Attractor specific parameters
var dt = 0.01;
var b = 0.208186; // Thomas attractor parameter
var r = 8;
var l = 1; // Line mode
var s = 1; // Stroke weight variation
var per = "xz"; // Projection plane

// Camera/view controls
var rotationX = 0;
var rotationY = 0;
var zoom = 1;
var isDragging = false;
var lastMouseX = 0;
var lastMouseY = 0;
var centerX, centerY;

// Performance monitoring and optimization
var frameTimeHistory = [];
var targetFPS = 60;
var currentDots = dots;
var performanceCheckInterval = 60;
var frameCounter = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB);
    background(0);
    
    centerX = width / 2;
    centerY = height / 2;
    
    // Initialize particle positions
    for (var i = 0; i < dots; i++) {
        x[i] = random(-2, 2);
        y[i] = random(-2, 2);
        z[i] = random(-2, 2);
    }
}

function draw() {
    var startTime = millis();
    
    if (l === 0) {
        background(0);
    } else {
        // Fade effect for trails
        fill(0, 0, 0, 20);
        noStroke();
        rect(0, 0, width, height);
    }
    
    if (s === 0) {
        strokeWeight(1);
    }
    
    // Apply transformations
    push();
    translate(centerX, centerY);
    scale(zoom);
    
    // Update and render particles
    for (var i = 0; i < currentDots; i++) {
        // Store previous position
        px[i] = x[i];
        py[i] = y[i];
        pz[i] = z[i];
        
        // Thomas Attractor equations
        nx[i] = sin(y[i]) - b * x[i];
        ny[i] = sin(z[i]) - b * y[i];
        nz[i] = sin(x[i]) - b * z[i];
        
        // Update positions
        x[i] += nx[i] * dt;
        y[i] += ny[i] * dt;
        z[i] += nz[i] * dt;
        
        // Render particle
        renderParticle(i);
    }
    
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
}

function renderParticle(i) {
    // Color based on particle index for variety
    stroke(i % 360, 80, 90);
    
    // Apply 3D rotation
    var rotatedCoords = rotate3D(x[i], y[i], z[i], rotationX, rotationY);
    var currentX = rotatedCoords.x;
    var currentY = rotatedCoords.y;
    var currentZ = rotatedCoords.z;
    
    var prevRotatedCoords = rotate3D(px[i], py[i], pz[i], rotationX, rotationY);
    var prevX = prevRotatedCoords.x;
    var prevY = prevRotatedCoords.y;
    var prevZ = prevRotatedCoords.z;
    
    // Depth-based stroke weight
    if (s === 1) {
        if (per === "xy") {
            strokeWeight(map(currentZ, -r/3, r/3, 0.5, 2));
        } else if (per === "xz") {
            strokeWeight(map(currentY, -r/3, r/3, 0.5, 2));
        } else {
            strokeWeight(map(currentX, -r/3, r/3, 0.5, 2));
        }
    }
    
    // Render based on mode
    if (l === 0) {
        // Point mode
        if (per === "xy") {
            point(map(currentX, -r, r, -centerX, centerX), map(currentY, -r, r, centerY, -centerY));
        } else if (per === "xz") {
            point(map(currentX, -r, r, -centerX, centerX), map(currentZ, -r, r, centerY, -centerY));
        } else {
            point(map(currentY, -r, r, -centerX, centerX), map(currentZ, -r, r, centerY, -centerY));
        }
    } else {
        // Line mode
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
    
    if (avgFrameTime > targetFrameTime * 1.2 && currentDots > 1000) {
        // Performance is poor, reduce particle count
        currentDots = Math.max(1000, Math.floor(currentDots * 0.9));
    } else if (avgFrameTime < targetFrameTime * 0.8 && currentDots < dots) {
        // Performance is good, increase particle count
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

function mousePressed() {
    isDragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
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
        
        // Constrain vertical rotation
        rotationX = constrain(rotationX, -PI/2, PI/2);
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

function mouseWheel(event) {
    var zoomFactor = 1 - event.delta * 0.001;
    zoom *= zoomFactor;
    zoom = constrain(zoom, 0.1, 5);
    return false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    centerX = width / 2;
    centerY = height / 2;
}