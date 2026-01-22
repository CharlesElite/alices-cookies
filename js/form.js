/**
 * Alice's Girl Scout Cookie Website
 * Form handling and validation
 */

// =================================
// Configuration
// =================================
const CONFIG = {
    COOKIE_PRICE: 6,
    cookies: [
        'thin-mints',
        'caramel-delites',
        'peanut-butter-patties',
        'trefoils',
        'lemonades',
        'peanut-butter-sandwich',
        'adventurefuls',
        'exploremores'
    ]
};

// Store cookie quantities
let quantities = {};

// Initialize quantities to 0
CONFIG.cookies.forEach(cookie => {
    quantities[cookie] = 0;
});

// =================================
// Initialize Form
// =================================
document.addEventListener('DOMContentLoaded', () => {
    initQuantityControls();
    initDeliveryMethodToggle();
    initFormValidation();
    initFormSubmission();
});

// =================================
// Quantity Controls
// =================================
function initQuantityControls() {
    const qtyButtons = document.querySelectorAll('.qty-btn');

    qtyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const action = btn.getAttribute('data-action');
            const cookie = btn.getAttribute('data-cookie');

            if (action === 'increase') {
                quantities[cookie]++;
            } else if (action === 'decrease' && quantities[cookie] > 0) {
                quantities[cookie]--;
            }

            updateQuantityDisplay(cookie);
            updateTotal();
        });
    });
}

function updateQuantityDisplay(cookie) {
    const qty = quantities[cookie];
    const qtyInput = document.getElementById(`qty-${cookie}`);
    const priceDisplay = document.getElementById(`price-${cookie}`);

    if (qtyInput) {
        qtyInput.value = qty;
    }

    if (priceDisplay) {
        const price = qty * CONFIG.COOKIE_PRICE;
        priceDisplay.textContent = '$' + price;
    }
}

function updateTotal() {
    let totalBoxes = 0;
    let totalAmount = 0;

    CONFIG.cookies.forEach(cookie => {
        totalBoxes += quantities[cookie];
        totalAmount += quantities[cookie] * CONFIG.COOKIE_PRICE;
    });

    document.getElementById('totalBoxes').textContent = totalBoxes + ' boxes';
    document.getElementById('totalAmount').textContent = '$' + totalAmount;
}

// =================================
// Delivery Method Toggle
// =================================
function initDeliveryMethodToggle() {
    // No longer needed - local delivery only, address always required
    // Keeping function for backwards compatibility
}

// =================================
// Form Validation
// =================================
function initFormValidation() {
    const form = document.getElementById('orderForm');
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);

            if (value.length >= 6) {
                value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0,3)}) ${value.slice(3)}`;
            }

            e.target.value = value;
        });
    }
}

function validateField(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Check if required field is empty
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (input.type === 'tel' && value) {
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Show/hide error
    if (!isValid) {
        showFieldError(input, errorMessage);
    } else {
        clearFieldError(input);
    }

    return isValid;
}

function showFieldError(input, message) {
    input.classList.add('error');

    // Remove existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--error-color);
        font-size: 14px;
        margin-top: 4px;
    `;

    input.parentElement.appendChild(errorDiv);
    input.style.borderColor = 'var(--error-color)';
}

function clearFieldError(input) {
    input.classList.remove('error');
    input.style.borderColor = '';

    const errorMessage = input.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function validateForm() {
    const form = document.getElementById('orderForm');
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    let errors = [];

    // Validate all required fields
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
            errors.push(input.previousElementSibling?.textContent || 'A field');
        }
    });

    // Check if at least one cookie is selected
    const totalBoxes = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    if (totalBoxes === 0) {
        isValid = false;
        errors.push('Please select at least one box of cookies');
        showFormError('Please select at least one box of cookies');
    }

    return isValid;
}

