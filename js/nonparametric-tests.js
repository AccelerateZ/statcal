/**
 * Non-parametric Statistical Tests Calculator
 * Modern implementation of Wilcoxon tests, Mann-Whitney U test, and Runs test
 */

// Wilcoxon Signed Rank Test Class
class WilcoxonSignedRankTest {
    constructor(n) {
        this.n = parseInt(n);
        this.xmin = 0;
        this.xmax = this.n * (this.n + 1) / 2;
    }

    mean() {
        return this.n * (this.n + 1) / 4;
    }

    variance() {
        return this.n * (this.n + 1) * (2 * this.n + 1) / 24;
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    // Recursive function to calculate number of combinations
    cnum(x, n) {
        if (x < 0 || x > (n * (n + 1) / 2) || n < 1) return 0;
        if (n === 1) return 1;
        return this.cnum(x, n - 1) + this.cnum(x - n, n - 1);
    }

    pmf(x) {
        if (x >= this.xmin && x <= this.xmax) {
            return this.cnum(x, this.n) / Math.pow(2, this.n);
        }
        return 0;
    }

    cdf(x) {
        let cdfval = 0;
        for (let i = this.xmin; i <= x; i++) {
            cdfval += this.pmf(i);
        }
        if (x === this.xmax) {
            cdfval = 1;
        }
        return cdfval;
    }

    printMoments() {
        return {
            mean: this.mean(),
            variance: this.variance(),
            sd: this.sd()
        };
    }
}

// Mann-Whitney U-Test Class (Enhanced Implementation)
class MannWhitneyUTest {
    constructor(n1, n2) {
        this.n1 = parseInt(n1);
        this.n2 = parseInt(n2);
        this.xmin = 0;
        this.xmax = this.n1 * this.n2;
    }

    mean() {
        return this.n1 * this.n2 / 2;
    }

    variance() {
        return this.n1 * this.n2 * (this.n1 + this.n2 + 1) / 12;
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    // Recursive function for exact PMF calculation (from original mw.object.js)
    fnum(u, n1, n2) {
        if (u < 0 || n1 < 0 || n2 < 0 || (n1 * n2) < u) return 0;
        else if (u === 0 && n1 >= 0 && n2 >= 0) return 1;
        else return (this.fnum(u, n1, n2 - 1) + this.fnum(u - n2, n1 - 1, n2));
    }

    pmf(u) {
        if (u >= this.xmin && u <= this.xmax) {
            return (factorial(this.n1) * factorial(this.n2) / factorial(this.n1 + this.n2)) * 
                   this.fnum(u, this.n1, this.n2);
        } else {
            return 0;
        }
    }

    cdf(x) {
        let cdfval = 0;
        for (let i = this.xmin; i <= x; i++) {
            cdfval += this.pmf(i);
        }
        if (x === this.xmax) {
            cdfval = 1;
        }
        return cdfval;
    }

    // Convert U statistic to rank sum
    uToRankSum(u) {
        return u + this.n1 * (this.n1 + 1) / 2;
    }

    // Convert rank sum to U statistic
    rankSumToU(rankSum) {
        return rankSum - this.n1 * (this.n1 + 1) / 2;
    }

    printMoments() {
        return {
            mean: this.mean(),
            variance: this.variance(),
            sd: this.sd()
        };
    }
}

// Wilcoxon Rank Sum Test Class (simplified wrapper)
class WilcoxonRankSumTest {
    constructor(n1, n2) {
        this.n1 = parseInt(n1);
        this.n2 = parseInt(n2);
        this.N = this.n1 + this.n2;
        this.xmin = this.n1 * (this.n1 + 1) / 2;
        this.xmax = this.n1 * (this.n1 + 2 * this.n2 + 1) / 2;
        this.mannWhitney = new MannWhitneyUTest(n1, n2);
    }

    mean() {
        return this.n1 * (this.N + 1) / 2;
    }

