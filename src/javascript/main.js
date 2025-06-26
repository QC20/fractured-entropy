// Simple solution: Load all scripts statically, then switch between them
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
        'Runge-Kutta 4th Order',
        'Rössler Attractor',
        'Nose-Hoover Attractor'
    ];

    let currentIndex = 0;
    let p5Instance = null;
    
    const button = document.querySelector('.learn-more');
    const nameElement = document.getElementById('attractor-name');
    const container = document.getElementById('canvas-container');

    function showName(name) {
        nameElement.textContent = name;
        nameElement.style.opacity = '1';
        setTimeout(() => {
            nameElement.style.opacity = '0';
        }, 3000);
    }

    function switchAttractor() {
        // Remove current p5 instance
        if (p5Instance) {
            p5Instance.remove();
            p5Instance = null;
        }
        
        // Clear container
        container.innerHTML = '';
        
        // Update index
        currentIndex = (currentIndex + 1) % attractors.length;
        
        // Show name
        showName(attractors[currentIndex]);
        
        // Wait a moment then create new instance
        setTimeout(() => {
            // Force reload the page to restart with fresh state
            window.location.reload();
        }, 100);
    }

    button.addEventListener('click', switchAttractor);
    
    // Show initial name
    showName(attractors[currentIndex]);
});