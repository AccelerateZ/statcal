/**
 * Beta Distribution Calculator
 * Calculate probabilities and properties for Beta distribution
 */

// Beta Distribution Class
class BetaDistribution {
    constructor(alpha, beta) {
        this.alpha = parseFloat(alpha);  // shape parameter 1
        this.beta = parseFloat(beta);    // shape parameter 2
    }

    mean() {
        return this.alpha / (this.alpha + this.beta);
    }

    variance() {
        const sum = this.alpha + this.beta;
        return (this.alpha * this.beta) / (sum * sum * (sum + 1));
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    pdf(x) {
        if (x < 0 || x > 1) return 0;
        return jStat.beta.pdf(x, this.alpha, this.beta);
    }

    cdf(x) {
        if (x <= 0) return 0;
        if (x >= 1) return 1;
        return jStat.beta.cdf(x, this.alpha, this.beta);
    }

    percentile(p) {
        if (p < 0 || p > 1) return '';
        return jStat.beta.inv(p, this.alpha, this.beta);
    }

    printMoments() {
        return {
            mean: this.mean(),
            variance: this.variance(),
            sd: this.sd()
        };
    }
}

// Calculator Functions for Beta Distribution
function calculateBetaProbability() {
    try {
        const alpha = getNumberInput('beta-alpha');
        const beta = getNumberInput('beta-beta');
        const x1 = getNumberInput('beta-x1');
        const calcType = document.getElementById('beta-calc-type-picker').value;

        if (alpha <= 0) {
            throw new Error('Shape parameter α must be positive');
        }

        if (beta <= 0) {
            throw new Error('Shape parameter β must be positive');
        }

        if (x1 < 0 || x1 > 1) {
            throw new Error('X must be between 0 and 1 for Beta distribution');
        }

        const dist = new BetaDistribution(alpha, beta);
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
                const x2 = getNumberInput('beta-x2');
                if (x2 < 0 || x2 > 1) {
                    throw new Error('X2 must be between 0 and 1 for Beta distribution');
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
        result += formatMomentsLatex(moments, 'Beta');

        updateWithLatex('beta-result-content', result);
        showResultContainer('beta-result');

    } catch (error) {
        showError(error.message);
    }
}

function calculateBetaPercentile() {
    try {
        const alpha = getNumberInput('beta-perc-alpha');
        const beta = getNumberInput('beta-perc-beta');
        const percentile = getNumberInput('beta-percentile');

        if (alpha <= 0) {
            throw new Error('Shape parameter α must be positive');
        }

        if (beta <= 0) {
            throw new Error('Shape parameter β must be positive');
        }

        if (percentile <= 0 || percentile >= 100) {
            throw new Error('Percentile must be between 0 and 100 (exclusive)');
        }

        const p = percentile / 100;
        const dist = new BetaDistribution(alpha, beta);
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
        result += formatMomentsLatex(moments, 'Beta');

        updateWithLatex('beta-percentile-result-content', result);
        showResultContainer('beta-percentile-result');

    } catch (error) {
        showError(error.message);
    }
}

function toggleBetaCalcType() {
    const calcType = document.getElementById('beta-calc-type-picker').value;
    const x2Container = document.getElementById('beta-x2-container');
    
    if (calcType === 'between') {
        x2Container.classList.remove('hidden');
    } else {
        x2Container.classList.add('hidden');
    }
}
