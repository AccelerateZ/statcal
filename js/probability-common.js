/**
 * Common utility functions for probability distributions
 * Adapted from applets/common.js with modern JavaScript practices
 */

// Mathematical utility functions
function factorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    } else {
        return factorial(n - 1) * n;
    }
}

function logFactorial(n) {
    if (n === 0 || n === 1) {
        return 0;
    } else {
        return logFactorial(n - 1) + Math.log(n);
    }
}

function combination(n, k) {
    if (n === k || k === 0) {
        return 1;
    } else if (n < k) {
        return 0;
    } else {
        return factorial(n) / (factorial(k) * factorial(n - k));
    }
}

function roundNumber(num, digits = 4) {
    return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
}

// Distribution class definitions

class NormalDistribution {
    constructor(mu, sigma) {
        this.mu = parseFloat(mu);
        this.sigma = parseFloat(sigma);
    }

    mean() {
        return this.mu;
    }

    variance() {
        return this.sigma * this.sigma;
    }

    sd() {
        return this.sigma;
    }

    pdf(x) {
        if (!isNaN(parseFloat(x))) {
            return jStat.normal.pdf(x, this.mu, this.sigma);
        }
        return '';
    }

    cdf(x) {
        if (!isNaN(parseFloat(x))) {
            return jStat.normal.cdf(x, this.mu, this.sigma);
        }
        return '';
    }

    percentile(p) {
        if (!isNaN(parseFloat(p)) && p >= 0 && p <= 1) {
            return jStat.normal.inv(p, this.mu, this.sigma);
        }
        return '';
    }

    printMoments() {
        return {
            mean: this.mean(),
            variance: this.variance(),
            sd: this.sd()
        };
    }
}

class BinomialDistribution {
    constructor(n, p) {
        this.n = parseInt(n);
        this.p = parseFloat(p);
    }

    mean() {
        return this.n * this.p;
    }

    variance() {
        return this.n * this.p * (1 - this.p);
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    pmf(x) {
        const k = parseInt(x);
        if (k < 0 || k > this.n) return 0;
        return combination(this.n, k) * Math.pow(this.p, k) * Math.pow(1 - this.p, this.n - k);
    }

    cdf(x) {
        const k = parseInt(x);
        let cdfVal = 0;
        for (let i = 0; i <= k && i <= this.n; i++) {
            cdfVal += this.pmf(i);
        }
        return Math.min(cdfVal, 1);
    }

    printMoments() {
        return {
            mean: this.mean(),
            variance: this.variance(),
            sd: this.sd()
        };
    }
}

class PoissonDistribution {
    constructor(lambda) {
        this.lambda = parseFloat(lambda);
    }

    mean() {
        return this.lambda;
    }

    variance() {
        return this.lambda;
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    pmf(x) {
        const k = parseInt(x);
        if (k < 0) return 0;
        return Math.exp(-this.lambda) * Math.pow(this.lambda, k) / factorial(k);
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

class ExponentialDistribution {
    constructor(lambda) {
        this.lambda = parseFloat(lambda);
    }

    mean() {
        return 1 / this.lambda;
    }

    variance() {
        return 1 / (this.lambda * this.lambda);
    }

    sd() {
        return Math.sqrt(this.variance());
    }

    pdf(x) {
        if (x < 0) return 0;
        return this.lambda * Math.exp(-this.lambda * x);
    }

    cdf(x) {
        if (x < 0) return 0;
        return 1 - Math.exp(-this.lambda * x);
    }

    percentile(p) {
        if (p < 0 || p > 1) return '';
        return -Math.log(1 - p) / this.lambda;
    }

    printMoments() {
        return {
            mean: this.mean(),
            variance: this.variance(),
            sd: this.sd()
        };
    }
}

// Utility function to format distribution moments for LaTeX display
function formatMomentsLatex(moments, distributionName) {
    return `
        <h4>${distributionName} Distribution Properties:</h4>
        <p>$$\\mu = E(X) = ${formatNumberForLatex(moments.mean)}$$</p>
        <p>$$\\sigma^2 = Var(X) = ${formatNumberForLatex(moments.variance)}$$</p>
        <p>$$\\sigma = SD(X) = ${formatNumberForLatex(moments.sd)}$$</p>
    `;
}

// Additional distribution classes for completeness
class GammaDistribution {
    constructor(alpha, beta) {
        this.alpha = parseFloat(alpha);  // shape parameter
        this.beta = parseFloat(beta);    // scale parameter
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
