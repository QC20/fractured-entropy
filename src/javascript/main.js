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

    function loadAttractor(index) {
        // Clean up the previous instance completely
        if (p5Instance) {
            p5Instance.remove(); // This removes the canvas and stops the draw loop.
            p5Instance = null;
        }
        if (currentScriptElement) {
            document.body.removeChild(currentScriptElement);
            currentScriptElement = null;
        }
        // Ensure the container is empty as a fallback
        canvasContainer.innerHTML = '';

        // Set up for the new attractor
        currentAttractorIndex = index;
        const attractor = attractors[currentAttractorIndex];

        // Display the attractor name and set it to fade out
        attractorNameElement.textContent = attractor.name;
        attractorNameElement.style.opacity = '1';
        setTimeout(() => {
            attractorNameElement.style.opacity = '0';
        }, 5000);

        // Load the new attractor script
        const script = document.createElement('script');
        script.src = attractor.path;
        script.onload = () => {
            // Once loaded, we must manually create a new p5 instance.
            // Passing 'null' as the first argument tells p5 to look for global setup/draw functions.
            // The second argument tells p5 where to put the canvas.
            if (typeof setup === 'function') {
                p5Instance = new p5(null, canvasContainer);
            } else {
                console.error("The 'setup' function was not found in the loaded script: " + attractor.path);
            }
        };
        document.body.appendChild(script);
        currentScriptElement = script;
    }

    button.addEventListener('click', () => {
        const nextIndex = (currentAttractorIndex + 1) % attractors.length;
        loadAttractor(nextIndex);
    });

    // Load the first attractor when the page is ready
    loadAttractor(0);
});
