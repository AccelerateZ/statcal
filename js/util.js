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

// Enable text selection on page load
window.addEventListener('DOMContentLoaded', function() {
    // Remove any potential text selection disabling
    document.body.style.webkitUserSelect = 'text';
    document.body.style.mozUserSelect = 'text';
    document.body.style.msUserSelect = 'text';
    document.body.style.userSelect = 'text';
    
    // Ensure MathJax elements are selectable when they load
    if (window.MathJax) {
        MathJax.startup.registerStartupHook('end', function() {
            const mathElements = document.querySelectorAll('.MathJax, .MathJax_Display');
            mathElements.forEach(function(element) {
                element.style.webkitUserSelect = 'text';
                element.style.mozUserSelect = 'text';
                element.style.msUserSelect = 'text';
                element.style.userSelect = 'text';
            });
        });
    }
});

// Override any potential disabling functions
if (typeof jQuery !== 'undefined' && jQuery.fn.disableSelection) {
    jQuery.fn.disableSelection = function() {
        return this; // Do nothing
    };
}

// Initialize default values for all s-picker components
function initializePickers() {
    // Set default values for all calculation type pickers
    const pickerDefaults = {
        'normal-calc-type-picker': 'less-than',
        'binomial-calc-type-picker': 'exact',
        'poisson-calc-type-picker': 'exact',
        'exponential-calc-type-picker': 'less-than',
        'gamma-calc-type-picker': 'less-than',
        'beta-calc-type-picker': 'less-than',
        'geometric-calc-type-picker': 'exact',
        'hypergeometric-calc-type-picker': 'exact',
        'lognormal-calc-type-picker': 'pdf',
        'negbinom-calc-type-picker': 'exact',
        'pareto-calc-type-picker': 'pdf',
        'weibull-calc-type-picker': 'pdf'
    };

    // Map picker IDs to their toggle function names
    const toggleFunctions = {
        'normal-calc-type-picker': 'toggleNormalCalcType',
        'binomial-calc-type-picker': 'toggleBinomialCalcType',
        'poisson-calc-type-picker': 'togglePoissonCalcType',
        'exponential-calc-type-picker': 'toggleExponentialCalcType',
        'gamma-calc-type-picker': 'toggleGammaCalcType',
        'beta-calc-type-picker': 'toggleBetaCalcType',
        'geometric-calc-type-picker': 'toggleGeometricCalcType',
        'hypergeometric-calc-type-picker': 'toggleHypergeometricCalcType',
        'lognormal-calc-type-picker': 'toggleLognormalCalcType',
        'negbinom-calc-type-picker': 'toggleNegBinomCalcType',
        'pareto-calc-type-picker': 'toggleParetoCalcType',
        'weibull-calc-type-picker': 'toggleWeibullCalcType'
    };

    Object.entries(pickerDefaults).forEach(([id, defaultValue]) => {
        const picker = document.getElementById(id);
        if (picker) {
            picker.value = defaultValue;
            // Trigger the toggle function to show/hide appropriate containers
            const toggleFunction = toggleFunctions[id];
            if (typeof window[toggleFunction] === 'function') {
                window[toggleFunction]();
            }
        }
    });
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePickers);
