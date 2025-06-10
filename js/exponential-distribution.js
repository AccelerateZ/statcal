/**
 * Exponential Distribution Calculator
 * Calculate probabilities, percentiles, and properties for exponential distribution
 */

function calculateExponentialProbability() {
    try {
        const lambda = getNumberInput('exponential-lambda');
        const x1 = getNumberInput('exponential-x1');
        const calcType = document.getElementById('exponential-calc-type-picker').value;

        if (lambda <= 0) {
            throw new Error('Lambda (λ) must be positive');
        }

        if (x1 < 0) {
            throw new Error('X must be non-negative');
        }

        const dist = new ExponentialDistribution(lambda);
        let result = '';

        switch (calcType) {
            case 'less-than':
                const probLess = dist.cdf(x1);
                result = `
                    <h4>P(X ≤ ${formatNumberForLatex(x1)}):</h4>
                    <p>$$P(X \\leq ${formatNumberForLatex(x1)}) = 1 - e^{-${formatNumberForLatex(lambda)} \\cdot ${formatNumberForLatex(x1)}} = ${formatNumberForLatex(probLess)}$$</p>
                `;
                break;
            
            case 'greater-than':
                const probGreater = 1 - dist.cdf(x1);
                result = `
                    <h4>P(X > ${formatNumberForLatex(x1)}):</h4>
                    <p>$$P(X > ${formatNumberForLatex(x1)}) = e^{-${formatNumberForLatex(lambda)} \\cdot ${formatNumberForLatex(x1)}} = ${formatNumberForLatex(probGreater)}$$</p>
                `;
                break;
            
            case 'between':
                const x2 = getNumberInput('exponential-x2');
                if (x2 < 0) {
                    throw new Error('X2 must be non-negative');
                }
                if (x1 >= x2) {
                    throw new Error('X1 must be less than X2 for between calculation');
                }
                const probBetween = dist.cdf(x2) - dist.cdf(x1);
                result = `
                    <h4>P(${formatNumberForLatex(x1)} < X ≤ ${formatNumberForLatex(x2)}):</h4>
                    <p>$$P(${formatNumberForLatex(x1)} < X \\leq ${formatNumberForLatex(x2)}) = e^{-${formatNumberForLatex(lambda)} \\cdot ${formatNumberForLatex(x1)}} - e^{-${formatNumberForLatex(lambda)} \\cdot ${formatNumberForLatex(x2)}} = ${formatNumberForLatex(probBetween)}$$</p>
                `;
                break;
        }

        // Add distribution moments
        const moments = dist.printMoments();
        result += `
            <h4>Distribution Properties:</h4>
            <p>$$\\lambda = ${formatNumberForLatex(lambda)}$$</p>
        `;
        result += formatMomentsLatex(moments, 'Exponential');

        updateWithLatex('exponential-result-content', result);
        showResultContainer('exponential-result');

    } catch (error) {
        showError(error.message);
    }
}

function calculateExponentialPercentile() {
    try {
        const lambda = getNumberInput('exponential-perc-lambda');
        const percentile = getNumberInput('exponential-percentile');

        if (lambda <= 0) {
            throw new Error('Lambda (λ) must be positive');
        }
        
        if (percentile <= 0 || percentile >= 100) {
            throw new Error('Percentile must be between 0 and 100 (exclusive)');
        }

        const dist = new ExponentialDistribution(lambda);
        const p = percentile / 100;
        const xValue = dist.percentile(p);

        const result = `
            <h4>${percentile}th Percentile:</h4>
            <p>$$P(X \\leq ${formatNumberForLatex(xValue)}) = ${formatNumberForLatex(p)}$$</p>
            <p>$$x = -\\frac{\\ln(1 - ${formatNumberForLatex(p)})}{${formatNumberForLatex(lambda)}} = ${formatNumberForLatex(xValue)}$$</p>
            <p>The ${percentile}th percentile is: <strong>${formatNumberForLatex(xValue)}</strong></p>
        `;

        updateWithLatex('exponential-percentile-result-content', result);
        showResultContainer('exponential-percentile-result');

    } catch (error) {
        showError(error.message);
    }
}

// Toggle between calculation types for exponential distribution
function toggleExponentialCalcType() {
    const calcType = document.getElementById('exponential-calc-type-picker').value;
    const x2Container = document.getElementById('exponential-x2-container');
    
    if (calcType === 'between') {
        x2Container.classList.remove('hidden');
    } else {
        x2Container.classList.add('hidden');
    }
}
