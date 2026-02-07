/**
 * Comprehensive bank loan data for PSU and Private banks in India
 * Covers: CGTMSE, Home Loan, Loan Against Property (LAP)
 * Rates as of 2025-2026
 */

const BANK_DATA = {
  psu: [
    {
      id: "sbi",
      name: "State Bank of India",
      type: "PSU",
      logo: "🏦",
      loans: {
        home_loan: {
          name: "SBI Home Loan",
          interestRate: { min: 8.50, max: 10.15 },
          processingFee: "0.35% of loan amount (min ₹2,000, max ₹10,000)",
          processingFeePercent: 0.35,
          maxAmount: 10000000,
          minAmount: 500000,
          maxTenure: 30,
          minTenure: 5,
          prepaymentCharge: "Nil for floating rate",
          features: [
            "No prepayment penalty on floating rate",
            "Balance transfer facility available",
            "Top-up loan available",
            "Special rates for women borrowers (-0.05%)"
          ],
          eligibility: {
            minAge: 18,
            maxAge: 70,
            minIncome: 25000,
            employmentTypes: ["salaried", "self-employed"],
            minCibil: 650
          }
        },
        lap: {
          name: "SBI Loan Against Property",
          interestRate: { min: 9.10, max: 11.20 },
          processingFee: "0.50% of loan amount (max ₹50,000)",
          processingFeePercent: 0.50,
          maxAmount: 75000000,
          minAmount: 1000000,
          maxTenure: 15,
          minTenure: 5,
          ltvRatio: 65,
          prepaymentCharge: "Nil for floating rate",
          features: [
            "Up to 65% of property value",
            "Overdraft facility available",
            "Both residential & commercial property accepted",
            "Doorstep service available"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 65,
            minIncome: 40000,
            employmentTypes: ["salaried", "self-employed", "professional"],
            minCibil: 700
          }
        },
        cgtmse: {
          name: "SBI CGTMSE Loan",
          interestRate: { min: 9.00, max: 11.50 },
          processingFee: "0.50% of loan amount",
          processingFeePercent: 0.50,
          maxAmount: 50000000,
          minAmount: 100000,
          maxTenure: 7,
          minTenure: 3,
          guaranteeCover: "Up to 85% for loans up to ₹5 lakh, 75% for above",
          collateralFree: true,
          prepaymentCharge: "2% on outstanding",
          features: [
            "Collateral-free loan up to ₹5 Cr",
            "Guarantee coverage by CGTMSE trust",
            "Available for MSMEs & micro enterprises",
            "Quick processing for existing customers"
          ],
          eligibility: {
            businessTypes: ["manufacturing", "services", "trading"],
            minBusinessAge: 1,
            maxAge: 65,
            minTurnover: 0,
            employmentTypes: ["self-employed", "business-owner"],
            minCibil: 650
          }
        }
      }
    },
    {
      id: "bob",
      name: "Bank of Baroda",
      type: "PSU",
      logo: "🏛️",
      loans: {
        home_loan: {
          name: "Baroda Home Loan",
          interestRate: { min: 8.40, max: 10.65 },
          processingFee: "0.25% of loan amount (max ₹25,000)",
          processingFeePercent: 0.25,
          maxAmount: 15000000,
          minAmount: 300000,
          maxTenure: 30,
          minTenure: 5,
          prepaymentCharge: "Nil for floating rate",
          features: [
            "One of the lowest processing fees among PSU banks",
            "Special scheme for government employees",
            "Balance transfer with top-up option",
            "In-principle approval within 3 days"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 65,
            minIncome: 20000,
            employmentTypes: ["salaried", "self-employed"],
            minCibil: 650
          }
        },
        lap: {
          name: "Baroda Loan Against Property",
          interestRate: { min: 9.50, max: 12.00 },
          processingFee: "0.50% of loan amount",
          processingFeePercent: 0.50,
          maxAmount: 50000000,
          minAmount: 500000,
          maxTenure: 15,
          minTenure: 3,
          ltvRatio: 60,
          prepaymentCharge: "Nil for individual floating rate",
          features: [
            "LTV up to 60% of market value",
            "Available for residential & commercial properties",
            "Flexible repayment options",
            "No hidden charges"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 65,
            minIncome: 35000,
            employmentTypes: ["salaried", "self-employed", "professional"],
            minCibil: 700
          }
        },
        cgtmse: {
          name: "Baroda CGTMSE Loan",
          interestRate: { min: 9.25, max: 12.00 },
          processingFee: "0.50% of loan amount",
          processingFeePercent: 0.50,
          maxAmount: 50000000,
          minAmount: 100000,
          maxTenure: 7,
          minTenure: 3,
          guaranteeCover: "Up to 85% for micro enterprises",
          collateralFree: true,
          prepaymentCharge: "2% on prepaid amount",
          features: [
            "No collateral required under CGTMSE",
            "For new & existing MSMEs",
            "Concessional rate for women entrepreneurs",
            "Simplified documentation"
          ],
          eligibility: {
            businessTypes: ["manufacturing", "services", "trading"],
            minBusinessAge: 1,
            maxAge: 65,
            minTurnover: 0,
            employmentTypes: ["self-employed", "business-owner"],
            minCibil: 650
          }
        }
      }
    },
    {
      id: "pnb",
      name: "Punjab National Bank",
      type: "PSU",
      logo: "🏦",
      loans: {
        home_loan: {
          name: "PNB Housing Loan",
          interestRate: { min: 8.45, max: 10.25 },
          processingFee: "0.35% of loan amount (max ₹15,000)",
          processingFeePercent: 0.35,
          maxAmount: 15000000,
          minAmount: 200000,
          maxTenure: 30,
          minTenure: 5,
          prepaymentCharge: "Nil for floating rate",
          features: [
            "Special rates for women borrowers",
            "Doorstep service in metro cities",
            "Top-up facility on existing loans",
            "Takeover of home loans from other banks"
          ],
          eligibility: {
            minAge: 18,
            maxAge: 65,
            minIncome: 20000,
            employmentTypes: ["salaried", "self-employed"],
            minCibil: 650
          }
        },
        lap: {
          name: "PNB Loan Against Property",
          interestRate: { min: 9.35, max: 11.50 },
          processingFee: "0.50% of loan amount (max ₹50,000)",
          processingFeePercent: 0.50,
          maxAmount: 50000000,
          minAmount: 500000,
          maxTenure: 15,
          minTenure: 3,
          ltvRatio: 60,
          prepaymentCharge: "Nil for floating rate individuals",
          features: [
            "Competitive rates for PSU bank",
            "LTV ratio up to 60%",
            "Both residential & commercial",
            "Flexible EMI options"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 65,
            minIncome: 35000,
            employmentTypes: ["salaried", "self-employed", "professional"],
            minCibil: 700
          }
        },
        cgtmse: {
          name: "PNB CGTMSE Loan",
          interestRate: { min: 9.15, max: 11.75 },
          processingFee: "0.50% of loan amount",
          processingFeePercent: 0.50,
          maxAmount: 50000000,
          minAmount: 100000,
          maxTenure: 7,
          minTenure: 3,
          guaranteeCover: "As per CGTMSE norms",
          collateralFree: true,
          prepaymentCharge: "2%",
          features: [
            "Collateral-free for eligible MSMEs",
            "Government guarantee coverage",
            "Competitive interest rates",
            "Dedicated MSME branch support"
          ],
          eligibility: {
            businessTypes: ["manufacturing", "services", "trading"],
            minBusinessAge: 1,
            maxAge: 65,
            minTurnover: 0,
            employmentTypes: ["self-employed", "business-owner"],
            minCibil: 650
          }
        }
      }
    },
    {
      id: "canara",
      name: "Canara Bank",
      type: "PSU",
      logo: "🏛️",
      loans: {
        home_loan: {
          name: "Canara Home Loan",
          interestRate: { min: 8.40, max: 10.75 },
          processingFee: "0.50% of loan amount (max ₹10,000)",
          processingFeePercent: 0.50,
          maxAmount: 10000000,
          minAmount: 300000,
          maxTenure: 30,
          minTenure: 5,
          prepaymentCharge: "Nil",
          features: [
            "Low processing fee cap",
            "Home loan for NRIs available",
            "Special rate for women (0.05% concession)",
            "Online application & tracking"
          ],
          eligibility: {
            minAge: 18,
            maxAge: 65,
            minIncome: 20000,
            employmentTypes: ["salaried", "self-employed"],
            minCibil: 650
          }
        },
        lap: {
          name: "Canara Loan Against Property",
          interestRate: { min: 9.45, max: 11.75 },
          processingFee: "0.50% of loan amount",
          processingFeePercent: 0.50,
          maxAmount: 50000000,
          minAmount: 500000,
          maxTenure: 15,
          minTenure: 3,
          ltvRatio: 60,
          prepaymentCharge: "Nil for individuals",
          features: [
            "Attractive rates for property owners",
            "Quick disbursement",
            "Flexible end-use",
            "Minimal documentation"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 65,
            minIncome: 35000,
            employmentTypes: ["salaried", "self-employed"],
            minCibil: 700
          }
        },
        cgtmse: {
          name: "Canara CGTMSE Loan",
          interestRate: { min: 9.30, max: 11.80 },
          processingFee: "0.50% of loan amount",
          processingFeePercent: 0.50,
          maxAmount: 50000000,
          minAmount: 100000,
          maxTenure: 7,
          minTenure: 3,
          guaranteeCover: "Up to 85% as per CGTMSE norms",
          collateralFree: true,
          prepaymentCharge: "2%",
          features: [
            "Support for micro & small enterprises",
            "No collateral up to ₹5 Cr",
            "Government-backed guarantee",
            "Priority processing for MSMEs"
          ],
          eligibility: {
            businessTypes: ["manufacturing", "services"],
            minBusinessAge: 1,
            maxAge: 65,
            minTurnover: 0,
            employmentTypes: ["self-employed", "business-owner"],
            minCibil: 650
          }
        }
      }
    },
    {
      id: "union",
      name: "Union Bank of India",
      type: "PSU",
      logo: "🏦",
      loans: {
        home_loan: {
          name: "Union Home Loan",
          interestRate: { min: 8.35, max: 10.50 },
          processingFee: "0.50% of loan amount (max ₹15,000)",
          processingFeePercent: 0.50,
          maxAmount: 10000000,
          minAmount: 300000,
          maxTenure: 30,
          minTenure: 5,
          prepaymentCharge: "Nil for floating rate",
          features: [
            "Competitive interest rates",
            "Free personal accident insurance",
            "Express processing for salaried",
            "Top-up loan facility"
          ],
          eligibility: {
            minAge: 18,
            maxAge: 65,
            minIncome: 20000,
            employmentTypes: ["salaried", "self-employed"],
            minCibil: 650
          }
        },
        lap: {
          name: "Union Loan Against Property",
          interestRate: { min: 9.40, max: 11.60 },
          processingFee: "0.50% of loan amount",
          processingFeePercent: 0.50,
          maxAmount: 50000000,
          minAmount: 500000,
          maxTenure: 15,
          minTenure: 3,
          ltvRatio: 60,
          prepaymentCharge: "Nil for floating",
          features: [
            "Competitive LAP rates",
            "Both residential & commercial property",
            "Overdraft option available",
            "Quick processing"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 65,
            minIncome: 35000,
            employmentTypes: ["salaried", "self-employed", "professional"],
            minCibil: 700
          }
        },
        cgtmse: {
          name: "Union CGTMSE Loan",
          interestRate: { min: 9.20, max: 11.70 },
          processingFee: "0.50% of loan amount",
          processingFeePercent: 0.50,
          maxAmount: 50000000,
          minAmount: 100000,
          maxTenure: 7,
          minTenure: 3,
          guaranteeCover: "As per CGTMSE scheme",
          collateralFree: true,
          prepaymentCharge: "2%",
          features: [
            "Collateral-free MSME loans",
            "Government guarantee",
            "Special focus on women entrepreneurs",
            "Simplified processes"
          ],
          eligibility: {
            businessTypes: ["manufacturing", "services", "trading"],
            minBusinessAge: 1,
            maxAge: 65,
            minTurnover: 0,
            employmentTypes: ["self-employed", "business-owner"],
            minCibil: 650
          }
        }
      }
    }
  ],
  private: [
    {
      id: "hdfc",
      name: "HDFC Bank",
      type: "Private",
      logo: "🏢",
      loans: {
        home_loan: {
          name: "HDFC Home Loan",
          interestRate: { min: 8.75, max: 9.65 },
          processingFee: "0.50% of loan amount or ₹3,000 (whichever is higher)",
          processingFeePercent: 0.50,
          maxAmount: 100000000,
          minAmount: 500000,
          maxTenure: 30,
          minTenure: 5,
          prepaymentCharge: "Nil for floating rate",
          features: [
            "Fastest approval - within 48 hours",
            "Wide network for easy access",
            "Digital application & tracking",
            "Flexible repayment options including step-up EMI"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 65,
            minIncome: 25000,
            employmentTypes: ["salaried", "self-employed"],
            minCibil: 700
          }
        },
        lap: {
          name: "HDFC Loan Against Property",
          interestRate: { min: 9.50, max: 11.00 },
          processingFee: "1% of loan amount",
          processingFeePercent: 1.00,
          maxAmount: 100000000,
          minAmount: 1000000,
          maxTenure: 15,
          minTenure: 5,
          ltvRatio: 65,
          prepaymentCharge: "Nil for floating rate individuals",
          features: [
            "Highest LTV among private banks at 65%",
            "Both residential & commercial property",
            "Overdraft & term loan options",
            "Premium customer service"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 60,
            minIncome: 50000,
            employmentTypes: ["salaried", "self-employed", "professional"],
            minCibil: 725
          }
        },
        cgtmse: {
          name: "HDFC CGTMSE Business Loan",
          interestRate: { min: 10.00, max: 13.50 },
          processingFee: "1% of loan amount",
          processingFeePercent: 1.00,
          maxAmount: 50000000,
          minAmount: 500000,
          maxTenure: 7,
          minTenure: 3,
          guaranteeCover: "As per CGTMSE norms",
          collateralFree: true,
          prepaymentCharge: "4% on prepaid amount",
          features: [
            "Fast track processing for existing customers",
            "Digital loan journey",
            "Dedicated relationship manager",
            "Pre-approved offers for eligible customers"
          ],
          eligibility: {
            businessTypes: ["manufacturing", "services", "trading"],
            minBusinessAge: 3,
            maxAge: 65,
            minTurnover: 1000000,
            employmentTypes: ["self-employed", "business-owner"],
            minCibil: 700
          }
        }
      }
    },
    {
      id: "icici",
      name: "ICICI Bank",
      type: "Private",
      logo: "🏢",
      loans: {
        home_loan: {
          name: "ICICI Home Loan",
          interestRate: { min: 8.75, max: 9.85 },
          processingFee: "0.50% of loan amount (max ₹5,000 with offers)",
          processingFeePercent: 0.50,
          maxAmount: 50000000,
          minAmount: 500000,
          maxTenure: 30,
          minTenure: 5,
          prepaymentCharge: "Nil for floating rate",
          features: [
            "Online approval in minutes for pre-approved customers",
            "Flexible EMI options",
            "Insurance bundling options",
            "Balance transfer with rate match guarantee"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 65,
            minIncome: 25000,
            employmentTypes: ["salaried", "self-employed"],
            minCibil: 700
          }
        },
        lap: {
          name: "ICICI Loan Against Property",
          interestRate: { min: 9.35, max: 11.25 },
          processingFee: "0.99% of loan amount",
          processingFeePercent: 0.99,
          maxAmount: 50000000,
          minAmount: 1000000,
          maxTenure: 15,
          minTenure: 5,
          ltvRatio: 60,
          prepaymentCharge: "Nil for individual floating",
          features: [
            "Quick disbursal within 5 days",
            "Transparent processing",
            "End-to-end digital process",
            "Multiple property types accepted"
          ],
          eligibility: {
            minAge: 23,
            maxAge: 62,
            minIncome: 50000,
            employmentTypes: ["salaried", "self-employed", "professional"],
            minCibil: 700
          }
        },
        cgtmse: {
          name: "ICICI CGTMSE Loan",
          interestRate: { min: 10.25, max: 14.00 },
          processingFee: "1.5% of loan amount",
          processingFeePercent: 1.50,
          maxAmount: 50000000,
          minAmount: 500000,
          maxTenure: 7,
          minTenure: 3,
          guaranteeCover: "As per CGTMSE scheme",
          collateralFree: true,
          prepaymentCharge: "4% on prepaid amount",
          features: [
            "Designed for growing businesses",
            "Cashflow-based assessment",
            "Digital documentation",
            "Dedicated MSME team"
          ],
          eligibility: {
            businessTypes: ["manufacturing", "services", "trading"],
            minBusinessAge: 3,
            maxAge: 65,
            minTurnover: 1500000,
            employmentTypes: ["self-employed", "business-owner"],
            minCibil: 700
          }
        }
      }
    },
    {
      id: "axis",
      name: "Axis Bank",
      type: "Private",
      logo: "🏢",
      loans: {
        home_loan: {
          name: "Axis Home Loan",
          interestRate: { min: 8.75, max: 13.30 },
          processingFee: "Up to 1% of loan amount",
          processingFeePercent: 1.00,
          maxAmount: 50000000,
          minAmount: 500000,
          maxTenure: 30,
          minTenure: 5,
          prepaymentCharge: "Nil for floating rate",
          features: [
            "Quick processing within 72 hours",
            "Power advantage for high-income borrowers",
            "Digital application with e-sign",
            "Special rates for existing customers"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 65,
            minIncome: 25000,
            employmentTypes: ["salaried", "self-employed"],
            minCibil: 700
          }
        },
        lap: {
          name: "Axis Loan Against Property",
          interestRate: { min: 9.60, max: 12.50 },
          processingFee: "1% of loan amount",
          processingFeePercent: 1.00,
          maxAmount: 50000000,
          minAmount: 1000000,
          maxTenure: 20,
          minTenure: 5,
          ltvRatio: 60,
          prepaymentCharge: "2% for fixed rate, Nil for floating",
          features: [
            "Longer tenure up to 20 years",
            "Overdraft facility available",
            "Multiple property types accepted",
            "Top-up facility"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 65,
            minIncome: 40000,
            employmentTypes: ["salaried", "self-employed", "professional"],
            minCibil: 700
          }
        },
        cgtmse: {
          name: "Axis CGTMSE Loan",
          interestRate: { min: 10.50, max: 14.50 },
          processingFee: "1.5% of loan amount",
          processingFeePercent: 1.50,
          maxAmount: 50000000,
          minAmount: 500000,
          maxTenure: 7,
          minTenure: 3,
          guaranteeCover: "As per CGTMSE norms",
          collateralFree: true,
          prepaymentCharge: "4%",
          features: [
            "Collateral-free business loans",
            "Dedicated business banking team",
            "Fast track for existing account holders",
            "Flexible repayment structure"
          ],
          eligibility: {
            businessTypes: ["manufacturing", "services", "trading"],
            minBusinessAge: 3,
            maxAge: 65,
            minTurnover: 2000000,
            employmentTypes: ["self-employed", "business-owner"],
            minCibil: 700
          }
        }
      }
    },
    {
      id: "kotak",
      name: "Kotak Mahindra Bank",
      type: "Private",
      logo: "🏢",
      loans: {
        home_loan: {
          name: "Kotak Home Loan",
          interestRate: { min: 8.70, max: 9.65 },
          processingFee: "0.50% of loan amount",
          processingFeePercent: 0.50,
          maxAmount: 50000000,
          minAmount: 500000,
          maxTenure: 20,
          minTenure: 5,
          prepaymentCharge: "Nil for floating rate",
          features: [
            "Competitive rates",
            "Quick digital approval",
            "FlexiPay EMI option",
            "Zero documentation for pre-approved"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 60,
            minIncome: 30000,
            employmentTypes: ["salaried", "self-employed"],
            minCibil: 700
          }
        },
        lap: {
          name: "Kotak Loan Against Property",
          interestRate: { min: 9.50, max: 12.00 },
          processingFee: "1% of loan amount",
          processingFeePercent: 1.00,
          maxAmount: 50000000,
          minAmount: 1000000,
          maxTenure: 15,
          minTenure: 5,
          ltvRatio: 60,
          prepaymentCharge: "Nil for floating rate",
          features: [
            "Attractive LAP rates",
            "Quick disbursal",
            "Both commercial & residential",
            "Balance transfer option"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 65,
            minIncome: 50000,
            employmentTypes: ["salaried", "self-employed", "professional"],
            minCibil: 725
          }
        },
        cgtmse: {
          name: "Kotak CGTMSE Loan",
          interestRate: { min: 10.50, max: 14.00 },
          processingFee: "1.25% of loan amount",
          processingFeePercent: 1.25,
          maxAmount: 50000000,
          minAmount: 500000,
          maxTenure: 7,
          minTenure: 3,
          guaranteeCover: "As per CGTMSE",
          collateralFree: true,
          prepaymentCharge: "3%",
          features: [
            "For MSMEs under CGTMSE scheme",
            "Quick sanction",
            "Minimal documentation",
            "Relationship-based pricing"
          ],
          eligibility: {
            businessTypes: ["manufacturing", "services"],
            minBusinessAge: 3,
            maxAge: 65,
            minTurnover: 1500000,
            employmentTypes: ["self-employed", "business-owner"],
            minCibil: 700
          }
        }
      }
    },
    {
      id: "indusind",
      name: "IndusInd Bank",
      type: "Private",
      logo: "🏢",
      loans: {
        home_loan: {
          name: "IndusInd Home Loan",
          interestRate: { min: 8.70, max: 10.50 },
          processingFee: "0.50% of loan amount",
          processingFeePercent: 0.50,
          maxAmount: 50000000,
          minAmount: 500000,
          maxTenure: 25,
          minTenure: 5,
          prepaymentCharge: "Nil for floating rate",
          features: [
            "Quick disbursement",
            "Flexible tenure options",
            "Balance transfer facility",
            "Property search assistance"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 60,
            minIncome: 30000,
            employmentTypes: ["salaried", "self-employed"],
            minCibil: 700
          }
        },
        lap: {
          name: "IndusInd Loan Against Property",
          interestRate: { min: 9.75, max: 13.00 },
          processingFee: "1% of loan amount",
          processingFeePercent: 1.00,
          maxAmount: 30000000,
          minAmount: 1000000,
          maxTenure: 15,
          minTenure: 5,
          ltvRatio: 55,
          prepaymentCharge: "2% for fixed, Nil for floating",
          features: [
            "Quick processing",
            "Multiple property types",
            "Flexible end use",
            "Competitive pricing for HNIs"
          ],
          eligibility: {
            minAge: 21,
            maxAge: 65,
            minIncome: 50000,
            employmentTypes: ["salaried", "self-employed"],
            minCibil: 725
          }
        },
        cgtmse: {
          name: "IndusInd CGTMSE Loan",
          interestRate: { min: 11.00, max: 15.00 },
          processingFee: "1.5% of loan amount",
          processingFeePercent: 1.50,
          maxAmount: 20000000,
          minAmount: 500000,
          maxTenure: 5,
          minTenure: 3,
          guaranteeCover: "As per CGTMSE",
          collateralFree: true,
          prepaymentCharge: "4%",
          features: [
            "Collateral-free for MSMEs",
            "Quick turnaround",
            "Flexible structures",
            "Dedicated MSME desk"
          ],
          eligibility: {
            businessTypes: ["manufacturing", "services", "trading"],
            minBusinessAge: 3,
            maxAge: 65,
            minTurnover: 2000000,
            employmentTypes: ["self-employed", "business-owner"],
            minCibil: 700
          }
        }
      }
    }
  ]
};

// Helper to get all banks as flat array
function getAllBanks() {
  return [...BANK_DATA.psu, ...BANK_DATA.private];
}

// Helper to get loans by type
function getLoansByType(loanType) {
  const results = [];
  getAllBanks().forEach(bank => {
    if (bank.loans[loanType]) {
      results.push({
        bank: bank.name,
        bankId: bank.id,
        bankType: bank.type,
        logo: bank.logo,
        ...bank.loans[loanType]
      });
    }
  });
  return results;
}
