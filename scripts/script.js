// Upgraded JS: GSAP powered reveals, cursor interactions, hover 3D, parallax, selection pulse
(() => {
  // GSAP setup
  gsap.registerPlugin(ScrollTrigger);

  // Loading screen
  const loading = document.getElementById('loading');
  window.addEventListener('load', () => {
    gsap.to(loading, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        loading.style.display = 'none';
        document.body.classList.add('loaded');
      }
    });
  });

  // Basic DOM refs
  const cursor = document.getElementById('cursor');
  const ripple = document.getElementById('cursorRipple');
  const hoverTargets = document.querySelectorAll('.hover-target, .nav-link, .btn, .project-card, .skill-group, .project-media img, .contact-card, .step, .testimonial-card, .stat, .interest-item');

  // initial mouse position
  let mouse = {x: window.innerWidth/2, y: window.innerHeight/2};
  let pos = {x: mouse.x, y: mouse.y};

  // Smooth cursor motion using GSAP ticker
  function moveCursor(){
    pos.x += (mouse.x - pos.x) * 0.18;
    pos.y += (mouse.y - pos.y) * 0.18;
    gsap.set(cursor, {x: pos.x, y: pos.y});
    gsap.set(ripple, {x: mouse.x, y: mouse.y});
  }
  gsap.ticker.add(moveCursor);

  window.addEventListener('mousemove', (e)=>{
    mouse.x = e.clientX; 
    mouse.y = e.clientY;
  });

  // click: shrink briefly
  window.addEventListener('mousedown', ()=>{
    gsap.to(cursor, {scale:0.5, duration:0.12, ease:'power3.out'});
    // ripple
    gsap.fromTo(ripple, {opacity:0.8, scale:0.3}, {opacity:0, scale:1.6, duration:0.7, ease:'power2.out'});
  });
  window.addEventListener('mouseup', ()=>{
    gsap.to(cursor, {scale:1, duration:0.28, ease:'elastic.out(1,0.6)'});
  });

  // Enhanced Hover interactions
  hoverTargets.forEach(el=>{
    el.addEventListener('mouseenter', ()=>{
      // Different hover effects based on element type
      if (el.classList.contains('step') || el.classList.contains('testimonial-card')) {
        gsap.to(el, {y:-12, duration:0.45, ease:'power3.out'});
      } else if (el.classList.contains('stat') || el.classList.contains('interest-item')) {
        gsap.to(el, {y:-5, duration:0.3, ease:'power2.out'});
      } else {
        gsap.to(el, {y:-8, z:10, duration:0.38, ease:'power3.out'});
      }
      gsap.to(cursor, {scale:1.4, duration:0.18});
    });
    
    el.addEventListener('mouseleave', ()=>{
      gsap.to(el, {y:0, z:0, duration:0.45, ease:'power3.out'});
      gsap.to(cursor, {scale:1, duration:0.25});
    });
  });

  // Reveal animations for all elements with .reveal
  gsap.utils.toArray('.reveal').forEach(el=>{
    gsap.fromTo(el, {y:25, autoAlpha:0}, {
      y:0, 
      autoAlpha:1, 
      duration:1.1, 
      ease:'power3.out',
      scrollTrigger:{
        trigger:el, 
        start:'top 85%', 
        toggleActions:'play none none none',
        markers: false // Set to true for debugging
      }
    });
  });

  // Staggered reveal for project cards
  ScrollTrigger.batch('.projects-grid .project-card', {
    interval: 0.12,
    batchMax: 6,
    onEnter: batch => gsap.to(batch, {
      y: 0, 
      autoAlpha: 1, 
      stagger: 0.1, 
      duration: 0.9, 
      ease: 'power3.out'
    }),
    onLeave: batch => gsap.to(batch, {autoAlpha:0}),
    start: 'top 85%'
  });

  // Staggered reveal for process steps
  ScrollTrigger.batch('.process-steps .step', {
    interval: 0.15,
    onEnter: batch => gsap.to(batch, {
      y: 0, 
      autoAlpha: 1, 
      stagger: 0.2, 
      duration: 1, 
      ease: 'power3.out'
    }),
    start: 'top 80%'
  });

  // Staggered reveal for testimonials
  ScrollTrigger.batch('.testimonials-grid .testimonial-card', {
    interval: 0.1,
    onEnter: batch => gsap.to(batch, {
      y: 0, 
      autoAlpha: 1, 
      stagger: 0.15, 
      duration: 0.8, 
      ease: 'power3.out'
    }),
    start: 'top 85%'
  });

  // Parallax: elements with data-parallax
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  window.addEventListener('scroll', ()=>{
    parallaxEls.forEach(el=>{
      const factor = parseFloat(el.dataset.parallax) || 0.02;
      const offset = window.scrollY * factor;
      gsap.to(el, {y: offset, duration: 0.6, ease: 'power1.out'});
    });
  });

  // Background blob subtle follow on mouse
  // Enhanced blob movement with mouse interaction
const blobs = document.querySelectorAll('.bg-blob');