    variance() {
        return this.n1 * this.n2 * (this.N + 1) / 12;
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    pmf(w) {
        // Convert rank sum to U statistic and use Mann-Whitney calculation
        const u = this.mannWhitney.rankSumToU(w);
        return this.mannWhitney.pmf(u);
    }

    cdf(w) {
        // Use normal approximation for large samples
        if (this.n1 > 8 || this.n2 > 8) {
            const mu = this.mean();
            const sigma = this.sd();
            const z = (w + 0.5 - mu) / sigma;
            return jStat.normal.cdf(z, 0, 1);
        }
        
        // For small samples, use exact calculation
        let cdfval = 0;
        for (let i = this.xmin; i <= w; i++) {
            cdfval += this.pmf(i);
        }
        return Math.min(cdfval, 1);
    }

    // Mann-Whitney U statistic
    mannWhitneyU(rankSum) {
        return this.mannWhitney.rankSumToU(rankSum);
    }

    printMoments() {
        return {
            mean: this.mean(),
            variance: this.variance(),
            sd: this.sd()
        };
    }
}

// Runs Test Class
class RunsTest {
    constructor(n1, n2) {
        this.n1 = parseInt(n1);
        this.n2 = parseInt(n2);
        
        if (this.n1 === 0 || this.n2 === 0) {
            this.xmin = 1;
            this.xmax = 1;
        } else if (this.n1 !== this.n2) {
            this.xmin = 2;
            this.xmax = 2 * Math.min(this.n1, this.n2) + 2;
        } else {
            this.xmin = 2;
            this.xmax = 2 * Math.min(this.n1, this.n2) + 1;
        }
    }

    mean() {
        return 2 * this.n1 * this.n2 / (this.n1 + this.n2) + 1;
    }

