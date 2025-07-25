// Cursor Effects

document.addEventListener('DOMContentLoaded', () => {
    // Create cursor trail container
    const cursorTrailContainer = document.createElement('div');
    cursorTrailContainer.className = 'cursor-trail-container';
    document.body.appendChild(cursorTrailContainer);
    
    // Mouse position tracking
    let mouseX = 0;
    let mouseY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create trail particle on mouse move
        createTrailParticle(mouseX, mouseY);
    });
    
    // Create a trail particle
    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-trail-particle';
        
        // Randomize particle properties
        const size = Math.random() * 10 + 5;
        const duration = Math.random() * 1 + 0.5; // seconds
        const hue = Math.random() * 60 + 30; // golden-yellow range
        
        // Set particle style
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = `hsla(${hue}, 80%, 60%, 0.3)`;
        particle.style.animationDuration = `${duration}s`;
        
        // Add to container
        cursorTrailContainer.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }
});