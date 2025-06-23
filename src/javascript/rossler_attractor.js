// ===== RÖSSLER ATTRACTOR WITH RK4 INTEGRATION AND ADAPTIVE PERFORMANCE =====
var dots = 10000;
var x = new Array(dots);
var y = new Array(dots);
var z = new Array(dots);
var px = new Array(dots);
var py = new Array(dots);
var pz = new Array(dots);

// Runge-Kutta 4th order integration arrays
var k1x = new Array(dots), k1y = new Array(dots), k1z = new Array(dots);
var k2x = new Array(dots), k2y = new Array(dots), k2z = new Array(dots);
var k3x = new Array(dots), k3y = new Array(dots), k3z = new Array(dots);
var k4x = new Array(dots), k4y = new Array(dots), k4z = new Array(dots);

var dt = 0.01;
var r = 20;
var l = 0;
var s = 1;
var per = "xz";

// Rössler Attractor parameters
var a = 0.2;
var b = 0.2;
var c = 5.7;

// Camera/view controls
var rotationX = 0;
var rotationY = 0;
var zoom = 1;
var isDragging = false;
var lastMouseX = 0;
var lastMouseY = 0;
var centerX, centerY;

// Adaptive performance system
var frameTimeHistory = [];
var targetFPS = 60;
var currentDots = dots;
var performanceCheckInterval = 60;
var frameCounter = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB);
    background(255);
    
    centerX = width / 2;
    centerY = height / 2;
    
    // Initialize particle positions
    for (var i = 0; i < dots; i++) {
        x[i] = random(-10, 10);
        y[i] = random(-10, 10);
        z[i] = random(-10, 10);
    }
}

function draw() {
    var startTime = millis();
    
    if (l === 0) {
        background(255);
    }
    
    if (s === 0) {
        strokeWeight(1);
    }
    
    // Apply transformations
    push();
    translate(centerX, centerY);
    scale(zoom);
    
    // Update particles using Runge-Kutta 4th order
    updateParticlesRK4();
    
    // Render particles
    for (var i = 0; i < currentDots; i++) {
        renderParticle(i);
    }
    
    pop();
    
    // Adaptive performance monitoring
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

// Runge-Kutta 4th order integration for Rössler Attractor
function updateParticlesRK4() {
    for (var i = 0; i < currentDots; i++) {
        px[i] = x[i];
        py[i] = y[i];
        pz[i] = z[i];
        
        // k1 = f(t, y)
        var derivs1 = getRosslerDerivatives(x[i], y[i], z[i]);
        k1x[i] = derivs1.dx;
        k1y[i] = derivs1.dy;
        k1z[i] = derivs1.dz;
        
        // k2 = f(t + dt/2, y + k1*dt/2)
        var derivs2 = getRosslerDerivatives(
            x[i] + k1x[i] * dt * 0.5,
            y[i] + k1y[i] * dt * 0.5,
            z[i] + k1z[i] * dt * 0.5
        );
        k2x[i] = derivs2.dx;
        k2y[i] = derivs2.dy;
        k2z[i] = derivs2.dz;
        
        // k3 = f(t + dt/2, y + k2*dt/2)
        var derivs3 = getRosslerDerivatives(
            x[i] + k2x[i] * dt * 0.5,
            y[i] + k2y[i] * dt * 0.5,
            z[i] + k2z[i] * dt * 0.5
        );
        k3x[i] = derivs3.dx;
        k3y[i] = derivs3.dy;
        k3z[i] = derivs3.dz;
        
        // k4 = f(t + dt, y + k3*dt)
        var derivs4 = getRosslerDerivatives(
            x[i] + k3x[i] * dt,
            y[i] + k3y[i] * dt,
            z[i] + k3z[i] * dt
        );
        k4x[i] = derivs4.dx;
        k4y[i] = derivs4.dy;
        k4z[i] = derivs4.dz;
        
        // Update position using weighted average
        var dx = (k1x[i] + 2*k2x[i] + 2*k3x[i] + k4x[i]) / 6;
        var dy = (k1y[i] + 2*k2y[i] + 2*k3y[i] + k4y[i]) / 6;
        var dz = (k1z[i] + 2*k2z[i] + 2*k3z[i] + k4z[i]) / 6;
        
        x[i] += dx * dt;
        y[i] += dy * dt;
        z[i] += dz * dt;
    }
}

// Rössler Attractor differential equations
function getRosslerDerivatives(px, py, pz) {
    return {
        dx: -py - pz,
        dy: px + a * py,
        dz: b + pz * (px - c)
    };
}

// Adaptive quality system
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

// Render individual particle
function renderParticle(i) {
    stroke(i%360, 100, 100);
    
    // Apply 3D rotation
    var rotatedCoords = rotate3D(x[i], y[i], z[i], rotationX, rotationY);
    var currentX = rotatedCoords.x;
    var currentY = rotatedCoords.y;
    var currentZ = rotatedCoords.z;
    
    var prevRotatedCoords = rotate3D(px[i], py[i], pz[i], rotationX, rotationY);
    var prevX = prevRotatedCoords.x;
    var prevY = prevRotatedCoords.y;
    var prevZ = prevRotatedCoords.z;
    
    if (s === 1) {
        if (per === "xy") {
            strokeWeight(map(currentZ, -r/3, r/3, 2, 3));
        } else if (per === "xz") {
            strokeWeight(map(currentY, -r/3, r/3, 3, 2));
        } else {
            strokeWeight(map(currentX, -r/3, r/3, 2, 3));
        }
    }
    
    if (l === 0) {
        if (per === "xy") {
            point(map(currentX, -r, r, -centerX, centerX), map(currentY, -r, r, centerY, -centerY));
        } else if (per === "xz") {
            point(map(currentX, -r, r, -centerX, centerX), map(currentZ, -r, r, centerY, -centerY));
        } else {
            point(map(currentY, -r, r, -centerX, centerX), map(currentZ, -r, r, centerY, -centerY));
        }
    } else {
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
    return false; // Prevent page scrolling
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    centerX = width / 2;
    centerY = height / 2;
}