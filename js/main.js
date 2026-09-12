/**
 * ItsTimbob — Official Creator & VIP Host JavaScript
 * Includes:
 * 1. Animated Top Status Rotation with Live/Offline state
 * 2. IntersectionObserver Scroll Reveals (.reveal / .reveal-visible)
 * 3. Active Nav Link Tracking with Smooth Underline
 * 4. Interactive Accordions, Clipboard Copy & Smooth Scrolling
 */

document.addEventListener('DOMContentLoaded', () => {
  initSiteConfig();
  startHeroStatusRotator();
  initHeaderScroll();
  initKickLiveMonitor();
  initScrollReveals();
  initActiveNavHighlight();
  initMobileNav();
  initFaqAccordion();
  initEmailCopy();
  initAnimatedCounters();
  initNextStreamCountdown();
  initNotifyButton();
  initSmoothScroll();
  initTextScrambleEffect();
  initCardTiltEffect();
  initVipPromiseGlowSweep();
  initWtfCodeCopy();
});

/**
 * Hydrates all data-config elements from SITE_CONFIG
 */
function initSiteConfig() {
  if (typeof window.SITE_CONFIG === 'undefined') return;

  const cfg = window.SITE_CONFIG;

  // Hydrate Social & Platform Links
  const linkMappings = {
    'kick': cfg.kickUrl || 'https://kick.com/itstimbob',
    'x': cfg.xUrl,
    'discord': cfg.discordUrl,
    'telegram': cfg.telegramUrl,
    'email': `mailto:${cfg.contactEmail}`
  };

  Object.entries(linkMappings).forEach(([key, url]) => {
    if (!url) return;
    const elements = document.querySelectorAll(`[data-config-link="${key}"]`);
    elements.forEach(el => {
      el.setAttribute('href', url);
      if (!url.startsWith('mailto:')) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    });
  });

  /**
   * Fast "WTF" Letter-Loading Click Interaction for "JOIN WTF GAMES"
   * Animates the letters in sequence: W -> WT -> WTF with subtle neon-green glow,
   * then immediately opens the destination (approx 460ms total).
   */
  function triggerWtfSequence(button, targetUrl) {
    if (!button || button.dataset.loadingWtf === 'true') return;
    button.dataset.loadingWtf = 'true';
    button.style.pointerEvents = 'none';

    const originalHtml = button.innerHTML;
    const originalWidth = button.offsetWidth;
    button.style.minWidth = `${originalWidth}px`;

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      button.innerHTML = `<span class="wtf-loader-wrap"><span class="wtf-loader-text">WTF</span></span>`;
      setTimeout(() => {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
        setTimeout(() => {
          button.innerHTML = originalHtml;
          button.style.minWidth = '';
          button.style.pointerEvents = 'auto';
          delete button.dataset.loadingWtf;
        }, 500);
      }, 300);
      return;
    }

    button.classList.add('btn-wtf-loading');

    // Sequence: W -> WT -> WTF
    const setWtfText = (chars) => {
      button.innerHTML = `<span class="wtf-loader-wrap"><span class="wtf-loader-text wtf-char-pop">${chars}</span></span>`;
    };

    // Step 1: W (0ms)
    setWtfText('W');

    // Step 2: WT (140ms)
    setTimeout(() => {
      setWtfText('WT');
    }, 140);

    // Step 3: WTF (280ms)
    setTimeout(() => {
      setWtfText('WTF');
    }, 280);

    // Step 4: Fully displayed, immediately open destination (approx 460ms)
    setTimeout(() => {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');

      // Seamlessly restore original button state after navigation
      setTimeout(() => {
        button.classList.remove('btn-wtf-loading');
        button.innerHTML = originalHtml;
        button.style.minWidth = '';
        button.style.pointerEvents = 'auto';
        delete button.dataset.loadingWtf;
      }, 600);
    }, 460);
  }

  // WTF Games CTA Link Handling with Fast "WTF" Letter-Loading Interaction
  // Directly opens https://www.wtfgames.com in a new tab
  const wtfElements = document.querySelectorAll('[data-config-link="wtf"]');
  wtfElements.forEach(el => {
    el.removeAttribute('href');
    el.style.cursor = 'pointer';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    
    const clickHandler = (e) => {
      e.preventDefault();
      const targetUrl = window.SITE_CONFIG?.wtfReferralUrl?.trim() || 'https://www.wtfgames.com';
      triggerWtfSequence(el, targetUrl);
    };

    el.addEventListener('click', clickHandler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        clickHandler(e);
      }
    });
  });

  // Hydrate Text
  const textMappings = {
    'email': cfg.contactEmail,
    'brand': cfg.brandName,
    'tagline': cfg.tagline
  };

  Object.entries(textMappings).forEach(([key, val]) => {
    if (!val) return;
    const elements = document.querySelectorAll(`[data-config-text="${key}"]`);
    elements.forEach(el => {
      el.textContent = val;
    });
  });

  // Stream status initial setup from config
  if (cfg.stream) {
    const isLive = Boolean(cfg.stream.isLive);
    updateLiveStatus(isLive);
    if (cfg.stream.title) {
      const overlayTitle = document.getElementById('streamOverlayTitle');
      if (overlayTitle) overlayTitle.textContent = cfg.stream.title;
    }
    if (cfg.stream.category) {
      const overlayCategory = document.getElementById('streamOverlayCategory');
      if (overlayCategory) overlayCategory.textContent = cfg.stream.category;
    }
  }

  // Bonus & Reward Information hydration
  if (cfg.bonusReward) {
    const bonusBadge = document.querySelector('[data-config-text="bonusBadge"]');
    const bonusTitle = document.querySelector('[data-config-text="bonusTitle"]');
    const bonusDesc = document.querySelector('[data-config-text="bonusDesc"]');
    if (bonusBadge && cfg.bonusReward.badgeText) bonusBadge.textContent = cfg.bonusReward.badgeText;
    if (bonusTitle && cfg.bonusReward.title) bonusTitle.textContent = cfg.bonusReward.title;
    if (bonusDesc && cfg.bonusReward.description) bonusDesc.textContent = cfg.bonusReward.description;
  }
}

