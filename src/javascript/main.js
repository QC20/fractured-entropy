document.addEventListener('DOMContentLoaded', () => {
    const attractors = [
        { name: 'Aizawa Attractor', path: './src/javascript/aizawa_attractor.js' },
        { name: 'Chen Attractor', path: './src/javascript/chen_attractor.js' },
        { name: 'Chua Attractor', path: './src/javascript/chua_attractor.js' },
        { name: 'De Jong Attractor', path: './src/javascript/dejong_attractor.js' },
        { name: 'Dequan Li Attractor', path: './src/javascript/dequan_li_attractor.js' },
        { name: 'Euler Adaptive Attractor', path: './src/javascript/euler_adaptive_attractor.js' },
        { name: 'Halvorsen Attractor', path: './src/javascript/halvorsen_attractor.js' },
        { name: 'Ikeda Attractor', path: './src/javascript/ikeda_attractor.js' },
        { name: 'Clifford Attractor', path: './src/javascript/clifford_attractor.js' },
        { name: 'Pickover Attractor', path: './src/javascript/pickover_attractor.js' },
        { name: 'Lorenz Attractor', path: './src/javascript/lorenz_attractor.js' },
        { name: 'Thomas Attractor', path: './src/javascript/thomas_attractor.js' },
        { name: 'Runge-Kutta 4th Order Integration', path: './src/javascript/Runge-Kutta_4th_order_integration.js' },
        { name: 'Rössler Attractor', path: './src/javascript/rossler_attractor.js' },
        { name: 'Nose-Hoover Attractor', path: './src/javascript/nose_hoover_attractor.js' }
    ];

    let currentAttractorIndex = 0;
    const button = document.querySelector('.learn-more');
    const attractorNameElement = document.getElementById('attractor-name');
    const canvasContainer = document.getElementById('canvas-container');
    let p5Instance = null;
    let loadedScripts = new Set(); // Track loaded scripts to avoid duplicates

    function cleanupPrevious() {
        // Remove p5 instance
        if (p5Instance) {
            try {
                p5Instance.remove();
            } catch (e) {
                console.log('Error removing p5 instance:', e);
            }
            p5Instance = null;
        }

        // Clear container
        canvasContainer.innerHTML = '';

        // Clear global p5 functions to prevent conflicts
        const p5Functions = ['setup', 'draw', 'mousePressed', 'mouseReleased', 'mouseDragged', 'mouseWheel', 'windowResized', 'keyPressed', 'keyReleased'];
        p5Functions.forEach(func => {
            if (typeof window[func] !== 'undefined') {
                delete window[func];
            }
        });

        // Also clear any variables that might be defined by attractors
        const commonVars = ['x', 'y', 'z', 'dt', 'points', 'particles', 'angle', 'scale', 'camera'];
        commonVars.forEach(varName => {
            if (typeof window[varName] !== 'undefined' && window[varName] !== document && window[varName] !== window) {
                try {
                    delete window[varName];
                } catch (e) {
                    // Some variables can't be deleted, that's ok
                }
            }
        });
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            // If script is already loaded, remove it first
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                existingScript.remove();
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = false; // Ensure synchronous loading
            
            script.onload = () => {
                loadedScripts.add(src);
                resolve();
            };
            
            script.onerror = () => {
                console.error('Error loading script:', src);
                reject(new Error(`Failed to load ${src}`));
            };
            
            document.head.appendChild(script);
        });
    }

    function showAttractorName(name) {
        attractorNameElement.textContent = name;
        attractorNameElement.style.opacity = '1';
        setTimeout(() => {
            attractorNameElement.style.opacity = '0';
        }, 5000);
    }

    async function loadAttractor(index) {
        cleanupPrevious();

        // Add a small delay to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        currentAttractorIndex = index;
        const attractor = attractors[currentAttractorIndex];

        // Show attractor name
        showAttractorName(attractor.name);

        try {
            // Load the attractor script
            await loadScript(attractor.path);
            
            // Give the script time to define its functions
            await new Promise(resolve => setTimeout(resolve, 200));

            // Check if setup function exists and create p5 instance
            if (typeof window.setup === 'function') {
                console.log(`Creating p5 instance for ${attractor.name}`);
                
                // Create p5 instance in instance mode to avoid conflicts
                const sketch = (p) => {
                    // Capture the current setup and draw functions
                    const currentSetup = window.setup;
                    const currentDraw = window.draw;
                    const currentMousePressed = window.mousePressed;
                    const currentMouseReleased = window.mouseReleased;
                    const currentMouseDragged = window.mouseDragged;
                    const currentMouseWheel = window.mouseWheel;
                    const currentWindowResized = window.windowResized;
                    
                    p.setup = function() {
                        // Call the attractor's setup function in the context of this p5 instance
                        if (currentSetup) {
                            currentSetup.call(this);
                        }
                    };
                    
                    p.draw = function() {
                        // Call the attractor's draw function in the context of this p5 instance
                        if (currentDraw) {
                            currentDraw.call(this);
                        }
                    };

                    // Add interaction handlers if they exist
                    if (currentMousePressed) {
                        p.mousePressed = function() {
                            if (this.mouseX >= 0 && this.mouseX <= this.width && this.mouseY >= 0 && this.mouseY <= this.height) {
                                currentMousePressed.call(this);
                            }
                        };
                    }

                    if (currentMouseReleased) {
                        p.mouseReleased = function() {
                            currentMouseReleased.call(this);
                        };
                    }

                    if (currentMouseDragged) {
                        p.mouseDragged = function() {
                            if (this.mouseX >= 0 && this.mouseX <= this.width && this.mouseY >= 0 && this.mouseY <= this.height) {
                                currentMouseDragged.call(this);
                            }
                        };
                    }

                    if (currentMouseWheel) {
                        p.mouseWheel = function(event) {
                            currentMouseWheel.call(this, event);
                            return false; // Prevent page scrolling
                        };
                    }

                    if (currentWindowResized) {
                        p.windowResized = function() {
                            currentWindowResized.call(this);
                        };
                    }
                };

                p5Instance = new p5(sketch, canvasContainer);
                console.log(`Successfully loaded ${attractor.name}`);
                
            } else {
                console.error(`Setup function not found for ${attractor.name}`);
                console.log('Available window functions:', Object.keys(window).filter(key => typeof window[key] === 'function' && (key.includes('setup') || key.includes('draw'))));
            }
        } catch (error) {
            console.error(`Error loading ${attractor.name}:`, error);
            
            // Try to load the next attractor if this one fails
            setTimeout(() => {
                const nextIndex = (currentAttractorIndex + 1) % attractors.length;
                if (nextIndex !== index) { // Avoid infinite loop
                    loadAttractor(nextIndex);
                }
            }, 1000);
        }
    }

    // Button click handler
    button.addEventListener('click', () => {
        button.disabled = true; // Prevent rapid clicking
        const nextIndex = (currentAttractorIndex + 1) % attractors.length;
        
        loadAttractor(nextIndex).finally(() => {
            // Re-enable button after loading completes
            setTimeout(() => {
                button.disabled = false;
            }, 500);
        });
    });

    // Load the first attractor
    console.log('Starting with first attractor...');
    loadAttractor(0);
});