document.addEventListener('DOMContentLoaded', () => {
    const attractors = [
        { name: 'Aizawa Attractor', script: './src/javascript/aizawa_attractor.js' },
        { name: 'Chen Attractor', script: './src/javascript/chen_attractor.js' },
        { name: 'Chua Attractor', script: './src/javascript/chua_attractor.js' },
        { name: 'De Jong Attractor', script: './src/javascript/dejong_attractor.js' },
        { name: 'Dequan Li Attractor', script: './src/javascript/dequan_li_attractor.js' },
        { name: 'Euler Adaptive Attractor', script: './src/javascript/euler_adaptive_attractor.js' },
        { name: 'Halvorsen Attractor', script: './src/javascript/halvorsen_attractor.js' },
        { name: 'Ikeda Attractor', script: './src/javascript/ikeda_attractor.js' },
        { name: 'Clifford Attractor', script: './src/javascript/clifford_attractor.js' },
        { name: 'Pickover Attractor', script: './src/javascript/pickover_attractor.js' },
        { name: 'Lorenz Attractor', script: './src/javascript/lorenz_attractor.js' },
        { name: 'Thomas Attractor', script: './src/javascript/thomas_attractor.js' },
        { name: 'Runge-Kutta 4th Order', script: './src/javascript/Runge-Kutta_4th_order_integration.js' },
        { name: 'Rössler Attractor', script: './src/javascript/rossler_attractor.js' },
        { name: 'Nose-Hoover Attractor', script: './src/javascript/nose_hoover_attractor.js' }
    ];

    let currentIndex = 0;
    const button = document.querySelector('.learn-more');
    const nameElement = document.getElementById('attractor-name');

    function showName(name) {
        nameElement.textContent = name;
        nameElement.style.opacity = '1';
        setTimeout(() => {
            nameElement.style.opacity = '0';
        }, 4000);
    }

    function loadNextAttractor() {
        currentIndex = (currentIndex + 1) % attractors.length;
        const attractor = attractors[currentIndex];
        
        // Store the next attractor info in URL hash so we remember it after reload
        window.location.hash = currentIndex;
        
        // Show the name
        showName(attractor.name);
        
        // Reload the page to start fresh
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    // Check if we have a specific attractor to load from URL hash
    function getStartingIndex() {
        const hash = window.location.hash.replace('#', '');
        const index = parseInt(hash);
        return (isNaN(index) || index < 0 || index >= attractors.length) ? 0 : index;
    }

    // Initialize
    currentIndex = getStartingIndex();
    
    // Load the current attractor script
    const currentAttractor = attractors[currentIndex];
    const script = document.createElement('script');
    script.src = currentAttractor.script;
    script.onload = () => {
        showName(currentAttractor.name);
        console.log('Loaded:', currentAttractor.name);
    };
    script.onerror = () => {
        console.error('Failed to load:', currentAttractor.script);
    };
    document.head.appendChild(script);

    // Button click handler
    button.addEventListener('click', loadNextAttractor);
});