/**
 * Updates all status indicators to a single unified status:
 * 'Online' when live, or 'Offline' when inactive.
 */
function updateLiveStatus(isLive, streamData = {}) {
  const statusText = isLive ? 'Online' : 'Offline';
  const cfg = window.SITE_CONFIG || {};

  // 1. Stream Preview Card Badge
  const streamBadge = document.getElementById('streamStatusBadge');
  const streamBadgeText = document.getElementById('streamStatusText');
  const streamBadgeDot = document.getElementById('streamStatusDot');
  const centerPrompt = document.getElementById('streamCenterPrompt');
  const viewerText = document.getElementById('streamViewerText');
  const overlayTitle = document.getElementById('streamOverlayTitle');
  const overlayCategory = document.getElementById('streamOverlayCategory');

  if (streamBadge) {
    streamBadge.classList.remove(isLive ? 'offline' : 'live');
    streamBadge.classList.add(isLive ? 'live' : 'offline');
  }
  if (streamBadgeText) {
    streamBadgeText.textContent = statusText;
  }
  if (streamBadgeDot) {
    streamBadgeDot.className = `stream-status-dot ${isLive ? 'live' : 'offline'}`;
  }

  if (centerPrompt) {
    centerPrompt.textContent = isLive
      ? (cfg.stream?.liveText || 'Click to watch live on Kick')
      : (cfg.stream?.statusText || 'Stream is offline \u2014 check the schedule below');
  }

  if (viewerText) {
    if (isLive) {
      const count = streamData.viewers ?? cfg.stream?.viewers;
      viewerText.textContent = count ? `${Number(count).toLocaleString()} watching` : 'Watching now';
    } else {
      viewerText.textContent = 'Be the first';
    }
  }

  if (streamData.title && overlayTitle) {
    overlayTitle.textContent = streamData.title;
  }
  if (streamData.category && overlayCategory) {
    overlayCategory.textContent = streamData.category;
  }

  // 2. Hero Status Top Row (Matching original ItsTimbob reference structure)
  const statusDot = document.getElementById('statusDot');
  if (statusDot) {
    statusDot.classList.remove('live', 'offline');
    statusDot.classList.add(isLive ? 'live' : 'offline');
  }

  // Ensure hero rotator on the left side is actively cycling
  startHeroStatusRotator();
}

