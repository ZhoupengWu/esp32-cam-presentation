// Section observer for sidebar highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

const options = {
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === entry.target.id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, options);

sections.forEach(section => {
    observer.observe(section);
});

// Smooth scroll for nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Dynamic Code Fetching
async function loadSourceCode(filePath, elementId) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Could not fetch ${filePath}`);
        const text = await response.text();
        const element = document.getElementById(elementId);
        element.textContent = text;
        hljs.highlightElement(element);
    } catch (error) {
        console.error(error);
        document.getElementById(elementId).textContent = `// Error loading ${filePath}\n// Make sure the file exists in the root directory.`;
    }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    // We assume the .cpp and .py files are in the root directory relative to index.html
    loadSourceCode('save-photos.cpp', 'code-save-photos');
    loadSourceCode('pir-sensor.cpp', 'code-pir-sensor');
    loadSourceCode('camera.py', 'code-camera');
});

// Zoom Functionality
function zoomCode(elementId, direction) {
    const element = document.getElementById(elementId);
    const style = window.getComputedStyle(element, null).getPropertyValue('font-size');
    let currentSize = parseFloat(style);
    
    // Limits: min 0.5rem (approx 8px), max 2rem (approx 32px)
    const newSize = currentSize + (direction * 2);
    if (newSize >= 8 && newSize <= 32) {
        element.style.fontSize = newSize + 'px';
    }
}

// Keyboard navigation (j/k or arrows)
document.addEventListener('keydown', (e) => {
    const activeLink = document.querySelector('nav a.active');
    if (!activeLink) return;
    
    const parentLi = activeLink.parentElement;
    
    if (e.key === 'ArrowDown' || e.key === 'j') {
        const nextLi = parentLi.nextElementSibling;
        if (nextLi) nextLi.querySelector('a').click();
    } else if (e.key === 'ArrowUp' || e.key === 'k') {
        const prevLi = parentLi.previousElementSibling;
        if (prevLi) prevLi.querySelector('a').click();
    }
});
