// ===== HOPALONG ATTRACTOR WITH DYNAMIC PERFORMANCE =====
var dots = 10000;
var x = new Array(dots);
var y = new Array(dots);
var z = new Array(dots);
var px = new Array(dots);
var py = new Array(dots);
var pz = new Array(dots);

var dt = 0.002;
var r = 20;
var l = 0;
var s = 1;
var per = "xz";

// Hopalong Attractor parameters
var a = 0.4;
var b = 1.0;
var c = 0.0;

// Camera/view controls
var rotationX = 0;
var rotationY = 0;
var zoom = 1;
var isDragging = false;
var lastMouseX = 0;
var lastMouseY = 0;
var centerX, centerY;

// Performance monitoring and adaptive quality
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
        x[i] = random(-2, 2);
        y[i] = random(-2, 2);
        z[i] = random(-2, 2);
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
    
    // Update particles using Hopalong Attractor equations
    for (var i = 0; i < currentDots; i++) {
        px[i] = x[i];
        py[i] = y[i];
        pz[i] = z[i];
        
        // Hopalong Attractor equations
        var xx = y[i] - Math.sign(x[i]) * Math.sqrt(Math.abs(b * x[i] - c));
        var yy = a - x[i];
        var zz = z[i] + Math.sin(x[i] * 0.1) * 0.1; // Add simple z evolution
        
        x[i] = xx;
        y[i] = yy;
        z[i] = zz;
        
        // Scale for better visualization
        x[i] *= 0.1;
        y[i] *= 0.1;
        z[i] *= 0.1;
        
        renderParticle(i);
    }
    
    pop();
    
    // Performance monitoring and adaptive quality
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
    stroke(i % 360, 100, 100);
    
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

function adjustQuality() {
    if (frameTimeHistory.length < 10) return;
    
    var avgFrameTime = frameTimeHistory.reduce((a, b) => a + b, 0) / frameTimeHistory.length;
    var targetFrameTime = 1000 / targetFPS;
    
    if (avgFrameTime > targetFrameTime * 1.2 && currentDots > 1000) {
        currentDots = Math.max(1000, Math.floor(currentDots * 0.9));
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