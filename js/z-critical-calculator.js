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
              // Display results with LaTeX formatting
            const rightTailLatex = `
                <h4>Right-tailed z critical value:</h4>
                <p>$$z_{\\alpha=${formatNumberForLatex(alpha)}} = ${formatNumberForLatex(zCritRight)}$$</p>
            `;
            
            const leftTailLatex = `
                <h4>Left-tailed z critical value:</h4>
                <p>$$z_{\\alpha=${formatNumberForLatex(alpha)}} = ${formatNumberForLatex(zCritLeft)}$$</p>
            `;
            
            const twoTailLatex = `
                <h4>Two-tailed z critical value:</h4>
                <p>$$z_{\\alpha/2=${formatNumberForLatex(alpha/2)}} = \\pm${formatNumberForLatex(zCritTwoTail)}$$</p>
            `;
            
            updateWithLatex('z-crit-right', rightTailLatex);
            updateWithLatex('z-crit-left', leftTailLatex);
            updateWithLatex('z-crit-two-tail', twoTailLatex);
            showResultContainer('z-crit-result');
        });
        
    } catch (error) {
        showError(error.message);
    }
}
