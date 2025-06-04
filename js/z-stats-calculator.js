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
            const doubleTailP = singleTailP * 2;            // Display results with LaTeX formatting
            const singleTailLatex = `
                <h4>Single-tail p-value:</h4>
                <p>$$p = P(Z \\geq |${formatNumberForLatex(zValue)}|) = ${formatNumberForLatex(singleTailP)}$$</p>
            `;
            
            const doubleTailLatex = `
                <h4>Double-tail p-value:</h4>
                <p>$$p = 2 \\times P(Z \\geq |${formatNumberForLatex(zValue)}|) = ${formatNumberForLatex(doubleTailP)}$$</p>
            `;
            
            updateWithLatex('z-single-tail-p', singleTailLatex);
            updateWithLatex('z-double-tail-p', doubleTailLatex);
            showResultContainer('z-stats-result');
        });
        
    } catch (error) {
        showError(error.message);
    }
}
