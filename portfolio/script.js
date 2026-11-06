const socialProfiles = [
  { label: 'GitHub', href: 'https://github.com/sujankhaireni789-sketch', icon: 'fa-brands fa-github', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/girisujan2064/', icon: 'fa-brands fa-linkedin-in', external: true },
  { label: 'TikTok', href: 'https://www.tiktok.com/@sujangiri3633', icon: 'fa-brands fa-tiktok', external: true },
  { label: 'Email', href: 'mailto:girisujan2064@gmail.com', icon: 'fa-solid fa-envelope', external: false },
];

document.querySelectorAll('[data-social-links]').forEach((list) => {
  socialProfiles.forEach(({ label, href, icon, external }) => {
    const link = document.createElement('a');
    const iconElement = document.createElement('i');

    link.className = 'social-link';
    link.href = href;
    link.setAttribute('aria-label', label);
    link.title = label;
    if (external) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }

    iconElement.className = icon;
    iconElement.setAttribute('aria-hidden', 'true');
    link.append(iconElement);
    list.append(link);
  });
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');
const nav = document.querySelector('.nav');

if (nav && !document.querySelector('.theme-toggle')) {
  const themeToggle = document.createElement('button');
  themeToggle.type = 'button';
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Switch to light mode');
  themeToggle.setAttribute('aria-pressed', 'true');
  themeToggle.innerHTML = '<span class="theme-toggle-icon" aria-hidden="true">☀</span><span class="theme-toggle-text">Light</span>';
  nav.appendChild(themeToggle);
}

const themeToggleButton = document.querySelector('.theme-toggle');
const themeStorageKey = 'portfolio-theme-v2';
const getPreferredTheme = () => {
  const storedTheme = localStorage.getItem(themeStorageKey);
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }

  return 'dark';
};

const applyTheme = (theme) => {
  const isDark = theme === 'dark';
  document.body.setAttribute('data-theme', theme);

  if (themeToggleButton) {
    const text = themeToggleButton.querySelector('.theme-toggle-text');
    const icon = themeToggleButton.querySelector('.theme-toggle-icon');

    themeToggleButton.setAttribute('aria-pressed', String(isDark));
    themeToggleButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    if (text) text.textContent = isDark ? 'Light' : 'Dark';
    if (icon) icon.textContent = isDark ? '☀' : '☾';
    themeToggleButton.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  localStorage.setItem(themeStorageKey, theme);
};

if (themeToggleButton) {
  applyTheme(getPreferredTheme());
  themeToggleButton.addEventListener('click', () => {
    const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

const journeyTabs = document.querySelectorAll('.journey-tab');
const journeyPanels = document.querySelectorAll('.about-journey-panel');

const syncJourneyState = (selectedTabName) => {
  journeyTabs.forEach((button) => {
    const isActive = button.dataset.journey === selectedTabName;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
    button.setAttribute('aria-selected', String(isActive));
  });

  journeyPanels.forEach((panel) => {
    const isVisible = panel.dataset.panel === selectedTabName;
    panel.classList.toggle('is-active', isVisible);
    panel.hidden = !isVisible;
    panel.setAttribute('aria-hidden', String(!isVisible));
  });
};

const initialJourneyTab = document.querySelector('.journey-tab.is-active');
syncJourneyState(initialJourneyTab ? initialJourneyTab.dataset.journey : null);

journeyTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const isAlreadyActive = tab.classList.contains('is-active');
    syncJourneyState(isAlreadyActive ? null : tab.dataset.journey);
  });
});

if (menuButton) {
  menuButton.addEventListener('click', () => {
    if (!navigation) return;

    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation?.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      navigation.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    }
  });
}

document.querySelectorAll('#download-cv, #download-cv-footer').forEach((button) => {
  button.addEventListener('click', () => window.print());
});

document.querySelectorAll('#year').forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const roleRotator = document.querySelector('[data-role-rotator]');

if (roleRotator && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const roles = [
    'Web Developer',
    'IT Student',
    'Sports Coordinator',
    'Hostel Manager',
    'Documentation Manager',
    'Lab Technician',
    'Marketing & Sales',
  ];
  let activeRoleIndex = roles.indexOf(roleRotator.textContent.trim());

  window.setInterval(() => {
    roleRotator.classList.remove('is-entering');
    roleRotator.classList.add('is-leaving');

    window.setTimeout(() => {
      activeRoleIndex = (activeRoleIndex + 1) % roles.length;
      roleRotator.textContent = roles[activeRoleIndex];
      roleRotator.classList.remove('is-leaving');
      roleRotator.classList.add('is-entering');
      window.setTimeout(() => roleRotator.classList.remove('is-entering'), 360);
    }, 220);
  }, 3000);
}

const contactForm = document.querySelector('#contact-form');
const contactMessage = document.querySelector('#contact-message');
const messageCount = document.querySelector('#message-count');

if (contactForm && contactMessage && messageCount) {
  contactMessage.addEventListener('input', () => {
    messageCount.textContent = contactMessage.value.length;
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.querySelector('#form-status');
    const submitButton = contactForm.querySelector('[type="submit"]');
    const endpoint = new URL(contactForm.action, window.location.href);

    submitButton.disabled = true;
    status.textContent = 'Sending your message...';

    try {
      const tokenResponse = await fetch(new URL('csrf-token.php', endpoint), {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      });
      const tokenResult = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenResult.token) {
        throw new Error('Could not start a secure form session. Please try again.');
      }

      const formData = new FormData(contactForm);
      formData.set('csrf_token', tokenResult.token);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Your message could not be sent. Please try again.');
      }

      status.textContent = result.message;
      contactForm.reset();
      messageCount.textContent = '0';
    } catch (error) {
      status.textContent = error.message || 'A network error occurred. Please try again.';
    } finally {
      submitButton.disabled = false;
    }
  });
}

const projectFilterButtons = document.querySelectorAll('[data-project-filter]');
const projectCards = document.querySelectorAll('.project[data-category]');

projectFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.projectFilter;

    projectFilterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle('is-active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    });

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(/\s+/);
      card.hidden = selectedFilter !== 'all' && !categories.includes(selectedFilter);
    });
  });
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0 });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}
