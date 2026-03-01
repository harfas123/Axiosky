/* ========================================
   AXIOSKY NAVIGATION - NAVIGATION.JS
   Hamburger menu, mobile nav toggle, active states
   ======================================== */

// ===== DOM ELEMENTS =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// ===== HAMBURGER MENU TOGGLE =====
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Dropdown support for mobile (touch)
dropdownToggles.forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    const menu = toggle.nextElementSibling;
    menu.classList.toggle('active');
  });
});


// ===== CLOSE MENU ON LINK CLICK =====
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// ===== CLOSE MENU ON OUTSIDE CLICK =====
document.addEventListener('click', (e) => {
  if (!e.target.closest('.navbar-container')) {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  }
});

// ===== NAVBAR SCROLL EFFECT (optional) =====
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > 50) {
    navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  } else {
    navbar.style.boxShadow = 'none';
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// ===== ACTIVE LINK HIGHLIGHTING (optional) =====
window.addEventListener('scroll', () => {
  let currentScroll = window.scrollY;

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    if (href.startsWith('#')) {
      const section = document.querySelector(href);
      
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (currentScroll >= sectionTop - 100 && currentScroll < sectionTop + sectionHeight - 100) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    }
  });
});

console.log('✓ Navigation module loaded');
