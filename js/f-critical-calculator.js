/**
 * Calculate F critical value
 * Based on compute_f_stats_given_alpha_v1_v2.py
 */

function calculateFCriticalValue() {
    try {
        // Get input values
        const df1 = getNumberInput('f-crit-df1');
        const df2 = getNumberInput('f-crit-df2');
        const alpha = getNumberInput('f-alpha');

        // Validate inputs
        if (alpha <= 0 || alpha >= 1) {
            throw new Error('Significance level must be between 0 and 1');
        }
        
        if (df1 <= 0 || !Number.isInteger(df1)) {
            throw new Error('Numerator degrees of freedom must be a positive integer');
        }
        
        if (df2 <= 0 || !Number.isInteger(df2)) {
            throw new Error('Denominator degrees of freedom must be a positive integer');
        }        // Use F-distribution from jStat library to calculate critical value
        loadJStat().then(() => {
            // Calculate F critical value - inverse cumulative distribution function at (1-alpha)
            const fCritical = jStat.centralF.inv(1 - alpha, df1, df2);
            
            // Display results
            document.getElementById('f-critical-value').textContent = 
                `F critical value: F_(${df1}, ${df2}) at Significance Level= ${alpha} is ${formatNumber(fCritical, 4)}`;
            document.getElementById('f-crit-result').hidden = false;
        });
        
    } catch (error) {
        showError(error.message);
    }
}