let heroRotatorTimer = null;
let heroRotatorIndex = 0;

/**
 * Rotates through the 4 live status phrases on the left side of the top status row:
 * 1. “I’M STREAMING”
 * 2. “LIVE NOW”
 * 3. “SPORTS & RECREATION”
 * 4. “SLOTS & GIVEAWAYS”
 */
function startHeroStatusRotator() {
  const rotatorWrap = document.getElementById('statusRotator');
  if (!rotatorWrap) return;
  const items = rotatorWrap.querySelectorAll('.status-rotator-item');
  if (items.length <= 1) return;

  if (heroRotatorTimer) return; // already active

  heroRotatorTimer = setInterval(() => {
    const currentItem = items[heroRotatorIndex];
    currentItem.classList.remove('active');
    currentItem.classList.add('exit');

    heroRotatorIndex = (heroRotatorIndex + 1) % items.length;
    const nextItem = items[heroRotatorIndex];

    nextItem.classList.remove('exit');
    void nextItem.offsetWidth; // Force reflow for smooth transition
    nextItem.classList.add('active');

    setTimeout(() => {
      currentItem.classList.remove('exit');
    }, 550);
  }, 2600);
}

function stopHeroStatusRotator() {
  if (heroRotatorTimer) {
    clearInterval(heroRotatorTimer);
    heroRotatorTimer = null;
  }
}

/**
 * 2. AUTOMATED KICK LIVE STATUS MONITOR
 * Automatically polls and updates the single status ('Online' or 'Offline')
 * based on live Kick channel status.
 */
function initKickLiveMonitor() {
  const cfg = window.SITE_CONFIG || {};
  const channel = (cfg.stream && cfg.stream.channel) || 'itstimbob';

  // Support URL query parameter override for easy live testing/demo (?live=true, ?live=false, ?status=offline, ?status=online)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('live')) {
    const forcedLive = urlParams.get('live') === 'true' || urlParams.get('live') === '1';
    updateLiveStatus(forcedLive, {
      viewers: forcedLive ? 1280 : 0,
      title: forcedLive ? 'Live on Kick \u2014 Weekend Slate & Reactions' : undefined
    });
    return;
  }
  if (urlParams.has('status')) {
    const forcedLive = urlParams.get('status') === 'online' || urlParams.get('status') === 'live';
    updateLiveStatus(forcedLive);
    return;
  }
}

/**
 * 3. SCROLL-REVEAL ANIMATIONS (IntersectionObserver)
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  // Check if browser supports IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('reveal-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Active Navigation Link Highlight on Scroll
 */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Sticky header glass blur on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Drawer Navigation
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileBackdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    toggleBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    toggleBtn.classList.remove('active');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  const drawerFooterLinks = drawer.querySelectorAll('.mobile-drawer-footer a');
  drawerFooterLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/**
 * Interactive FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-card, .faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-btn, .faq-question');
    const answer = item.querySelector('.faq-body, .faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-body, .faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
          const otherBtn = otherItem.querySelector('.faq-btn, .faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Copy Email to Clipboard with Toast Notification
 */
