/**
 * Poisson Distribution Calculator
 * Calculate probabilities and properties for Poisson distribution
 */

function calculatePoissonProbability() {
    try {
        const lambda = getNumberInput('poisson-lambda');
        const x1 = getNumberInput('poisson-x1');
        const calcType = document.getElementById('poisson-calc-type-picker').value;

        if (lambda <= 0) {
            throw new Error('Lambda (λ) must be positive');
        }

        const dist = new PoissonDistribution(lambda);
        let result = '';

        switch (calcType) {
            case 'exact':
                if (x1 < 0 || !Number.isInteger(x1)) {
                    throw new Error('X must be a non-negative integer');
                }
                const probExact = dist.pmf(x1);
                result = `
                    <h4>P(X = ${x1}):</h4>
                    <p>$$P(X = ${x1}) = \\frac{e^{-${formatNumberForLatex(lambda)}} \\cdot ${formatNumberForLatex(lambda)}^{${x1}}}{${x1}!} = ${formatNumberForLatex(probExact)}$$</p>
                `;
                break;
            
            case 'less-equal':
                if (x1 < 0 || !Number.isInteger(x1)) {
                    throw new Error('X must be a non-negative integer');
                }
                const probLessEqual = dist.cdf(x1);
                result = `
                    <h4>P(X ≤ ${x1}):</h4>
                    <p>$$P(X \\leq ${x1}) = \\sum_{k=0}^{${x1}} \\frac{e^{-${formatNumberForLatex(lambda)}} \\cdot ${formatNumberForLatex(lambda)}^k}{k!} = ${formatNumberForLatex(probLessEqual)}$$</p>
                `;
                break;
            
            case 'greater-equal':
                if (x1 < 0 || !Number.isInteger(x1)) {
                    throw new Error('X must be a non-negative integer');
                }
                const probGreaterEqual = 1 - (x1 > 0 ? dist.cdf(x1 - 1) : 0);
                result = `
                    <h4>P(X ≥ ${x1}):</h4>
                    <p>$$P(X \\geq ${x1}) = 1 - P(X \\leq ${x1-1}) = ${formatNumberForLatex(probGreaterEqual)}$$</p>
                `;
                break;
            
            case 'between':
                const x2 = getNumberInput('poisson-x2');
                if (x1 < 0 || !Number.isInteger(x1) || x2 < 0 || !Number.isInteger(x2)) {
                    throw new Error('X1 and X2 must be non-negative integers');
                }
                if (x1 > x2) {
                    throw new Error('X1 must be less than or equal to X2');
                }
                const probBetween = dist.cdf(x2) - (x1 > 0 ? dist.cdf(x1 - 1) : 0);
                result = `
                    <h4>P(${x1} ≤ X ≤ ${x2}):</h4>
                    <p>$$P(${x1} \\leq X \\leq ${x2}) = P(X \\leq ${x2}) - P(X \\leq ${x1-1}) = ${formatNumberForLatex(probBetween)}$$</p>
                `;
                break;
        }

        // Add distribution moments
        const moments = dist.printMoments();
        result += `
            <h4>Distribution Properties:</h4>
            <p>$$\\lambda = ${formatNumberForLatex(lambda)}$$</p>
        `;
        result += formatMomentsLatex(moments, 'Poisson');

        updateWithLatex('poisson-result-content', result);
        showResultContainer('poisson-result');

    } catch (error) {
        showError(error.message);
    }
}

// Toggle between calculation types for Poisson distribution
function togglePoissonCalcType() {
    const calcType = document.getElementById('poisson-calc-type-picker').value;
    const x2Container = document.getElementById('poisson-x2-container');
    
    if (calcType === 'between') {
        x2Container.classList.remove('hidden');
    } else {
        x2Container.classList.add('hidden');
    }
}
