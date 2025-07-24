// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

// Custom Cursor
let cursorX = 0;
let cursorY = 0;
let outlineX = 0;
let outlineY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    cursorDot.style.left = cursorX + 'px';
    cursorDot.style.top = cursorY + 'px';
});

// Smooth cursor outline follow
function animateCursorOutline() {
    outlineX += (cursorX - outlineX) * 0.15;
    outlineY += (cursorY - outlineY) * 0.15;
    
    cursorOutline.style.left = outlineX - 20 + 'px';
    cursorOutline.style.top = outlineY - 20 + 'px';
    
    requestAnimationFrame(animateCursorOutline);
}
animateCursorOutline();

// Cursor hover effects
document.querySelectorAll('a, button, .project-card, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorDot.style.transform = 'scale(2)';
        cursorOutline.style.transform = 'scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursorDot.style.transform = 'scale(1)';
        cursorOutline.style.transform = 'scale(1)';
    });
});

// Navigation functionality
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// GSAP Animations
// Hero section animations
gsap.timeline()
    .from('.hero-name', {
        duration: 1,
        y: 100,
        opacity: 0,
        ease: 'power3.out'
    })
    .from('.hero-subtitle', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-description', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-buttons .btn', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
    }, '-=0.3')
    .from('.profile-card', {
        duration: 1.2,
        scale: 0.8,
        opacity: 0,
        ease: 'back.out(1.7)'
    }, '-=0.8');

// Floating shapes animation
gsap.to('.shape', {
    duration: 'random(4, 8)',
    y: 'random(-50, 50)',
    x: 'random(-30, 30)',
    rotation: 'random(-180, 180)',
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: {
        each: 0.5,
        from: 'random'
    }
});

// Parallax effect for background shapes
gsap.to('.shape-1', {
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    y: -200,
    rotation: 360
});

gsap.to('.shape-2', {
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    y: -150,
    rotation: -360
});

gsap.to('.shape-3', {
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    y: -100,
    rotation: 180
});

// Section animations
gsap.utils.toArray('section').forEach(section => {
    gsap.from(section.querySelectorAll('.section-title, .section-subtitle'), {
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
    });
});

// About section animations
gsap.from('.about-text h3, .about-text p', {
    scrollTrigger: {
        trigger: '.about-content',
        start: 'top 80%'
    },
    duration: 1,
    y: 30,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
});

gsap.from('.skill-tag', {
    scrollTrigger: {
        trigger: '.skills',
        start: 'top 80%'
    },
    duration: 0.6,
    scale: 0,
    opacity: 0,
    stagger: 0.1,
    ease: 'back.out(1.7)'
});

gsap.from('.stat-card', {
    scrollTrigger: {
        trigger: '.about-stats',
        start: 'top 80%'
    },
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
});

// Projects section animations
gsap.from('.project-card', {
    scrollTrigger: {
        trigger: '.projects',
        start: 'top 90%',
        end: 'bottom 10%',
        toggleActions: 'play none none reverse'
    },
    duration: 1,
    y: 100,
    opacity: 0,
    stagger: 0.3,
    ease: 'power3.out'
});

// Fallback: Ensure project cards are visible if ScrollTrigger fails
setTimeout(() => {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        if (getComputedStyle(card).opacity === '0') {
            gsap.set(card, { opacity: 1, y: 0 });
        }
    });
}, 2000);

// Contact section animations
gsap.from('.contact-item', {
    scrollTrigger: {
        trigger: '.contact-info',
        start: 'top 80%'
    },
    duration: 0.8,
    x: -50,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
});

gsap.from('.contact-form', {
    scrollTrigger: {
        trigger: '.contact-form',
        start: 'top 80%'
    },
    duration: 1,
    x: 50,
    opacity: 0,
    ease: 'power3.out'
});

// Counter animation for stats
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 20);
}

// Trigger counter animation when stats come into view
ScrollTrigger.create({
    trigger: '.about-stats',
    start: 'top 80%',
    onEnter: () => {
        document.querySelectorAll('.stat-number').forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            animateCounter(stat, target);
        });
    }
});

// Form validation and submission
const formValidation = {
    name: {
        element: document.getElementById('name'),
        error: document.getElementById('name-error'),
        validate: function() {
            const value = this.element.value.trim();
            if (value.length < 2) {
                this.error.textContent = 'Name must be at least 2 characters long';
                return false;
            }
            this.error.textContent = '';
            return true;
        }
    },
    email: {
        element: document.getElementById('email'),
        error: document.getElementById('email-error'),
        validate: function() {
            const value = this.element.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.error.textContent = 'Please enter a valid email address';
                return false;
            }
            this.error.textContent = '';
            return true;
        }
    },
    message: {
        element: document.getElementById('message'),
        error: document.getElementById('message-error'),
        validate: function() {
            const value = this.element.value.trim();
            if (value.length < 10) {
                this.error.textContent = 'Message must be at least 10 characters long';
                return false;
            }
            this.error.textContent = '';
            return true;
        }
    }
};

// Real-time validation
Object.values(formValidation).forEach(field => {
    field.element.addEventListener('blur', () => field.validate());
    field.element.addEventListener('input', () => {
        if (field.error.textContent) {
            field.validate();
        }
    });
});

// Form submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    Object.values(formValidation).forEach(field => {
        if (!field.validate()) {
            isValid = false;
        }
    });
    
    if (isValid) {
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // Show success message
            showAlert('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Clear any error messages
            Object.values(formValidation).forEach(field => {
                field.error.textContent = '';
            });
        }, 2000);
    } else {
        showAlert('Please fix the errors above and try again.', 'error');
    }
});

// Alert system
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
            </span>
            <span class="alert-message">${message}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
        border-radius: 8px;
        padding: 1rem;
        max-width: 400px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .alert-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .alert-icon {
            font-weight: bold;
            font-size: 1.2rem;
        }
        .alert-message {
            flex: 1;
        }
        .alert-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            margin-left: 0.5rem;
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Intersection Observer for navbar active states
const sections = document.querySelectorAll('section[id]');
const navLinksArray = Array.from(navLinks);

const observerOptions = {
    rootMargin: '-50% 0px -50% 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const activeLink = navLinksArray.find(link => 
                link.getAttribute('href') === `#${entry.target.id}`
            );
            
            // Remove active class from all links
            navLinksArray.forEach(link => link.classList.remove('active'));
            
            // Add active class to current link
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// Add active state styles
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-link.active {
        color: #007bff !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(activeStyle);

// Preloader (optional)
window.addEventListener('load', () => {
    // Hide preloader if exists
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 500);
    }
    
    // Start animations
    gsap.from('.navbar', {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.2
    });
});

// Handle profile image error (fallback)
const profileImg = document.getElementById('profile-pic');
if (profileImg) {
    profileImg.addEventListener('error', function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjhmOWZhIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IiNkZWUyZTYiLz4KPHBhdGggZD0iTTEwMCAyMDBjMC0yNy42MTQgMjIuMzg2LTUwIDUwLTUwczUwIDIyLjM4NiA1MCA1MGgtMTAweiIgZmlsbD0iI2RlZTJlNiIvPgo8L3N2Zz4K';
    });
}

// Add project image fallbacks
document.querySelectorAll('.project-image img').forEach((img, index) => {
    img.addEventListener('error', function() {
        this.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjZjhmOWZhIi8+CjxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZGVlMmU2Ii8+CjwvdGc+Cg==`;
    });
});

console.log('Portfolio website loaded successfully! 🚀');
