/**
 * Smooth Scroll Module
 * Handles smooth scrolling for anchor links across the page
 */

(function() {
  'use strict';

  function initSmoothScroll() {
    // Select all anchor links that point to elements on the page
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
          // Smooth scroll to target
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Optional: Update URL without page jump
          window.history.pushState(null, null, targetId);
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothScroll);
  } else {
    initSmoothScroll();
  }
})();