function initEmailCopy() {
  const triggers = document.querySelectorAll('#copyEmailCard, #copyEmailBtn');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  triggers.forEach(el => {
    el.addEventListener('click', async () => {
      const email = window.SITE_CONFIG ? window.SITE_CONFIG.contactEmail : 'hey@timbob.space';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        showToast('Email copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
        showToast(`Email: ${email}`);
      }
    });
  });
}



/**
 * Animated Number Counters (0 to Target Value)
 * Executes once per page load when element enters viewport (~1.0s to 1.5s duration)
 */
function initAnimatedCounters() {
  const elements = document.querySelectorAll(
    '.commission-pct, .creator-stat-value, .hero-stat-val, [data-counter]'
  );

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function parseTarget(text) {
    const clean = text.trim();
    // Match "70%", "10%", "100%"
    let m = clean.match(/^(\d+)(%)$/);
    if (m) return { start: 0, end: parseInt(m[1], 10), prefix: '', suffix: '%' };
    // Match "3x", "3×"
    m = clean.match(/^(\d+)([x×])$/i);
    if (m) return { start: 0, end: parseInt(m[1], 10), prefix: '', suffix: m[2] };
    // Match "24/7"
    m = clean.match(/^(\d+)(\/7)$/);
    if (m) return { start: 0, end: parseInt(m[1], 10), prefix: '', suffix: '/7' };
    // Pure integer
    m = clean.match(/^(\d+)$/);
    if (m) return { start: 0, end: parseInt(m[1], 10), prefix: '', suffix: '' };
    return null;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      obs.unobserve(el); // Only run once per page load!

      const targetData = el.dataset.counterTarget;
      if (!targetData) return;
      const parsed = parseTarget(targetData);
      if (!parsed) return;

      const card = el.closest('.commission-card');
      const barFill = card ? card.querySelector('.commission-bar-fill') : null;
      const targetPct = parsed.suffix === '%' ? parsed.end : 0;

      if (prefersReduced) {
        el.textContent = `${parsed.prefix}${parsed.end}${parsed.suffix}`;
        if (barFill) barFill.style.width = `${targetPct}%`;
        return;
      }

      const duration = 1250; // 1.25 seconds duration
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth easeOutCubic curve
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(parsed.start + (parsed.end - parsed.start) * ease);

        el.textContent = `${parsed.prefix}${current}${parsed.suffix}`;

        if (barFill) {
          barFill.style.width = `${(targetPct * ease).toFixed(1)}%`;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = `${parsed.prefix}${parsed.end}${parsed.suffix}`;
          if (barFill) barFill.style.width = `${targetPct}%`;
        }
      }

      requestAnimationFrame(step);
    });
  }, {
    threshold: 0.25
  });

  elements.forEach(el => {
    const parsed = parseTarget(el.textContent);
    if (parsed) {
      el.dataset.counterTarget = el.textContent.trim();
      if (!prefersReduced) {
        el.textContent = `${parsed.prefix}0${parsed.suffix}`;
        const card = el.closest('.commission-card');
        const barFill = card ? card.querySelector('.commission-bar-fill') : null;
        if (barFill) {
          barFill.style.width = '0%';
        }
      }
      observer.observe(el);
    }
  });
}

/**
 * Shared Toast Notification
 */
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast) return;
  if (toastMsg) toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * Get Notified Button Handler
 */
function initNotifyButton() {
  const notifyBtn = document.querySelector('[data-notify-btn]');
  if (!notifyBtn) return;
  notifyBtn.addEventListener('click', () => {
    showToast('🔔 Join Discord to get pinged the second ItsTimbob goes live!');
  });
}

/**
 * Smooth scroll with active nav highlight
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * NEXT STREAM Live Countdown Feature
 * Confirmed Schedule:
 * - Tuesday — 3 PM PST — Recreation & Takes
 * - Thursday — 3 PM PST — Slots & Nights
 * - Sunday — 12 PM PST — Game Day (FEATURED)
 * All times PST
 */
