// CropSense Frontend JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all sliders and their value displays
    initializeSliders();
    
    // Setup reset button functionality
    setupResetButton();
    
    // Setup ripple effects for submit button
    setupRippleEffects();
});

/**
 * Initialize all slider inputs and their value displays
 */
function initializeSliders() {
    const sliders = [
        { id: 'N-slider', display: 'N-value', min: 0, max: 140 },
        { id: 'P-slider', display: 'P-value', min: 5, max: 145 },
        { id: 'K-slider', display: 'K-value', min: 5, max: 205 },
        { id: 'temperature-slider', display: 'temperature-value', min: 8, max: 44 },
        { id: 'humidity-slider', display: 'humidity-value', min: 14, max: 100 },
        { id: 'ph-slider', display: 'ph-value', min: 3.5, max: 10 },
        { id: 'rainfall-slider', display: 'rainfall-value', min: 20, max: 300 }
    ];

    sliders.forEach(sliderConfig => {
        const slider = document.getElementById(sliderConfig.id);
        const display = document.getElementById(sliderConfig.display);
        
        if (slider && display) {
            // Set initial value to midpoint
            const initialValue = (sliderConfig.min + sliderConfig.max) / 2;
            slider.value = initialValue;
            updateSliderDisplay(slider, display);
            
            // Add event listener for real-time updates
            slider.addEventListener('input', function() {
                updateSliderDisplay(this, display);
            });
            
            // Add visual feedback on interaction
            slider.addEventListener('mousedown', function() {
                this.style.opacity = '1';
            });
            
            slider.addEventListener('mouseup', function() {
                this.style.opacity = '0.7';
            });
        }
    });
}

/**
 * Update the display element with formatted slider value
 * @param {HTMLInputElement} slider - The slider input element
 * @param {HTMLElement} display - The element to display the value
 */
function updateSliderDisplay(slider, display) {
    let value = parseFloat(slider.value);
    
    // Format display based on parameter type
    switch(slider.name) {
        case 'temperature':
            display.textContent = `${value.toFixed(1)}°C`;
            break;
        case 'ph':
            display.textContent = value.toFixed(1);
            break;
        case 'humidity':
            display.textContent = `${value}%`;
            break;
        case 'rainfall':
            display.textContent = `${value}mm`;
            break;
        default:
            display.textContent = value;
    }
    
    // Update slider background gradient for visual feedback
    const percentage = ((value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(90deg, #81c784 ${percentage}%, #e0e0e0 ${percentage}%)`;
}

/**
 * Setup reset button functionality
 */
function setupResetButton() {
    const resetBtn = document.getElementById('reset-btn');
    const form = document.querySelector('form');
    
    if (resetBtn && form) {
        resetBtn.addEventListener('click', function() {
            // Reset all sliders to their midpoint values
            const sliders = form.querySelectorAll('input[type="range"]');
            sliders.forEach(slider => {
                const min = parseFloat(slider.min);
                const max = parseFloat(slider.max);
                const midValue = (min + max) / 2;
                slider.value = midValue;
                
                // Trigger display update
                const displayId = `${slider.name}-value`;
                const display = document.getElementById(displayId);
                if (display) {
                    updateSliderDisplay(slider, display);
                }
            });
            
            // Add visual feedback for reset
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Scroll to top for better UX
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/**
 * Setup ripple effects for buttons
 */
function setupRippleEffects() {
    const submitBtn = document.querySelector('.submit-btn');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            // Remove existing ripple effects
            const existingRipples = this.querySelectorAll('.ripple-effect');
            existingRipples.forEach(ripple => ripple.remove());
            
            // Create new ripple effect
            const ripple = document.createElement('div');
            ripple.classList.add('ripple-effect');
            
            // Position the ripple at click location
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
}

/**
 * Validate form inputs before submission
 */
function validateForm() {
    const inputs = document.querySelectorAll('input[type="range"]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = parseFloat(input.value);
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        
        if (value < min || value > max) {
            isValid = false;
            // Add visual error state
            input.style.border = '2px solid #f44336';
        } else {
            input.style.border = '';
        }
    });
    
    return isValid;
}

// Add form validation on submit
document.querySelector('form')?.addEventListener('submit', function(e) {
    if (!validateForm()) {
        e.preventDefault();
        alert('Please ensure all values are within the specified ranges.');
    }
});

/**
 * Utility function for smooth scrolling
 */
function smoothScrollTo(element) {
    element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Add loading state for form submission
document.querySelector('form')?.addEventListener('submit', function() {
    const submitBtn = this.querySelector('.submit-btn');
    if (submitBtn) {
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.querySelector('.btn-text').textContent = 'Analyzing... 🌱';
        submitBtn.disabled = true;
        
        // Revert after 5 seconds (in case of error)
        setTimeout(() => {
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.disabled = false;
        }, 5000);
    }
});