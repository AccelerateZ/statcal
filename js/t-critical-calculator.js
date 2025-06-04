/**
 * Calculate t critical value
 * Based on compute_t_stats_given_alpha_DoF.py
 */

function calculateTCriticalValue() {
    try {
        // Get input values
        const alpha = getNumberInput('t-crit-alpha');
        const df = getNumberInput('t-crit-df');

        // Validate inputs
        if (alpha <= 0 || alpha >= 1) {
            throw new Error('Significance level must be between 0 and 1');
        }
        
        if (df <= 0 || !Number.isInteger(df)) {
            throw new Error('Degrees of freedom must be a positive integer');
        }        // Use t-distribution from jStat library to calculate critical values
        loadJStat().then(() => {
            // Calculate right-tailed critical value - inverse cumulative distribution at (1-alpha)
            const tCritRight = jStat.studentt.inv(1 - alpha, df);
            
            // Calculate left-tailed critical value - inverse cumulative distribution at alpha
            const tCritLeft = jStat.studentt.inv(alpha, df);
              // Display results with LaTeX formatting
            const rightTailLatex = `
                <h4>Right-tailed t critical value:</h4>
                <p>$$t_{\\alpha=${formatNumberForLatex(alpha)}, \\text{DoF}=${df}} = ${formatNumberForLatex(tCritRight)}$$</p>
            `;
            
            const leftTailLatex = `
                <h4>Left-tailed t critical value:</h4>
                <p>$$t_{\\alpha=${formatNumberForLatex(alpha)}, \\text{DoF}=${df}} = ${formatNumberForLatex(tCritLeft)}$$</p>
            `;
            
            updateWithLatex('t-crit-right', rightTailLatex);
            updateWithLatex('t-crit-left', leftTailLatex);
            showResultContainer('t-crit-result');
        });
        
    } catch (error) {
        showError(error.message);
    }
}
