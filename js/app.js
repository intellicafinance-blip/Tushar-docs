/**
 * Intellica Financial Services - Main Application JavaScript
 * Handles: EMI Calculator, WhatsApp Integration, Navigation, Animations
 */

// ============================================
// WhatsApp Configuration
// ============================================
const WHATSAPP_NUMBER = '919217093900';
const WHATSAPP_MESSAGE = 'Hi Intellica Financial Services! I am interested in learning more about your loan services. Please help me with the best loan options.';

function openWhatsApp() {
  const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodedMessage;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// ============================================
// EMI Calculator
// ============================================

function calculateEMI(principal, annualRate, tenureYears) {
  const monthlyRate = annualRate / 12 / 100;
  const months = tenureYears * 12;
  if (monthlyRate === 0) return Math.round(principal / months);
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}

function formatIndianCurrency(num) {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
  if (num >= 100000) return (num / 100000).toFixed(2) + ' L';
  return num.toLocaleString('en-IN');
}

function updateEMI() {
  var amount = parseInt(document.getElementById('calcAmount').value);
  var rate = parseFloat(document.getElementById('calcRate').value);
  var tenure = parseInt(document.getElementById('calcTenure').value);

  // Update display values
  document.getElementById('calcAmountValue').textContent = 'Rs. ' + amount.toLocaleString('en-IN');
  document.getElementById('calcRateValue').textContent = rate.toFixed(2) + '%';
  document.getElementById('calcTenureValue').textContent = tenure + (tenure === 1 ? ' Year' : ' Years');

  // Calculate EMI
  var emi = calculateEMI(amount, rate, tenure);
  var totalPayment = emi * tenure * 12;
  var totalInterest = totalPayment - amount;

  // Update results
  document.getElementById('emiAmount').textContent = 'Rs. ' + formatIndianCurrency(emi);
  document.getElementById('donutTotal').textContent = 'Rs. ' + formatIndianCurrency(totalPayment);
  document.getElementById('legendPrincipal').textContent = 'Rs. ' + formatIndianCurrency(amount);
  document.getElementById('legendInterest').textContent = 'Rs. ' + formatIndianCurrency(totalInterest);

  // Update donut chart
  var circumference = 2 * Math.PI * 50; // ~314.16
  var principalRatio = amount / totalPayment;
  var principalArc = circumference * principalRatio;
  var interestArc = circumference * (1 - principalRatio);

  document.getElementById('principalArc').setAttribute('stroke-dasharray', principalArc + ' ' + circumference);
  document.getElementById('interestArc').setAttribute('stroke-dasharray', interestArc + ' ' + circumference);
  document.getElementById('interestArc').setAttribute('stroke-dashoffset', '-' + principalArc);
}

// Loan type preset values
var loanPresets = {
  'home-loan':     { rate: 8.50, tenure: 20, maxTenure: 30, maxAmount: 100000000, defaultAmount: 5000000 },
  'lap':           { rate: 9.50, tenure: 15, maxTenure: 20, maxAmount: 75000000,  defaultAmount: 3000000 },
  'cgtmse':        { rate: 9.50, tenure: 5,  maxTenure: 7,  maxAmount: 50000000,  defaultAmount: 2000000 },
  'business-loan': { rate: 11.00, tenure: 5,  maxTenure: 7,  maxAmount: 50000000,  defaultAmount: 2500000 },
  'personal-loan': { rate: 10.49, tenure: 5,  maxTenure: 7,  maxAmount: 5000000,   defaultAmount: 1000000 }
};

function onCalcLoanTypeChange() {
  var loanType = document.getElementById('calcLoanType').value;
  var preset = loanPresets[loanType];
  if (!preset) return;

  document.getElementById('calcRate').value = preset.rate;
  document.getElementById('calcTenure').value = preset.tenure;
  document.getElementById('calcTenure').max = preset.maxTenure;
  document.getElementById('calcAmount').value = preset.defaultAmount;
  document.getElementById('calcAmount').max = preset.maxAmount;

  updateEMI();
}

// ============================================
// Header Scroll Effect
// ============================================

var lastScrollY = 0;

function handleScroll() {
  var header = document.getElementById('header');
  var scrollY = window.scrollY;

  if (scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  lastScrollY = scrollY;

  // Update active nav link based on scroll position
  updateActiveNavLink();
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ============================================
// Active Navigation Link
// ============================================

function updateActiveNavLink() {
  var sections = document.querySelectorAll('section[id]');
  var scrollPosition = window.scrollY + 100;

  sections.forEach(function(section) {
    var sectionTop = section.offsetTop;
    var sectionHeight = section.offsetHeight;
    var sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-link').forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
}

// ============================================
// Mobile Navigation Toggle
// ============================================

var mobileToggle = document.getElementById('mobileToggle');
var mainNav = document.getElementById('mainNav');

if (mobileToggle) {
  mobileToggle.addEventListener('click', function() {
    mobileToggle.classList.toggle('active');
    mainNav.classList.toggle('open');
  });
}

// Close mobile nav when clicking a link
document.querySelectorAll('.nav-link').forEach(function(link) {
  link.addEventListener('click', function() {
    if (mainNav.classList.contains('open')) {
      mobileToggle.classList.remove('active');
      mainNav.classList.remove('open');
    }
  });
});

// ============================================
// Smooth Scroll for Navigation Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var targetId = this.getAttribute('href');
    if (targetId === '#') return;

    var target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      var headerHeight = document.getElementById('header').offsetHeight;
      var targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// Contact Form Handler
// ============================================

function handleFormSubmit(event) {
  event.preventDefault();

  var name = document.getElementById('contactName').value.trim();
  var phone = document.getElementById('contactPhone').value.trim();
  var email = document.getElementById('contactEmail').value.trim();
  var loanType = document.getElementById('contactLoanType').value;
  var amount = document.getElementById('contactAmount').value.trim();
  var city = document.getElementById('contactCity').value.trim();
  var message = document.getElementById('contactMessage').value.trim();

  // Validate required fields
  if (!name || !phone || !loanType) {
    showToast('Please fill in all required fields.');
    return;
  }

  // Build WhatsApp message with form data
  var loanTypeLabels = {
    'home-loan': 'Home Loan',
    'lap': 'Loan Against Property',
    'cgtmse': 'CGTMSE Loan',
    'business-loan': 'Business Loan',
    'personal-loan': 'Personal Loan'
  };

  var whatsappMsg = 'New Loan Enquiry from Intellica Website:\n\n';
  whatsappMsg += 'Name: ' + name + '\n';
  whatsappMsg += 'Phone: ' + phone + '\n';
  if (email) whatsappMsg += 'Email: ' + email + '\n';
  whatsappMsg += 'Loan Type: ' + (loanTypeLabels[loanType] || loanType) + '\n';
  if (amount) whatsappMsg += 'Amount Required: Rs. ' + amount + '\n';
  if (city) whatsappMsg += 'City: ' + city + '\n';
  if (message) whatsappMsg += 'Message: ' + message + '\n';

  // Open WhatsApp with form data
  var encodedMsg = encodeURIComponent(whatsappMsg);
  var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodedMsg;
  window.open(url, '_blank', 'noopener,noreferrer');

  showToast('Thank you, ' + name + '! Your enquiry has been sent via WhatsApp. Our team will contact you soon.');

  // Reset form
  document.getElementById('contactForm').reset();
}

// ============================================
// Toast Notification
// ============================================

function showToast(message) {
  var container = document.getElementById('toastContainer');
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(function() { toast.remove(); }, 300);
  }, 4000);
}

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================

function initScrollAnimations() {
  var observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe service cards, feature cards, process steps
  var animateElements = document.querySelectorAll('.service-card, .feature-card, .process-step, .about-card, .contact-info-card');
  animateElements.forEach(function(el) {
    el.classList.add('fade-up');
    observer.observe(el);
  });
}

// ============================================
// Counter Animation for Stats
// ============================================

function animateCounter(element, target, suffix) {
  var current = 0;
  var duration = 2000;
  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    current = Math.floor(eased * target);
    element.textContent = current + (suffix || '');
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target + (suffix || '');
    }
  }

  requestAnimationFrame(step);
}

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize EMI calculator
  updateEMI();

  // Initialize scroll animations
  initScrollAnimations();

  // Handle header state on load
  handleScroll();
});
