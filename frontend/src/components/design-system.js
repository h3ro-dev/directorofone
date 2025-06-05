/**
 * Director of One - Design System Component Library
 * Provides interactive behaviors for design system components
 */

class DesignSystem {
    constructor() {
        this.init();
    }

    init() {
        // Initialize all components when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        this.initButtons();
        this.initCards();
        this.initNavigation();
        this.initForms();
        this.initAnimations();
        this.initAccessibility();
    }

    // Button interactions
    initButtons() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Add ripple effect on click
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
            
            // Add keyboard support
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }

    // Card interactions
    initCards() {
        const hoverCards = document.querySelectorAll('.card-hover');
        
        hoverCards.forEach(card => {
            // Add tilt effect on hover
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
            
            // Make cards keyboard accessible
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    card.click();
                }
            });
        });
    }

    // Navigation interactions
    initNavigation() {
        const nav = document.querySelector('.nav');
        let lastScroll = 0;
        
        if (nav) {
            // Hide/show navigation on scroll
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll <= 0) {
                    nav.classList.remove('nav-hidden');
                    return;
                }
                
                if (currentScroll > lastScroll && currentScroll > 100) {
                    nav.classList.add('nav-hidden');
                } else {
                    nav.classList.remove('nav-hidden');
                }
                
                lastScroll = currentScroll;
            });
            
            // Mobile menu toggle
            const menuToggle = document.createElement('button');
            menuToggle.classList.add('menu-toggle');
            menuToggle.innerHTML = '<span></span><span></span><span></span>';
            menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            
            const navContainer = nav.querySelector('.nav-container > div');
            if (navContainer && window.innerWidth <= 768) {
                navContainer.appendChild(menuToggle);
                
                menuToggle.addEventListener('click', () => {
                    nav.classList.toggle('nav-open');
                    menuToggle.classList.toggle('active');
                });
            }
        }
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const offset = 80; // Account for fixed nav
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Form interactions
    initForms() {
        // Floating labels
        const formInputs = document.querySelectorAll('input, textarea, select');
        
        formInputs.forEach(input => {
            // Check if input has value on load
            if (input.value) {
                input.classList.add('has-value');
            }
            
            // Add/remove class on input
            input.addEventListener('input', () => {
                if (input.value) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
            
            // Add focus/blur effects
            input.addEventListener('focus', () => {
                input.parentElement?.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement?.classList.remove('focused');
            });
        });
        
        // Form validation
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Show validation messages
                    const invalidInputs = form.querySelectorAll(':invalid');
                    invalidInputs.forEach(input => {
                        const error = input.parentElement?.querySelector('.error-message') || 
                                    document.createElement('span');
                        error.classList.add('error-message');
                        error.textContent = input.validationMessage;
                        
                        if (!input.parentElement?.querySelector('.error-message')) {
                            input.parentElement?.appendChild(error);
                        }
                    });
                }
                
                form.classList.add('was-validated');
            });
        });
    }

    // Scroll animations
    initAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-scale-in');
        animatedElements.forEach(el => observer.observe(el));
        
        // Parallax effect for hero sections
        const parallaxElements = document.querySelectorAll('.parallax');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Accessibility enhancements
    initAccessibility() {
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.classList.add('skip-link');
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Focus trap for modals
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                        }
                    }
                }
                
                if (e.key === 'Escape') {
                    this.closeModal(modal);
                }
            });
        });
        
        // Announce dynamic content changes
        this.announcer = document.createElement('div');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.classList.add('sr-only');
        document.body.appendChild(this.announcer);
    }

    // Utility methods
    announce(message) {
        if (this.announcer) {
            this.announcer.textContent = message;
            setTimeout(() => {
                this.announcer.textContent = '';
            }, 1000);
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Focus first focusable element
            const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable) {
                focusable.focus();
            }
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Toast notifications
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.classList.add('toast', `toast-${type}`);
        toast.textContent = message;
        
        const container = document.querySelector('.toast-container') || (() => {
            const div = document.createElement('div');
            div.classList.add('toast-container');
            document.body.appendChild(div);
            return div;
        })();
        
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
        
        // Announce to screen readers
        this.announce(message);
    }

    // Loading states
    setLoading(element, isLoading = true) {
        if (isLoading) {
            element.classList.add('loading');
            element.setAttribute('aria-busy', 'true');
            element.disabled = true;
        } else {
            element.classList.remove('loading');
            element.setAttribute('aria-busy', 'false');
            element.disabled = false;
        }
    }
}

// Additional CSS for dynamic components
const style = document.createElement('style');
style.textContent = `
    /* Ripple effect */
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Navigation states */
    .nav {
        transition: transform 0.3s ease-in-out;
    }
    
    .nav-hidden {
        transform: translateY(-100%);
    }
    
    /* Menu toggle */
    .menu-toggle {
        display: none;
        flex-direction: column;
        gap: 4px;
        padding: 8px;
        background: transparent;
        border: none;
        cursor: pointer;
    }
    
    .menu-toggle span {
        display: block;
        width: 24px;
        height: 3px;
        background-color: var(--color-text-primary);
        transition: all 0.3s ease;
    }
    
    .menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        .menu-toggle {
            display: flex;
        }
    }
    
    /* Animation classes */
    .animate-fade-in {
        opacity: 0;
        transition: opacity 0.6s ease-out;
    }
    
    .animate-slide-up {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }
    
    .animate-scale-in {
        opacity: 0;
        transform: scale(0.9);
        transition: all 0.6s ease-out;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) scale(1) !important;
    }
    
    /* Skip link */
    .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--color-primary-500);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 0 0 4px 0;
        z-index: 100;
    }
    
    .skip-link:focus {
        top: 0;
    }
    
    /* Screen reader only */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    /* Toast notifications */
    .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
    }
    
    .toast {
        background: var(--color-neutral-800);
        color: white;
        padding: 12px 24px;
        border-radius: var(--radius-md);
        margin-bottom: 10px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        box-shadow: var(--shadow-lg);
    }
    
    .toast.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .toast-success {
        background: var(--color-success);
    }
    
    .toast-error {
        background: var(--color-error);
    }
    
    .toast-warning {
        background: var(--color-warning);
    }
    
    /* Loading states */
    .loading {
        position: relative;
        color: transparent !important;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 50%;
        left: 50%;
        margin-left: -8px;
        margin-top: -8px;
        border: 2px solid var(--color-primary-200);
        border-radius: 50%;
        border-top-color: var(--color-primary-600);
        animation: spinner 0.6s linear infinite;
    }
    
    @keyframes spinner {
        to {
            transform: rotate(360deg);
        }
    }
    
    /* Form validation */
    .error-message {
        color: var(--color-error);
        font-size: var(--text-sm);
        margin-top: var(--space-1);
        display: block;
    }
    
    .was-validated input:invalid,
    .was-validated textarea:invalid,
    .was-validated select:invalid {
        border-color: var(--color-error);
    }
    
    .was-validated input:valid,
    .was-validated textarea:valid,
    .was-validated select:valid {
        border-color: var(--color-success);
    }
`;

document.head.appendChild(style);

// Initialize the design system
const designSystem = new DesignSystem();

// Export for use in other scripts
window.DesignSystem = designSystem;