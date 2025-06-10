/**
 * Negative Binomial Distribution Calculator
 * Calculate probabilities and properties for Negative Binomial distribution (failures before r-th success)
 */

// Negative Binomial Distribution Class (number of failures before r-th success)
class NegativeBinomialDistribution {
    constructor(r, p) {
        this.r = parseInt(r);     // number of successes
        this.p = parseFloat(p);   // probability of success
    }

    mean() {
        return this.r * (1 - this.p) / this.p;
    }

    variance() {
        return this.r * (1 - this.p) / (this.p * this.p);
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    pmf(x) {
        const k = parseInt(x);
        if (k < 0) return 0;
        return combination(k + this.r - 1, k) * Math.pow(this.p, this.r) * Math.pow(1 - this.p, k);
    }

    cdf(x) {
        const k = parseInt(x);
        let cdfVal = 0;
        for (let i = 0; i <= k; i++) {
            cdfVal += this.pmf(i);
        }
        return cdfVal;
    }

    printMoments() {
        return {
            mean: this.mean(),
            variance: this.variance(),
            sd: this.sd()
        };
    }
}

// Calculator Functions for Negative Binomial Distribution
function calculateNegativeBinomialProbability() {
    try {
        const r = getNumberInput('negbinom-r');
        const p = getNumberInput('negbinom-p');
        const x1 = getNumberInput('negbinom-x1');
        const calcType = document.getElementById('negbinom-calc-type-picker').value;

        if (r <= 0 || !Number.isInteger(r)) {
            throw new Error('Number of successes r must be a positive integer');
        }

        if (p <= 0 || p >= 1) {
            throw new Error('Probability p must be between 0 and 1 (exclusive)');
        }

        if (x1 < 0 || !Number.isInteger(x1)) {
            throw new Error('X must be a non-negative integer');
        }

        const dist = new NegativeBinomialDistribution(r, p);
        let result = '';

        switch (calcType) {
            case 'exact':
                const probExact = dist.pmf(x1);
                result = `
                    <h4>P(X = ${x1}):</h4>
                    <p>$$P(X = ${x1}) = \\binom{${x1}+${r}-1}{${x1}} ${formatNumberForLatex(p)}^{${r}} (1-${formatNumberForLatex(p)})^{${x1}} = ${formatNumberForLatex(probExact)}$$</p>
                `;
                break;
            
            case 'less-equal':
                const probLessEqual = dist.cdf(x1);
                result = `
                    <h4>P(X ≤ ${x1}):</h4>
                    <p>$$P(X \\leq ${x1}) = ${formatNumberForLatex(probLessEqual)}$$</p>
                `;
                break;
            
            case 'greater-equal':
                const probGreaterEqual = 1 - (x1 > 0 ? dist.cdf(x1 - 1) : 0);
                result = `
                    <h4>P(X ≥ ${x1}):</h4>
                    <p>$$P(X \\geq ${x1}) = ${formatNumberForLatex(probGreaterEqual)}$$</p>
                `;
                break;
            
            case 'between':
                const x2 = getNumberInput('negbinom-x2');
                if (x2 < 0 || !Number.isInteger(x2)) {
                    throw new Error('X2 must be a non-negative integer');
                }
                if (x1 > x2) {
                    throw new Error('X1 must be less than or equal to X2');
                }
                const probBetween = dist.cdf(x2) - (x1 > 0 ? dist.cdf(x1 - 1) : 0);
                result = `
                    <h4>P(${x1} ≤ X ≤ ${x2}):</h4>
                    <p>$$P(${x1} \\leq X \\leq ${x2}) = ${formatNumberForLatex(probBetween)}$$</p>
                `;
                break;
        }

        // Add distribution moments
        const moments = dist.printMoments();
        result += `
            <h4>Distribution Properties:</h4>
            <p>$$r = ${r}, \\quad p = ${formatNumberForLatex(p)}$$</p>
        `;
        result += formatMomentsLatex(moments, 'Negative Binomial');

        updateWithLatex('negbinom-result-content', result);
        showResultContainer('negbinom-result');

    } catch (error) {
        showError(error.message);
    }
}

function toggleNegBinomCalcType() {
    const calcType = document.getElementById('negbinom-calc-type-picker').value;
    const x2Container = document.getElementById('negbinom-x2-container');
    
    if (calcType === 'between') {
        x2Container.classList.remove('hidden');
    } else {
        x2Container.classList.add('hidden');
    }
}
