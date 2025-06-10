/**
 * Gamma Distribution Calculator
 * Calculate probabilities and properties for Gamma distribution
 */

// Gamma Distribution Class
class GammaDistribution {
    constructor(alpha, beta) {
        this.alpha = parseFloat(alpha);  // shape parameter
        this.beta = parseFloat(beta);    // scale parameter (note: jStat uses scale = 1/rate)
    }

    mean() {
        return this.alpha * this.beta;
    }

    variance() {
        return this.alpha * this.beta * this.beta;
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    pdf(x) {
        if (x <= 0) return 0;
        // jStat.gamma uses shape, scale parameterization
        return jStat.gamma.pdf(x, this.alpha, this.beta);
    }

    cdf(x) {
        if (x <= 0) return 0;
        return jStat.gamma.cdf(x, this.alpha, this.beta);
    }

    percentile(p) {
        if (p < 0 || p > 1) return '';
        return jStat.gamma.inv(p, this.alpha, this.beta);
    }

    printMoments() {
        return {
            mean: this.mean(),
            variance: this.variance(),
            sd: this.sd()
        };
    }
}

// Calculator Functions for Gamma Distribution
function calculateGammaProbability() {
    try {
        const alpha = getNumberInput('gamma-alpha');
        const beta = getNumberInput('gamma-beta');
        const x1 = getNumberInput('gamma-x1');
        const calcType = document.getElementById('gamma-calc-type-picker').value;

        if (alpha <= 0) {
            throw new Error('Shape parameter α must be positive');
        }

        if (beta <= 0) {
            throw new Error('Scale parameter β must be positive');
        }

        if (x1 < 0) {
            throw new Error('X must be non-negative');
        }

        const dist = new GammaDistribution(alpha, beta);
        let result = '';

        switch (calcType) {
            case 'less-than':
                const probLessThan = dist.cdf(x1);
                result = `
                    <h4>P(X ≤ ${x1}):</h4>
                    <p>$$P(X \\leq ${formatNumberForLatex(x1)}) = ${formatNumberForLatex(probLessThan)}$$</p>
                `;
                break;
            
            case 'greater-than':
                const probGreaterThan = 1 - dist.cdf(x1);
                result = `
                    <h4>P(X > ${x1}):</h4>
                    <p>$$P(X > ${formatNumberForLatex(x1)}) = ${formatNumberForLatex(probGreaterThan)}$$</p>
                `;
                break;
            
            case 'between':
                const x2 = getNumberInput('gamma-x2');
                if (x2 < 0) {
                    throw new Error('X2 must be non-negative');
                }
                if (x1 > x2) {
                    throw new Error('X1 must be less than or equal to X2');
                }
                const probBetween = dist.cdf(x2) - dist.cdf(x1);
                result = `
                    <h4>P(${x1} < X ≤ ${x2}):</h4>
                    <p>$$P(${formatNumberForLatex(x1)} < X \\leq ${formatNumberForLatex(x2)}) = ${formatNumberForLatex(probBetween)}$$</p>
                `;
                break;
        }

        // Add distribution moments
        const moments = dist.printMoments();
        result += `
            <h4>Distribution Properties:</h4>
            <p>$$\\alpha = ${formatNumberForLatex(alpha)}, \\quad \\beta = ${formatNumberForLatex(beta)}$$</p>
        `;
        result += formatMomentsLatex(moments, 'Gamma');

        updateWithLatex('gamma-result-content', result);
        showResultContainer('gamma-result');

    } catch (error) {
        showError(error.message);
    }
}

function calculateGammaPercentile() {
    try {
        const alpha = getNumberInput('gamma-perc-alpha');
        const beta = getNumberInput('gamma-perc-beta');
        const percentile = getNumberInput('gamma-percentile');

        if (alpha <= 0) {
            throw new Error('Shape parameter α must be positive');
        }

        if (beta <= 0) {
            throw new Error('Scale parameter β must be positive');
        }

        if (percentile <= 0 || percentile >= 100) {
            throw new Error('Percentile must be between 0 and 100 (exclusive)');
        }

        const p = percentile / 100;
        const dist = new GammaDistribution(alpha, beta);
        const value = dist.percentile(p);

        let result = `
            <h4>${percentile}th Percentile:</h4>
            <p>$$x_{${formatNumberForLatex(p)}} = ${formatNumberForLatex(value)}$$</p>
            <p>This means that ${percentile}% of the distribution is below ${formatNumberForLatex(value)}.</p>
        `;

        // Add distribution moments
        const moments = dist.printMoments();
        result += `
            <h4>Distribution Properties:</h4>
            <p>$$\\alpha = ${formatNumberForLatex(alpha)}, \\quad \\beta = ${formatNumberForLatex(beta)}$$</p>
        `;
        result += formatMomentsLatex(moments, 'Gamma');

        updateWithLatex('gamma-percentile-result-content', result);
        showResultContainer('gamma-percentile-result');

    } catch (error) {
        showError(error.message);
    }
}

function toggleGammaCalcType() {
    const calcType = document.getElementById('gamma-calc-type-picker').value;
    const x2Container = document.getElementById('gamma-x2-container');
    
    if (calcType === 'between') {
        x2Container.classList.remove('hidden');
    } else {
        x2Container.classList.add('hidden');
    }
}
