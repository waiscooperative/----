// ========================================
//   WAIS Cooperative Dashboard JavaScript
//   Common functionality for all dashboards
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle Functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarBackdrop = document.querySelector('.sidebar-backdrop');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
            
            // Create backdrop if it doesn't exist
            if (!sidebarBackdrop) {
                const backdrop = document.createElement('div');
                backdrop.className = 'sidebar-backdrop';
                document.body.appendChild(backdrop);
                
                backdrop.addEventListener('click', function() {
                    sidebar.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                    backdrop.classList.remove('active');
                });
            }
            
            const backdrop = document.querySelector('.sidebar-backdrop');
            if (backdrop) {
                backdrop.classList.toggle('active');
            }
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (sidebar && sidebar.classList.contains('active')) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                    const backdrop = document.querySelector('.sidebar-backdrop');
                    if (backdrop) {
                        backdrop.classList.remove('active');
                    }
                }
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            if (sidebar) {
                sidebar.classList.remove('active');
            }
            document.body.classList.remove('sidebar-open');
            const backdrop = document.querySelector('.sidebar-backdrop');
            if (backdrop) {
                backdrop.classList.remove('active');
            }
        }
    });
    
    // Notification bell click handler
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            // Navigate to notifications page or show dropdown
            const notificationsLink = document.querySelector('a[href*="notifications"]');
            if (notificationsLink) {
                notificationsLink.click();
            } else {
                alert('You have 3 new notifications!\n\n1. Deposit confirmation - Sep 4\n2. Payment reminder - Sep 3\n3. Workshop announcement - Sep 2');
            }
        });
    }
    
    // Form validation helpers
    const forms = document.querySelectorAll('form[data-demo-form]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#dc3545';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });
    
    // Table search functionality
    const searchInputs = document.querySelectorAll('[data-table-search]');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const tableId = this.getAttribute('data-table-search');
            const table = document.querySelector(tableId);
            const searchTerm = this.value.toLowerCase();
            
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
        });
    });
    
    // Table filter functionality
    const filterSelects = document.querySelectorAll('[data-table-filter]');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            const tableId = this.getAttribute('data-table-filter');
            const table = document.querySelector(tableId);
            const filterValue = this.value;
            
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    if (filterValue === '') {
                        row.style.display = '';
                    } else {
                        const status = row.getAttribute('data-status');
                        row.style.display = status === filterValue ? '' : 'none';
                    }
                });
            }
        });
    });
    
    // Initialize tooltips and other UI enhancements
    initializeUIEnhancements();
});

function initializeUIEnhancements() {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('no-loading')) {
                const originalText = this.textContent;
                this.textContent = 'Loading...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 1000);
            }
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility functions
function formatCurrency(amount) {
    return '₱' + parseFloat(amount).toFixed(2);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#124b36' : type === 'error' ? '#dc3545' : '#04234c'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
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