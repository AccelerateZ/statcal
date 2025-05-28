/**
 * Common utility functions
 */

// Get input value
function getInputValue(id) {
    const value = document.getElementById(id).value.trim();
    if (!value) {
        throw new Error(`Please enter a value for ${document.getElementById(id).label}`);
    }
    return value;
}

// Get numeric input value
function getNumberInput(id) {
    const value = getInputValue(id);
    const numberValue = Number(value);
    if (isNaN(numberValue)) {
        throw new Error(`${document.getElementById(id).label} must be a number`);
    }
    return numberValue;
}

// Clear form and results
function clearForm(...ids) {
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element.tagName === 'MDUI-TEXT-FIELD') {
            element.value = '';
        } else {
            element.hidden = true;
        }
    });
}

// Display error message
function showError(message) {
    mdui.snackbar({
        message: message,
        position: 'top',
        closeOnOutsideClick: true
    });
}

// Format number with specified decimal places
function formatNumber(number, digits = 6) {
    return Number(number).toFixed(digits);
}
