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
            const pValue = 1 - jStat.chisquare.cdf(chiSquareValue, df);            // Display results with LaTeX formatting
            const pValueLatex = `
                <h4>Chi-square p-value:</h4>
                <p>$$\\chi^2 = ${formatNumberForLatex(chiSquareValue)}$$</p>
                <p>$$p = P(\\chi^2_{${df}} \\geq ${formatNumberForLatex(chiSquareValue)}) = ${formatNumberForLatex(pValue)}$$</p>
            `;
            
            updateWithLatex('chi-square-p-value', pValueLatex);
            showResultContainer('chi-square-stats-result');
        });
        
    } catch (error) {
        showError(error.message);
    }
}
