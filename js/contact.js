/**
 * Muhammad Ahmad Portfolio - Contact Handling, WhatsApp Instant Connect & Copy Clipboard
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Toast Notification Helper
  const showToast = (message, icon = '✓') => {
    let toast = document.getElementById('floating-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'floating-toast';
      toast.className = 'toast-alert';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-msg">${message}</span>`;
    toast.classList.add('visible');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  };

  window.showToast = showToast;

  // 2. Copy to Clipboard
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.dataset.copy;
      const label = btn.dataset.copyLabel || 'Text';

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`${label} copied to clipboard!`, '📋');
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`${label} copied!`, '📋');
      });
    });
  });

  // 3. Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('#contact-name').value.trim();
      const email = contactForm.querySelector('#contact-email').value.trim();
      const projectType = contactForm.querySelector('#contact-service').value;
      const message = contactForm.querySelector('#contact-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', '⚠️');
        return;
      }

      // Pre-compose WhatsApp Message
      const waMsg = `Hi Ahmad! I'm ${name} (${email}).%0A%0A*Service:* ${projectType}%0A*Message:* ${message}`;
      const waUrl = `https://wa.me/923701768488?text=${waMsg}`;

      // Show success modal / direct WhatsApp redirect
      showToast('Thank you! Redirecting to WhatsApp...', '🚀');
      
      setTimeout(() => {
        window.open(waUrl, '_blank');
        contactForm.reset();
      }, 1000);
    });
  }

  // 4. Live Lahore Time Tracker
  const updateLahoreTime = () => {
    const timeEl = document.getElementById('live-lahore-time');
    if (!timeEl) return;

    try {
      const options = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const lahoreTime = new Intl.DateTimeFormat('en-US', options).format(new Date());
      timeEl.textContent = lahoreTime + ' (PKT, UTC+5)';
    } catch (err) {
      timeEl.textContent = 'GMT+5 (Lahore, PK)';
    }
  };

  updateLahoreTime();
  setInterval(updateLahoreTime, 1000);
});
