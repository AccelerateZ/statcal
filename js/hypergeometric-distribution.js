/**
 * Hypergeometric Distribution Calculator
 * Calculate probabilities and properties for Hypergeometric distribution (sampling without replacement)
 */

// Hypergeometric Distribution Class
class HypergeometricDistribution {
    constructor(N, M, n) {
        this.N = parseInt(N);  // population size
        this.M = parseInt(M);  // number of success states in population
        this.n = parseInt(n);  // number of draws
    }

    mean() {
        return this.n * this.M / this.N;
    }

    variance() {
        return this.n * (this.M / this.N) * (1 - this.M / this.N) * (this.N - this.n) / (this.N - 1);
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    pmf(x) {
        const k = parseInt(x);
        if (k < Math.max(0, this.n + this.M - this.N) || k > Math.min(this.n, this.M)) return 0;
        return (combination(this.M, k) * combination(this.N - this.M, this.n - k)) / combination(this.N, this.n);
    }

    cdf(x) {
        const k = parseInt(x);
        let cdfVal = 0;
        const minK = Math.max(0, this.n + this.M - this.N);
        const maxK = Math.min(this.n, this.M);
        
        for (let i = minK; i <= k && i <= maxK; i++) {
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

// Calculator Functions for Hypergeometric Distribution
function calculateHypergeometricProbability() {
    try {
        const N = getNumberInput('hypergeometric-N');
        const M = getNumberInput('hypergeometric-M');
        const n = getNumberInput('hypergeometric-n');
        const x1 = getNumberInput('hypergeometric-x1');
        const calcType = document.getElementById('hypergeometric-calc-type-picker').value;

        if (N <= 0 || !Number.isInteger(N)) {
            throw new Error('Population size N must be a positive integer');
        }
        
        if (M < 0 || M > N || !Number.isInteger(M)) {
            throw new Error('Number of success states M must be between 0 and N');
        }
        
        if (n <= 0 || n > N || !Number.isInteger(n)) {
            throw new Error('Number of draws n must be between 1 and N');
        }

        const dist = new HypergeometricDistribution(N, M, n);
        const minX = Math.max(0, n + M - N);
        const maxX = Math.min(n, M);
        
        if (x1 < minX || x1 > maxX || !Number.isInteger(x1)) {
            throw new Error(`X must be an integer between ${minX} and ${maxX}`);
        }

        let result = '';

        switch (calcType) {
            case 'exact':
                const probExact = dist.pmf(x1);
                result = `
                    <h4>P(X = ${x1}):</h4>
                    <p>$$P(X = ${x1}) = \\frac{\\binom{${M}}{${x1}} \\binom{${N-M}}{${n-x1}}}{\\binom{${N}}{${n}}} = ${formatNumberForLatex(probExact)}$$</p>
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
                const probGreaterEqual = 1 - (x1 > minX ? dist.cdf(x1 - 1) : 0);
                result = `
                    <h4>P(X ≥ ${x1}):</h4>
                    <p>$$P(X \\geq ${x1}) = ${formatNumberForLatex(probGreaterEqual)}$$</p>
                `;
                break;
            
            case 'between':
                const x2 = getNumberInput('hypergeometric-x2');
                if (x2 < minX || x2 > maxX || !Number.isInteger(x2)) {
                    throw new Error(`X2 must be an integer between ${minX} and ${maxX}`);
                }
                if (x1 > x2) {
                    throw new Error('X1 must be less than or equal to X2');
                }
                const probBetween = dist.cdf(x2) - (x1 > minX ? dist.cdf(x1 - 1) : 0);
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
            <p>$$N = ${N}, \\quad M = ${M}, \\quad n = ${n}$$</p>
        `;
        result += formatMomentsLatex(moments, 'Hypergeometric');

        updateWithLatex('hypergeometric-result-content', result);
        showResultContainer('hypergeometric-result');

    } catch (error) {
        showError(error.message);
    }
}

function toggleHypergeometricCalcType() {
    const calcType = document.getElementById('hypergeometric-calc-type-picker').value;
    const x2Container = document.getElementById('hypergeometric-x2-container');
    
    if (calcType === 'between') {
        x2Container.classList.remove('hidden');
    } else {
        x2Container.classList.add('hidden');
    }
}
