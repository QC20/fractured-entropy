document.addEventListener('DOMContentLoaded', () => {
    const attractors = [
        { name: 'Aizawa Attractor', path: './src/javascript/aizawa_attractor.js' },
        { name: 'Chen Attractor', path: './src/javascript/chen_attractor.js' },
        { name: 'Chua Attractor', path: './src/javascript/chua_attractor.js' },
        { name: 'De Jong Attractor', path: './src/javascript/dejong_attractor.js' },
        { name: 'Dequan Li Attractor', path: './src/javascript/dequan_li_attractor.js' },
        { name: 'Euler Adaptive Attractor', path: './src/javascript/euler_adaptive_attractor.js' },
        { name: 'Halvorsen Attractor', path: './src/javascript/halvorsen_attractor.js' }
    ];

    let currentAttractorIndex = 0;
    const button = document.querySelector('.learn-more');
    const attractorNameElement = document.getElementById('attractor-name');
    const canvasContainer = document.getElementById('canvas-container');
    let p5Instance = null;
    let currentScriptElement = null;

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

        // Remove script element
        if (currentScriptElement && currentScriptElement.parentNode) {
            currentScriptElement.parentNode.removeChild(currentScriptElement);
            currentScriptElement = null;
        }

        // Clear container
        canvasContainer.innerHTML = '';

        // Clear global p5 functions to prevent conflicts
        if (typeof window.setup !== 'undefined') {
            delete window.setup;
        }
        if (typeof window.draw !== 'undefined') {
            delete window.draw;
        }
        if (typeof window.mousePressed !== 'undefined') {
            delete window.mousePressed;
        }
        if (typeof window.mouseReleased !== 'undefined') {
            delete window.mouseReleased;
        }
        if (typeof window.mouseDragged !== 'undefined') {
            delete window.mouseDragged;
        }
        if (typeof window.mouseWheel !== 'undefined') {
            delete window.mouseWheel;
        }
        if (typeof window.windowResized !== 'undefined') {
            delete window.windowResized;
        }
    }

    function loadAttractor(index) {
        cleanupPrevious();

        // Wait a moment for cleanup to complete
        setTimeout(() => {
            currentAttractorIndex = index;
            const attractor = attractors[currentAttractorIndex];

            // Display the attractor name with fade effect
            attractorNameElement.textContent = attractor.name;
            attractorNameElement.style.opacity = '1';
            setTimeout(() => {
                attractorNameElement.style.opacity = '0';
            }, 3000);

            // Load the new attractor script
            const script = document.createElement('script');
            script.src = attractor.path;
            script.onload = () => {
                // Give the script time to define its functions
                setTimeout(() => {
                    if (typeof window.setup === 'function') {
                        try {
                            p5Instance = new p5(null, canvasContainer);
                        } catch (e) {
                            console.error('Error creating p5 instance for', attractor.name, ':', e);
                        }
                    } else {
                        console.error("Setup function not found for", attractor.name);
                    }
                }, 100);
            };
            script.onerror = () => {
                console.error('Error loading script:', attractor.path);
            };
            
            document.body.appendChild(script);
            currentScriptElement = script;
        }, 200);
    }

    button.addEventListener('click', () => {
        const nextIndex = (currentAttractorIndex + 1) % attractors.length;
        loadAttractor(nextIndex);
    });

    // Load the first attractor
    loadAttractor(0);
});