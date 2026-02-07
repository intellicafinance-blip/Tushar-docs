/**
 * Main Application Logic for AI Loan Comparison App
 */

// Initialize AI Engine
const aiEngine = new AILoanEngine();

// State
let currentResults = [];
let currentFilter = 'all';

// ============================================
// Tab Navigation
// ============================================

function switchTab(tabName) {
  // Update nav buttons
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update panels
  document.querySelectorAll('.section-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${tabName}`);
  });

  // Initialize tab-specific content
  if (tabName === 'calculator') {
    updateCalculator();
  } else if (tabName === 'comparison-table') {
    updateComparisonTable();
  }
}

// ============================================
// Theme Toggle
// ============================================

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  document.querySelector('.theme-toggle').textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', next);
}

// Load saved theme
(function() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    if (saved === 'dark') {
      document.querySelector('.theme-toggle').textContent = '☀️';
    }
  }
})();

// ============================================
// Loan Type Change Handler
// ============================================

function onLoanTypeChange() {
  const loanType = document.getElementById('loanType').value;
  const businessAgeGroup = document.getElementById('businessAgeGroup');
  const tenureInput = document.getElementById('loanTenure');

  if (loanType === 'cgtmse') {
    businessAgeGroup.style.display = '';
    tenureInput.value = 5;
    tenureInput.max = 7;
    document.getElementById('employmentType').value = 'self-employed';
  } else {
    businessAgeGroup.style.display = 'none';
    tenureInput.max = 30;
    if (loanType === 'home_loan') {
      tenureInput.value = 20;
    } else {
      tenureInput.value = 15;
    }
  }

  // Update amount hint
  updateAmountHint();
}

function updateAmountHint() {
  const amount = parseInt(document.getElementById('loanAmount').value) || 0;
  document.getElementById('amountHint').textContent = '₹' + formatIndianCurrency(amount);
}

// Listen for amount changes
document.getElementById('loanAmount').addEventListener('input', updateAmountHint);

// ============================================
// Find Loans (AI Recommendation)
// ============================================

function findLoans() {
  const loanType = document.getElementById('loanType').value;
  const loanAmount = parseInt(document.getElementById('loanAmount').value) || 5000000;
  const tenure = parseInt(document.getElementById('loanTenure').value) || 20;

  const userProfile = {
    age: parseInt(document.getElementById('userAge').value) || 30,
    income: parseInt(document.getElementById('userIncome').value) || 75000,
    employmentType: document.getElementById('employmentType').value,
    cibilScore: parseInt(document.getElementById('cibilScore').value) || 750,
    businessAge: parseInt(document.getElementById('businessAge').value) || 0
  };

  // Get AI recommendations
  currentResults = aiEngine.getRecommendations(loanType, userProfile, loanAmount, tenure);

  // Generate and display insights
  const insights = aiEngine.generateInsights(currentResults, loanType, loanAmount, tenure);
  displayInsights(insights);

  // Display loan cards
  currentFilter = 'all';
  displayResults(currentResults);

  // Show sections
  document.getElementById('insightsPanel').classList.remove('hidden');
  document.getElementById('resultsSection').classList.remove('hidden');

  // Reset filter pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.textContent.trim() === 'All Banks');
  });

  showToast('AI analysis complete! Found ' + currentResults.length + ' loan options.');
}

// ============================================
// Display Functions
// ============================================

function displayInsights(insights) {
  const container = document.getElementById('insightCards');
  container.innerHTML = insights.map(insight => `
    <div class="insight-card fade-in">
      <div class="insight-icon">${insight.icon}</div>
      <h4>${insight.title}</h4>
      <p>${insight.text}</p>
    </div>
  `).join('');
}