function initNextStreamCountdown() {
  const banner = document.getElementById('nextStreamBanner');
  if (!banner) return;

  const dayEl = document.getElementById('nextStreamDay');
  const timeEl = document.getElementById('nextStreamTime');
  const topicEl = document.getElementById('nextStreamTopic');
  const featuredEl = document.getElementById('nextStreamFeatured');
  const timerLabelEl = document.getElementById('nextStreamTimerLabel');
  const countdownEl = document.getElementById('nextStreamCountdown');
  const secsEl = document.getElementById('nextStreamSecs');
  const badgeEl = document.getElementById('nextStreamBadge');

  const SCHEDULE = [
    {
      dayName: 'Tuesday',
      dayIndex: 2,
      hour: 15,
      minute: 0,
      timeText: '3 PM PST',
      title: 'Recreation & Takes',
      featured: false
    },
    {
      dayName: 'Thursday',
      dayIndex: 4,
      hour: 15,
      minute: 0,
      timeText: '3 PM PST',
      title: 'Slots & Nights',
      featured: false
    },
    {
      dayName: 'Sunday',
      dayIndex: 0,
      hour: 12,
      minute: 0,
      timeText: '12 PM PST',
      title: 'Game Day',
      featured: true
    }
  ];

  // 2.5 hour stream window (9000 seconds)
  const STREAM_DURATION_SEC = 9000;

  function getPacificNow() {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        weekday: 'short',
        hour12: false
      });
      const parts = formatter.formatToParts(new Date());
      const p = {};
      for (const part of parts) {
        p[part.type] = part.value;
      }
      const daysMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return {
        dayOfWeek: daysMap[p.weekday] ?? new Date().getDay(),
        hour: parseInt(p.hour, 10) % 24,
        minute: parseInt(p.minute, 10),
        second: parseInt(p.second, 10)
      };
    } catch (e) {
      const d = new Date();
      return {
        dayOfWeek: d.getDay(),
        hour: d.getHours(),
        minute: d.getMinutes(),
        second: d.getSeconds()
      };
    }
  }

  function update() {
    const pac = getPacificNow();
    const candidates = [];

    for (const stream of SCHEDULE) {
      let daysUntil = (stream.dayIndex - pac.dayOfWeek + 7) % 7;
      let diff = daysUntil * 86400 + (stream.hour - pac.hour) * 3600 + (stream.minute - pac.minute) * 60 - pac.second;
      let isLive = false;

      if (daysUntil === 0) {
        if (diff <= 0 && diff >= -STREAM_DURATION_SEC) {
          isLive = true;
        } else if (diff < -STREAM_DURATION_SEC) {
          daysUntil = 7;
          diff += 7 * 86400;
        }
      }

      candidates.push({
        stream,
        diff,
        isLive,
        daysUntil
      });
    }

    const liveCandidate = candidates.find(c => c.isLive);
    let activeStream;
    let isLiveNow = false;
    let remainingSec = 0;

    if (liveCandidate) {
      activeStream = liveCandidate.stream;
      isLiveNow = true;
    } else {
      const upcoming = candidates
        .filter(c => c.diff > 0)
        .sort((a, b) => a.diff - b.diff)[0];
      activeStream = upcoming ? upcoming.stream : SCHEDULE[0];
      remainingSec = upcoming ? upcoming.diff : 0;
    }

    // Update Stream Details
    if (dayEl && dayEl.textContent !== activeStream.dayName) {
      dayEl.textContent = activeStream.dayName;
    }
    if (timeEl && timeEl.textContent !== activeStream.timeText) {
      timeEl.textContent = activeStream.timeText;
    }
    if (topicEl && topicEl.textContent !== activeStream.title) {
      topicEl.textContent = activeStream.title;
    }

    if (featuredEl) {
      featuredEl.style.display = activeStream.featured ? 'inline-block' : 'none';
    }

    // Update Countdown Readout & Live State
    if (isLiveNow) {
      banner.classList.add('is-live');
      if (badgeEl && badgeEl.textContent !== 'BROADCASTING') {
        badgeEl.textContent = 'BROADCASTING';
      }
      if (timerLabelEl && timerLabelEl.textContent !== 'STATUS') {
        timerLabelEl.textContent = 'STATUS';
      }
      if (countdownEl) {
        if (countdownEl.textContent !== 'LIVE NOW') {
          countdownEl.textContent = 'LIVE NOW';
        }
        countdownEl.classList.add('live-text');
      }
      if (secsEl) {
        secsEl.style.display = 'none';
      }
    } else {
      banner.classList.remove('is-live');
      if (badgeEl && badgeEl.textContent !== 'NEXT STREAM') {
        badgeEl.textContent = 'NEXT STREAM';
      }
      if (timerLabelEl && timerLabelEl.textContent !== 'STREAM STARTS IN') {
        timerLabelEl.textContent = 'STREAM STARTS IN';
      }
      if (countdownEl) {
        countdownEl.classList.remove('live-text');
        const days = Math.floor(remainingSec / 86400);
        const hours = Math.floor((remainingSec % 86400) / 3600);
        const mins = Math.floor((remainingSec % 3600) / 60);
        const secs = Math.floor(remainingSec % 60);

        const cdString = `${days}D ${String(hours).padStart(2, '0')}H ${String(mins).padStart(2, '0')}M`;
        if (countdownEl.textContent !== cdString) {
          countdownEl.textContent = cdString;
        }

        if (secsEl) {
          secsEl.style.display = 'inline';
          const secsString = `${String(secs).padStart(2, '0')}S`;
          if (secsEl.textContent !== secsString) {
            secsEl.textContent = secsString;
          }
        }
      }
    }
  }

  update();
  setInterval(update, 1000);
}

