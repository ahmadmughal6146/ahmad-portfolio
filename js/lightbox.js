/**
 * Muhammad Ahmad Portfolio - Fullscreen Lightbox & Project Details Modal
 */

class ProjectLightbox {
  constructor() {
    this.modal = document.getElementById('project-modal');
    this.closeBtn = document.getElementById('modal-close');
    this.currentProjectIndex = 0;
    this.currentGalleryIndex = 0;
    this.activeProjects = PORTFOLIO_DATA;
    this.init();
  }

  init() {
    if (!this.modal) return;

    this.closeBtn?.addEventListener('click', () => this.close());
    
    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // Keyboard support (Escape, ArrowLeft, ArrowRight)
    window.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowRight') this.nextGalleryImage();
      if (e.key === 'ArrowLeft') this.prevGalleryImage();
    });

    // Delegate project card review/click triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-project]');
      if (trigger) {
        e.preventDefault();
        const projectId = trigger.dataset.openProject;
        this.open(projectId);
      }
    });
  }

  open(projectId) {
    const project = PORTFOLIO_DATA.find(p => p.id === projectId);
    if (!project) return;

    this.currentProjectIndex = PORTFOLIO_DATA.indexOf(project);
    this.currentGalleryIndex = 0;
    this.render(project);
    
    this.modal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  close() {
    this.modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  render(project) {
    const modalBody = document.getElementById('modal-content-wrapper');
    if (!modalBody) return;

    const galleryThumbnails = project.gallery.map((img, idx) => `
      <button class="thumb-btn ${idx === 0 ? 'active' : ''}" data-thumb-index="${idx}" aria-label="View slide ${idx + 1}">
        <img src="${img}" alt="${project.title} preview ${idx + 1}" loading="lazy" />
      </button>
    `).join('');

    const deliverablesList = project.deliverables.map(d => `
      <li>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${d}</span>
      </li>
    `).join('');

    const toolsTags = project.tools.map(t => `<span class="tool-tag">${t}</span>`).join('');

    modalBody.innerHTML = `
      <div class="modal-grid">
        <!-- Visual Gallery Side -->
        <div class="modal-visual-side">
          <div class="main-gallery-view">
            <img id="active-gallery-image" src="${project.gallery[0]}" alt="${project.title}" />
            <div class="gallery-nav-overlay">
              <button id="gallery-prev" class="gallery-arrow" aria-label="Previous image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button id="gallery-next" class="gallery-arrow" aria-label="Next image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
            <span class="gallery-counter"><span id="curr-img-num">1</span> / ${project.gallery.length}</span>
          </div>
          <div class="gallery-thumbnails">
            ${galleryThumbnails}
          </div>
        </div>

        <!-- Project Meta & Story Side -->
        <div class="modal-info-side">
          <div class="project-badge-row">
            <span class="category-pill">${project.categoryLabel}</span>
            <span class="year-pill">${project.year}</span>
          </div>

          <h2 class="modal-project-title">${project.title}</h2>
          <p class="modal-tagline">${project.tagline}</p>

          <div class="meta-stats-grid">
            <div class="meta-stat-item">
              <span class="stat-label">Client</span>
              <span class="stat-val">${project.client}</span>
            </div>
            <div class="meta-stat-item">
              <span class="stat-label">Timeline</span>
              <span class="stat-val">${project.duration}</span>
            </div>
          </div>

          <div class="modal-section-block">
            <h3>Project Overview</h3>
            <p>${project.description}</p>
          </div>

          <div class="modal-section-block">
            <h3>Deliverables & Scope</h3>
            <ul class="deliverables-checklist">
              ${deliverablesList}
            </ul>
          </div>

          <div class="modal-section-block">
            <h3>Tools & Technologies</h3>
            <div class="tools-pills-wrap">
              ${toolsTags}
            </div>
          </div>

          ${project.highlight ? `
            <div class="modal-highlight-box">
              <span class="highlight-icon">⭐</span>
              <p>${project.highlight}</p>
            </div>
          ` : ''}

          <div class="modal-action-row">
            <a href="https://wa.me/923701768488?text=Hi%20Ahmad,%20I%20love%20your%20project%20'${encodeURIComponent(project.title)}'%20and%20would%20like%20to%20hire%20you!" target="_blank" class="btn btn-primary w-full">
              <span>Start a Project Like This</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>
      </div>
    `;

    // Bind thumbnail click events
    modalBody.querySelectorAll('.thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.thumbIndex, 10);
        this.setGalleryImage(project, idx);
      });
    });

    // Bind next/prev buttons
    modalBody.querySelector('#gallery-prev')?.addEventListener('click', () => this.prevGalleryImage());
    modalBody.querySelector('#gallery-next')?.addEventListener('click', () => this.nextGalleryImage());
  }

  setGalleryImage(project, index) {
    this.currentGalleryIndex = index;
    const imgEl = document.getElementById('active-gallery-image');
    const counterEl = document.getElementById('curr-img-num');
    if (imgEl) {
      imgEl.src = project.gallery[index];
    }
    if (counterEl) {
      counterEl.textContent = index + 1;
    }

    document.querySelectorAll('.thumb-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === index);
    });
  }

  nextGalleryImage() {
    const project = PORTFOLIO_DATA[this.currentProjectIndex];
    if (!project) return;
    const nextIdx = (this.currentGalleryIndex + 1) % project.gallery.length;
    this.setGalleryImage(project, nextIdx);
  }

  prevGalleryImage() {
    const project = PORTFOLIO_DATA[this.currentProjectIndex];
    if (!project) return;
    const prevIdx = (this.currentGalleryIndex - 1 + project.gallery.length) % project.gallery.length;
    this.setGalleryImage(project, prevIdx);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.portfolioLightbox = new ProjectLightbox();
});
