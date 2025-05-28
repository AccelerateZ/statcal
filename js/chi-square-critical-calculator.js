/**
 * Calculate chi-square critical value
 * Based on chi-square distribution
 */

function calculateChiSquareCriticalValue() {
    try {
        // Get input values
        const alpha = getNumberInput('chi-square-crit-alpha');
        const df = getNumberInput('chi-square-crit-df');

        // Validate inputs
        if (alpha <= 0 || alpha >= 1) {
            throw new Error('Significance level must be between 0 and 1');
        }
        
        if (df <= 0 || !Number.isInteger(df)) {
            throw new Error('Degrees of freedom must be a positive integer');
        }

        // Use chi-square distribution from jStat library to calculate critical value
        loadJStat().then(() => {
            // Calculate right-tailed critical value - inverse cumulative distribution at (1-alpha)
            const chiSquareCritical = jStat.chisquare.inv(1 - alpha, df);
            
            // Display results
            document.getElementById('chi-square-critical-value').textContent = 
                `Chi-square critical value (α=${alpha}, df=${df}): ${formatNumber(chiSquareCritical, 4)}`;
            document.getElementById('chi-square-crit-result').hidden = false;
        });
        
    } catch (error) {
        showError(error.message);
    }
}