/**
 * =========================================================================
 * 1. CYBER / TERMINAL TEXT SCRAMBLE ON HOVER (From larry-9n1.pages.dev)
 * =========================================================================
 * Gracefully scrambles alphanumeric characters with subtle glitch glyphs
 * for ~260ms before locking smoothly into the real word.
 */
function initTextScrambleEffect() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const scrambleTargets = document.querySelectorAll(
    '.nav-link, .about-pill, .section-eyebrow, .stream-live-pill span:not(.stream-status-dot)'
  );

  const chars = '!@#$%^&*()_+-=[]{}|;:<>?~01';

  scrambleTargets.forEach(el => {
    // Only scramble elements that have a direct single text node or simple inner text
    const originalText = el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE 
      ? el.textContent.trim() 
      : (el.querySelector('.nav-underline') ? el.childNodes[0].textContent.trim() : null);

    if (!originalText || originalText.length < 2) return;

    let frameId = null;

    el.addEventListener('mouseenter', () => {
      let iteration = 0;
      const totalSteps = originalText.length * 2.2;
      const stepDuration = 22; // ms per frame

      clearInterval(frameId);
      frameId = setInterval(() => {
        const scrambled = originalText
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '—' || char === '•') return char;
            if (index < iteration / 2.2) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
          el.textContent = scrambled;
        } else if (el.querySelector('.nav-underline')) {
          el.childNodes[0].textContent = scrambled;
        }

        if (iteration >= totalSteps) {
          clearInterval(frameId);
          if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
            el.textContent = originalText;
          } else if (el.querySelector('.nav-underline')) {
            el.childNodes[0].textContent = originalText;
          }
        }
        iteration += 1;
      }, stepDuration);
    });

    el.addEventListener('mouseleave', () => {
      clearInterval(frameId);
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
        el.textContent = originalText;
      } else if (el.querySelector('.nav-underline')) {
        el.childNodes[0].textContent = originalText;
      }
    });
  });
}

