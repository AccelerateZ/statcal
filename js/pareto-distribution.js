/**
 * Pareto Distribution Calculator
 * Calculate probabilities and properties for Pareto distribution
 */

// Pareto Distribution Class
class ParetoDistribution {
    constructor(xm, alpha) {
        this.xm = parseFloat(xm);      // scale parameter (minimum value)
        this.alpha = parseFloat(alpha); // shape parameter
    }

    mean() {
        if (this.alpha <= 1) return Infinity;
        return (this.alpha * this.xm) / (this.alpha - 1);
    }

    variance() {
        if (this.alpha <= 2) return Infinity;
        return (this.xm * this.xm * this.alpha) / ((this.alpha - 1) * (this.alpha - 1) * (this.alpha - 2));
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    pdf(x) {
        if (x < this.xm) return 0;
        return (this.alpha * Math.pow(this.xm, this.alpha)) / Math.pow(x, this.alpha + 1);
    }

    cdf(x) {
        if (x < this.xm) return 0;
        return 1 - Math.pow(this.xm / x, this.alpha);
    }

    percentile(p) {
        if (p < 0 || p > 1) return '';
        return this.xm / Math.pow(1 - p, 1 / this.alpha);
    }

    printMoments() {
        return {
            mean: this.mean(),
            variance: this.variance(),
            sd: this.sd()
        };
    }
}

// Calculator Functions for Pareto Distribution
function calculateParetoProbability() {
    try {
        const xm = getNumberInput('pareto-xm');
        const alpha = getNumberInput('pareto-alpha');
        const calcType = document.getElementById('pareto-calc-type-picker').value;

        if (xm <= 0) {
            throw new Error('Scale parameter xm must be positive');
        }

        if (alpha <= 0) {
            throw new Error('Shape parameter α must be positive');
        }

        const dist = new ParetoDistribution(xm, alpha);
        let result = '';

        switch (calcType) {
            case 'pdf':
                const x = getNumberInput('pareto-x');
                if (x < xm) {
                    throw new Error(`X must be greater than or equal to xm = ${xm}`);
                }
                const pdfValue = dist.pdf(x);
                result = `
                    <h4>Probability Density at x = ${x}:</h4>
                    <p>$$f(${formatNumberForLatex(x)}) = ${formatNumberForLatex(pdfValue)}$$</p>
                `;
                break;
            
            case 'cdf':
                const xCdf = getNumberInput('pareto-x');
                if (xCdf < xm) {
                    throw new Error(`X must be greater than or equal to xm = ${xm}`);
                }
                const cdfValue = dist.cdf(xCdf);
                result = `
                    <h4>P(X ≤ ${xCdf}):</h4>
                    <p>$$P(X \\leq ${formatNumberForLatex(xCdf)}) = 1 - \\left(\\frac{${formatNumberForLatex(xm)}}{${formatNumberForLatex(xCdf)}}\\right)^{${formatNumberForLatex(alpha)}} = ${formatNumberForLatex(cdfValue)}$$</p>
                `;
                break;
            
            case 'percentile':
                const p = getNumberInput('pareto-p');
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
            <p>$$x_m = ${formatNumberForLatex(xm)}, \\quad \\alpha = ${formatNumberForLatex(alpha)}$$</p>
        `;
        result += formatMomentsLatex(moments, 'Pareto');

        updateWithLatex('pareto-result-content', result);
        showResultContainer('pareto-result');

    } catch (error) {
        showError(error.message);
    }
}

function toggleParetoCalcType() {
    const calcType = document.getElementById('pareto-calc-type-picker').value;
    const xContainer = document.getElementById('pareto-x-container');
    const pContainer = document.getElementById('pareto-p-container');
    
    if (calcType === 'percentile') {
        xContainer.classList.add('hidden');
        pContainer.classList.remove('hidden');
    } else {
        xContainer.classList.remove('hidden');
        pContainer.classList.add('hidden');
    }
}
