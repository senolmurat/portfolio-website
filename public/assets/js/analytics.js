/**
 * Analytics implementation using GoatCounter
 * Tracks various user interactions and events on the portfolio website
 */
const Analytics = {
    /**
     * Initialize analytics tracking
     */
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    },

    /**
     * Track a custom event
     * @param {string} eventName - Name of the event
     * @param {Object} [details={}] - Additional event details
     */
    trackEvent(eventName, details = {}) {
        if (window.goatcounter && typeof window.goatcounter.count === 'function') {
            window.goatcounter.count({
                path: `event/${eventName}`,
                title: eventName,
                event: true,
                ...details
            });

            // Debug logging in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Analytics Event:', eventName, details);
            }
        }
    },

    /**
     * Set up all event listeners for tracking
     */
    setupEventListeners() {
        this.trackNavigation();
        this.trackSocialLinks();
        this.trackProjects();
        this.trackContactForm();
        this.trackDownloads();
        this.trackScrollDepth();
        this.trackTimeOnPage();
    },

    /**
     * Track navigation interactions
     */
    trackNavigation() {
        // Track main navigation clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const section = link.getAttribute('href').replace('#', '');
                this.trackEvent('Navigation Click', {
                    path: `navigation/${section}`,
                    title: `Navigate to ${section}`
                });
            });
        });

        // Track mobile menu interactions
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', () => {
                this.trackEvent('Mobile Menu Toggle');
            });
        }
    },

    /**
     * Track social media link interactions
     */
    trackSocialLinks() {
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = Array.from(link.classList)
                    .find(cls => cls.startsWith('profile-'))
                    ?.replace('profile-', '') || 'unknown';
                
                this.trackEvent('Social Link Click', {
                    path: `social/${platform}`,
                    title: `Social Click: ${platform}`
                });
            });
        });
    },

    /**
     * Track project interactions
     */
    trackProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (projectsGrid) {
            projectsGrid.addEventListener('click', (e) => {
                const projectCard = e.target.closest('.project-card');
                if (projectCard) {
                    const projectTitle = projectCard.querySelector('h3')?.textContent || 'Unknown Project';
                    this.trackEvent('Project Click', {
                        path: `project/${projectTitle.toLowerCase().replace(/\s+/g, '-')}`,
                        title: `Project: ${projectTitle}`
                    });
                }
            });
        }
    },

    /**
     * Track contact form interactions
     */
    trackContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            // Track form submissions
            contactForm.addEventListener('submit', (e) => {
                this.trackEvent('Contact Form Submit');
            });

            // Track form field interactions
            const formFields = contactForm.querySelectorAll('input, textarea');
            formFields.forEach(field => {
                field.addEventListener('focus', () => {
                    this.trackEvent('Form Field Focus', {
                        path: `form/focus/${field.id}`,
                        title: `Focus: ${field.id}`
                    });
                });
            });
        }
    },

    /**
     * Track file downloads (CV, etc.)
     */
    trackDownloads() {
        document.querySelectorAll('a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"]')
            .forEach(link => {
                link.addEventListener('click', () => {
                    const fileName = link.href.split('/').pop();
                    this.trackEvent('File Download', {
                        path: `download/${fileName}`,
                        title: `Download: ${fileName}`
                    });
                });
            });
    },

    /**
     * Track scroll depth
     */
    trackScrollDepth() {
        let maxScroll = 0;
        let scrollMarkers = new Set([25, 50, 75, 90, 100]);
        
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const scrollPercent = Math.round((window.scrollY + window.innerHeight) / 
                    document.documentElement.scrollHeight * 100);

                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                    
                    scrollMarkers.forEach(marker => {
                        if (scrollPercent >= marker) {
                            this.trackEvent('Scroll Depth', {
                                path: `scroll/${marker}`,
                                title: `Scrolled: ${marker}%`
                            });
                            scrollMarkers.delete(marker);
                        }
                    });
                }
            });
        });
    },

    /**
     * Track time spent on page
     */
    trackTimeOnPage() {
        const timeIntervals = [30, 60, 120, 300]; // seconds
        let startTime = Date.now();
        let trackedIntervals = new Set(timeIntervals);

        setInterval(() => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            
            trackedIntervals.forEach(interval => {
                if (timeSpent >= interval) {
                    this.trackEvent('Time on Page', {
                        path: `time/${interval}s`,
                        title: `Time Spent: ${interval}s`
                    });
                    trackedIntervals.delete(interval);
                }
            });
        }, 1000);

        // Track when user leaves the page
        window.addEventListener('beforeunload', () => {
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            this.trackEvent('Page Exit', {
                path: 'exit',
                title: `Total Time: ${totalTime}s`
            });
        });
    }
};

// Initialize analytics
Analytics.init(); 