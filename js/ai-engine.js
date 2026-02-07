/**
 * AI Recommendation Engine for Loan Comparison
 * Uses scoring algorithms to recommend the best loan options
 */

class AILoanEngine {
  constructor() {
    this.weights = {
      interestRate: 0.35,
      processingFee: 0.10,
      maxAmount: 0.10,
      tenure: 0.10,
      eligibilityMatch: 0.20,
      features: 0.05,
      prepayment: 0.10
    };
  }

  /**
   * Calculate EMI using reducing balance method
   */
  calculateEMI(principal, annualRate, tenureYears) {
    const monthlyRate = annualRate / 12 / 100;
    const months = tenureYears * 12;
    if (monthlyRate === 0) return principal / months;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  }

  /**
   * Calculate total interest payable
   */
  calculateTotalInterest(principal, annualRate, tenureYears) {
    const emi = this.calculateEMI(principal, annualRate, tenureYears);
    const months = tenureYears * 12;
    return Math.round(emi * months - principal);
  }

  /**
   * Generate amortization schedule
   */
  generateAmortizationSchedule(principal, annualRate, tenureYears) {
    const monthlyRate = annualRate / 12 / 100;
    const months = tenureYears * 12;
    const emi = this.calculateEMI(principal, annualRate, tenureYears);
    const schedule = [];
    let balance = principal;

    for (let month = 1; month <= months; month++) {
      const interestComponent = Math.round(balance * monthlyRate);
      const principalComponent = emi - interestComponent;
      balance = Math.max(0, balance - principalComponent);

      schedule.push({
        month,
        emi,
        principal: principalComponent,
        interest: interestComponent,
        balance: Math.round(balance)
      });
    }
    return schedule;
  }

  /**
   * Score a loan option based on user profile
   */
  scoreLoan(loan, userProfile, loanAmount, tenure) {
    let score = 0;
    const details = {};

    // 1. Interest rate score (lower is better)
    const avgRate = (loan.interestRate.min + loan.interestRate.max) / 2;
    const rateScore = Math.max(0, 100 - (avgRate - 8) * 15);
    score += rateScore * this.weights.interestRate;
    details.rateScore = Math.round(rateScore);

    // 2. Processing fee score (lower is better)
    const feeScore = Math.max(0, 100 - loan.processingFeePercent * 50);
    score += feeScore * this.weights.processingFee;
    details.feeScore = Math.round(feeScore);

    // 3. Max amount score (higher capacity is better)
    const amountScore = loanAmount <= loan.maxAmount ? 100 : 0;
    score += amountScore * this.weights.maxAmount;
    details.amountScore = Math.round(amountScore);

    // 4. Tenure flexibility score
    const tenureScore = tenure >= loan.minTenure && tenure <= loan.maxTenure ? 100 : 0;
    score += tenureScore * this.weights.tenure;
    details.tenureScore = Math.round(tenureScore);

    // 5. Eligibility match score
    let eligScore = 0;
    const elig = loan.eligibility;
    if (elig) {
      let checks = 0;
      let passed = 0;

      if (userProfile.age) {
        checks++;
        const minAge = elig.minAge || 18;
        const maxAge = elig.maxAge || 70;
        if (userProfile.age >= minAge && userProfile.age <= maxAge) passed++;
      }

      if (userProfile.income) {
        checks++;
        if (userProfile.income >= (elig.minIncome || 0)) passed++;
      }

      if (userProfile.cibilScore) {
        checks++;
        if (userProfile.cibilScore >= (elig.minCibil || 600)) passed++;
      }

      if (userProfile.employmentType) {
        checks++;
        if (elig.employmentTypes && elig.employmentTypes.includes(userProfile.employmentType)) passed++;
      }

      eligScore = checks > 0 ? (passed / checks) * 100 : 50;
    }
    score += eligScore * this.weights.eligibilityMatch;
    details.eligibilityScore = Math.round(eligScore);

    // 6. Features score
    const featScore = loan.features ? Math.min(100, loan.features.length * 25) : 0;
    score += featScore * this.weights.features;

    // 7. Prepayment flexibility score
    const prepayScore = loan.prepaymentCharge && loan.prepaymentCharge.toLowerCase().includes("nil") ? 100 : 40;
    score += prepayScore * this.weights.prepayment;
    details.prepaymentScore = Math.round(prepayScore);

    return {
      score: Math.round(score),
      details,
      emi: this.calculateEMI(loanAmount, loan.interestRate.min, tenure),
      totalInterest: this.calculateTotalInterest(loanAmount, loan.interestRate.min, tenure),
      totalPayment: loanAmount + this.calculateTotalInterest(loanAmount, loan.interestRate.min, tenure)
    };
  }

