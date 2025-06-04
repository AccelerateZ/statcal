/**
 * Calculate p-value from F-statistic
 * Based on compute_alpha_given_f_stats_v1_v2.py
 */

function calculatePValueFromFStats() {
    try {
        // Get input values
        const fStatistic = getNumberInput('f-statistic');
        const df1 = getNumberInput('f-df1');
        const df2 = getNumberInput('f-df2');

        // Validate inputs
        if (fStatistic < 0) {
            throw new Error('F-statistic cannot be negative');
        }
        
        if (df1 <= 0 || !Number.isInteger(df1)) {
            throw new Error('Numerator degrees of freedom must be a positive integer');
        }
        
        if (df2 <= 0 || !Number.isInteger(df2)) {
            throw new Error('Denominator degrees of freedom must be a positive integer');
        }        // Use F-distribution from jStat library to calculate p-value
        loadJStat().then(() => {
            // Calculate right-tail probability P(X >= fStatistic)
            const pValue = 1 - jStat.centralF.cdf(fStatistic, df1, df2);            // Display results with LaTeX formatting
            const pValueLatex = `
                <h4>F-statistic p-value:</h4>
                <p>$$F = ${formatNumberForLatex(fStatistic)}$$</p>
                <p>$$p = P(F_{${df1}, ${df2}} \\geq ${formatNumberForLatex(fStatistic)}) = ${formatNumberForLatex(pValue)}$$</p>
            `;
            
            updateWithLatex('f-p-value', pValueLatex);
            showResultContainer('f-stats-result');
        });
        
    } catch (error) {
        showError(error.message);
    }
}