// Random movement function
function randomMovement(blob) {
  const randomX = (Math.random() - 0.5) * 100;
  const randomY = (Math.random() - 0.5) * 100;
  const randomScale = 0.8 + Math.random() * 0.4;
  
  gsap.to(blob, {
    x: `+=${randomX}`,
    y: `+=${randomY}`,
    scale: randomScale,
    duration: 15 + Math.random() * 20,
    ease: "sine.inOut",
    onComplete: () => randomMovement(blob)
  });
}

// Initialize random movement for each blob
blobs.forEach((blob, index) => {
  // Stagger the start of animations
  gsap.delayedCall(index * 2, () => randomMovement(blob));
});

// Enhanced mouse follow with depth perception
window.addEventListener('mousemove', (e) => {
  if (window.innerWidth < 768) return; // Only on desktop
  
  const mouseX = (e.clientX / window.innerWidth - 0.5) * 80;
  const mouseY = (e.clientY / window.innerHeight - 0.5) * 80;
  
  blobs.forEach((blob, index) => {
    const depth = (index + 1) * 0.3; // Different sensitivity based on depth
    const moveX = mouseX * depth;
    const moveY = mouseY * depth;
    
    gsap.to(blob, {
      x: `+=${moveX * 0.1}`,
      y: `+=${moveY * 0.1}`,
      duration: 2,
      ease: "power2.out"
    });
  });
});

// Scroll-based blob movement
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const scrollFactor = scrollY * 0.05;
  
  blobs.forEach((blob, index) => {
    const scrollSensitivity = (index + 1) * 0.2;
    gsap.to(blob, {
      y: `-=${scrollFactor * scrollSensitivity}`,
      duration: 0.5,
      ease: "power1.out"
    });
  });
});

// Blob interaction on hover
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    blobs.forEach(blob => {
      gsap.to(blob, {
        scale: 1.2,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)"
      });
    });
  });
  
  el.addEventListener('mouseleave', () => {
    blobs.forEach(blob => {
      gsap.to(blob, {
        scale: 1,
        duration: 1,
        ease: "elastic.out(1, 0.5)"
      });
    });
  });
});

// Resize handler to keep blobs in view
window.addEventListener('resize', () => {
  blobs.forEach(blob => {
    // Reset positions if they go too far off screen
    const rect = blob.getBoundingClientRect();
    if (rect.left < -500 || rect.top < -500 || 
        rect.left > window.innerWidth + 500 || 
        rect.top > window.innerHeight + 500) {
      gsap.set(blob, {
        x: Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2,
        y: Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.2
      });
    }
  });
});

  // Hide cursor on inactivity
  let idleTimer;
  function resetIdle(){
    clearTimeout(idleTimer);
    gsap.to(cursor, {autoAlpha:1, duration:0.4});
    idleTimer = setTimeout(()=>gsap.to(cursor, {autoAlpha:0, duration:0.9}), 3000);
  }
  window.addEventListener('mousemove', resetIdle);
  resetIdle();

  // Text selection pulse
  document.addEventListener('selectionchange', ()=>{
    const sel = document.getSelection().toString();
    if(sel && sel.length>0){
      gsap.fromTo(cursor, {scale:1}, {
        scale:1.9, 
        duration:0.28, 
        yoyo:true, 
        repeat:1, 
        ease:'power2.out'
      });
    }
  });

  // Prevent native pointer showing on interactive elements
  document.querySelectorAll('a, button, input, textarea, label').forEach(el=>{
    el.style.cursor = 'none';
  });

  // Smooth nav scroll with offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if(!target) return;
      
      const headerHeight = document.querySelector('.site-header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  // Mobile-specific fixes
function initMobileFixes() {
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    // Remove cursor elements
    const cursor = document.getElementById('cursor');
    const ripple = document.getElementById('cursorRipple');
    if (cursor) cursor.style.display = 'none';
    if (ripple) ripple.style.display = 'none';
    
    // Restore default cursor
    document.body.style.cursor = 'auto';
    
    // Add mobile-specific class
    document.body.classList.add('mobile-device');
    
    // Simplify animations for mobile
    gsap.registerEffect({
      name: "mobileReveal",
      effect: (targets, config) => {
        return gsap.fromTo(targets, 
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" }
        );
      },
      defaults: { duration: 0.6 }
    });
  }
}

// Initialize mobile fixes when DOM loads
document.addEventListener('DOMContentLoaded', initMobileFixes);
window.addEventListener('resize', initMobileFixes);

// Touch-friendly hover alternatives
document.querySelectorAll('.hover-target').forEach(el => {
  el.addEventListener('touchstart', function() {
    this.classList.add('touch-active');
  });
  
  el.addEventListener('touchend', function() {
    setTimeout(() => {
      this.classList.remove('touch-active');
    }, 150);
  });
});

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Stats counter animation
  const stats = document.querySelectorAll('.number');
  stats.forEach(stat => {
    const target = parseInt(stat.textContent);
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      stat.textContent = Math.floor(current) + (stat.textContent.includes('%') ? '%' : '+');
    }, 60);
  });

  // Accessibility: ensure focus outlines visible for keyboard users
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Tab'){
      document.documentElement.classList.add('show-focus');
    }
  });

  // Mobile detection and cursor disable
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  }

  if (isMobile()) {
    cursor.style.display = 'none';
    ripple.style.display = 'none';
    document.body.style.cursor = 'auto';
  }

})();