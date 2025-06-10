/**
 * Binomial Distribution Calculator
 * Calculate probabilities and properties for binomial distribution
 */

function calculateBinomialProbability() {
    try {
        const n = getNumberInput('binomial-n');
        const p = getNumberInput('binomial-p');
        const x1 = getNumberInput('binomial-x1');
        const calcType = document.getElementById('binomial-calc-type-picker').value;

        if (n <= 0 || !Number.isInteger(n)) {
            throw new Error('Number of trials (n) must be a positive integer');
        }
        
        if (p < 0 || p > 1) {
            throw new Error('Probability (p) must be between 0 and 1');
        }

        const dist = new BinomialDistribution(n, p);
        let result = '';

        switch (calcType) {
            case 'exact':
                if (x1 < 0 || x1 > n || !Number.isInteger(x1)) {
                    throw new Error('X must be an integer between 0 and n');
                }
                const probExact = dist.pmf(x1);
                result = `
                    <h4>P(X = ${x1}):</h4>
                    <p>$$P(X = ${x1}) = \\binom{${n}}{${x1}} \\cdot ${formatNumberForLatex(p)}^{${x1}} \\cdot ${formatNumberForLatex(1-p)}^{${n-x1}} = ${formatNumberForLatex(probExact)}$$</p>
                `;
                break;
            
            case 'less-equal':
                if (x1 < 0 || x1 > n || !Number.isInteger(x1)) {
                    throw new Error('X must be an integer between 0 and n');
                }
                const probLessEqual = dist.cdf(x1);
                result = `
                    <h4>P(X ≤ ${x1}):</h4>
                    <p>$$P(X \\leq ${x1}) = \\sum_{k=0}^{${x1}} \\binom{${n}}{k} \\cdot ${formatNumberForLatex(p)}^k \\cdot ${formatNumberForLatex(1-p)}^{${n}-k} = ${formatNumberForLatex(probLessEqual)}$$</p>
                `;
                break;
            
            case 'greater-equal':
                if (x1 < 0 || x1 > n || !Number.isInteger(x1)) {
                    throw new Error('X must be an integer between 0 and n');
                }
                const probGreaterEqual = 1 - dist.cdf(x1 - 1);
                result = `
                    <h4>P(X ≥ ${x1}):</h4>
                    <p>$$P(X \\geq ${x1}) = 1 - P(X \\leq ${x1-1}) = ${formatNumberForLatex(probGreaterEqual)}$$</p>
                `;
                break;
            
            case 'between':
                const x2 = getNumberInput('binomial-x2');
                if (x1 < 0 || x1 > n || !Number.isInteger(x1) || x2 < 0 || x2 > n || !Number.isInteger(x2)) {
                    throw new Error('X1 and X2 must be integers between 0 and n');
                }
                if (x1 > x2) {
                    throw new Error('X1 must be less than or equal to X2');
                }
                const probBetween = dist.cdf(x2) - dist.cdf(x1 - 1);
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
            <p>$$n = ${n}, \\quad p = ${formatNumberForLatex(p)}$$</p>
        `;
        result += formatMomentsLatex(moments, 'Binomial');

        updateWithLatex('binomial-result-content', result);
        showResultContainer('binomial-result');

    } catch (error) {
        showError(error.message);
    }
}

// Toggle between calculation types for binomial distribution
function toggleBinomialCalcType() {
    const calcType = document.getElementById('binomial-calc-type-picker').value;
    const x2Container = document.getElementById('binomial-x2-container');
    
    if (calcType === 'between') {
        x2Container.classList.remove('hidden');
    } else {
        x2Container.classList.add('hidden');
    }
}
