/**
 * Calculate p-value from t-statistic
 * Based on compute_alpha_aka_p_value_given_t_stats_DoF.py
 */

function calculatePValueFromTStats() {
    try {
        // Get input values
        const tValue = getNumberInput('t-value');
        const dof = getNumberInput('t-dof');

        // Validate degrees of freedom must be positive integer
        if (dof <= 0 || !Number.isInteger(dof)) {
            throw new Error('Degrees of freedom must be a positive integer');
        }        // Calculate p-value
        // Using t-distribution from jStat library
        // Single-tail p-value: 1 - jStat.studentt.cdf(|tValue|, dof)
        // Double-tail p-value: 2 * (1 - jStat.studentt.cdf(|tValue|, dof))
        
        // Load jStat to calculate p-values
        // Dynamically load jStat library from CDN
        loadJStat().then(() => {
            const absT = Math.abs(tValue);
            const singleTailP = 1 - jStat.studentt.cdf(absT, dof);
            const doubleTailP = singleTailP * 2;
              // Display results
            document.getElementById('single-tail-p').textContent = `Single-tail p-value: ${formatNumber(singleTailP)}`;
            document.getElementById('double-tail-p').textContent = `Double-tail p-value: ${formatNumber(doubleTailP)}`;
            document.getElementById('t-stats-result').hidden = false;
        });
        
    } catch (error) {
        showError(error.message);
    }
}

// 动态加载jStat库
function loadJStat() {
    return new Promise((resolve, reject) => {
        if (window.jStat) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load statistics library'));
        document.head.appendChild(script);
    });
}
