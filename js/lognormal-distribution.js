/**
 * Log-normal Distribution Calculator
 * Calculate probabilities and properties for Log-normal distribution
 */

// Log-normal Distribution Class
class LognormalDistribution {
    constructor(mu, sigma) {
        this.mu = parseFloat(mu);     // mean of underlying normal
        this.sigma = parseFloat(sigma); // std dev of underlying normal
    }

    mean() {
        return Math.exp(this.mu + (this.sigma * this.sigma) / 2);
    }

    variance() {
        const expSigma2 = Math.exp(this.sigma * this.sigma);
        return Math.exp(2 * this.mu + this.sigma * this.sigma) * (expSigma2 - 1);
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    pdf(x) {
        if (x <= 0) return 0;
        return jStat.lognormal.pdf(x, this.mu, this.sigma);
    }

    cdf(x) {
        if (x <= 0) return 0;
        return jStat.lognormal.cdf(x, this.mu, this.sigma);
    }

    percentile(p) {
        if (p < 0 || p > 1) return '';
        return jStat.lognormal.inv(p, this.mu, this.sigma);
    }

    printMoments() {
        return {
            mean: this.mean(),
            variance: this.variance(),
            sd: this.sd()
        };
    }
}

// Calculator Functions for Log-normal Distribution
function calculateLognormalProbability() {
    try {
        const mu = getNumberInput('lognormal-mu');
        const sigma = getNumberInput('lognormal-sigma');
        const calcType = document.getElementById('lognormal-calc-type-picker').value;

        if (sigma <= 0) {
            throw new Error('Standard deviation σ must be positive');
        }

        const dist = new LognormalDistribution(mu, sigma);
        let result = '';

        switch (calcType) {
            case 'pdf':
                const x = getNumberInput('lognormal-x');
                if (x <= 0) {
                    throw new Error('X must be positive for log-normal distribution');
                }
                const pdfValue = dist.pdf(x);
                result = `
                    <h4>Probability Density at x = ${x}:</h4>
                    <p>$$f(${formatNumberForLatex(x)}) = ${formatNumberForLatex(pdfValue)}$$</p>
                `;
                break;
            
            case 'cdf':
                const xCdf = getNumberInput('lognormal-x');
                if (xCdf <= 0) {
                    throw new Error('X must be positive for log-normal distribution');
                }
                const cdfValue = dist.cdf(xCdf);
                result = `
                    <h4>P(X ≤ ${xCdf}):</h4>
                    <p>$$P(X \\leq ${formatNumberForLatex(xCdf)}) = ${formatNumberForLatex(cdfValue)}$$</p>
                `;
                break;
            
            case 'percentile':
                const p = getNumberInput('lognormal-p');
                if (p <= 0 || p >= 1) {
                    throw new Error('Percentile p must be between 0 and 1 (exclusive)');
                }
                const percentileValue = dist.percentile(p);
                result = `
                    <h4>${(p * 100).toFixed(1)}th Percentile:</h4>
                    <p>$$x_{${formatNumberForLatex(p)}} = ${formatNumberForLatex(percentileValue)}$$</p>
                `;
                break;
        }

        // Add distribution moments
        const moments = dist.printMoments();
        result += `
            <h4>Distribution Properties:</h4>
            <p>$$\\mu = ${formatNumberForLatex(mu)}, \\quad \\sigma = ${formatNumberForLatex(sigma)}$$</p>
        `;
        result += formatMomentsLatex(moments, 'Log-normal');

        updateWithLatex('lognormal-result-content', result);
        showResultContainer('lognormal-result');

    } catch (error) {
        showError(error.message);
    }
}

function toggleLognormalCalcType() {
    const calcType = document.getElementById('lognormal-calc-type-picker').value;
    const xContainer = document.getElementById('lognormal-x-container');
    const pContainer = document.getElementById('lognormal-p-container');
    
    if (calcType === 'percentile') {
        xContainer.classList.add('hidden');
        pContainer.classList.remove('hidden');
    } else {
        xContainer.classList.remove('hidden');
        pContainer.classList.add('hidden');
    }
}
