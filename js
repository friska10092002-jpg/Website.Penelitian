/**
 * UIN PONOROGO Research - Kuesioner Penelitian
 * Main JavaScript File
 */

// ========================================
// CONFIGURATION
// ========================================
// GANTI URL INI DENGAN URL GOOGLE APPS SCRIPT ANDA
// Lihat README.md untuk panduan setup
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz5rhwazfJ8Icpkk97v5736oxp0P6XVEcheEbozkTwxwqyRjorumjmtR-3QYSPEFXxVKQ/exec';

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function untuk membatasi frekuensi eksekusi
 */
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

/**
 * Format tanggal ke format Indonesia
 */
function formatDate(date) {
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('id-ID', options);
}

/**
 * Show loading overlay
 */
function showLoading(message = 'Memuat...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.querySelector('p').textContent = message;
        overlay.classList.add('active');
    }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

/**
 * Show success modal
 */
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * Hide success modal
 */
function hideSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add toast styles
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'success' ? '#27ae60' : '#e63946'};
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 5000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========================================
// NAVIGATION
// ========================================

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', debounce(() => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }
        }
    }, 10));
}

// ========================================
// FORM VALIDATION
// ========================================

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove previous error state
    field.classList.remove('error');
    
    // Check based on field type
    if (field.hasAttribute('required')) {
        if (field.type === 'radio') {
            const radioGroup = document.querySelectorAll(`input[name="${field.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                isValid = false;
            }
        } else if (!value) {
            isValid = false;
        }
    }
    
    // Number validation
    if (field.type === 'number' && value) {
        const numValue = parseInt(value);
        const min = parseInt(field.min);
        const max = parseInt(field.max);
        
        if (min && numValue < min) isValid = false;
        if (max && numValue > max) isValid = false;
    }
    
    if (!isValid) {
        field.classList.add('error');
    }
    
    return isValid;
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// ========================================
// PROGRESS INDICATOR
// ========================================

function updateProgress() {
    const form = document.getElementById('kuesionerForm');
    if (!form) return;
    
    const totalQuestions = 25; // 5 identitas + 20 AGIL
    let answeredQuestions = 0;
    
    // Count answered text/number/select inputs
    const textInputs = form.querySelectorAll('input[type="text"], input[type="number"], select');
    textInputs.forEach(input => {
        if (input.value.trim()) answeredQuestions++;
    });
    
    // Count answered radio groups
    const radioGroups = {};
    form.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (!radioGroups[radio.name]) {
            radioGroups[radio.name] = false;
        }
        if (radio.checked) {
            radioGroups[radio.name] = true;
        }
    });
    
    answeredQuestions += Object.values(radioGroups).filter(Boolean).length;
    
    const progressPercent = Math.round((answeredQuestions / totalQuestions) * 100);
    
    const progressFill = document.getElementById('progressFill');
    const progressPercentEl = document.getElementById('progressPercent');
    
    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }
    if (progressPercentEl) {
        progressPercentEl.textContent = progressPercent;
    }
}

// ========================================
// FORM SUBMISSION
// ========================================

async function submitForm(formData) {
    try {
        // Convert FormData to object
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Add timestamp
        data.timestamp = new Date().toISOString();
        
        // Send to Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error submitting form:', error);
        return { success: false, error: error.message };
    }
}

function initQuestionnaireForm() {
    const form = document.getElementById('kuesionerForm');
    if (!form) return;
    
    // Update progress on input change
    form.addEventListener('input', debounce(updateProgress, 100));
    form.addEventListener('change', debounce(updateProgress, 100));
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(form)) {
            showToast('Mohon lengkapi semua field yang wajib diisi', 'error');
            
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Show loading
        showLoading('Mengirim jawaban...');
        
        // Submit form
        const formData = new FormData(form);
        const result = await submitForm(formData);
        
        // Hide loading
        hideLoading();
        
        if (result.success) {
            showSuccessModal();
            form.reset();
            updateProgress();
        } else {
            showToast('Gagal mengirim jawaban. Silakan coba lagi.', 'error');
        }
    });
    
    // Initialize progress
    updateProgress();
}

// ========================================
// LOCAL STORAGE FALLBACK
// ========================================

function saveToLocalStorage(data) {
    try {
        let responses = JSON.parse(localStorage.getItem('kuesioner_responses') || '[]');
        responses.push({
            ...data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('kuesioner_responses', JSON.stringify(responses));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getLocalStorageData() {
    try {
        return JSON.parse(localStorage.getItem('kuesioner_responses') || '[]');
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
}

// ========================================
// CHARTS DATA FETCHING
// ========================================

async function fetchChartData() {
    // Try to fetch from Google Sheets first
    try {
        // Since Google Apps Script with no-cors doesn't return data,
        // we'll use localStorage as fallback for demo
        const localData = getLocalStorageData();
        
        if (localData.length > 0) {
            return processChartData(localData);
        }
        
        // Return sample data if no data available
        return getSampleData();
    } catch (error) {
        console.error('Error fetching chart data:', error);
        return getSampleData();
    }
}

function processChartData(data) {
    const totalResponden = data.length;
    
    // Initialize counters for each dimension
    const dimensions = {
        adaptation: { ya: 0, tidak: 0 },
        goal: { ya: 0, tidak: 0 },
        integration: { ya: 0, tidak: 0 },
        latency: { ya: 0, tidak: 0 }
    };
    
    // Process each response
    data.forEach(response => {
        // Adaptation (A1-A5)
        for (let i = 1; i <= 5; i++) {
            if (response[`A${i}`] === 'Ya') dimensions.adaptation.ya++;
            else if (response[`A${i}`] === 'Tidak') dimensions.adaptation.tidak++;
        }
        
        // Goal Attainment (G1-G5)
        for (let i = 1; i <= 5; i++) {
            if (response[`G${i}`] === 'Ya') dimensions.goal.ya++;
            else if (response[`G${i}`] === 'Tidak') dimensions.goal.tidak++;
        }
        
        // Integration (I1-I5)
        for (let i = 1; i <= 5; i++) {
            if (response[`I${i}`] === 'Ya') dimensions.integration.ya++;
            else if (response[`I${i}`] === 'Tidak') dimensions.integration.tidak++;
        }
        
        // Latency (L1-L5)
        for (let i = 1; i <= 5; i++) {
            if (response[`L${i}`] === 'Ya') dimensions.latency.ya++;
            else if (response[`L${i}`] === 'Tidak') dimensions.latency.tidak++;
        }
    });
    
    return {
        totalResponden,
        dimensions
    };
}

function getSampleData() {
    // Sample data for demonstration
    return {
        totalResponden: 45,
        dimensions: {
            adaptation: { ya: 185, tidak: 40 },
            goal: { ya: 175, tidak: 50 },
            integration: { ya: 195, tidak: 30 },
            latency: { ya: 188, tidak: 37 }
        }
    };
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    initNavigation();
    
    // Initialize questionnaire form
    initQuestionnaireForm();
    
    // Add CSS animation keyframes for toast
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Export functions for use in other scripts
window.KuesionerApp = {
    fetchChartData,
    getSampleData,
    processChartData,
    showToast,
    showLoading,
    hideLoading
};
