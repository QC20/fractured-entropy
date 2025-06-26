document.addEventListener('DOMContentLoaded', () => {
    const attractors = [
        'Aizawa Attractor',
        'Chen Attractor', 
        'Chua Attractor',
        'De Jong Attractor',
        'Dequan Li Attractor',
        'Euler Adaptive Attractor',
        'Halvorsen Attractor',
        'Ikeda Attractor',
        'Clifford Attractor',
        'Pickover Attractor',
        'Lorenz Attractor',
        'Thomas Attractor',
        'Runge-Kutta 4th Order Integration',
        'Rössler Attractor',
        'Nose-Hoover Attractor'
    ];

    let currentAttractorIndex = 0;
    let p5Instance = null;
    const button = document.querySelector('.learn-more');
    const attractorNameElement = document.getElementById('attractor-name');
    const canvasContainer = document.getElementById('canvas-container');
    
    // Store all the setup and draw functions that get loaded
    const attractorFunctions = {};
    
    // Capture functions as they get defined
    const originalSetup = window.setup;
    const originalDraw = window.draw;
    
    // Override the global setup and draw to capture them
    let setupQueue = [];
    let drawQueue = [];
    let currentCaptureIndex = 0;
    
    // Monkey patch to capture functions as they're defined
    Object.defineProperty(window, 'setup', {
        set: function(value) {
            if (typeof value === 'function') {
                setupQueue.push(value);
                console.log(`Captured setup function ${setupQueue.length}`);
            }
        },
        get: function() {
            return setupQueue[setupQueue.length - 1];
        },
        configurable: true
    });
    
    Object.defineProperty(window, 'draw', {
        set: function(value) {
            if (typeof value === 'function') {
                drawQueue.push(value);
                console.log(`Captured draw function ${drawQueue.length}`);
            }
        },
        get: function() {
            return drawQueue[drawQueue.length - 1];
        },
        configurable: true
    });

    function cleanupPrevious() {
        if (p5Instance) {
            try {
                p5Instance.remove();
            } catch (e) {
                console.log('Error removing p5 instance:', e);
            }
            p5Instance = null;
        }
        canvasContainer.innerHTML = '';
    }

    function showAttractorName(name) {
        attractorNameElement.textContent = name;
        attractorNameElement.style.opacity = '1';
        setTimeout(() => {
            attractorNameElement.style.opacity = '0';
        }, 5000);
    }

    function loadAttractor(index) {
        cleanupPrevious();
        
        setTimeout(() => {
            currentAttractorIndex = index;
            const attractorName = attractors[currentAttractorIndex];
            
            showAttractorName(attractorName);
            
            // Use the captured functions for this attractor
            const setupFunc = setupQueue[index];
            const drawFunc = drawQueue[index];
            
            if (setupFunc && drawFunc) {
                console.log(`Loading attractor ${index}: ${attractorName}`);
                
                const sketch = (p) => {
                    p.setup = function() {
                        setupFunc.call(this);
                    };
                    
                    p.draw = function() {
                        drawFunc.call(this);
                    };
                    
                    // Add common interaction handlers
                    p.mousePressed = function() {
                        if (typeof window.mousePressed === 'function' && 
                            this.mouseX >= 0 && this.mouseX <= this.width && 
                            this.mouseY >= 0 && this.mouseY <= this.height) {
                            window.mousePressed.call(this);
                        }
                    };
                    
                    p.mouseReleased = function() {
                        if (typeof window.mouseReleased === 'function') {
                            window.mouseReleased.call(this);
                        }
                    };
                    
                    p.mouseDragged = function() {
                        if (typeof window.mouseDragged === 'function' && 
                            this.mouseX >= 0 && this.mouseX <= this.width && 
                            this.mouseY >= 0 && this.mouseY <= this.height) {
                            window.mouseDragged.call(this);
                        }
                    };
                    
                    p.mouseWheel = function(event) {
                        if (typeof window.mouseWheel === 'function') {
                            window.mouseWheel.call(this, event);
                            return false;
                        }
                    };
                    
                    p.windowResized = function() {
                        if (typeof window.windowResized === 'function') {
                            window.windowResized.call(this);
                        }
                    };
                };
                
                try {
                    p5Instance = new p5(sketch, canvasContainer);
                    console.log(`Successfully created p5 instance for ${attractorName}`);
                } catch (e) {
                    console.error('Error creating p5 instance:', e);
                }
            } else {
                console.error(`Functions not found for attractor ${index}: ${attractorName}`);
                console.log(`Available setup functions: ${setupQueue.length}, draw functions: ${drawQueue.length}`);
                
                // If functions aren't captured yet, wait a bit and try again
                if (setupQueue.length < attractors.length) {
                    setTimeout(() => loadAttractor(index), 1000);
                }
            }
        }, 200);
    }

    button.addEventListener('click', () => {
        const nextIndex = (currentAttractorIndex + 1) % attractors.length;
        loadAttractor(nextIndex);
    });

    // Wait for all scripts to load, then start
    window.addEventListener('load', () => {
        setTimeout(() => {
            console.log(`Captured ${setupQueue.length} setup functions and ${drawQueue.length} draw functions`);
            loadAttractor(0);
        }, 500);
    });
    
    // Fallback: start after DOM is ready if window load doesn't fire
    setTimeout(() => {
        if (!p5Instance && setupQueue.length > 0) {
            console.log('Fallback: Starting first attractor');
            loadAttractor(0);
        }
    }, 2000);
});