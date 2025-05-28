/**
 * Calculate p-value from z-statistic
 * Based on standard normal distribution
 */

function calculatePValueFromZStats() {
    try {
        // Get input values
        const zValue = getNumberInput('z-value');

        // Calculate p-value
        // Using normal distribution from jStat library
        loadJStat().then(() => {
            const absZ = Math.abs(zValue);
            // Calculate single-tail p-value (right tail)
            const singleTailP = 1 - jStat.normal.cdf(absZ, 0, 1);
            
            // Calculate double-tail p-value
            const doubleTailP = singleTailP * 2;
            
            // Display results
            document.getElementById('z-single-tail-p').textContent = `Single-tail p-value: ${formatNumber(singleTailP)}`;
            document.getElementById('z-double-tail-p').textContent = `Double-tail p-value: ${formatNumber(doubleTailP)}`;
            document.getElementById('z-stats-result').hidden = false;
        });
        
    } catch (error) {
        showError(error.message);
    }
}
