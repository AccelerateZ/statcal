/**
 * Calculate p-value from chi-square statistic
 * Based on chi-square distribution
 */

function calculatePValueFromChiSquareStats() {
    try {
        // Get input values
        const chiSquareValue = getNumberInput('chi-square-value');
        const df = getNumberInput('chi-square-df');

        // Validate inputs
        if (chiSquareValue < 0) {
            throw new Error('Chi-square value cannot be negative');
        }
        
        if (df <= 0 || !Number.isInteger(df)) {
            throw new Error('Degrees of freedom must be a positive integer');
        }

        // Use chi-square distribution from jStat library to calculate p-value
        loadJStat().then(() => {
            // Calculate right-tail p-value P(X >= chiSquareValue)
            const pValue = 1 - jStat.chisquare.cdf(chiSquareValue, df);
            
            // Display results
            document.getElementById('chi-square-p-value').textContent = 
                `Chi-square p-value (χ²=${formatNumber(chiSquareValue, 4)}, df=${df}): ${formatNumber(pValue, 6)}`;
            document.getElementById('chi-square-stats-result').hidden = false;
        });
        
    } catch (error) {
        showError(error.message);
    }
}
