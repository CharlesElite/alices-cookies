/**
 * Alice's Girl Scout Cookie Website
 * Main JavaScript for interactions and animations
 */

// =================================
// Initialize on DOM load
// =================================
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
    initMobileMenu();
    initCookieCards();
    initFAQ();
    initProgressBar();
    initShareButton();
    updateProgressFromAPI();
});

// =================================
// Smooth Scrolling
// =================================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.remove('active');
            }
        });
    });
}

// =================================
// Mobile Navigation Toggle
// =================================
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// =================================
// Cookie Card Interactions
// =================================
function initCookieCards() {
    const cookieCards = document.querySelectorAll('.cookie-card');

    cookieCards.forEach(card => {
        // Click to flip
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });

        // Hover effect on desktop
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', () => {
                card.classList.add('flipped');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('flipped');
            });
        }
    });
}

// =================================
// FAQ Accordion
// =================================
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all other FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Toggle current FAQ
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// =================================
// Progress Bar Animation
// =================================
function initProgressBar() {
    const progressFill = document.querySelector('.progress-fill');

    if (progressFill) {
        // Observer to trigger animation when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressBar();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(progressFill.parentElement);
    }
}

function animateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const targetWidth = progressFill.getAttribute('data-progress');

    setTimeout(() => {
        progressFill.style.width = targetWidth + '%';
    }, 500);
}

// =================================
// Update Progress from API/Google Sheets
// =================================
async function updateProgressFromAPI() {
    // This will connect to your Zapier webhook or Google Sheets API
    // For now, we'll use the data-progress attribute

    // Uncomment this when you have your API endpoint:
    /*
    try {
        const response = await fetch('YOUR_STATS_WEBHOOK_URL');
        const stats = await response.json();

        // Update progress bar
        document.getElementById('boxes-sold').textContent = stats.totalBoxes;
        document.getElementById('boxes-goal').textContent = stats.goal;
        document.getElementById('progress-fill').setAttribute('data-progress', stats.percentage);
        document.getElementById('percentage').textContent = stats.percentage;

        // Trigger animation
        animateProgressBar();

    } catch (error) {
        console.error('Error fetching stats:', error);
    }
    */
}

// Optional: Auto-refresh progress every 5 minutes
setInterval(updateProgressFromAPI, 300000);

// =================================
// Share Button
// =================================
function initShareButton() {
    const shareBtn = document.getElementById('shareBtn');

    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: "Alice's Girl Scout Cookies",
                text: "Support Alice's Girl Scout journey! Order delicious cookies today!",
                url: window.location.href
            };

            try {
                // Use Web Share API if available (mobile)
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    // Fallback: Copy link to clipboard
                    await navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard! Share it with your friends!');
                }
            } catch (error) {
                console.error('Error sharing:', error);
            }
        });
    }
}

// =================================
// Scroll Progress Indicator (Optional)
// =================================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--accent-color);
        width: 0%;
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

        progressBar.style.width = scrollPercent + '%';
    });
}

// Uncomment to enable scroll progress:
// initScrollProgress();

// =================================
// Utility Functions
// =================================

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format phone number
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =================================
// Analytics (Optional)
// =================================

// Track button clicks
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track order button clicks
document.querySelectorAll('a[href="#order"], .btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('Engagement', 'click', 'Order CTA');
    });
});

// =================================
// Console Easter Egg
// =================================
console.log(`
🍪 Alice's Girl Scout Cookies Website 🍪
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Built with:
- HTML5
- CSS3
- Vanilla JavaScript
- 💚 Love and cookies

Support Alice's Girl Scout journey!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
