/**
 * Gamma and Beta Distribution Calculators
 * Calculate probabilities and properties for Gamma and Beta distributions
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
        if (x < 0) return 0;
        return jStat.gamma.pdf(x, this.alpha, this.beta);
    }

    cdf(x) {
        if (x < 0) return 0;
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
        if (x < 0) return 0;
        if (x > 1) return 1;
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

// Gamma Distribution Calculator Functions
function calculateGammaProbability() {
    try {
        const alpha = getNumberInput('gamma-alpha');
        const beta = getNumberInput('gamma-beta');
        const x1 = getNumberInput('gamma-x1');
        const calcType = document.querySelector('input[name="gamma-calc-type"]:checked').value;

        if (alpha <= 0) {
            throw new Error('Alpha (shape parameter) must be positive');
        }
        
        if (beta <= 0) {
            throw new Error('Beta (scale parameter) must be positive');
        }

        if (x1 < 0) {
            throw new Error('X must be non-negative for Gamma distribution');
        }

        const dist = new GammaDistribution(alpha, beta);
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
                const x2 = getNumberInput('gamma-x2');
                if (x2 < 0) {
                    throw new Error('X2 must be non-negative');
                }
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
            throw new Error('Alpha (shape parameter) must be positive');
        }
        
        if (beta <= 0) {
            throw new Error('Beta (scale parameter) must be positive');
        }
        
        if (percentile <= 0 || percentile >= 100) {
            throw new Error('Percentile must be between 0 and 100 (exclusive)');
        }

        const dist = new GammaDistribution(alpha, beta);
        const p = percentile / 100;
        const xValue = dist.percentile(p);

        const result = `
            <h4>${percentile}th Percentile:</h4>
            <p>$$P(X \\leq ${formatNumberForLatex(xValue)}) = ${formatNumberForLatex(p)}$$</p>
            <p>The ${percentile}th percentile is: <strong>${formatNumberForLatex(xValue)}</strong></p>
        `;

        updateWithLatex('gamma-percentile-result-content', result);
        showResultContainer('gamma-percentile-result');

    } catch (error) {
        showError(error.message);
    }
}

// Beta Distribution Calculator Functions
function calculateBetaProbability() {
    try {
        const alpha = getNumberInput('beta-alpha');
        const beta = getNumberInput('beta-beta');
        const x1 = getNumberInput('beta-x1');
        const calcType = document.querySelector('input[name="beta-calc-type"]:checked').value;

        if (alpha <= 0) {
            throw new Error('Alpha (shape parameter 1) must be positive');
        }
        
        if (beta <= 0) {
            throw new Error('Beta (shape parameter 2) must be positive');
        }

        if (x1 < 0 || x1 > 1) {
            throw new Error('X must be between 0 and 1 for Beta distribution');
        }

        const dist = new BetaDistribution(alpha, beta);
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
                const x2 = getNumberInput('beta-x2');
                if (x2 < 0 || x2 > 1) {
                    throw new Error('X2 must be between 0 and 1');
                }
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
            throw new Error('Alpha (shape parameter 1) must be positive');
        }
        
        if (beta <= 0) {
            throw new Error('Beta (shape parameter 2) must be positive');
        }
        
        if (percentile <= 0 || percentile >= 100) {
            throw new Error('Percentile must be between 0 and 100 (exclusive)');
        }

        const dist = new BetaDistribution(alpha, beta);
        const p = percentile / 100;
        const xValue = dist.percentile(p);

        const result = `
            <h4>${percentile}th Percentile:</h4>
            <p>$$P(X \\leq ${formatNumberForLatex(xValue)}) = ${formatNumberForLatex(p)}$$</p>
            <p>The ${percentile}th percentile is: <strong>${formatNumberForLatex(xValue)}</strong></p>
        `;

        updateWithLatex('beta-percentile-result-content', result);
        showResultContainer('beta-percentile-result');

    } catch (error) {
        showError(error.message);
    }
}

// Toggle functions for calc types
function toggleGammaCalcType() {
    const calcType = document.querySelector('input[name="gamma-calc-type"]:checked').value;
    const x2Container = document.getElementById('gamma-x2-container');
    
    if (calcType === 'between') {
        x2Container.classList.remove('hidden');
    } else {
        x2Container.classList.add('hidden');
    }
}

function toggleBetaCalcType() {
    const calcType = document.querySelector('input[name="beta-calc-type"]:checked').value;
    const x2Container = document.getElementById('beta-x2-container');
    
    if (calcType === 'between') {
        x2Container.classList.remove('hidden');
    } else {
        x2Container.classList.add('hidden');
    }
}
