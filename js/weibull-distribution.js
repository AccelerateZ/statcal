/**
 * Weibull Distribution Calculator
 * Calculate probabilities and properties for Weibull distribution
 */

// Helper function for Gamma function (approximation)
function gamma(z) {
    // Stirling's approximation for gamma function
    if (z === 1) return 1;
    if (z === 0.5) return Math.sqrt(Math.PI);
    if (z > 1) {
        return (z - 1) * gamma(z - 1);
    }
    // Use Lanczos approximation for better accuracy
    const g = 7;
    const C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
             771.32342877765313, -176.61502916214059, 12.507343278686905,
             -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    
    if (z < 0.5) {
        return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    }
    
    z -= 1;
    let x = C[0];
    for (let i = 1; i < g + 2; i++) {
        x += C[i] / (z + i);
    }
    
    const t = z + g + 0.5;
    const sqrt2pi = Math.sqrt(2 * Math.PI);
    return sqrt2pi * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

// Weibull Distribution Class
class WeibullDistribution {
    constructor(lambda, k) {
        this.lambda = parseFloat(lambda); // scale parameter
        this.k = parseFloat(k);           // shape parameter
    }

    mean() {
        return this.lambda * gamma(1 + 1 / this.k);
    }

    variance() {
        const gamma1 = gamma(1 + 1 / this.k);
        const gamma2 = gamma(1 + 2 / this.k);
        return this.lambda * this.lambda * (gamma2 - gamma1 * gamma1);
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    pdf(x) {
        if (x < 0) return 0;
        return (this.k / this.lambda) * Math.pow(x / this.lambda, this.k - 1) * Math.exp(-Math.pow(x / this.lambda, this.k));
    }

    cdf(x) {
        if (x < 0) return 0;
        return 1 - Math.exp(-Math.pow(x / this.lambda, this.k));
    }

    percentile(p) {
        if (p < 0 || p > 1) return '';
        return this.lambda * Math.pow(-Math.log(1 - p), 1 / this.k);
    }

    printMoments() {
        return {
            mean: this.mean(),
            variance: this.variance(),
            sd: this.sd()
        };
    }
}

// Calculator Functions for Weibull Distribution
function calculateWeibullProbability() {
    try {
        const lambda = getNumberInput('weibull-lambda');
        const k = getNumberInput('weibull-k');
        const calcType = document.getElementById('weibull-calc-type-picker').value;

        if (lambda <= 0) {
            throw new Error('Scale parameter λ must be positive');
        }

        if (k <= 0) {
            throw new Error('Shape parameter k must be positive');
        }

        const dist = new WeibullDistribution(lambda, k);
        let result = '';

        switch (calcType) {
            case 'pdf':
                const x = getNumberInput('weibull-x');
                if (x < 0) {
                    throw new Error('X must be non-negative');
                }
                const pdfValue = dist.pdf(x);
                result = `
                    <h4>Probability Density at x = ${x}:</h4>
                    <p>$$f(${formatNumberForLatex(x)}) = ${formatNumberForLatex(pdfValue)}$$</p>
                `;
                break;
            
            case 'cdf':
                const xCdf = getNumberInput('weibull-x');
                if (xCdf < 0) {
                    throw new Error('X must be non-negative');
                }
                const cdfValue = dist.cdf(xCdf);
                result = `
                    <h4>P(X ≤ ${xCdf}):</h4>
                    <p>$$P(X \\leq ${formatNumberForLatex(xCdf)}) = 1 - e^{-\\left(\\frac{${formatNumberForLatex(xCdf)}}{${formatNumberForLatex(lambda)}}\\right)^{${formatNumberForLatex(k)}}} = ${formatNumberForLatex(cdfValue)}$$</p>
                `;
                break;
            
            case 'percentile':
                const p = getNumberInput('weibull-p');
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
            <p>$$\\lambda = ${formatNumberForLatex(lambda)}, \\quad k = ${formatNumberForLatex(k)}$$</p>
        `;
        result += formatMomentsLatex(moments, 'Weibull');

        updateWithLatex('weibull-result-content', result);
        showResultContainer('weibull-result');

    } catch (error) {
        showError(error.message);
    }
}

function toggleWeibullCalcType() {
    const calcType = document.getElementById('weibull-calc-type-picker').value;
    const xContainer = document.getElementById('weibull-x-container');
    const pContainer = document.getElementById('weibull-p-container');
    
    if (calcType === 'percentile') {
        xContainer.classList.add('hidden');
        pContainer.classList.remove('hidden');
    } else {
        xContainer.classList.remove('hidden');
        pContainer.classList.add('hidden');
    }
}