  /**
   * Get AI recommendations sorted by score
   */
  getRecommendations(loanType, userProfile, loanAmount, tenure) {
    const loans = getLoansByType(loanType);
    const scored = loans.map(loan => {
      const result = this.scoreLoan(loan, userProfile, loanAmount, tenure);
      return {
        ...loan,
        aiScore: result.score,
        scoreDetails: result.details,
        calculatedEMI: result.emi,
        totalInterest: result.totalInterest,
        totalPayment: result.totalPayment
      };
    });

    // Sort by AI score descending
    scored.sort((a, b) => b.aiScore - a.aiScore);

    // Add rank and recommendation tag
    return scored.map((loan, index) => ({
      ...loan,
      rank: index + 1,
      recommendation: this.getRecommendationTag(index, loan.aiScore)
    }));
  }

  getRecommendationTag(rank, score) {
    if (rank === 0 && score >= 75) return { label: "Best Match", color: "#10b981", icon: "★" };
    if (rank === 0) return { label: "Top Pick", color: "#3b82f6", icon: "▲" };
    if (score >= 70) return { label: "Great Option", color: "#8b5cf6", icon: "●" };
    if (score >= 55) return { label: "Good Option", color: "#f59e0b", icon: "◆" };
    return { label: "Available", color: "#6b7280", icon: "○" };
  }

  /**
   * Generate AI insights text
   */
  generateInsights(recommendations, loanType, loanAmount, tenure) {
    const best = recommendations[0];
    const insights = [];

    // Best option insight
    insights.push({
      type: "recommendation",
      icon: "💡",
      title: "AI Recommendation",
      text: `${best.bank} offers the best overall value for your ${this.getLoanTypeName(loanType)} with a score of ${best.aiScore}/100. You could save ₹${this.formatCurrency(recommendations[recommendations.length - 1].totalInterest - best.totalInterest)} in interest compared to the most expensive option.`
    });

    // Rate comparison insight
    const lowestRate = Math.min(...recommendations.map(r => r.interestRate.min));
    const highestRate = Math.max(...recommendations.map(r => r.interestRate.max));
    insights.push({
      type: "rate",
      icon: "📊",
      title: "Interest Rate Range",
      text: `Rates vary from ${lowestRate}% to ${highestRate}% across banks. PSU banks generally offer lower rates but may have stricter eligibility criteria.`
    });

    // EMI insight
    const lowestEMI = Math.min(...recommendations.map(r => r.calculatedEMI));
    const highestEMI = Math.max(...recommendations.map(r => r.calculatedEMI));
    insights.push({
      type: "emi",
      icon: "💰",
      title: "EMI Comparison",
      text: `Monthly EMI ranges from ₹${this.formatCurrency(lowestEMI)} to ₹${this.formatCurrency(highestEMI)}. A difference of ₹${this.formatCurrency(highestEMI - lowestEMI)} per month.`
    });

    // Bank type insight
    const psuBanks = recommendations.filter(r => r.bankType === "PSU");
    const privateBanks = recommendations.filter(r => r.bankType === "Private");
    if (psuBanks.length > 0 && privateBanks.length > 0) {
      const avgPSURate = psuBanks.reduce((sum, r) => sum + r.interestRate.min, 0) / psuBanks.length;
      const avgPrivateRate = privateBanks.reduce((sum, r) => sum + r.interestRate.min, 0) / privateBanks.length;
      insights.push({
        type: "comparison",
        icon: "🏦",
        title: "PSU vs Private Banks",
        text: `PSU banks average ${avgPSURate.toFixed(2)}% while Private banks average ${avgPrivateRate.toFixed(2)}%. ${avgPSURate < avgPrivateRate ? "PSU banks are more affordable but Private banks often offer faster processing." : "Private banks are competitive on rates and offer premium services."}`
      });
    }

    // CGTMSE specific insight
    if (loanType === "cgtmse") {
      insights.push({
        type: "cgtmse",
        icon: "🛡️",
        title: "CGTMSE Coverage",
        text: "Under CGTMSE, your loan is backed by a government guarantee covering up to 85% for micro enterprises. No collateral needed for loans up to ₹5 Crore."
      });
    }

    return insights;
  }

