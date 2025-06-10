/**
 * Geometric Distribution Calculator
 * Calculate probabilities and properties for Geometric distribution (failures before first success)
 */

// Geometric Distribution Class (number of failures before first success)
class GeometricDistribution {
    constructor(p) {
        this.p = parseFloat(p);  // probability of success
    }

    mean() {
        return (1 - this.p) / this.p;
    }

    variance() {
        return (1 - this.p) / (this.p * this.p);
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    pmf(x) {
        const k = parseInt(x);
        if (k < 0) return 0;
        return Math.pow(1 - this.p, k) * this.p;
    }

    cdf(x) {
        const k = parseInt(x);
        if (k < 0) return 0;
        return 1 - Math.pow(1 - this.p, k + 1);
    }

    printMoments() {
        return {
            mean: this.mean(),
            variance: this.variance(),
            sd: this.sd()
        };
    }
}

// Calculator Functions for Geometric Distribution
function calculateGeometricProbability() {
    try {
        const p = getNumberInput('geometric-p');
        const x1 = getNumberInput('geometric-x1');
        const calcType = document.getElementById('geometric-calc-type-picker').value;

        if (p <= 0 || p >= 1) {
            throw new Error('Probability p must be between 0 and 1 (exclusive)');
        }

        if (x1 < 0 || !Number.isInteger(x1)) {
            throw new Error('X must be a non-negative integer');
        }

        const dist = new GeometricDistribution(p);
        let result = '';

        switch (calcType) {
            case 'exact':
                const probExact = dist.pmf(x1);
                result = `
                    <h4>P(X = ${x1}):</h4>
                    <p>$$P(X = ${x1}) = (1-${formatNumberForLatex(p)})^{${x1}} \\cdot ${formatNumberForLatex(p)} = ${formatNumberForLatex(probExact)}$$</p>
                `;
                break;
            
            case 'less-equal':
                const probLessEqual = dist.cdf(x1);
                result = `
                    <h4>P(X ≤ ${x1}):</h4>
                    <p>$$P(X \\leq ${x1}) = 1 - (1-${formatNumberForLatex(p)})^{${x1+1}} = ${formatNumberForLatex(probLessEqual)}$$</p>
                `;
                break;
            
            case 'greater-equal':
                const probGreaterEqual = 1 - (x1 > 0 ? dist.cdf(x1 - 1) : 0);
                result = `
                    <h4>P(X ≥ ${x1}):</h4>
                    <p>$$P(X \\geq ${x1}) = (1-${formatNumberForLatex(p)})^{${x1}} = ${formatNumberForLatex(probGreaterEqual)}$$</p>
                `;
                break;
            
            case 'between':
                const x2 = getNumberInput('geometric-x2');
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
            <p>$$p = ${formatNumberForLatex(p)}$$</p>
        `;
        result += formatMomentsLatex(moments, 'Geometric');

        updateWithLatex('geometric-result-content', result);
        showResultContainer('geometric-result');

    } catch (error) {
        showError(error.message);
    }
}

function toggleGeometricCalcType() {
    const calcType = document.getElementById('geometric-calc-type-picker').value;
    const x2Container = document.getElementById('geometric-x2-container');
    
    if (calcType === 'between') {
        x2Container.classList.remove('hidden');
    } else {
        x2Container.classList.add('hidden');
    }
}
