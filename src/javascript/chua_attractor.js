// ===== CHUA CIRCUIT ATTRACTOR SYSTEM =====

// System parameters
let dots = 5000;
let particles = [];
let dt = 0.01;
let scale = 80;

// Chua circuit parameters
let alpha = 15.6;
let beta = 28.0;
let m0 = -1.143;
let m1 = -0.714;

// Camera controls
let rotationX = 0;
let rotationY = 0;
let zoom = 1;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

// Particle class
class Particle {
    constructor() {
        this.x = random(-0.1, 0.1);
        this.y = random(-0.1, 0.1);
        this.z = random(-0.1, 0.1);
        this.prevX = this.x;
        this.prevY = this.y;
        this.prevZ = this.z;
        this.hue = random(360);
    }
    
    update() {
        this.prevX = this.x;
        this.prevY = this.y;
        this.prevZ = this.z;
        
        // Runge-Kutta 4th order integration
        let k1 = this.getChuaDerivatives(this.x, this.y, this.z);
        
        let k2 = this.getChuaDerivatives(
            this.x + k1.dx * dt * 0.5,
            this.y + k1.dy * dt * 0.5,
            this.z + k1.dz * dt * 0.5
        );
        
        let k3 = this.getChuaDerivatives(
            this.x + k2.dx * dt * 0.5,
            this.y + k2.dy * dt * 0.5,
            this.z + k2.dz * dt * 0.5
        );
        
        let k4 = this.getChuaDerivatives(
            this.x + k3.dx * dt,
            this.y + k3.dy * dt,
            this.z + k3.dz * dt
        );
        
        // Update position
        let dx = (k1.dx + 2*k2.dx + 2*k3.dx + k4.dx) / 6;
        let dy = (k1.dy + 2*k2.dy + 2*k3.dy + k4.dy) / 6;
        let dz = (k1.dz + 2*k2.dz + 2*k3.dz + k4.dz) / 6;
        
        this.x += dx * dt;
        this.y += dy * dt;
        this.z += dz * dt;
    }
    
    getChuaDerivatives(px, py, pz) {
        // Chua diode nonlinearity
        let h = m1 * px + 0.5 * (m0 - m1) * (abs(px + 1) - abs(px - 1));
        
        return {
            dx: alpha * (py - px - h),
            dy: px - py + pz,
            dz: -beta * py
        };
    }
    
    display() {
        // Apply 3D rotation
        let current = this.rotate3D(this.x, this.y, this.z);
        let prev = this.rotate3D(this.prevX, this.prevY, this.prevZ);
        
        // Set color
        stroke((this.hue + frameCount * 0.5) % 360, 80, 90);
        strokeWeight(0.8);
        
        // Draw line from previous to current position
        line(
            prev.x * scale, prev.z * scale,
            current.x * scale, current.z * scale
        );
    }
    
    rotate3D(x, y, z) {
        // Rotate around X axis
        let cosX = cos(rotationX);
        let sinX = sin(rotationX);
        let y1 = y * cosX - z * sinX;
        let z1 = y * sinX + z * cosX;
        
        // Rotate around Y axis
        let cosY = cos(rotationY);
        let sinY = sin(rotationY);
        let x2 = x * cosY + z1 * sinY;
        let z2 = -x * sinY + z1 * cosY;
        
        return {x: x2, y: y1, z: z2};
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    background(0);
    
    // Initialize particles
    particles = [];
    for (let i = 0; i < dots; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    // Fade effect
    fill(0, 0, 0, 15);
    noStroke();
    rect(0, 0, width, height);
    
    // Center the view
    push();
    translate(width/2, height/2);
    scale(zoom);
    
    // Update and display particles
    for (let particle of particles) {
        particle.update();
        particle.display();
    }
    
    pop();
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
        let deltaX = mouseX - lastMouseX;
        let deltaY = mouseY - lastMouseY;
        
        rotationY += deltaX * 0.01;
        rotationX += deltaY * 0.01;
        
        rotationX = constrain(rotationX, -PI/2, PI/2);
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

function mouseWheel(event) {
    let zoomFactor = 1 - event.delta * 0.001;
    zoom *= zoomFactor;
    zoom = constrain(zoom, 0.1, 3);
    return false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}