  /**
   * Check eligibility for a specific loan
   */
  checkEligibility(loan, userProfile) {
    const results = [];
    const elig = loan.eligibility;
    if (!elig) return { eligible: true, results: [], score: 100 };

    // Age check
    if (userProfile.age) {
      const minAge = elig.minAge || 18;
      const maxAge = elig.maxAge || 70;
      const agePass = userProfile.age >= minAge && userProfile.age <= maxAge;
      results.push({
        criteria: "Age",
        required: `${minAge} - ${maxAge} years`,
        yours: `${userProfile.age} years`,
        status: agePass ? "pass" : "fail"
      });
    }

    // Income check
    if (userProfile.income && elig.minIncome) {
      const incomePass = userProfile.income >= elig.minIncome;
      results.push({
        criteria: "Monthly Income",
        required: `Min ₹${this.formatCurrency(elig.minIncome)}`,
        yours: `₹${this.formatCurrency(userProfile.income)}`,
        status: incomePass ? "pass" : "fail"
      });
    }

    // CIBIL check
    if (userProfile.cibilScore && elig.minCibil) {
      const cibilPass = userProfile.cibilScore >= elig.minCibil;
      results.push({
        criteria: "CIBIL Score",
        required: `Min ${elig.minCibil}`,
        yours: `${userProfile.cibilScore}`,
        status: cibilPass ? "pass" : "fail"
      });
    }

    // Employment type check
    if (userProfile.employmentType && elig.employmentTypes) {
      const empPass = elig.employmentTypes.includes(userProfile.employmentType);
      results.push({
        criteria: "Employment Type",
        required: elig.employmentTypes.join(", "),
        yours: userProfile.employmentType,
        status: empPass ? "pass" : "fail"
      });
    }

    // Business age check (for CGTMSE)
    if (userProfile.businessAge !== undefined && elig.minBusinessAge !== undefined) {
      const bizPass = userProfile.businessAge >= elig.minBusinessAge;
      results.push({
        criteria: "Business Vintage",
        required: `Min ${elig.minBusinessAge} year(s)`,
        yours: `${userProfile.businessAge} year(s)`,
        status: bizPass ? "pass" : "fail"
      });
    }

    const passCount = results.filter(r => r.status === "pass").length;
    const totalCount = results.length;
    const eligScore = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 100;

    return {
      eligible: results.every(r => r.status === "pass"),
      results,
      score: eligScore,
      passCount,
      totalCount
    };
  }

  getLoanTypeName(type) {
    const names = {
      home_loan: "Home Loan",
      lap: "Loan Against Property",
      cgtmse: "CGTMSE Loan"
    };
    return names[type] || type;
  }

  formatCurrency(num) {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + " L";
    return num.toLocaleString("en-IN");
  }
}