function displayResults(results) {
  const filtered = currentFilter === 'all'
    ? results
    : results.filter(r => r.bankType === currentFilter);

  document.getElementById('resultsCount').textContent =
    `Showing ${filtered.length} of ${results.length} options | Sorted by AI Score`;

  const container = document.getElementById('loanCards');
  container.innerHTML = filtered.map((loan, index) => `
    <div class="loan-card ${loan.rank === 1 ? 'rank-1' : ''} slide-up" style="animation-delay: ${index * 0.1}s">
      <div class="loan-card-header">
        <div class="bank-info">
          <div class="bank-logo">${loan.logo}</div>
          <div class="bank-details">
            <h3>${loan.name}</h3>
            <div class="bank-type">
              ${loan.bank}
              <span class="bank-type-badge ${loan.bankType.toLowerCase()}">${loan.bankType}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-1 items-center">
          <span class="recommendation-badge" style="background: ${loan.recommendation.color}15; color: ${loan.recommendation.color}; border: 1px solid ${loan.recommendation.color}30">
            ${loan.recommendation.icon} ${loan.recommendation.label}
          </span>
          <div class="ai-score-badge">
            <span class="score-value" style="color: ${getScoreColor(loan.aiScore)}">${loan.aiScore}</span>
            <span class="score-label">AI Score</span>
          </div>
        </div>
      </div>

      <div class="loan-card-body">
        <div class="loan-metric">
          <div class="metric-value highlight">${loan.interestRate.min}% - ${loan.interestRate.max}%</div>
          <div class="metric-label">Interest Rate</div>
        </div>
        <div class="loan-metric">
          <div class="metric-value">₹${formatIndianCurrency(loan.calculatedEMI)}</div>
          <div class="metric-label">Monthly EMI</div>
        </div>
        <div class="loan-metric">
          <div class="metric-value">₹${formatIndianCurrency(loan.totalInterest)}</div>
          <div class="metric-label">Total Interest</div>
        </div>
        <div class="loan-metric">
          <div class="metric-value">₹${formatIndianCurrency(loan.totalPayment)}</div>
          <div class="metric-label">Total Payment</div>
        </div>
      </div>

      <div class="loan-card-features">
        ${loan.features.slice(0, 3).map(f => `<span class="feature-tag">${f}</span>`).join('')}
      </div>

      <div class="loan-card-footer">
        <span class="processing-fee">Processing Fee: ${loan.processingFee}</span>
        <div class="flex gap-1">
          <button class="btn btn-sm btn-outline" onclick="showLoanDetail('${loan.bankId}', '${document.getElementById('loanType').value}')">
            View Details
          </button>
          <button class="btn btn-sm btn-accent" onclick="applyNow('${loan.bank}')">
            Apply Now →
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterResults(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-pill').forEach(pill => {
    const pillText = pill.textContent.trim();
    const isActive = (filter === 'all' && pillText === 'All Banks') ||
                     (filter === 'PSU' && pillText === 'PSU Banks') ||
                     (filter === 'Private' && pillText === 'Private Banks');
    pill.classList.toggle('active', isActive);
  });
  displayResults(currentResults);
}

// ============================================
// EMI Calculator
// ============================================

function updateCalculator() {
  const amount = parseInt(document.getElementById('calcAmount').value);
  const rate = parseFloat(document.getElementById('calcRate').value);
  const tenure = parseInt(document.getElementById('calcTenure').value);

  // Update display values
  document.getElementById('calcAmountDisplay').textContent = '₹' + formatIndianCurrency(amount);
  document.getElementById('calcRateDisplay').textContent = rate.toFixed(1) + '%';
  document.getElementById('calcTenureDisplay').textContent = tenure + (tenure === 1 ? ' Year' : ' Years');

  // Calculate EMI
  const emi = aiEngine.calculateEMI(amount, rate, tenure);
  const totalInterest = aiEngine.calculateTotalInterest(amount, rate, tenure);
  const totalPayment = amount + totalInterest;

  // Update results
  document.getElementById('emiResult').textContent = '₹' + formatIndianCurrency(emi);
  document.getElementById('breakdownPrincipal').textContent = '₹' + formatIndianCurrency(amount);
  document.getElementById('breakdownInterest').textContent = '₹' + formatIndianCurrency(totalInterest);
  document.getElementById('breakdownTotal').textContent = '₹' + formatIndianCurrency(totalPayment);
  document.getElementById('donutTotal').textContent = '₹' + formatIndianCurrency(totalPayment);

  // Update donut chart
  const circumference = 2 * Math.PI * 40; // ~251.33
  const principalRatio = amount / totalPayment;
  const principalArc = circumference * principalRatio;
  const interestArc = circumference * (1 - principalRatio);

  document.getElementById('principalArc').setAttribute('stroke-dasharray', `${principalArc} ${circumference}`);
  document.getElementById('interestArc').setAttribute('stroke-dasharray', `${interestArc} ${circumference}`);
  document.getElementById('interestArc').setAttribute('stroke-dashoffset', `-${principalArc}`);

  // Update amortization table
  updateAmortization(amount, rate, tenure);
}

function updateAmortization(principal, rate, tenure) {
  const schedule = aiEngine.generateAmortizationSchedule(principal, rate, tenure);
  const yearlyData = [];

  for (let year = 1; year <= tenure; year++) {
    const startMonth = (year - 1) * 12;
    const endMonth = Math.min(year * 12, schedule.length);
    const yearSlice = schedule.slice(startMonth, endMonth);

    if (yearSlice.length === 0) break;

    const yearPrincipal = yearSlice.reduce((sum, m) => sum + m.principal, 0);
    const yearInterest = yearSlice.reduce((sum, m) => sum + m.interest, 0);
    const balance = yearSlice[yearSlice.length - 1].balance;

    yearlyData.push({
      year,
      emi: yearSlice[0].emi,
      principal: Math.round(yearPrincipal),
      interest: Math.round(yearInterest),
      balance
    });
  }

  const tbody = document.getElementById('amortBody');
  tbody.innerHTML = yearlyData.map(row => `
    <tr>
      <td>${row.year}</td>
      <td>₹${formatIndianCurrency(row.emi)}</td>
      <td>₹${formatIndianCurrency(row.principal)}</td>
      <td>₹${formatIndianCurrency(row.interest)}</td>
      <td>₹${formatIndianCurrency(row.balance)}</td>
    </tr>
  `).join('');
}

function toggleAmortization() {
  document.getElementById('amortTable').classList.toggle('hidden');
}

// ============================================
// Eligibility Checker
// ============================================

function checkEligibility() {
  const bankId = document.getElementById('eligBank').value;
  const loanType = document.getElementById('eligLoanType').value;

  const userProfile = {
    age: parseInt(document.getElementById('eligAge').value) || 30,
    income: parseInt(document.getElementById('eligIncome').value) || 75000,
    cibilScore: parseInt(document.getElementById('eligCibil').value) || 750,
    employmentType: document.getElementById('eligEmployment').value,
    businessAge: parseInt(document.getElementById('eligBusinessAge').value) || 0
  };

  // Find bank and loan
  const allBanks = getAllBanks();
  const bank = allBanks.find(b => b.id === bankId);
  if (!bank || !bank.loans[loanType]) {
    showToast('This loan type is not available for the selected bank.');
    return;
  }

  const loan = bank.loans[loanType];
  const result = aiEngine.checkEligibility(loan, userProfile);

  // Display results
  const container = document.getElementById('eligibilityResults');
  const scoreClass = result.score >= 80 ? 'high' : result.score >= 50 ? 'medium' : 'low';

  container.innerHTML = `
    <div class="eligibility-result slide-up">
      <div class="eligibility-header">
        <div>
          <h3>${bank.name} - ${loan.name}</h3>
          <p class="text-muted">Eligibility Assessment</p>
        </div>
        <div class="eligibility-score ${scoreClass}">
          ${result.score}%
        </div>
      </div>

      <div style="margin-bottom: 1.5rem; padding: 1rem; background: ${result.eligible ? '#10b98115' : '#ef444415'}; border-radius: var(--radius); border-left: 4px solid ${result.eligible ? '#10b981' : '#ef4444'}">
        <strong style="color: ${result.eligible ? '#10b981' : '#ef4444'}">
          ${result.eligible ? '✅ You are likely eligible for this loan!' : '⚠️ You may not meet all eligibility criteria.'}
        </strong>
        <p class="text-muted mt-1" style="font-size: 0.85rem">
          ${result.eligible
            ? 'Based on the information provided, you meet the basic eligibility requirements. Final approval depends on bank verification.'
            : 'Some criteria are not met. Review the details below and consider improving your profile or choosing a different bank.'}
        </p>
      </div>

      <table class="eligibility-criteria">
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Required</th>
            <th>Your Profile</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${result.results.map(r => `
            <tr>
              <td><strong>${r.criteria}</strong></td>
              <td>${r.required}</td>
              <td>${r.yours}</td>
              <td class="${r.status === 'pass' ? 'status-pass' : 'status-fail'}">
                ${r.status === 'pass' ? '✅ Pass' : '❌ Fail'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="mt-2">
        <h4 style="margin-bottom: 0.75rem">Loan Highlights</h4>
        <div class="loan-card-body">
          <div class="loan-metric">
            <div class="metric-value highlight">${loan.interestRate.min}% - ${loan.interestRate.max}%</div>
            <div class="metric-label">Interest Rate</div>
          </div>
          <div class="loan-metric">
            <div class="metric-value">₹${formatIndianCurrency(loan.maxAmount)}</div>
            <div class="metric-label">Max Amount</div>
          </div>
          <div class="loan-metric">
            <div class="metric-value">${loan.maxTenure} Years</div>
            <div class="metric-label">Max Tenure</div>
          </div>
        </div>
        <div class="loan-card-features mt-1">
          ${loan.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
        </div>
      </div>
    </div>
  `;

  showToast(result.eligible ? 'Great news! You appear eligible.' : 'Some criteria need attention.');
}

function onEligBankChange() {
  // Clear previous results when bank changes
  document.getElementById('eligibilityResults').innerHTML = '';
}

// ============================================
// Side-by-Side Comparison Table
// ============================================

function updateComparisonTable() {
  const loanType = document.getElementById('compareType').value;
  const bankType = document.getElementById('compareBankType').value;

  let loans = getLoansByType(loanType);
  if (bankType !== 'all') {
    loans = loans.filter(l => l.bankType === bankType);
  }

  // Sort by minimum interest rate
  loans.sort((a, b) => a.interestRate.min - b.interestRate.min);

  const tbody = document.getElementById('compareBody');
  tbody.innerHTML = loans.map((loan, i) => `
    <tr>
      <td><strong>${loan.logo} ${loan.bank}</strong></td>
      <td><span class="bank-type-badge ${loan.bankType.toLowerCase()}">${loan.bankType}</span></td>
      <td style="color: ${i === 0 ? '#10b981' : 'inherit'}; font-weight: ${i === 0 ? '700' : '400'}">
        ${loan.interestRate.min}% - ${loan.interestRate.max}%
      </td>
      <td>${loan.processingFee}</td>
      <td>₹${formatIndianCurrency(loan.maxAmount)}</td>
      <td>${loan.maxTenure} Years</td>
      <td>${loan.prepaymentCharge}</td>
      <td>${loan.eligibility.minCibil || 'N/A'}</td>
    </tr>
  `).join('');
}

// ============================================
// Loan Detail Modal
// ============================================

function showLoanDetail(bankId, loanType) {
  const allBanks = getAllBanks();
  const bank = allBanks.find(b => b.id === bankId);
  if (!bank || !bank.loans[loanType]) return;

  const loan = bank.loans[loanType];
  const loanAmount = parseInt(document.getElementById('loanAmount').value) || 5000000;
  const tenure = parseInt(document.getElementById('loanTenure').value) || 20;
  const emi = aiEngine.calculateEMI(loanAmount, loan.interestRate.min, tenure);
  const totalInterest = aiEngine.calculateTotalInterest(loanAmount, loan.interestRate.min, tenure);

  document.getElementById('modalTitle').textContent = `${bank.name} - ${loan.name}`;
  document.getElementById('modalContent').innerHTML = `
    <div class="loan-card-body">
      <div class="loan-metric">
        <div class="metric-value highlight">${loan.interestRate.min}% - ${loan.interestRate.max}%</div>
        <div class="metric-label">Interest Rate</div>
      </div>
      <div class="loan-metric">
        <div class="metric-value">₹${formatIndianCurrency(emi)}</div>
        <div class="metric-label">Monthly EMI</div>
      </div>
      <div class="loan-metric">
        <div class="metric-value">₹${formatIndianCurrency(totalInterest)}</div>
        <div class="metric-label">Total Interest</div>
      </div>
    </div>

    <div class="mt-2">
      <h4 style="margin-bottom: 0.5rem">Loan Details</h4>
      <table class="eligibility-criteria">
        <tbody>
          <tr><td><strong>Processing Fee</strong></td><td>${loan.processingFee}</td></tr>
          <tr><td><strong>Loan Amount Range</strong></td><td>₹${formatIndianCurrency(loan.minAmount)} - ₹${formatIndianCurrency(loan.maxAmount)}</td></tr>
          <tr><td><strong>Tenure Range</strong></td><td>${loan.minTenure} - ${loan.maxTenure} Years</td></tr>
          <tr><td><strong>Prepayment Charges</strong></td><td>${loan.prepaymentCharge}</td></tr>
          ${loan.ltvRatio ? `<tr><td><strong>LTV Ratio</strong></td><td>Up to ${loan.ltvRatio}%</td></tr>` : ''}
          ${loan.collateralFree ? '<tr><td><strong>Collateral</strong></td><td>Not Required (Under CGTMSE)</td></tr>' : ''}
          ${loan.guaranteeCover ? `<tr><td><strong>Guarantee Cover</strong></td><td>${loan.guaranteeCover}</td></tr>` : ''}
        </tbody>
      </table>
    </div>

    <div class="mt-2">
      <h4 style="margin-bottom: 0.5rem">Key Features</h4>
      <ul style="padding-left: 1.5rem; color: var(--text-secondary)">
        ${loan.features.map(f => `<li style="margin-bottom: 0.5rem">${f}</li>`).join('')}
      </ul>
    </div>

    <div class="mt-2">
      <h4 style="margin-bottom: 0.5rem">Eligibility Criteria</h4>
      <table class="eligibility-criteria">
        <tbody>
          ${loan.eligibility.minAge ? `<tr><td><strong>Age</strong></td><td>${loan.eligibility.minAge} - ${loan.eligibility.maxAge} years</td></tr>` : ''}
          ${loan.eligibility.minIncome ? `<tr><td><strong>Min Monthly Income</strong></td><td>₹${formatIndianCurrency(loan.eligibility.minIncome)}</td></tr>` : ''}
          ${loan.eligibility.minCibil ? `<tr><td><strong>Min CIBIL Score</strong></td><td>${loan.eligibility.minCibil}</td></tr>` : ''}
          <tr><td><strong>Employment Types</strong></td><td>${loan.eligibility.employmentTypes.join(', ')}</td></tr>
          ${loan.eligibility.minBusinessAge !== undefined ? `<tr><td><strong>Min Business Vintage</strong></td><td>${loan.eligibility.minBusinessAge} year(s)</td></tr>` : ''}
        </tbody>
      </table>
    </div>

    <div class="form-actions mt-2">
      <button class="btn btn-accent" onclick="applyNow('${bank.name}')">Apply Now →</button>
      <button class="btn btn-outline" onclick="closeModal()">Close</button>
    </div>
  `;

  document.getElementById('detailModal').classList.add('active');
}

function closeModal() {
  document.getElementById('detailModal').classList.remove('active');
}

// Close modal on outside click
document.getElementById('detailModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Close on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

// ============================================
// Apply Now
// ============================================

function applyNow(bankName) {
  showToast(`Redirecting to ${bankName}... In a production app, this would open the bank's loan application page.`);
}

// ============================================
// Reset Form
// ============================================

function resetForm() {
  document.getElementById('loanType').value = 'home_loan';
  document.getElementById('loanAmount').value = 5000000;
  document.getElementById('loanTenure').value = 20;
  document.getElementById('userAge').value = 30;
  document.getElementById('userIncome').value = 75000;
  document.getElementById('employmentType').value = 'salaried';
  document.getElementById('cibilScore').value = 750;
  document.getElementById('businessAge').value = 5;
  document.getElementById('businessAgeGroup').style.display = 'none';

  document.getElementById('insightsPanel').classList.add('hidden');
  document.getElementById('resultsSection').classList.add('hidden');
  updateAmountHint();

  showToast('Form reset successfully.');
}

// ============================================
// Utility Functions
// ============================================

function formatIndianCurrency(num) {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
  if (num >= 100000) return (num / 100000).toFixed(2) + ' L';
  return num.toLocaleString('en-IN');
}

function getScoreColor(score) {
  if (score >= 75) return '#10b981';
  if (score >= 60) return '#3b82f6';
  if (score >= 45) return '#f59e0b';
  return '#ef4444';
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  updateAmountHint();
  updateCalculator();
  updateComparisonTable();
});
