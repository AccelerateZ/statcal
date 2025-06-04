/**
 * Common utility functions
 * This version works with both MDUI and Sober.js frameworks
 */

// Get input value
function getInputValue(id) {
    const element = document.getElementById(id);
    const value = element.value ? element.value.trim() : '';
    if (!value) {
        throw new Error(`Please enter a value for ${element.placeholder || id}`);
    }
    return value;
}

// Get numeric input value
function getNumberInput(id) {
    const value = getInputValue(id);
    const numberValue = Number(value);
    if (isNaN(numberValue)) {
        const element = document.getElementById(id);
        throw new Error(`${element.placeholder || id} must be a number`);
    }
    return numberValue;
}

// Clear form and results
function clearForm(...ids) {
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (!element) return;
        
        // Handle different UI frameworks
        if (element.tagName === 'S-TEXT-FIELD') {
            // Sober.js input
            element.value = '';
        } else if (element.tagName === 'S-INPUT') {
            // Old Sober.js input
            element.value = '';
        } else if (element.tagName === 'MDUI-TEXT-FIELD') {
            // MDUI input
            element.value = '';
        } else {
            // For result containers, use appropriate hiding method
            const isMdui = document.querySelector('mdui-top-app-bar') !== null;
            if (isMdui) {
                element.hidden = true;
            } else {
                element.classList.add('hidden');
            }
        }
    });
}

// Display error message
function showError(message) {
    // Check if MDUI is present
    if (window.mdui && mdui.snackbar) {
        // Use MDUI snackbar
        mdui.snackbar({
            message: message,
            position: 'top'
        });
    } else {
        // Simple alert for Sober.js or fallback
        alert(message);
    }
}

// Format number with specified decimal places
function formatNumber(number, digits = 6) {
    return Number(number).toFixed(digits);
}

// Show result container - works with both MDUI and Sober.js
function showResultContainer(id) {
    const element = document.getElementById(id);
    if (!element) return;
    
    // Check if we're using MDUI or Sober.js
    const isMdui = document.querySelector('mdui-top-app-bar') !== null;
    
    if (isMdui) {
        // MDUI implementation
        element.hidden = false;
    } else {
        // Sober.js implementation
        element.classList.remove('hidden');
    }
}

// Toggle accordion functionality - works with both MDUI and Sober.js
function toggleAccordion(header) {
    // Get the next sibling which is the content panel
    const content = header.nextElementSibling;
    
    // Check if we're using MDUI or Sober.js
    const isMdui = document.querySelector('mdui-top-app-bar') !== null;
    
    if (isMdui) {
        // MDUI implementation - using hidden property
        const isOpen = !content.hidden;
        
        if (isOpen) {
            content.hidden = true;
            return;
        }
        
        // Close all accordion contents
        document.querySelectorAll('.accordion-content').forEach(item => {
            item.hidden = true;
        });
        
        // Open the clicked one
        content.hidden = false;
    } else {
        // Sober.js implementation - using 'hidden' class
        const isOpen = !content.classList.contains('hidden');
        
        if (isOpen) {
            content.classList.add('hidden');
            return;
        }
        
        // Close all accordion contents
        document.querySelectorAll('.accordion-content').forEach(item => {
            item.classList.add('hidden');
        });
        
        // Open the clicked one
        content.classList.remove('hidden');
    }
}

// MathJax utility functions for LaTeX rendering
function renderMathJax(element) {
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([element]).catch((err) => {
            console.warn('MathJax rendering error:', err);
        });
    }
}

// Update element with LaTeX content and render
function updateWithLatex(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = content;
        renderMathJax(element);
    }
}

// Format number for LaTeX display
function formatNumberForLatex(num, digits = 4) {
    if (num === Infinity) return '\\infty';
    if (num === -Infinity) return '-\\infty';
    if (isNaN(num)) return '\\text{NaN}';
    
    if (Math.abs(num) < 0.001 || Math.abs(num) >= 1000) {
        const exp = num.toExponential(digits);
        const [mantissa, exponent] = exp.split('e');
        return `${mantissa} \\times 10^{${parseInt(exponent)}}`;
    } else {
        return num.toFixed(digits);
    }
}
