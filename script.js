// Flutter Lab Exam Web Portal Script

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCopyButtons();
  initSearch();
  initActiveNav();
});

// 1. Theme Toggle (Dark / Light)
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('flutter_exam_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('flutter_exam_theme', newTheme);
  });
}

// 2. Copy Code to Clipboard with Toast and Button Feedback
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');
  let toastTimer = null;

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-copy-target');
      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;

      const codeText = codeEl.innerText.trim();

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(codeText);
        } else {
          // Fallback
          const textArea = document.createElement('textarea');
          textArea.value = codeText;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        // Button state update
        const originalContent = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Copied!</span>
        `;

        // Toast notification
        toast.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.classList.remove('show');
        }, 2200);

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalContent;
        }, 2000);

      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  });
}

// 3. Real-time Search & Filter
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');
  const setCards = document.querySelectorAll('.set-card');
  const quickstart = document.getElementById('quickstart');
  const noResults = document.getElementById('noResults');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query.length > 0) {
      clearBtn.style.display = 'block';
    } else {
      clearBtn.style.display = 'none';
    }

    let matchCount = 0;

    setCards.forEach(card => {
      const setTitle = card.querySelector('h2')?.innerText.toLowerCase() || '';
      const setDesc = card.querySelector('.card-desc')?.innerText.toLowerCase() || '';
      const setNumber = card.getAttribute('data-set') || '';
      const tags = card.getAttribute('data-tags') || '';

      const isMatch = setTitle.includes(query) ||
                      setDesc.includes(query) ||
                      setNumber.includes(query) ||
                      tags.includes(query) ||
                      `set ${setNumber}`.includes(query);

      if (isMatch) {
        card.style.display = '';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Handle Quickstart visibility during search
    if (query.length > 0 && !'quickstart commands workflow bash'.includes(query)) {
      quickstart.style.display = 'none';
    } else {
      quickstart.style.display = '';
    }

    // No results feedback
    if (matchCount === 0 && query.length > 0) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
    }
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
  });
}

// 4. ScrollSpy / Active Nav Link Highlighting
function initActiveNav() {
  const sections = document.querySelectorAll('main section, main article');
  const navItems = document.querySelectorAll('.nav-links .nav-item');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}