    variance() {
        return (2 * this.n1 * this.n2 * (2 * this.n1 * this.n2 - this.n1 - this.n2)) /
               ((this.n1 + this.n2) * (this.n1 + this.n2) * (this.n1 + this.n2 - 1));
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    pmf(x) {
        x = parseInt(x);
        
        if (x < this.xmin || x > this.xmax) return 0;
        
        if (this.n1 === 0 || this.n2 === 0) return 1;
        
        if (x % 2 === 0) { // even
            return (2 * combination(this.n1 - 1, x / 2 - 1) * combination(this.n2 - 1, x / 2 - 1)) /
                   combination(this.n1 + this.n2, this.n1);
        } else { // odd
            return (combination(this.n1 - 1, (x - 1) / 2) * combination(this.n2 - 1, (x - 1) / 2 - 1) +
                   combination(this.n2 - 1, (x - 1) / 2) * combination(this.n1 - 1, (x - 1) / 2 - 1)) /
                   combination(this.n1 + this.n2, this.n1);
        }
    }

    cdf(x) {
        let cdfval = 0;
        for (let i = this.xmin; i <= x; i++) {
            cdfval += this.pmf(i);
        }
        if (x === this.xmax) {
            cdfval = 1;
        }
        return cdfval;
    }

    printMoments() {
        return {
            mean: this.mean(),
            variance: this.variance(),
            sd: this.sd()
        };
    }
}

// Calculator Functions for Wilcoxon Signed Rank Test
function calculateWilcoxonSignedRank() {
    try {
        const n = getNumberInput('wilcoxon-signed-n');
        const w = getNumberInput('wilcoxon-signed-w');
        const calcType = document.getElementById('wilcoxon-signed-calc-type-picker').value;

        if (n <= 0 || !Number.isInteger(n)) {
            throw new Error('Sample size n must be a positive integer');
        }

        if (n > 25) {
            throw new Error('For n > 25, use normal approximation (not implemented in this demo)');
        }

        const test = new WilcoxonSignedRankTest(n);
        
        if (w < test.xmin || w > test.xmax || !Number.isInteger(w)) {
            throw new Error(`W must be an integer between ${test.xmin} and ${test.xmax}`);
        }

        let result = '';

        switch (calcType) {
            case 'exact':
                const probExact = test.pmf(w);
                result = `
                    <h4>P(W = ${w}):</h4>
                    <p>$$P(W = ${w}) = ${formatNumberForLatex(probExact)}$$</p>
                `;
                break;
            
            case 'less-equal':
                const probLessEqual = test.cdf(w);
                result = `
                    <h4>P(W ≤ ${w}):</h4>
                    <p>$$P(W \\leq ${w}) = ${formatNumberForLatex(probLessEqual)}$$</p>
                `;
                break;
            
            case 'greater-equal':
                const probGreaterEqual = 1 - (w > test.xmin ? test.cdf(w - 1) : 0);
                result = `
                    <h4>P(W ≥ ${w}):</h4>
                    <p>$$P(W \\geq ${w}) = ${formatNumberForLatex(probGreaterEqual)}$$</p>
                `;
                break;
        }

        // Add test statistics
        const moments = test.printMoments();
        result += `
            <h4>Test Properties:</h4>
            <p>$$n = ${n}$$</p>
            <p>$$W \\in [${test.xmin}, ${test.xmax}]$$</p>
        `;
        result += formatMomentsLatex(moments, 'Wilcoxon Signed Rank');

        updateWithLatex('wilcoxon-signed-result-content', result);
        showResultContainer('wilcoxon-signed-result');

    } catch (error) {
        showError(error.message);
    }
}

// Calculator Functions for Mann-Whitney U Test
function calculateMannWhitneyU() {
    try {
        const n1 = getNumberInput('mann-whitney-n1');
        const n2 = getNumberInput('mann-whitney-n2');
        const u = getNumberInput('mann-whitney-u');
        const calcType = document.getElementById('mann-whitney-calc-type-picker').value;

        if (n1 <= 0 || !Number.isInteger(n1)) {
            throw new Error('Sample size n1 must be a positive integer');
        }

        if (n2 <= 0 || !Number.isInteger(n2)) {
            throw new Error('Sample size n2 must be a positive integer');
        }

        const test = new MannWhitneyUTest(n1, n2);
        
        if (u < test.xmin || u > test.xmax || !Number.isInteger(u)) {
            throw new Error(`U must be an integer between ${test.xmin} and ${test.xmax}`);
        }

        let result = '';

        switch (calcType) {
            case 'exact':
                const probExact = test.pmf(u);
                result = `
                    <h4>P(U = ${u}):</h4>
                    <p>$$P(U = ${u}) = ${formatNumberForLatex(probExact)}$$</p>
                `;
                break;
            
            case 'less-equal':
                const probLessEqual = test.cdf(u);
                result = `
                    <h4>P(U ≤ ${u}):</h4>
                    <p>$$P(U \\leq ${u}) = ${formatNumberForLatex(probLessEqual)}$$</p>
                `;
                break;
            
            case 'greater-equal':
                const probGreaterEqual = 1 - (u > test.xmin ? test.cdf(u - 1) : 0);
                result = `
                    <h4>P(U ≥ ${u}):</h4>
                    <p>$$P(U \\geq ${u}) = ${formatNumberForLatex(probGreaterEqual)}$$</p>
                `;
                break;
        }

        // Add rank sum equivalent
        const rankSum = test.uToRankSum(u);
        result += `
            <h4>Wilcoxon Rank Sum Equivalent:</h4>
            <p>$$W = U + \\frac{n_1(n_1+1)}{2} = ${u} + \\frac{${n1} \\cdot ${n1+1}}{2} = ${formatNumberForLatex(rankSum)}$$</p>
        `;

        // Add test context
        result += `
            <h4>Mann-Whitney U Test Context:</h4>
            <p>This tests whether two independent samples come from populations with the same distribution.</p>
            <p>$$H_0: F_1(x) = F_2(x) \\text{ for all } x$$</p>
            <p>$$H_a: F_1(x) \\neq F_2(x) \\text{ for some } x$$</p>
        `;

        // Add test statistics
        const moments = test.printMoments();
        result += `
            <h4>Test Properties:</h4>
            <p>$$n_1 = ${n1}, \\quad n_2 = ${n2}$$</p>
            <p>$$U \\in [${test.xmin}, ${test.xmax}]$$</p>
        `;
        result += formatMomentsLatex(moments, 'Mann-Whitney U');

        updateWithLatex('mann-whitney-result-content', result);
        showResultContainer('mann-whitney-result');

    } catch (error) {
        showError(error.message);
    }
}

// Calculator Functions for Wilcoxon Rank Sum Test
function calculateWilcoxonRankSum() {
    try {
        const n1 = getNumberInput('wilcoxon-rank-n1');
        const n2 = getNumberInput('wilcoxon-rank-n2');
        const w = getNumberInput('wilcoxon-rank-w');
        const calcType = document.getElementById('wilcoxon-rank-calc-type-picker').value;

        if (n1 <= 0 || !Number.isInteger(n1)) {
            throw new Error('Sample size n1 must be a positive integer');
        }

        if (n2 <= 0 || !Number.isInteger(n2)) {
            throw new Error('Sample size n2 must be a positive integer');
        }

        const test = new WilcoxonRankSumTest(n1, n2);
        
        if (w < test.xmin || w > test.xmax || !Number.isInteger(w)) {
            throw new Error(`W must be an integer between ${formatNumberForLatex(test.xmin)} and ${formatNumberForLatex(test.xmax)}`);
        }

        let result = '';

        switch (calcType) {
            case 'exact':
                const probExact = test.pmf(w);
                result = `
                    <h4>P(W = ${w}):</h4>
                    <p>$$P(W = ${w}) = ${formatNumberForLatex(probExact)}$$</p>
                `;
                break;
            
            case 'less-equal':
                const probLessEqual = test.cdf(w);
                result = `
                    <h4>P(W ≤ ${w}):</h4>
                    <p>$$P(W \\leq ${w}) = ${formatNumberForLatex(probLessEqual)}$$</p>
                `;
                break;
            
            case 'greater-equal':
                const probGreaterEqual = 1 - test.cdf(w - 1);
                result = `
                    <h4>P(W ≥ ${w}):</h4>
                    <p>$$P(W \\geq ${w}) = ${formatNumberForLatex(probGreaterEqual)}$$</p>
                `;
                break;
        }

        // Add Mann-Whitney U statistic
        const u = test.mannWhitneyU(w);
        result += `
            <h4>Mann-Whitney U Statistic:</h4>
            <p>$$U = W - \\frac{n_1(n_1+1)}{2} = ${w} - \\frac{${n1} \\cdot ${n1+1}}{2} = ${formatNumberForLatex(u)}$$</p>
        `;

        // Add test context
        result += `
            <h4>Wilcoxon Rank Sum Test Context:</h4>
            <p>This is equivalent to the Mann-Whitney U test, testing whether two independent samples come from populations with the same distribution.</p>
            <p>$$H_0: \\text{The two populations have identical distributions}$$</p>
            <p>$$H_a: \\text{The two populations have different distributions}$$</p>
        `;

        // Add test statistics
        const moments = test.printMoments();
        result += `
            <h4>Test Properties:</h4>
            <p>$$n_1 = ${n1}, \\quad n_2 = ${n2}$$</p>
            <p>$$W \\in [${formatNumberForLatex(test.xmin)}, ${formatNumberForLatex(test.xmax)}]$$</p>
        `;
        result += formatMomentsLatex(moments, 'Wilcoxon Rank Sum');

        updateWithLatex('wilcoxon-rank-result-content', result);
        showResultContainer('wilcoxon-rank-result');

    } catch (error) {
        showError(error.message);
    }
}

// Calculator Functions for Runs Test
function calculateRunsTest() {
    try {
        const n1 = getNumberInput('runs-n1');
        const n2 = getNumberInput('runs-n2');
        const r = getNumberInput('runs-r');
        const calcType = document.getElementById('runs-calc-type-picker').value;

        if (n1 < 0 || !Number.isInteger(n1)) {
            throw new Error('n1 must be a non-negative integer');
        }

        if (n2 < 0 || !Number.isInteger(n2)) {
            throw new Error('n2 must be a non-negative integer');
        }

        const test = new RunsTest(n1, n2);
        
        if (r < test.xmin || r > test.xmax || !Number.isInteger(r)) {
            throw new Error(`Number of runs must be an integer between ${test.xmin} and ${test.xmax}`);
        }

        let result = '';

        switch (calcType) {
            case 'exact':
                const probExact = test.pmf(r);
                result = `
                    <h4>P(R = ${r}):</h4>
                    <p>$$P(R = ${r}) = ${formatNumberForLatex(probExact)}$$</p>
                `;
                break;
            
            case 'less-equal':
                const probLessEqual = test.cdf(r);
                result = `
                    <h4>P(R ≤ ${r}):</h4>
                    <p>$$P(R \\leq ${r}) = ${formatNumberForLatex(probLessEqual)}$$</p>
                `;
                break;
            
            case 'greater-equal':
                const probGreaterEqual = 1 - (r > test.xmin ? test.cdf(r - 1) : 0);
                result = `
                    <h4>P(R ≥ ${r}):</h4>
                    <p>$$P(R \\geq ${r}) = ${formatNumberForLatex(probGreaterEqual)}$$</p>
                `;
                break;
        }

        // Add test context
        result += `
            <h4>Runs Test Context:</h4>
            <p>This tests the hypothesis that a sequence of ${n1 + n2} observations (${n1} of type 1, ${n2} of type 2) is random.</p>
            <p>$$H_0: \\text{sequence is random}$$</p>
            <p>$$H_a: \\text{sequence is not random}$$</p>
        `;

        // Add test statistics
        const moments = test.printMoments();
        result += `
            <h4>Test Properties:</h4>
            <p>$$n_1 = ${n1}, \\quad n_2 = ${n2}$$</p>
            <p>$$R \\in [${test.xmin}, ${test.xmax}]$$</p>
        `;
        result += formatMomentsLatex(moments, 'Runs Test');

        updateWithLatex('runs-result-content', result);
        showResultContainer('runs-result');

    } catch (error) {
        showError(error.message);
    }
}
