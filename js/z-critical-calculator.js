/**
 * Calculate z critical value
 * Based on standard normal distribution
 */

function calculateZCriticalValue() {
    try {
        // Get input values
        const alpha = getNumberInput('z-crit-alpha');

        // Validate inputs
        if (alpha <= 0 || alpha >= 1) {
            throw new Error('Significance level must be between 0 and 1');
        }

        // Use normal distribution from jStat library to calculate critical value
        loadJStat().then(() => {
            // Calculate right-tailed critical value - inverse cumulative distribution at (1-alpha)
            const zCritRight = jStat.normal.inv(1 - alpha, 0, 1);
            
            // Calculate left-tailed critical value - inverse cumulative distribution at alpha
            const zCritLeft = jStat.normal.inv(alpha, 0, 1);
            
            // Calculate two-tailed critical value
            const zCritTwoTail = jStat.normal.inv(1 - alpha/2, 0, 1);
            
            // Display results
            document.getElementById('z-crit-right').textContent = 
                `Right-tailed z critical value (Significance Level=${alpha}): ${formatNumber(zCritRight, 6)}`;
            document.getElementById('z-crit-left').textContent = 
                `Left-tailed z critical value (Significance Level=${alpha}): ${formatNumber(zCritLeft, 6)}`;
            document.getElementById('z-crit-two-tail').textContent = 
                `Two-tailed z critical value (Significance Level=${alpha}): ${formatNumber(zCritTwoTail, 6)}`;
            document.getElementById('z-crit-result').hidden = false;
        });
        
    } catch (error) {
        showError(error.message);
    }
}
