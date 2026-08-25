/**
 * Muhammad Ahmad Portfolio - Main Engine
 * Smooth navigation, project grid rendering, filters, theme toggle, stats counter, custom cursor
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Render Portfolio Grid
  const renderPortfolioGrid = (category = 'all') => {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    const filtered = category === 'all'
      ? PORTFOLIO_DATA
      : PORTFOLIO_DATA.filter(p => p.category === category);

    grid.innerHTML = filtered.map((project, idx) => `
      <div class="project-card" data-category="${project.category}" style="animation-delay: ${idx * 0.1}s">
        <div class="card-media-wrapper">
          <img src="${project.thumbnail}" alt="${project.title}" loading="lazy" class="card-img" />
          <div class="card-overlay">
            <button class="btn btn-review" data-open-project="${project.id}">
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
            <button class="card-link-btn" data-open-project="${project.id}" aria-label="Open ${project.title}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');
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

  // 2. Render Skills Matrix
  const renderSkills = () => {
    const skillsContainer = document.getElementById('skills-matrix-grid');
    if (!skillsContainer) return;

    skillsContainer.innerHTML = SKILLS_DATA.map(group => `
      <div class="skill-category-card">
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
                <div class="skill-bar-fill" style="width: ${skill.level}%"></div>
              </div>
              <span class="skill-subtag">${skill.tag}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  };

  renderSkills();

  // 3. Render Testimonials
  const renderTestimonials = () => {
    const testContainer = document.getElementById('testimonials-slider');
    if (!testContainer) return;

    testContainer.innerHTML = TESTIMONIALS.map(t => `
      <div class="testimonial-card">
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

  // 4. Smooth Scroll Spy & Navigation Highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    const scrollPos = window.scrollY + 160;

    // Navbar shadow & glass blur enhancement
    const navbar = document.querySelector('.header-nav');
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scroll progress bar
    const progressEl = document.getElementById('scroll-progress-bar');
    if (progressEl) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = (window.scrollY / docHeight) * 100;
      progressEl.style.width = `${pct}%`;
    }

    // Active Section Spy
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

  // 5. Dynamic Typewriter in Hero
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
      typeSpeed = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
  };

  typeEffect();

  // 6. Theme Switcher (Dark Obsidian / Gold Luxe / Cyberpunk Neon)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themes = ['theme-obsidian', 'theme-gold', 'theme-cyberpunk'];
  let currentThemeIdx = 0;

  const updateLogoForTheme = (theme) => {
    const logoImgs = document.querySelectorAll('.brand-logo-img');
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

  // 7. Interactive Stats Counter
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

  // 8. Custom Glowing Cursor Follower (Desktop only)
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');

    if (cursor && cursorDot) {
      window.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
        cursorDot.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      });

      document.querySelectorAll('a, button, input, select, textarea, .project-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
      });
    }
  }
});
