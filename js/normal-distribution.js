/**
 * Normal Distribution Calculator
 * Calculate probabilities, percentiles, and properties for normal distribution
 */

function calculateNormalProbability() {
    try {
        const mu = getNumberInput('normal-mu');
        const sigma = getNumberInput('normal-sigma');
        const x1 = getNumberInput('normal-x1');        const x2Input = document.getElementById('normal-x2');
        const calcType = document.getElementById('normal-calc-type-picker').value;

        if (sigma <= 0) {
            throw new Error('Standard deviation must be positive');
        }

        const dist = new NormalDistribution(mu, sigma);
        let result = '';

        switch (calcType) {
            case 'less-than':
                const probLess = dist.cdf(x1);
                result = `
                    <h4>P(X ≤ ${formatNumberForLatex(x1)}):</h4>
                    <p>$$P(X \\leq ${formatNumberForLatex(x1)}) = ${formatNumberForLatex(probLess)}$$</p>
                `;
                break;
            
            case 'greater-than':
                const probGreater = 1 - dist.cdf(x1);
                result = `
                    <h4>P(X > ${formatNumberForLatex(x1)}):</h4>
                    <p>$$P(X > ${formatNumberForLatex(x1)}) = ${formatNumberForLatex(probGreater)}$$</p>
                `;
                break;
            
            case 'between':
                const x2 = getNumberInput('normal-x2');
                if (x1 >= x2) {
                    throw new Error('X1 must be less than X2 for between calculation');
                }
                const probBetween = dist.cdf(x2) - dist.cdf(x1);
                result = `
                    <h4>P(${formatNumberForLatex(x1)} < X ≤ ${formatNumberForLatex(x2)}):</h4>
                    <p>$$P(${formatNumberForLatex(x1)} < X \\leq ${formatNumberForLatex(x2)}) = ${formatNumberForLatex(probBetween)}$$</p>
                `;
                break;
        }

        // Add distribution moments
        const moments = dist.printMoments();
        result += formatMomentsLatex(moments, 'Normal');

        updateWithLatex('normal-result-content', result);
        showResultContainer('normal-result');

    } catch (error) {
        showError(error.message);
    }
}

function calculateNormalPercentile() {
    try {
        const mu = getNumberInput('normal-perc-mu');
        const sigma = getNumberInput('normal-perc-sigma');
        const percentile = getNumberInput('normal-percentile');

        if (sigma <= 0) {
            throw new Error('Standard deviation must be positive');
        }
        
        if (percentile <= 0 || percentile >= 100) {
            throw new Error('Percentile must be between 0 and 100 (exclusive)');
        }

        const dist = new NormalDistribution(mu, sigma);
        const p = percentile / 100;
        const xValue = dist.percentile(p);

        const result = `
            <h4>${percentile}th Percentile:</h4>
            <p>$$P(X \\leq ${formatNumberForLatex(xValue)}) = ${formatNumberForLatex(p)}$$</p>
            <p>The ${percentile}th percentile is: <strong>${formatNumberForLatex(xValue)}</strong></p>
        `;

        updateWithLatex('normal-percentile-result-content', result);
        showResultContainer('normal-percentile-result');

    } catch (error) {
        showError(error.message);
    }
}

// Toggle between calculation types for normal distribution
function toggleNormalCalcType() {
    const picker = document.getElementById('normal-calc-type-picker');
    const calcType = picker.value;
    const x2Container = document.getElementById('normal-x2-container');
    
    if (calcType === 'between') {
        x2Container.classList.remove('hidden');
    } else {
        x2Container.classList.add('hidden');
    }
}
