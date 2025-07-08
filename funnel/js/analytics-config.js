/**
 * ANALYTICS CONFIGURATION
 * Configuration for Google Analytics 4, custom tracking, and integrations
 */

// Analytics Configuration Object
const ANALYTICS_CONFIG = {
    // Google Analytics 4 Configuration
    GA4: {
        MEASUREMENT_ID: 'G-XXXXXXXXXX', // Replace with your actual GA4 Measurement ID
        CONFIG: {
            // Enhanced E-commerce
            send_page_view: true,
            
            // Custom parameters
            custom_map: {
                custom_parameter_1: 'funnel_step',
                custom_parameter_2: 'service_interest',
                custom_parameter_3: 'lead_score',
                custom_parameter_4: 'traffic_source'
            },
            
            // Conversion tracking
            conversion_linker: true,
            
            // Enhanced measurement
            enhanced_measurement: {
                scrolls: true,
                outbound_clicks: true,
                site_search: false,
                video_engagement: false,
                file_downloads: true
            }
        }
    },
    
    // Custom Event Names
    EVENTS: {
        // Funnel Events
        FUNNEL_STEP_VIEWED: 'funnel_step_viewed',
        FUNNEL_STEP_COMPLETED: 'funnel_step_completed',
        FUNNEL_ABANDONED: 'funnel_abandoned',
        
        // Lead Generation Events
        LEAD_GENERATED: 'lead_generated',
        QUOTE_REQUESTED: 'quote_requested',
        CONSULTATION_BOOKED: 'consultation_booked',
        
        // Service Selection Events
        SERVICE_VIEWED: 'service_viewed',
        SERVICE_SELECTED: 'service_selected',
        PRICING_CLICKED: 'pricing_clicked',
        
        // Form Events
        FORM_STARTED: 'form_started',
        FORM_FIELD_COMPLETED: 'form_field_completed',
        FORM_SUBMITTED: 'form_submitted',
        FORM_ABANDONED: 'form_abandoned',
        
        // Engagement Events
        EMAIL_SIGNUP: 'email_signup',
        LEAD_MAGNET_REQUESTED: 'lead_magnet_requested',
        UPSELL_VIEWED: 'upsell_viewed',
        UPSELL_CLICKED: 'upsell_clicked',
        
        // Navigation Events
        CTA_CLICKED: 'cta_clicked',
        EXTERNAL_LINK_CLICKED: 'external_link_clicked',
        SOCIAL_SHARE: 'social_share',
        
        // Technical Events
        PAGE_LOAD_TIME: 'page_load_time',
        SCROLL_DEPTH: 'scroll_depth',
        TIME_ON_PAGE: 'time_on_page',
        
        // Business Events
        PHONE_CLICKED: 'phone_clicked',
        EMAIL_CLICKED: 'email_clicked',
        REFERRAL_SHARED: 'referral_shared'
    },
    
    // Custom Dimensions and Metrics
    CUSTOM_DIMENSIONS: {
        FUNNEL_STEP: 'funnel_step',           // landing, services, contact, thank-you
        SERVICE_INTEREST: 'service_interest', // landing, website, ecommerce, app
        LEAD_SCORE: 'lead_score',            // 0-100 calculated score
        TRAFFIC_SOURCE: 'traffic_source',     // organic, paid, social, referral, direct
        USER_TYPE: 'user_type',              // new_visitor, returning_visitor, lead, customer
        DEVICE_TYPE: 'device_type',          // mobile, tablet, desktop
        SESSION_QUALITY: 'session_quality',  // high, medium, low (based on engagement)
        GEOGRAPHIC_REGION: 'region'          // SW_Washington, NW_Oregon, other
    },
    
    // Conversion Goals and Values
    CONVERSIONS: {
        LEAD_GENERATED: {
            event_name: 'lead_generated',
            value: 100,
            currency: 'USD'
        },
        QUOTE_REQUESTED: {
            event_name: 'quote_requested', 
            value: 250,
            currency: 'USD'
        },
        CONSULTATION_BOOKED: {
            event_name: 'consultation_booked',
            value: 500,
            currency: 'USD'
        },
        EMAIL_SIGNUP: {
            event_name: 'email_signup',
            value: 25,
            currency: 'USD'
        },
        UPSELL_CLICKED: {
            event_name: 'upsell_clicked',
            value: 75,
            currency: 'USD'
        }
    },
    
    // Enhanced E-commerce Configuration
    ECOMMERCE: {
        // Service Items for Enhanced E-commerce
        ITEMS: {
            LANDING_PAGE: {
                item_id: 'landing_page_service',
                item_name: 'Landing Page Development',
                item_category: 'web_development',
                item_category2: 'landing_pages',
                price: 750, // Average price
                quantity: 1
            },
            FULL_WEBSITE: {
                item_id: 'full_website_service',
                item_name: 'Full Website Development',
                item_category: 'web_development', 
                item_category2: 'websites',
                price: 1500, // Average price
                quantity: 1
            },
            ECOMMERCE: {
                item_id: 'ecommerce_service',
                item_name: 'E-commerce Development',
                item_category: 'web_development',
                item_category2: 'ecommerce',
                price: 7000, // Average price
                quantity: 1
            },
            CUSTOM_APP: {
                item_id: 'custom_app_service',
                item_name: 'Custom Web Application',
                item_category: 'web_development',
                item_category2: 'applications',
                price: 5000, // Estimated average
                quantity: 1
            },
            PROMPT_TEMPLATES: {
                item_id: 'prompt_templates',
                item_name: 'AI Prompt Engineering Templates',
                item_category: 'digital_products',
                item_category2: 'templates',
                price: 47,
                quantity: 1
            },
            AI_CONSULTATION: {
                item_id: 'ai_consultation',
                item_name: 'AI Business Automation Consultation',
                item_category: 'consulting',
                item_category2: 'ai_automation', 
                price: 197,
                quantity: 1
            }
        }
    },
    
    // Facebook Pixel Configuration (if using)
    FACEBOOK_PIXEL: {
        PIXEL_ID: 'XXXXXXXXXXXXXXX', // Replace with actual Pixel ID
        EVENTS: {
            PAGE_VIEW: 'PageView',
            LEAD: 'Lead',
            COMPLETE_REGISTRATION: 'CompleteRegistration',
            INITIATE_CHECKOUT: 'InitiateCheckout',
            PURCHASE: 'Purchase',
            VIEW_CONTENT: 'ViewContent'
        }
    },
    
    // Development and Debug Settings
    DEBUG: {
        ENABLED: window.location.hostname === 'localhost' || window.location.hostname.includes('dev'),
        LOG_EVENTS: true,
        CONSOLE_OUTPUT: true,
        TEST_MODE: false
    },
    
    // Data Layer Configuration
    DATA_LAYER: {
        VARIABLE_NAME: 'dataLayer',
        ENHANCED_ECOMMERCE: true,
        USER_PROPERTIES: true,
        CUSTOM_EVENTS: true
    },
    
    // Privacy and Compliance
    PRIVACY: {
        ANONYMIZE_IP: true,
        RESPECT_DNT: true, // Respect Do Not Track header
        COOKIE_CONSENT_REQUIRED: true,
        DATA_RETENTION_MONTHS: 26
    },
    
    // Third-Party Integrations
    INTEGRATIONS: {
        HOTJAR: {
            ENABLED: false,
            SITE_ID: 'XXXXXXX'
        },
        MICROSOFT_CLARITY: {
            ENABLED: false,
            PROJECT_ID: 'XXXXXXXXXX'
        },
        MIXPANEL: {
            ENABLED: false,
            TOKEN: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
        }
    }
};

