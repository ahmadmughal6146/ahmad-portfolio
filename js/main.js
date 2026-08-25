/**
 * MUHAMMAD AHMAD (AHMAD GRAPHIXS GFX) - ADVANCED ENGINE & ANIMATIONS
 * Preloader, Particle Canvas, Scroll Reveals, 3D Tilts, Magnetic Physics,
 * Portfolio Grid, Dynamic Typewriter, Theme Switcher & Stats Counters
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. INTRO PRELOADER ANIMATION
  // ==========================================
  const preloader = document.getElementById('site-preloader');
  const preloaderBar = document.getElementById('preloader-bar-fill');
  const preloaderPct = document.getElementById('preloader-pct');

  let loadProgress = 0;
  const progressInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 18) + 12;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(progressInterval);
      if (preloaderBar) preloaderBar.style.width = '100%';
      if (preloaderPct) preloaderPct.textContent = '100%';

      setTimeout(() => {
        preloader?.classList.add('loaded');
        document.body.classList.remove('modal-open');
        initScrollReveals();
      }, 500);
    } else {
      if (preloaderBar) preloaderBar.style.width = `${loadProgress}%`;
      if (preloaderPct) preloaderPct.textContent = `${loadProgress}%`;
    }
  }, 40);

  // Fallback if load takes longer
  window.addEventListener('load', () => {
    loadProgress = 100;
    if (preloaderBar) preloaderBar.style.width = '100%';
    if (preloaderPct) preloaderPct.textContent = '100%';
    setTimeout(() => {
      preloader?.classList.add('loaded');
      initScrollReveals();
    }, 400);
  });

  // ==========================================
  // 2. BACKGROUND PARTICLE CANVAS ENGINE
  // ==========================================
  const initParticleCanvas = () => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = window.innerWidth < 768 ? 35 : 75;

    const getThemeColor = () => {
      const currentTheme = document.documentElement.className;
      if (currentTheme.includes('theme-cyberpunk')) return { r: 0, g: 240, b: 255 };
      if (currentTheme.includes('theme-gold')) return { r: 234, g: 179, b: 8 };
      return { r: 255, g: 189, b: 89 }; // Obsidian Amber
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        const color = getThemeColor();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      const color = getThemeColor();

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${(1 - dist / 120) * 0.22})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Connect to mouse
        const mdx = particles[i].x - mouseX;
        const mdy = particles[i].y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${(1 - mdist / 150) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      requestAnimationFrame(animateParticles);
    };

    animateParticles();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  };

  initParticleCanvas();

  // ==========================================
  // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================
  const initScrollReveals = () => {
    const revealElements = document.querySelectorAll('.reveal-init, .reveal-slide-left, .reveal-slide-right, .reveal-zoom-in');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => observer.observe(el));
  };

  // ==========================================
  // 4. 3D TILT EFFECT ON CARDS
  // ==========================================
  const initTiltCards = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return; // Skip touch devices

    const tiltCards = document.querySelectorAll('.project-card, .skill-category-card, .about-highlight-card, .hero-visual-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease-out';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  };

  // ==========================================
  // 5. MAGNETIC BUTTONS EFFECT
  // ==========================================
  const initMagneticButtons = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const magneticBtns = document.querySelectorAll('.magnetic-btn, .theme-toggle-btn, .brand-logo');

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'none';
      });
    });
  };

  initMagneticButtons();

  // ==========================================
  // 6. RENDER PORTFOLIO GRID
  // ==========================================
  const renderPortfolioGrid = (category = 'all') => {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    const filtered = category === 'all'
      ? PORTFOLIO_DATA
      : PORTFOLIO_DATA.filter(p => p.category === category);

    grid.innerHTML = filtered.map((project, idx) => `
      <div class="project-card reveal-init delay-${(idx % 4 + 1) * 100}" data-category="${project.category}">
        <div class="card-media-wrapper">
          <img src="${project.thumbnail}" alt="${project.title}" loading="lazy" class="card-img" />
          <div class="card-overlay">
            <button class="btn btn-review magnetic-btn" data-open-project="${project.id}">
              <span>Review Project</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
          <span class="category-badge">${project.categoryLabel}</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">${project.title}</h3>
          <p class="card-tagline">${project.tagline}</p>
          <div class="card-footer">
            <div class="card-tools">
              ${project.tools.slice(0, 2).map(t => `<span class="mini-tag">${t}</span>`).join('')}
            </div>
            <button class="card-link-btn magnetic-btn" data-open-project="${project.id}" aria-label="Open ${project.title}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    initScrollReveals();
    initTiltCards();
    initMagneticButtons();
  };

  renderPortfolioGrid('all');

  // Filter Buttons
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.filter;
      renderPortfolioGrid(cat);
    });
  });

  // ==========================================
  // 7. RENDER SKILLS MATRIX
  // ==========================================
  const renderSkills = () => {
    const skillsContainer = document.getElementById('skills-matrix-grid');
    if (!skillsContainer) return;

    skillsContainer.innerHTML = SKILLS_DATA.map((group, gIdx) => `
      <div class="skill-category-card reveal-init delay-${(gIdx + 1) * 100}">
        <div class="skill-cat-header">
          <span class="cat-icon-badge">${group.icon}</span>
          <h3 class="skill-cat-title">${group.category}</h3>
        </div>
        <div class="skill-items-list">
          ${group.skills.map(skill => `
            <div class="skill-item">
              <div class="skill-info-row">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-pct">${skill.level}%</span>
              </div>
              <div class="skill-bar-track">
                <div class="skill-bar-fill" style="width: 0%" data-fill="${skill.level}%"></div>
              </div>
              <span class="skill-subtag">${skill.tag}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Animate skill bars when in view
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.fill;
          });
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-category-card').forEach(card => skillObserver.observe(card));
  };

  renderSkills();

  // ==========================================
  // 8. RENDER TESTIMONIALS
  // ==========================================
  const renderTestimonials = () => {
    const testContainer = document.getElementById('testimonials-slider');
    if (!testContainer) return;

    testContainer.innerHTML = TESTIMONIALS.map((t, idx) => `
      <div class="testimonial-card reveal-init delay-${(idx + 1) * 100}">
        <div class="test-header">
          <img src="${t.avatar}" alt="${t.name}" class="test-avatar" />
          <div>
            <h4 class="test-name">${t.name}</h4>
            <span class="test-role">${t.role}</span>
          </div>
        </div>
        <div class="test-stars">★★★★★</div>
        <p class="test-quote">"${t.text}"</p>
      </div>
    `).join('');
  };

  renderTestimonials();

  // ==========================================
  // 9. NAVBAR SCROLL SPY & PROGRESS
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    const scrollPos = window.scrollY + 160;

    const navbar = document.querySelector('.header-nav');
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    const progressEl = document.getElementById('scroll-progress-bar');
    if (progressEl) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = (window.scrollY / docHeight) * 100;
      progressEl.style.width = `${pct}%`;
    }

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const mobileNavMenu = document.getElementById('nav-menu-links');

  if (mobileMenuBtn && mobileNavMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileNavMenu.classList.toggle('mobile-open');
    });

    mobileNavMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileNavMenu.classList.remove('mobile-open');
      });
    });
  }

  // ==========================================
  // 10. DYNAMIC TYPEWRITER IN HERO
  // ==========================================
  const roles = [
    'Graphic Designer',
    'Frontend Developer',
    'Social Media Manager',
    'Brand Identity Architect'
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typewriterEl = document.getElementById('hero-typewriter');

  const typeEffect = () => {
    if (!typewriterEl) return;
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typewriterEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typewriterEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 40 : 90;

    if (!isDeleting && charIdx === currentRole.length) {
      typeSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
  };

  typeEffect();

  // ==========================================
  // 11. THEME SWITCHER
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themes = ['theme-obsidian', 'theme-gold', 'theme-cyberpunk'];
  let currentThemeIdx = 0;

  const updateLogoForTheme = (theme) => {
    const logoImgs = document.querySelectorAll('.brand-logo-img, .preloader-logo-img');
    const logoSrc = theme === 'theme-cyberpunk' 
      ? 'assets/images/brand-logo-cyber.png' 
      : 'assets/images/brand-logo-gold.png';
    logoImgs.forEach(img => { img.src = logoSrc; });
  };

  const savedTheme = localStorage.getItem('ahmad_portfolio_theme') || 'theme-obsidian';
  document.documentElement.className = savedTheme;
  currentThemeIdx = themes.indexOf(savedTheme) !== -1 ? themes.indexOf(savedTheme) : 0;
  updateLogoForTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentThemeIdx = (currentThemeIdx + 1) % themes.length;
      const nextTheme = themes[currentThemeIdx];
      document.documentElement.className = nextTheme;
      localStorage.setItem('ahmad_portfolio_theme', nextTheme);
      updateLogoForTheme(nextTheme);
      
      const themeNames = {
        'theme-obsidian': 'Dark Obsidian',
        'theme-gold': 'Luxe Gold',
        'theme-cyberpunk': 'Cyberpunk Neon'
      };
      window.showToast?.(`Theme changed to ${themeNames[nextTheme]}`, '🎨');
    });
  }

  // ==========================================
  // 12. STATS COUNTER ON SCROLL
  // ==========================================
  const statsSection = document.getElementById('stats-counter-section');
  let statsCounted = false;

  const countUp = () => {
    if (statsCounted || !statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      statsCounted = true;
      document.querySelectorAll('.counter-number').forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        let count = 0;
        const speed = target / 40;
        const update = () => {
          count += speed;
          if (count < target) {
            counter.textContent = Math.ceil(count);
            requestAnimationFrame(update);
          } else {
            counter.textContent = target + (counter.dataset.suffix || '');
          }
        };
        update();
      });
    }
  };

  window.addEventListener('scroll', countUp, { passive: true });
  countUp();

  // ==========================================
  // 13. CUSTOM GLOWING CURSOR FOLLOWER
  // ==========================================
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');

    if (cursor && cursorDot) {
      window.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
        cursorDot.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      });

      document.querySelectorAll('a, button, input, select, textarea, .project-card, .skill-category-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
      });
    }
  }

  // ==========================================
  // 14. PAGE EXIT / LEAVE TRANSITION
  // ==========================================
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.target === '_blank') return;
      document.body.style.opacity = '0.4';
      document.body.style.transition = 'opacity 0.3s ease';
    });
  });

  // Initialize Tilt and Reveals
  initScrollReveals();
  initTiltCards();
});
