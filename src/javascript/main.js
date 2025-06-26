document.addEventListener('DOMContentLoaded', () => {
    // Define attractors with their corresponding global function names
    const attractors = [
        { name: 'Aizawa Attractor', setupFunc: 'aizawaSetup', drawFunc: 'aizawaDraw' },
        { name: 'Chen Attractor', setupFunc: 'chenSetup', drawFunc: 'chenDraw' },
        { name: 'Chua Attractor', setupFunc: 'chuaSetup', drawFunc: 'chuaDraw' },
        { name: 'De Jong Attractor', setupFunc: 'dejongSetup', drawFunc: 'dejongDraw' },
        { name: 'Dequan Li Attractor', setupFunc: 'dequanLiSetup', drawFunc: 'dequanLiDraw' },
        { name: 'Euler Adaptive Attractor', setupFunc: 'eulerAdaptiveSetup', drawFunc: 'eulerAdaptiveDraw' },
        { name: 'Halvorsen Attractor', setupFunc: 'halvorsenSetup', drawFunc: 'halvorsenDraw' },
        { name: 'Ikeda Attractor', setupFunc: 'ikedaSetup', drawFunc: 'ikedaDraw' },
        { name: 'Clifford Attractor', setupFunc: 'cliffordSetup', drawFunc: 'cliffordDraw' },
        { name: 'Pickover Attractor', setupFunc: 'pickoverSetup', drawFunc: 'pickoverDraw' },
        { name: 'Lorenz Attractor', setupFunc: 'lorenzSetup', drawFunc: 'lorenzDraw' },
        { name: 'Thomas Attractor', setupFunc: 'thomasSetup', drawFunc: 'thomasDraw' },
        { name: 'Runge-Kutta 4th Order', setupFunc: 'rungeKuttaSetup', drawFunc: 'rungeKuttaDraw' },
        { name: 'Rössler Attractor', setupFunc: 'rosslerSetup', drawFunc: 'rosslerDraw' },
        { name: 'Nose-Hoover Attractor', setupFunc: 'noseHooverSetup', drawFunc: 'noseHooverDraw' }
    ];

    let currentAttractorIndex = 0;
    let p5Instance = null;
    const button = document.querySelector('.learn-more');
    const attractorNameElement = document.getElementById('attractor-name');
    const canvasContainer = document.getElementById('canvas-container');

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

    function loadAttractor(index) {
        cleanupPrevious();
        
        setTimeout(() => {
            currentAttractorIndex = index;
            const attractor = attractors[currentAttractorIndex];

            // Display the attractor name with fade effect
            attractorNameElement.textContent = attractor.name;
            attractorNameElement.style.opacity = '1';
            setTimeout(() => {
                attractorNameElement.style.opacity = '0';
            }, 5000);

            // Check if the attractor functions exist
            const setupFunc = window[attractor.setupFunc];
            const drawFunc = window[attractor.drawFunc];

            if (typeof setupFunc === 'function' && typeof drawFunc === 'function') {
                // Create a sketch function that uses the specific attractor's functions
                const sketch = (p) => {
                    p.setup = function() {
                        setupFunc.call(p);
                    };
                    
                    p.draw = function() {
                        drawFunc.call(p);
                    };

                    // Add common interaction handlers if they exist globally
                    if (typeof window.mousePressed === 'function') {
                        p.mousePressed = function() {
                            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                                window.mousePressed.call(p);
                            }
                        };
                    }

                    if (typeof window.mouseReleased === 'function') {
                        p.mouseReleased = function() {
                            window.mouseReleased.call(p);
                        };
                    }

                    if (typeof window.mouseDragged === 'function') {
                        p.mouseDragged = function() {
                            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                                window.mouseDragged.call(p);
                            }
                        };
                    }

                    if (typeof window.mouseWheel === 'function') {
                        p.mouseWheel = function(event) {
                            window.mouseWheel.call(p, event);
                        };
                    }

                    if (typeof window.windowResized === 'function') {
                        p.windowResized = function() {
                            window.windowResized.call(p);
                        };
                    }
                };

                try {
                    p5Instance = new p5(sketch, canvasContainer);
                } catch (e) {
                    console.error('Error creating p5 instance for', attractor.name, ':', e);
                }
            } else {
                console.error('Setup or draw function not found for', attractor.name);
                console.log('Looking for:', attractor.setupFunc, 'and', attractor.drawFunc);
                console.log('Available functions:', Object.keys(window).filter(key => key.includes('etup') || key.includes('raw')));
            }
        }, 200);
    }

    button.addEventListener('click', () => {
        const nextIndex = (currentAttractorIndex + 1) % attractors.length;
        loadAttractor(nextIndex);
    });

    // Load the first attractor
    loadAttractor(0);
});