// Export configuration for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ANALYTICS_CONFIG;
} else {
    window.ANALYTICS_CONFIG = ANALYTICS_CONFIG;
}

// Initialize Google Analytics 4 with configuration
function initializeGA4() {
    if (typeof gtag !== 'undefined') {
        // Configure GA4 with our settings
        gtag('config', ANALYTICS_CONFIG.GA4.MEASUREMENT_ID, ANALYTICS_CONFIG.GA4.CONFIG);
        
        // Set custom dimensions
        gtag('config', ANALYTICS_CONFIG.GA4.MEASUREMENT_ID, {
            send_page_view: false // We'll send manual page views with custom data
        });
        
        // Debug logging
        if (ANALYTICS_CONFIG.DEBUG.ENABLED && ANALYTICS_CONFIG.DEBUG.LOG_EVENTS) {
            console.log('📊 GA4 Initialized with config:', ANALYTICS_CONFIG.GA4);
        }
    }
}

// Initialize Facebook Pixel (if enabled)
function initializeFacebookPixel() {
    if (ANALYTICS_CONFIG.FACEBOOK_PIXEL.PIXEL_ID && typeof fbq !== 'undefined') {
        fbq('init', ANALYTICS_CONFIG.FACEBOOK_PIXEL.PIXEL_ID);
        
        if (ANALYTICS_CONFIG.DEBUG.ENABLED) {
            console.log('📊 Facebook Pixel Initialized:', ANALYTICS_CONFIG.FACEBOOK_PIXEL.PIXEL_ID);
        }
    }
}

// Helper function to determine geographic region
function getGeographicRegion() {
    // This would typically use IP geolocation or browser geolocation
    // For now, we'll return a default
    return 'unknown';
}

// Helper function to determine device type
function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

// Helper function to calculate session quality
function calculateSessionQuality(sessionData) {
    let score = 0;
    
    // Time on site (weight: 30%)
    const timeMinutes = sessionData.duration / (1000 * 60);
    if (timeMinutes > 5) score += 30;
    else if (timeMinutes > 2) score += 20;
    else if (timeMinutes > 1) score += 10;
    
    // Page depth (weight: 25%)
    if (sessionData.pageViews > 3) score += 25;
    else if (sessionData.pageViews > 2) score += 20;
    else if (sessionData.pageViews > 1) score += 15;
    
    // Interaction count (weight: 25%)
    if (sessionData.interactions > 10) score += 25;
    else if (sessionData.interactions > 5) score += 20;
    else if (sessionData.interactions > 2) score += 15;
    
    // Conversion actions (weight: 20%)
    if (sessionData.conversions > 0) score += 20;
    else if (sessionData.formSubmissions > 0) score += 15;
    else if (sessionData.ctaClicks > 0) score += 10;
    
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
}

// Initialize all analytics when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeGA4();
    initializeFacebookPixel();
    
    if (ANALYTICS_CONFIG.DEBUG.ENABLED) {
        console.log('📊 Analytics Configuration Loaded:', ANALYTICS_CONFIG);
    }
});