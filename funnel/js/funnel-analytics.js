/**
 * NEURIX FUNNEL ANALYTICS & OPTIMIZATION
 * Tracks user behavior, conversion events, and implements UX improvements
 */

// Analytics Configuration
const ANALYTICS_CONFIG = {
    // Replace with actual GA4 Measurement ID
    GA_MEASUREMENT_ID: 'G-XXXXXXXXXX',
    
    // Conversion tracking
    CONVERSION_EVENTS: {
        LEAD_GENERATED: 'lead_generated',
        QUOTE_REQUESTED: 'quote_requested',
        SERVICE_SELECTED: 'service_selected',
        EMAIL_SIGNUP: 'email_signup',
        UPSELL_CLICKED: 'upsell_clicked'
    },
    
    // Custom event parameters
    CUSTOM_DIMENSIONS: {
        USER_TYPE: 'user_type',
        SERVICE_INTEREST: 'service_interest',
        FUNNEL_STEP: 'funnel_step',
        TRAFFIC_SOURCE: 'traffic_source'
    }
};

// Enhanced Event Tracking
class FunnelAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.startTime = Date.now();
        this.scrollDepth = 0;
        this.maxScrollDepth = 0;
        this.interactions = [];
        
        this.init();
    }
    
    init() {
        this.setupScrollTracking();
        this.setupClickTracking();
        this.setupFormTracking();
        this.setupTimeTracking();
        this.trackPageView();
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getUserId() {
        let userId = localStorage.getItem('neurix_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('neurix_user_id', userId);
        }
        return userId;
    }
    
    // Track enhanced page views with context
    trackPageView() {
        const pageData = {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
            referrer: document.referrer,
            session_id: this.sessionId,
            user_id: this.userId,
            timestamp: new Date().toISOString(),
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
            user_agent: navigator.userAgent,
            funnel_step: this.getFunnelStep()
        };
        
        this.sendEvent('page_view', pageData);
        
        // Track traffic source
        this.trackTrafficSource();
    }
    
    getFunnelStep() {
        const path = window.location.pathname;
        if (path.includes('landing')) return 'awareness';
        if (path.includes('services')) return 'consideration';
        if (path.includes('contact')) return 'intent';
        if (path.includes('thank-you')) return 'conversion';
        return 'unknown';
    }
    
    trackTrafficSource() {
        const referrer = document.referrer;
        let source = 'direct';
        
        if (referrer) {
            if (referrer.includes('google')) source = 'google';
            else if (referrer.includes('facebook')) source = 'facebook';
            else if (referrer.includes('linkedin')) source = 'linkedin';
            else if (referrer.includes('twitter')) source = 'twitter';
            else source = 'referral';
        }
        
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source');
        if (utmSource) source = utmSource;
        
        this.sendEvent('traffic_source_identified', {
            source: source,
            referrer: referrer,
            utm_campaign: urlParams.get('utm_campaign'),
            utm_medium: urlParams.get('utm_medium'),
            utm_content: urlParams.get('utm_content')
        });
    }
    
    // Enhanced scroll tracking
    setupScrollTracking() {
        let ticking = false;
        
        const updateScrollDepth = () => {
            this.scrollDepth = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (this.scrollDepth > this.maxScrollDepth) {
                this.maxScrollDepth = this.scrollDepth;
                
                // Track milestone scroll depths
                const milestones = [25, 50, 75, 90, 100];
                milestones.forEach(milestone => {
                    if (this.maxScrollDepth >= milestone && !this.scrollMilestones?.[milestone]) {
                        this.scrollMilestones = this.scrollMilestones || {};
                        this.scrollMilestones[milestone] = true;
                        
                        this.sendEvent('scroll_depth', {
                            depth_percentage: milestone,
                            page_path: window.location.pathname,
                            time_to_depth: Date.now() - this.startTime
                        });
                    }
                });
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollDepth);
                ticking = true;
            }
        });
    }
    
    // Enhanced click tracking
    setupClickTracking() {
        document.addEventListener('click', (event) => {
            const element = event.target;
            const clickData = {
                element_type: element.tagName.toLowerCase(),
                element_id: element.id || '',
                element_class: element.className || '',
                element_text: element.textContent?.substring(0, 100) || '',
                element_href: element.href || '',
                page_path: window.location.pathname,
                click_x: event.clientX,
                click_y: event.clientY,
                timestamp: new Date().toISOString()
            };
            
            // Special tracking for important elements
            if (element.classList.contains('btn')) {
                clickData.button_type = this.getButtonType(element);
                clickData.button_location = this.getButtonLocation(element);
                this.sendEvent('button_click', clickData);
            }
            
            if (element.tagName === 'A') {
                clickData.link_type = element.href.includes(window.location.origin) ? 'internal' : 'external';
                this.sendEvent('link_click', clickData);
            }
            
            // Track all clicks for heat mapping
            this.sendEvent('element_click', clickData);
        });
    }
    
    getButtonType(button) {
        if (button.classList.contains('btn-primary')) return 'primary';
        if (button.classList.contains('btn-secondary')) return 'secondary';
        if (button.classList.contains('btn-outline')) return 'outline';
        return 'default';
    }
    
    getButtonLocation(button) {
        const rect = button.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect.top < viewportHeight * 0.33) return 'top';
        if (rect.top < viewportHeight * 0.66) return 'middle';
        return 'bottom';
    }
    
    // Form tracking with field-level analytics
    setupFormTracking() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const formId = form.id || 'unnamed_form';
            let formStartTime = null;
            let fieldInteractions = {};
            
            // Track form start
            form.addEventListener('focusin', (event) => {
                if (!formStartTime) {
                    formStartTime = Date.now();
                    this.sendEvent('form_started', {
                        form_id: formId,
                        first_field: event.target.name || event.target.id,
                        page_path: window.location.pathname
                    });
                }
            });
            
            // Track field interactions
            const formFields = form.querySelectorAll('input, select, textarea');
            formFields.forEach(field => {
                const fieldName = field.name || field.id;
                
                field.addEventListener('focus', () => {
                    fieldInteractions[fieldName] = {
                        focus_time: Date.now(),
                        focus_count: (fieldInteractions[fieldName]?.focus_count || 0) + 1
                    };
                });
                
                field.addEventListener('blur', () => {
                    if (fieldInteractions[fieldName]) {
                        const interaction = fieldInteractions[fieldName];
                        interaction.blur_time = Date.now();
                        interaction.time_spent = interaction.blur_time - interaction.focus_time;
                        interaction.has_value = !!field.value;
                        interaction.value_length = field.value?.length || 0;
                        
                        this.sendEvent('form_field_interaction', {
                            form_id: formId,
                            field_name: fieldName,
                            field_type: field.type,
                            ...interaction
                        });
                    }
                });
                
                // Track field completion
                field.addEventListener('change', () => {
                    if (field.value) {
                        this.sendEvent('form_field_completed', {
                            form_id: formId,
                            field_name: fieldName,
                            field_type: field.type,
                            has_value: true,
                            time_from_form_start: formStartTime ? Date.now() - formStartTime : 0
                        });
                    }
                });
            });
            
            // Track form submission
            form.addEventListener('submit', (event) => {
                const formData = new FormData(form);
                const completedFields = Array.from(formData.keys());
                const totalFields = formFields.length;
                const completionRate = completedFields.length / totalFields;
                
                this.sendEvent('form_submitted', {
                    form_id: formId,
                    completion_rate: completionRate,
                    completed_fields: completedFields.length,
                    total_fields: totalFields,
                    time_to_complete: formStartTime ? Date.now() - formStartTime : 0,
                    page_path: window.location.pathname
                });
                
                // Track specific form submissions
                if (formId === 'contactForm') {
                    this.trackLeadGeneration(formData);
                }
            });
        });
    }
    
    trackLeadGeneration(formData) {
        const leadData = {
            service_type: formData.get('service'),
            timeline: formData.get('timeline'),
            budget: formData.get('budget'),
            has_phone: !!formData.get('phone'),
            has_company: !!formData.get('company'),
            description_length: formData.get('description')?.length || 0,
            wants_lead_magnet: formData.get('leadMagnet') === 'yes',
            lead_score: this.calculateLeadScore(formData)
        };
        
        this.sendEvent(ANALYTICS_CONFIG.CONVERSION_EVENTS.LEAD_GENERATED, leadData);
        
        // Send conversion to GA4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                send_to: `${ANALYTICS_CONFIG.GA_MEASUREMENT_ID}/lead_generated`,
                value: leadData.lead_score,
                currency: 'USD'
            });
        }
    }
    
    calculateLeadScore(formData) {
        let score = 50; // Base score
        
        // Service type scoring
        const service = formData.get('service');
        const serviceScores = {
            'landing': 60,
            'website': 80,
            'ecommerce': 100,
            'app': 90,
            'unsure': 40
        };
        score += serviceScores[service] || 0;
        
        // Timeline urgency
        const timeline = formData.get('timeline');
        if (timeline === 'asap') score += 30;
        else if (timeline === '2weeks') score += 20;
        else if (timeline === 'month') score += 10;
        
        // Budget indication
        const budget = formData.get('budget');
        if (budget && budget !== 'discuss') score += 20;
        
        // Contact completeness
        if (formData.get('phone')) score += 15;
        if (formData.get('company')) score += 10;
        
        // Description quality
        const description = formData.get('description');
        if (description && description.length > 100) score += 15;
        if (description && description.length > 300) score += 10;
        
        return Math.min(score, 100);
    }
    
    // Time-based tracking
    setupTimeTracking() {
        // Track page engagement time
        let isActive = true;
        let totalActiveTime = 0;
        let lastActiveTime = Date.now();
        
        const trackActivity = () => {
            if (isActive) {
                totalActiveTime += Date.now() - lastActiveTime;
            }
            lastActiveTime = Date.now();
            isActive = true;
        };
        
        // Reset activity on user interaction
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, trackActivity, { passive: true });
        });
        
        // Mark as inactive after 30 seconds of no activity
        setInterval(() => {
            if (Date.now() - lastActiveTime > 30000) {
                isActive = false;
            }
        }, 1000);
        
        // Send engagement data before page unload
        window.addEventListener('beforeunload', () => {
            trackActivity();
            
            this.sendEvent('page_engagement', {
                total_time: Date.now() - this.startTime,
                active_time: totalActiveTime,
                engagement_rate: totalActiveTime / (Date.now() - this.startTime),
                max_scroll_depth: this.maxScrollDepth,
                interactions_count: this.interactions.length,
                page_path: window.location.pathname
            });
        });
    }
    
    // Send events to analytics
    sendEvent(eventName, eventData = {}) {
        // Add session context to all events
        const enrichedData = {
            ...eventData,
            session_id: this.sessionId,
            user_id: this.userId,
            timestamp: new Date().toISOString(),
            page_path: window.location.pathname
        };
        
        // Send to Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, enrichedData);
        }
        
        // Send to custom analytics endpoint (implement as needed)
        this.sendToCustomAnalytics(eventName, enrichedData);
        
        // Store interaction
        this.interactions.push({
            event: eventName,
            data: enrichedData,
            timestamp: Date.now()
        });
        
        // Debug logging in development
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
            console.log('📊 Analytics Event:', eventName, enrichedData);
        }
    }
    
    sendToCustomAnalytics(eventName, eventData) {
        // Implement custom analytics endpoint
        // This could send to your own server, Mixpanel, Amplitude, etc.
        
        // Example implementation:
        /*
        fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: eventName,
                properties: eventData
            })
        }).catch(error => {
            console.warn('Analytics send failed:', error);
        });
        */
    }
    
    // Public methods for manual tracking
    trackCustomEvent(eventName, eventData = {}) {
        this.sendEvent(eventName, eventData);
    }
    
    trackServiceInterest(serviceName, context = {}) {
        this.sendEvent(ANALYTICS_CONFIG.CONVERSION_EVENTS.SERVICE_SELECTED, {
            service_name: serviceName,
            context: context,
            funnel_step: this.getFunnelStep()
        });
    }
    
    trackEmailSignup(email, context = {}) {
        this.sendEvent(ANALYTICS_CONFIG.CONVERSION_EVENTS.EMAIL_SIGNUP, {
            email_domain: email.split('@')[1],
            context: context,
            lead_magnet: context.leadMagnet || false
        });
    }
    
    trackUpsellClick(offerName, offerValue = 0) {
        this.sendEvent(ANALYTICS_CONFIG.CONVERSION_EVENTS.UPSELL_CLICKED, {
            offer_name: offerName,
            offer_value: offerValue,
            funnel_step: this.getFunnelStep()
        });
    }
    
    // Get current session analytics
    getSessionData() {
        return {
            sessionId: this.sessionId,
            userId: this.userId,
            startTime: this.startTime,
            currentTime: Date.now(),
            sessionDuration: Date.now() - this.startTime,
            maxScrollDepth: this.maxScrollDepth,
            interactionsCount: this.interactions.length,
            funnelStep: this.getFunnelStep()
        };
    }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.funnelAnalytics = new FunnelAnalytics();
    
    // Make tracking functions globally available
    window.trackEvent = (eventName, eventData) => {
        window.funnelAnalytics.trackCustomEvent(eventName, eventData);
    };
    
    window.trackServiceInterest = (serviceName, context) => {
        window.funnelAnalytics.trackServiceInterest(serviceName, context);
    };
    
    window.trackEmailSignup = (email, context) => {
        window.funnelAnalytics.trackEmailSignup(email, context);
    };
    
    window.trackUpsellClick = (offerName, offerValue) => {
        window.funnelAnalytics.trackUpsellClick(offerName, offerValue);
    };
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FunnelAnalytics, ANALYTICS_CONFIG };
}