/**
 * =========================================================================
 * 2. INTERACTIVE 3D MICRO-TILT ON CARDS (Inspired by Grace Daniyan Portfolio)
 * =========================================================================
 * Subtle cursor-following rotation (max 4.5deg) with smooth spring reset.
 * Desktop pointer only; completely disabled on touch and reduced-motion devices.
 */
function initCardTiltEffect() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltCards = document.querySelectorAll(
    '.content-pillar-card, .vip-mini-card, .creator-stat-card'
  );

  tiltCards.forEach(card => {
    let bounds = null;
    let isHovered = false;

    const onMouseEnter = () => {
      isHovered = true;
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.12s ease-out, border-color 0.25s ease, box-shadow 0.25s ease';
      card.style.willChange = 'transform';
    };

    const onMouseMove = (e) => {
      if (!isHovered || !bounds) return;
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xPct = (mouseX / bounds.width) - 0.5; // -0.5 to 0.5
      const yPct = (mouseY / bounds.height) - 0.5;

      const rotateY = (xPct * 8.5).toFixed(2);  // max ~4.25 deg
      const rotateX = (-yPct * 8.5).toFixed(2);

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    };

    const onMouseLeave = () => {
      isHovered = false;
      card.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s ease, box-shadow 0.25s ease';
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      setTimeout(() => {
        if (!isHovered) {
          card.style.willChange = '';
        }
      }, 450);
    };

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}

/**
 * Subtle VIP Spotlight / Glow Sweep on "YOU'RE A VIP TO ME."
 * Triggers once when the Personal Host Promise card first enters the viewport.
 * Runs an elegant 850ms light sweep from left to right, intensifying neon glow as it passes.
 * Smoothly settles back to resting state.
 * Gently repeats on a calm 12-second interval only while the card remains visible in viewport.
 */
function initVipPromiseGlowSweep() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const card = document.querySelector('.vip-personal-promise-card');
  if (!card) return;

  const target = card.querySelector('.volt-highlight');
  if (!target) return;

  let intervalId = null;
  let hasTriggeredFirst = false;

  const triggerSweep = () => {
    if (target.classList.contains('sweep-active')) return;

    target.classList.add('sweep-active');
    setTimeout(() => {
      target.classList.remove('sweep-active');
    }, 900);
  };

  if (!('IntersectionObserver' in window)) {
    setTimeout(triggerSweep, 600);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!hasTriggeredFirst) {
          hasTriggeredFirst = true;
          // Subtle pause after entering viewport before sweeping
          setTimeout(triggerSweep, 250);
        }

        // Maintain a calm, long 12-second interval while visible
        if (!intervalId) {
          intervalId = setInterval(() => {
            if (document.visibilityState === 'visible' && entry.isIntersecting) {
              triggerSweep();
            }
          }, 12000);
        }
      } else {
        // Clear interval when out of view
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.35
  });

  observer.observe(card);
}

/**
 * Interactive WTF Games Code Copy
 * Copies "ItsTimbob" to clipboard, shows "COPIED!" feedback on button,
 * and triggers toast notification.
 */
function initWtfCodeCopy() {
  const copyBtn = document.getElementById('copyWtfCodeBtn');
  const codeVal = document.getElementById('wtfCodeValue');
  if (!copyBtn && !codeVal) return;

  const targets = [copyBtn, codeVal].filter(Boolean);

  const copyCode = async () => {
    const code = window.SITE_CONFIG?.wtfReferralCode || 'ItsTimbob';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = code;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      if (copyBtn) {
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span class="copy-btn-text">COPIED!</span>
        `;
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
          copyBtn.classList.remove('copied');
        }, 2000);
      }

      showToast(`WTF Games code "${code}" copied to clipboard!`);
    } catch (err) {
      console.error('Failed to copy WTF code: ', err);
      showToast(`Code: ${code}`);
    }
  };

  targets.forEach(el => el.addEventListener('click', copyCode));
}


