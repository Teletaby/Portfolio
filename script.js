/**
 * Justin James Gutierrez — Portfolio Interactivity & IT Terminal Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Dark / Light Mode Theme Controller
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  const updateThemeUI = (theme) => {
    const isLight = theme === 'light';
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
      themeToggleBtn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    }
  };

  const getActiveTheme = () => {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  };

  const setTheme = (theme, notify = false) => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (e) {}
    updateThemeUI(theme);
    if (notify && typeof window.showToast === 'function') {
      window.showToast(theme === 'light' ? 'Light mode activated' : 'Dark mode activated');
    }
  };

  // Sync UI with current theme on boot
  updateThemeUI(getActiveTheme());

  const handleToggle = () => {
    const currentTheme = getActiveTheme();
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme, true);
  };

  themeToggleBtn?.addEventListener('click', handleToggle);

  // 1. Navigation Sticky & Active Link Tracking
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const checkHeaderScroll = () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  checkHeaderScroll();
  window.addEventListener('scroll', () => {
    checkHeaderScroll();

    // Active Section Tracking
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    mobileNavLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 1.5. Scroll Reveal Animation for Each Section (fade at first when scrolling)
  const sectionsToReveal = document.querySelectorAll('section[id]:not(#hero)');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.05
    });

    sectionsToReveal.forEach((sec) => {
      sec.classList.add('fade-section');
      revealObserver.observe(sec);
    });
  } else {
    sectionsToReveal.forEach((sec) => sec.classList.add('is-revealed'));
  }

  // 2. Project Category Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'grid';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 3. Modern Accessible Dialog Modals
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseButtons = document.querySelectorAll('.modal-close-btn, [data-modal-close]');

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-modal-target');
      const dialog = document.getElementById(modalId);
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
        const cursor = document.getElementById('itCursor');
        if (cursor && typeof cursor.showPopover === 'function') {
          try {
            cursor.hidePopover();
            cursor.showPopover();
          } catch (e) {}
        }
      }
    });
  });

  modalCloseButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const dialog = btn.closest('dialog');
      if (dialog) {
        dialog.close();
        document.body.style.overflow = '';
        const cursor = document.getElementById('itCursor');
        if (cursor && typeof cursor.showPopover === 'function') {
          try {
            cursor.hidePopover();
            cursor.showPopover();
          } catch (e) {}
        }
      }
    });
  });

  // Close when clicking modal backdrop
  document.querySelectorAll('dialog.custom-modal').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        dialog.close();
        document.body.style.overflow = '';
      }
    });

    dialog.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
  });

  // 4. Toast Notification System
  window.showToast = function (message, duration = 3200) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  };

  // 5. Copy Email to Clipboard
  window.copyEmail = function (email = 'gutierrezjustinjames63@gmail.com') {
    navigator.clipboard.writeText(email).then(() => {
      showToast(`Email copied: ${email}`);
    }).catch(() => {
      showToast(`Email: ${email}`);
    });
  };

  // 6. Contact Form Simulation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = 'Sending message...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast('Thank you! Your message has been sent to Justin.');
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }

  // 7. Mobile Menu Toggle & Backdrop Overlay
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');

  function closeMobileDrawer() {
    mobileDrawer?.classList.remove('open');
    mobileDrawerOverlay?.classList.remove('open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    header?.classList.remove('drawer-open');
    document.body.classList.remove('menu-locked');
  }

  function openMobileDrawer() {
    mobileDrawer?.classList.add('open');
    mobileDrawerOverlay?.classList.add('open');
    mobileToggle?.setAttribute('aria-expanded', 'true');
    header?.classList.add('drawer-open');
    document.body.classList.add('menu-locked');
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    mobileDrawerOverlay?.addEventListener('click', closeMobileDrawer);

    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileDrawer();
      }
    });
  }

  // 8. Interactive IT Command Center / CLI Console
  const terminalScreen = document.getElementById('terminalScreen');
  const terminalInput = document.getElementById('terminalInput');
  const terminalChips = document.querySelectorAll('.terminal-chip');

  const COMMANDS = {
    help: [
      { text: 'AVAILABLE IT SYSTEM COMMANDS:', cls: 'success' },
      { text: '  sysinfo     - View system telemetry, OS specs, and IT competencies', cls: 'info' },
      { text: '  experience  - Dump career logs for Stefanini, ORIGIN, SMDC, and Knowles', cls: 'info' },
      { text: '  video       - Display video editing suite & TikTok creator channels', cls: 'info' },
      { text: '  projects    - List active production systems and deployment URLs', cls: 'info' },
      { text: '  certs       - Display verified CISCO hardware & security credentials', cls: 'info' },
      { text: '  ping        - Simulate ICMP ping test to Vercel global edge nodes', cls: 'info' },
      { text: '  contact     - Display communication endpoints and copy email', cls: 'info' },
      { text: '  clear       - Clear the terminal screen', cls: 'info' }
    ],
    sysinfo: [
      { text: '[SYSTEM DIAGNOSTIC REPORT]', cls: 'success' },
      { text: '  CANDIDATE:     Justin James Gutierrez', cls: 'info' },
      { text: '  ROLE:          IT Specialist & Systems Solutions Engineer', cls: 'accent' },
      { text: '  ACADEMIC:      Magna Cum Laude · BS Computer Science (DLSU-D)', cls: 'warn' },
      { text: '  CORE STACK:    IT Infrastructure, Hardware Diagnostics, Network Protocols', cls: 'info' },
      { text: '  PLATFORMS:     Windows Server, Linux/POSIX, Vercel Edge, MongoDB, Node.js', cls: 'info' },
      { text: '  SECURITY:      CISCO Certified (Hardware Basics & Cybersecurity)', cls: 'success' },
      { text: '  LOCATION:      Bacoor, Cavite, Philippines (Remote / On-site Ready)', cls: 'info' },
      { text: '  STATUS:        Available for Enterprise IT Roles', cls: 'success' }
    ],
    video: [
      { text: '==================================================', cls: 'muted' },
      { text: '  CREATIVE MEDIA & VIDEO EDITING SUITE', cls: 'highlight' },
      { text: '==================================================', cls: 'muted' },
      { text: 'Editing Suite: Adobe After Effects · Premiere Pro · CapCut', cls: 'accent' },
      { text: 'Creator Handles: @tabby_edits & @teletaby_edits (TikTok) · @taby_edits (YouTube)', cls: 'info' },
      { text: 'Specialties: Velocity Curves, Speed Ramping, Rhythm Beat-Syncing', cls: 'info' },
      { text: 'Timeline:', cls: 'info' },
      { text: '  - Grade 6: First introduced to video editing; sparked creative passion', cls: 'muted' },
      { text: '  - High School: Designated classroom video editor for projects & events', cls: 'muted' },
      { text: '  - 3rd Yr College: Returned to motion design; launched TikTok channels', cls: 'muted' },
      { text: '  - May 2026: Approached & recruited by ORIGIN (LA) for artist campaigns', cls: 'success' },
    ],
    experience: [
      { text: '[CAREER & WORK EXPERIENCE LOGS]', cls: 'success' },
      { text: '1. Stefanini Philippines (Pasay City, PH) [September 2026 – Present]', cls: 'accent' },
      { text: '   Role: Helpdesk Technician I (Full-time)', cls: 'info' },
      { text: '   - Multi-channel technical end-user support via telephone, email, and live web chat.', cls: 'info' },
      { text: '   - Restorative maintenance, PC hardware/OS troubleshooting, and ITSM ticket tracking.', cls: 'info' },
      { text: '', cls: 'info' },
      { text: '2. ORIGIN (Los Angeles, CA) [May 2026 – Present]', cls: 'accent' },
      { text: '   Role: Freelance Content Creator & Digital Campaign Specialist', cls: 'info' },
      { text: '   - Managed digital marketing campaigns for international artist rosters.', cls: 'info' },
      { text: '   - Engineered multimedia asset delivery pipelines and encoding standards.', cls: 'info' },
      { text: '', cls: 'info' },
      { text: '3. SM Development Corporation (SMDC) [June 2025 – August 2025]', cls: 'accent' },
      { text: '   Role: Technical Support Intern (Pasay City, PH)', cls: 'info' },
      { text: '   - Deployed, repaired, and configured enterprise workstation hardware.', cls: 'info' },
      { text: '   - Resolved Tier-1/2 support tickets; managed device inventory & lifecycle.', cls: 'info' },
      { text: '', cls: 'info' },
      { text: '4. Knowles Training Institute [June 2024 – August 2024]', cls: 'accent' },
      { text: '   Role: IT Team Lead Assistant Intern (Singapore / Remote)', cls: 'info' },
      { text: '   - Corporate platform administration, WordPress uptime, and security hardening.', cls: 'info' },
      { text: '   - Streamlined data verification and weekly IT analytics reporting.', cls: 'info' }
    ],
    projects: [
      { text: '[ACTIVE PRODUCTION SYSTEMS]', cls: 'success' },
      { text: '  1. JSquared Cinema: Media streaming web platform (Vercel Edge)', cls: 'accent' },
      { text: '     URL: https://jjsquared.vercel.app/', cls: 'info' },
      { text: '  2. KTaby: Global K-Pop community & discography portal (Vercel Serverless)', cls: 'accent' },
      { text: '     URL: https://ktabys.vercel.app/', cls: 'info' },
      { text: '  3. FallGuard: Real-time edge computer vision fall detection (99.0% accuracy)', cls: 'accent' },
      { text: '     Stack: Python, Google MediaPipe, LSTM Neural Network, OpenCV', cls: 'info' },
      { text: '  4. VitalPoint: Full-stack clinic appointment & RBAC administrative system', cls: 'accent' },
      { text: '     Stack: Node.js, Express, MongoDB, RESTful APIs', cls: 'info' }
    ],
    certs: [
      { text: '[VERIFIED INDUSTRY CREDENTIALS]', cls: 'success' },
      { text: '  * CISCO Networking Academy: Computer Hardware Basics', cls: 'accent' },
      { text: '    - Motherboard architectures, BIOS/UEFI setup, storage configurations, diagnostics.', cls: 'info' },
      { text: '  * CISCO Networking Academy: Introduction to Cybersecurity', cls: 'accent' },
      { text: '    - Network threat mitigation, defense-in-depth, firewalling, encryption protocols.', cls: 'info' }
    ],
    ping: [
      { text: 'PING vercel.edge.network (76.76.21.21): 56 data bytes', cls: 'info' },
      { text: '64 bytes from 76.76.21.21: icmp_seq=1 ttl=118 time=12.4 ms', cls: 'success' },
      { text: '64 bytes from 76.76.21.21: icmp_seq=2 ttl=118 time=11.8 ms', cls: 'success' },
      { text: '64 bytes from 76.76.21.21: icmp_seq=3 ttl=118 time=13.1 ms', cls: 'success' },
      { text: '--- vercel.edge.network ping statistics ---', cls: 'info' },
      { text: '3 packets transmitted, 3 packets received, 0.0% packet loss', cls: 'success' },
      { text: 'round-trip min/avg/max = 11.8/12.43/13.1 ms [Edge Status: HEALTHY]', cls: 'accent' }
    ],
    contact: [
      { text: '[COMMUNICATION ENDPOINTS]', cls: 'success' },
      { text: '  EMAIL:     gutierrezjustinjames63@gmail.com', cls: 'accent' },
      { text: '  PHONE:     0993-475-7875', cls: 'info' },
      { text: '  LOCATION:  Bacoor, Cavite, Philippines', cls: 'info' },
      { text: '  LINKEDIN:  https://www.linkedin.com/in/justin-james-gutierrez-6088a1280', cls: 'accent' },
      { text: '  RESUME:    Available in new tab via navigation', cls: 'warn' }
    ]
  };

  function executeTerminalCommand(cmdString) {
    if (!terminalScreen) return;
    const cleanCmd = cmdString.trim().toLowerCase();
    if (!cleanCmd) return;

    // Append Command Echo
    const echoLine = document.createElement('div');
    echoLine.className = 'terminal-line cmd-echo';
    echoLine.textContent = `guest@portfolio:~$ ${cleanCmd}`;
    terminalScreen.appendChild(echoLine);

    if (cleanCmd === 'clear') {
      terminalScreen.innerHTML = `
        <div class="terminal-line success">Gutierrez IT Systems Telemetry Console v2.6.0 [x86_64-win32-vercel]</div>
        <div class="terminal-line info">Type 'help' or click any quick-run diagnostic command below:</div>
        <div class="terminal-line accent">---</div>
      `;
      return;
    }

    const responses = COMMANDS[cleanCmd];
    if (responses) {
      responses.forEach((res) => {
        const line = document.createElement('div');
        line.className = `terminal-line ${res.cls}`;
        line.textContent = res.text;
        terminalScreen.appendChild(line);
      });
      if (cleanCmd === 'contact') {
        copyEmail('gutierrezjustinjames63@gmail.com');
      }
    } else {
      const errLine = document.createElement('div');
      errLine.className = 'terminal-line warn';
      errLine.textContent = `Command not recognized: '${cleanCmd}'. Type 'help' to see valid commands.`;
      terminalScreen.appendChild(errLine);
    }

    // Scroll to bottom
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeTerminalCommand(terminalInput.value);
        terminalInput.value = '';
      }
    });
  }

  terminalChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        if (terminalInput) terminalInput.value = cmd;
        executeTerminalCommand(cmd);
        if (terminalInput) terminalInput.value = '';
      }
    });
  });

  // 9. IT Systems Diagnostic Crosshair & Reticle Cursor with EXEC_TRIG Selection Box
  const itCursor = document.getElementById('itCursor');
  const cursorCrosshair = document.getElementById('cursorCrosshair');
  const cursorReticle = document.getElementById('cursorReticle');
  const cursorTag = document.getElementById('cursorTag');
  const selectionBox = document.getElementById('itSelectionBox');
  const boxTag = document.getElementById('boxTag');
  const boxDim = document.getElementById('boxDim');

  if (itCursor && typeof itCursor.showPopover === 'function') {
    try {
      itCursor.showPopover();
    } catch (e) {}
  }

  // Prevent text selection drag across the site
  document.addEventListener('selectstart', (e) => {
    if (!e.target.matches('input, textarea, [contenteditable="true"]')) {
      e.preventDefault();
    }
  });

  if (cursorCrosshair && cursorReticle && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isVisible = false;
    let isHovering = false;
    let isMouseDown = false;
    let isDraggingBox = false;
    let startX = 0;
    let startY = 0;
    let fadeTimeout = null;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursorCrosshair.style.opacity = '1';
        cursorReticle.style.opacity = '1';
      }
      cursorCrosshair.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

      // Handle EXEC_TRIG Box Drawing
      if (isMouseDown && selectionBox) {
        const dx = mouseX - startX;
        const dy = mouseY - startY;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
          isDraggingBox = true;
          const left = Math.min(startX, mouseX);
          const top = Math.min(startY, mouseY);
          const width = Math.abs(dx);
          const height = Math.abs(dy);

          if (fadeTimeout) {
            clearTimeout(fadeTimeout);
            fadeTimeout = null;
          }
          selectionBox.classList.remove('box-captured');
          selectionBox.style.opacity = '1';
          selectionBox.style.display = 'block';
          selectionBox.style.left = `${left}px`;
          selectionBox.style.top = `${top}px`;
          selectionBox.style.width = `${width}px`;
          selectionBox.style.height = `${height}px`;

          if (boxTag) boxTag.textContent = 'EXEC_TRIG // SCAN_REGION';
          if (boxDim) boxDim.textContent = `${Math.round(width)} × ${Math.round(height)} PX`;
          if (cursorTag) cursorTag.textContent = 'EXEC_TRIG';
        }
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      isVisible = false;
      cursorCrosshair.style.opacity = '0';
      cursorReticle.style.opacity = '0';
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      cursorReticle.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover Tracking (Supports normal page elements + modal elements)
    function attachHoverTracking() {
      const hoverTargets = document.querySelectorAll('a, button, input, textarea, select, .project-card, .timeline-column, .terminal-chip, .filter-btn, .modal-close-btn, .scroll-top-btn, [data-modal-target], [data-modal-close], .arch-node');
      hoverTargets.forEach((target) => {
        target.addEventListener('mouseenter', () => {
          if (!isMouseDown) {
            isHovering = true;
            cursorReticle.classList.add('cursor-hover');
            cursorCrosshair.classList.add('cursor-hover');
            if (cursorTag) cursorTag.textContent = 'TARGET_LOCKED';
          }
        });
        target.addEventListener('mouseleave', () => {
          if (!isMouseDown) {
            isHovering = false;
            cursorReticle.classList.remove('cursor-hover');
            cursorCrosshair.classList.remove('cursor-hover');
            if (cursorTag) cursorTag.textContent = 'SYS_OK';
          }
        });
      });
    }
    attachHoverTracking();

    // Mousedown / Mouseup for EXEC_TRIG & Box Creation
    window.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only primary button
      isMouseDown = true;
      startX = e.clientX;
      startY = e.clientY;
      cursorReticle.classList.add('cursor-click');
      if (cursorTag) cursorTag.textContent = 'EXEC_TRIG';
    });

    window.addEventListener('mouseup', () => {
      isMouseDown = false;
      cursorReticle.classList.remove('cursor-click');

      if (isDraggingBox && selectionBox) {
        const curWidth = parseFloat(selectionBox.style.width) || 0;
        const curHeight = parseFloat(selectionBox.style.height) || 0;

        if (curWidth > 20 && curHeight > 20) {
          selectionBox.classList.add('box-captured');
          if (boxTag) boxTag.textContent = 'REGION_CAPTURED // 200 OK';
          if (cursorTag) cursorTag.textContent = 'REGION_OK';

          fadeTimeout = setTimeout(() => {
            selectionBox.style.opacity = '0';
            setTimeout(() => {
              selectionBox.style.display = 'none';
              selectionBox.classList.remove('box-captured');
            }, 250);
          }, 450);
        } else {
          selectionBox.style.display = 'none';
        }
        isDraggingBox = false;
      }

      setTimeout(() => {
        if (!isMouseDown) {
          if (cursorTag) cursorTag.textContent = isHovering ? 'TARGET_LOCKED' : 'SYS_OK';
        }
      }, 300);
    });
  }

  // 10. Interactive 3D Card Tilt & Cursor Spotlight (Desktop only for smooth mobile scrolling)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const interactiveCards = document.querySelectorAll('.project-card, .timeline-column, .terminal-card');
    interactiveCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  // 11. Scroll-to-Top Button with Circular Progress Tracking
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const scrollProgressCircle = document.getElementById('scrollProgressCircle');
  const circumference = 2 * Math.PI * 20; // 125.6637

  if (scrollProgressCircle) {
    scrollProgressCircle.style.strokeDasharray = `${circumference}`;
    scrollProgressCircle.style.strokeDashoffset = `${circumference}`;
  }

  function updateScrollProgress() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

    if (scrollProgressCircle) {
      scrollProgressCircle.style.strokeDashoffset = `${circumference * (1 - progress)}`;
    }

    if (scrollTopBtn) {
      if (scrollY > 160) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // 12. Adobe After Effects Real Video Player Controller (@tabby_edits TikTok Media)
  const aeVideoPlayer = document.getElementById('aeVideoPlayer');
  const aeMonitorScreen = document.getElementById('aeMonitorScreen');
  const aePlayBtn = document.getElementById('aePlayBtn');
  const aePlayIcon = document.getElementById('aePlayIcon');
  const aePlayText = document.getElementById('aePlayText');
  const aeCenterPlayBtn = document.getElementById('aeCenterPlayBtn');
  const aeScrubSlider = document.getElementById('aeScrubSlider');
  const aeTimeDisplay = document.getElementById('aeTimeDisplay');
  const aeTimecode = document.getElementById('aeTimecode');
  const aePrevClipBtn = document.getElementById('aePrevClipBtn');
  const aeNextClipBtn = document.getElementById('aeNextClipBtn');
  const aeMuteBtn = document.getElementById('aeMuteBtn');
  const aeAudioBtn = document.getElementById('aeAudioBtn');
  const aeAudioIcon = document.getElementById('aeAudioIcon');
  const aeAudioBtnIcon = document.getElementById('aeAudioBtnIcon');
  const aeAudioText = document.getElementById('aeAudioText');
  const aeActiveClipTitle = document.getElementById('aeActiveClipTitle');
  const aeClipBtns = document.querySelectorAll('.ae-clip-btn');

  const aeClips = [
    { id: 1, file: 'tabby_edit_1.mp4', title: 'Latest Edit // TikTok Release', tag: '@tabby_edits' },
    { id: 2, file: 'tabby_edit_2.mp4', title: 'Ahyeon // BabyMonster Velocity', tag: '@tabby_edits' },
    { id: 3, file: 'tabby_edit_3.mp4', title: 'Rhythm Beat Sync // TikTok Cut', tag: '@tabby_edits' }
  ];

  let currentClipIndex = 0;
  let isScrubbing = false;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function formatAeTimecode(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00:00:00';
    const totalFrames = Math.floor(seconds * 60);
    const hrs = String(Math.floor(totalFrames / 216000)).padStart(2, '0');
    const mins = String(Math.floor((totalFrames % 216000) / 3600)).padStart(2, '0');
    const secs = String(Math.floor((totalFrames % 3600) / 60)).padStart(2, '0');
    const frames = String(totalFrames % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}:${frames}`;
  }

  function updateAudioUI(isMuted) {
    if (aeAudioText) aeAudioText.textContent = isMuted ? 'Sound Off' : 'Sound On';
    const iconMuted = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
    const iconUnmuted = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
    if (aeAudioIcon) aeAudioIcon.innerHTML = isMuted ? iconMuted : iconUnmuted;
    if (aeAudioBtnIcon) aeAudioBtnIcon.innerHTML = isMuted ? iconMuted : iconUnmuted;
  }

  function toggleAudio() {
    if (!aeVideoPlayer) return;
    aeVideoPlayer.muted = !aeVideoPlayer.muted;
    updateAudioUI(aeVideoPlayer.muted);
  }

  function togglePlay() {
    if (!aeVideoPlayer) return;
    if (aeVideoPlayer.paused) {
      aeVideoPlayer.play().catch(() => {
        aeVideoPlayer.muted = true;
        updateAudioUI(true);
        aeVideoPlayer.play().catch(() => {});
      });
    } else {
      aeVideoPlayer.pause();
    }
  }

  function loadClip(index, autoPlay = true) {
    if (index < 0) index = aeClips.length - 1;
    if (index >= aeClips.length) index = 0;
    currentClipIndex = index;
    const clip = aeClips[currentClipIndex];

    aeClipBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentClipIndex);
    });

    if (aeActiveClipTitle) {
      aeActiveClipTitle.textContent = clip.title;
    }

    if (aeVideoPlayer) {
      const wasMuted = aeVideoPlayer.muted;
      aeVideoPlayer.src = clip.file;
      aeVideoPlayer.muted = wasMuted;
      aeVideoPlayer.load();
      if (autoPlay) {
        aeVideoPlayer.play().catch(() => {
          aeVideoPlayer.muted = true;
          updateAudioUI(true);
          aeVideoPlayer.play().catch(() => {});
        });
      }
    }
  }

  if (aeVideoPlayer) {
    aeVideoPlayer.addEventListener('play', () => {
      aeMonitorScreen?.classList.remove('is-paused');
      if (aePlayText) aePlayText.textContent = 'Pause';
      if (aePlayIcon) {
        aePlayIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
      }
    });

    aeVideoPlayer.addEventListener('pause', () => {
      aeMonitorScreen?.classList.add('is-paused');
      if (aePlayText) aePlayText.textContent = 'Play';
      if (aePlayIcon) {
        aePlayIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
      }
    });

    aeVideoPlayer.addEventListener('timeupdate', () => {
      if (!isScrubbing && aeVideoPlayer.duration) {
        const percent = (aeVideoPlayer.currentTime / aeVideoPlayer.duration) * 100;
        if (aeScrubSlider) aeScrubSlider.value = percent;
      }
      if (aeTimeDisplay && aeVideoPlayer.duration) {
        aeTimeDisplay.textContent = `${formatTime(aeVideoPlayer.currentTime)} / ${formatTime(aeVideoPlayer.duration)}`;
      }
      if (aeTimecode) {
        aeTimecode.textContent = formatAeTimecode(aeVideoPlayer.currentTime);
      }
    });

    aeVideoPlayer.addEventListener('loadedmetadata', () => {
      if (aeTimeDisplay) {
        aeTimeDisplay.textContent = `00:00 / ${formatTime(aeVideoPlayer.duration)}`;
      }
      if (aeTimecode) {
        aeTimecode.textContent = formatAeTimecode(0);
      }
    });

    aeVideoPlayer.addEventListener('click', togglePlay);
  }

  if (aeScrubSlider) {
    aeScrubSlider.addEventListener('input', (e) => {
      isScrubbing = true;
      if (aeVideoPlayer && aeVideoPlayer.duration) {
        const seekTime = (parseFloat(e.target.value) / 100) * aeVideoPlayer.duration;
        aeVideoPlayer.currentTime = seekTime;
        if (aeTimeDisplay) {
          aeTimeDisplay.textContent = `${formatTime(seekTime)} / ${formatTime(aeVideoPlayer.duration)}`;
        }
        if (aeTimecode) {
          aeTimecode.textContent = formatAeTimecode(seekTime);
        }
      }
    });
    aeScrubSlider.addEventListener('change', () => {
      isScrubbing = false;
    });
  }

  aePlayBtn?.addEventListener('click', togglePlay);
  aeCenterPlayBtn?.addEventListener('click', togglePlay);
  aeMuteBtn?.addEventListener('click', toggleAudio);
  aeAudioBtn?.addEventListener('click', toggleAudio);

  aePrevClipBtn?.addEventListener('click', () => loadClip(currentClipIndex - 1));
  aeNextClipBtn?.addEventListener('click', () => loadClip(currentClipIndex + 1));

  aeClipBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => loadClip(idx));
  });

  // Ensure initial mute state is synchronized
  if (aeVideoPlayer) {
    updateAudioUI(aeVideoPlayer.muted);
  }

});