function showFormError(message) {
    // Remove existing error
    const existingError = document.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }

    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background: #ffebee;
        color: var(--error-color);
        padding: var(--spacing-md);
        border-radius: 8px;
        margin-bottom: var(--spacing-md);
        border: 2px solid var(--error-color);
        text-align: center;
        font-weight: 600;
    `;

    const form = document.getElementById('orderForm');
    form.insertBefore(errorDiv, form.firstChild);

    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// =================================
// Form Submission
// =================================
function initFormSubmission() {
    const form = document.getElementById('orderForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Prepare order data
        const orderData = collectFormData();

        // Create order summary for Netlify
        const orderSummary = formatOrderSummary(orderData);
        document.getElementById('order-summary').value = orderSummary;

        // Show loading state
        showLoading();

        try {
            // Submit to Netlify Forms
            const formData = new FormData(form);
            const response = await fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            // Show success message
            showSuccess(orderData);

        } catch (error) {
            console.error('Order submission error:', error);
            showError();
        } finally {
            hideLoading();
        }
    });
}

function collectFormData() {
    const form = document.getElementById('orderForm');

    // Get selected cookies
    const cookies = [];
    CONFIG.cookies.forEach(cookie => {
        if (quantities[cookie] > 0) {
            cookies.push({
                name: getCookieDisplayName(cookie),
                quantity: quantities[cookie],
                price: quantities[cookie] * CONFIG.COOKIE_PRICE
            });
        }
    });

    // Calculate totals
    const totalBoxes = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    const totalAmount = totalBoxes * CONFIG.COOKIE_PRICE;

    return {
        timestamp: new Date().toISOString(),
        customer_name: document.getElementById('name').value.trim(),
        customer_email: document.getElementById('email').value.trim(),
        customer_phone: document.getElementById('phone').value.trim(),
        delivery_method: 'Local Delivery - Twin Cities',
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        zip: document.getElementById('zip').value.trim(),
        cookies: cookies,
        total_boxes: totalBoxes,
        total_amount: totalAmount,
        special_requests: document.getElementById('requests').value.trim(),
        source: 'Website'
    };
}

function getCookieDisplayName(cookieId) {
    const names = {
        'thin-mints': 'Thin Mints®',
        'caramel-delites': 'Caramel deLites®',
        'peanut-butter-patties': 'Peanut Butter Patties®',
        'trefoils': 'Trefoils®',
        'lemonades': 'Lemonades®',
        'peanut-butter-sandwich': 'Peanut Butter Sandwich',
        'adventurefuls': 'Adventurefuls™',
        'exploremores': 'Exploremores™'
    };
    return names[cookieId] || cookieId;
}

function formatOrderSummary(orderData) {
    let summary = `ORDER DETAILS\n`;
    summary += `=============\n\n`;
    summary += `Customer: ${orderData.customer_name}\n`;
    summary += `Email: ${orderData.customer_email}\n`;
    summary += `Phone: ${orderData.customer_phone}\n\n`;
    summary += `Delivery Address:\n`;
    summary += `${orderData.address}\n`;
    summary += `${orderData.city}, ${orderData.zip}\n\n`;
    summary += `COOKIES ORDERED:\n`;
    summary += `----------------\n`;

    orderData.cookies.forEach(cookie => {
        summary += `${cookie.quantity}x ${cookie.name} - $${cookie.price}\n`;
    });

    summary += `\n`;
    summary += `TOTAL: ${orderData.total_boxes} boxes - $${orderData.total_amount}\n`;

    if (orderData.special_requests) {
        summary += `\nSpecial Requests: ${orderData.special_requests}\n`;
    }

    summary += `\nOrder Date: ${new Date(orderData.timestamp).toLocaleString()}\n`;

    return summary;
}

// =================================
// UI State Functions
// =================================
function showLoading() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    submitBtn.style.opacity = '0.6';
    submitBtn.style.cursor = 'not-allowed';
}

function hideLoading() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Place My Pre-Order';
    submitBtn.style.opacity = '1';
    submitBtn.style.cursor = 'pointer';
}

function showSuccess(orderData) {
    // Hide form
    document.getElementById('orderForm').style.display = 'none';

    // Show success message
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';

    // Fill in success details
    document.getElementById('successName').textContent = orderData.customer_name;
    document.getElementById('successBoxes').textContent = orderData.total_boxes;
    document.getElementById('successAmount').textContent = '$' + orderData.total_amount;

    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Track conversion
    if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
            'event_category': 'Order',
            'event_label': 'Cookie Order',
            'value': orderData.total_amount
        });
    }
}

function showError() {
    showFormError('Oops! Something went wrong. Please try again or email us at alicescookies@example.com');
}

// =================================
// Export for testing
// =================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        validateForm,
        collectFormData,
        formatCurrency: (amount) => '$' + amount
    };
}
