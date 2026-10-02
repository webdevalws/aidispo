/**
 * AI-DISPO® — UltraFlow Precision Syringe
 * Interactive Script: 
 * - Section 1: Hero Syringe Scroll-Docking & Parallax
 * - Section 3: Needle Macro Zoom & Horizontal Parallax
 * - Section 4: Full-Screen Horizontal Syringe Scroll-Docking & 3-Pillar Cards Fly-In
 * - Clinical ROI Calculator & Procurement Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Audio Synthesizer (Clinical Haptic Sound Feedback)
  let audioEnabled = false;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playClinicalClick(type = 'click') {
    if (!audioEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.36);
      } else if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        osc.start(now);
        osc.stop(now + 0.025);
      } else if (type === 'aspirate') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.28);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'inject') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'droplet') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (e) {
      // AudioContext fallback
    }
  }

  const soundToggleBtn = document.getElementById('soundToggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      audioEnabled = !audioEnabled;
      soundToggleBtn.classList.toggle('active', audioEnabled);
      const soundText = soundToggleBtn.querySelector('.sound-text');
      if (soundText) {
        soundText.textContent = audioEnabled ? 'AUDIO ON' : 'AUDIO OFF';
      }
      if (audioEnabled) {
        playClinicalClick('success');
      }
    });
  }

  // =========================================================================
  // MOBILE NAVIGATION DRAWER & PRODUCT ACCORDION
  // =========================================================================
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileProductToggle = document.getElementById('mobileProductToggle');
  const mobileProductDropdown = document.getElementById('mobileProductDropdown');

  function openMobileNav() {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.add('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'false');
    }
    if (mobileNavBackdrop) mobileNavBackdrop.classList.add('open');
    if (mobileMenuToggle) mobileMenuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
    initAudio();
    playClinicalClick('click');
  }

  function closeMobileNav() {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.remove('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'true');
    }
    if (mobileNavBackdrop) mobileNavBackdrop.classList.remove('open');
    if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', () => {
      closeMobileNav();
      playClinicalClick('click');
    });
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', () => {
      closeMobileNav();
    });
  }

  if (mobileProductToggle && mobileProductDropdown) {
    mobileProductToggle.addEventListener('click', (e) => {
      e.preventDefault();
      mobileProductDropdown.classList.toggle('active');
      playClinicalClick('click');
    });
  }

  // Auto close mobile drawer on clicking any navigation anchor
  document.querySelectorAll('.mobile-nav-link, .mobile-dropdown-item, .mobile-nav-footer a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Generic click sound binding to buttons
  document.querySelectorAll('button, .btn-craft, .nav-link, .spec-read-more-btn').forEach(elem => {
    elem.addEventListener('click', () => {
      playClinicalClick('click');
    });
    elem.addEventListener('mouseenter', () => {
      playClinicalClick('hover');
    });
  });

  function isMobile() {
    return window.innerWidth <= 768;
  }

  // =========================================================================
  // 2. SECTION 1: HERO SCROLL-DRIVEN SYRINGE DOCKING ANIMATION
  // =========================================================================
  const heroTrack = document.getElementById('heroTrack');
  const heroProductWrapper = document.getElementById('heroProductWrapper');
  const heroBgTextLayer = document.getElementById('heroBgTextLayer');
  const heroInkSplash = document.getElementById('heroInkSplash');
  const heroBottomBar = document.getElementById('heroBottomBar');
  const introBadge = document.getElementById('introBadge');
  const heroVisualStage = document.getElementById('heroVisualStage');
  const heroLaserTarget = document.getElementById('heroLaserTarget');
  const heroFeatureCallouts = document.getElementById('heroFeatureCallouts');

  let mouseTiltX = 0;
  let mouseTiltY = 0;
  let heroScrollProgress = 0;

  function updateHeroScroll() {
    if (!heroTrack) return;
    const rect = heroTrack.getBoundingClientRect();
    const scrollDistance = heroTrack.offsetHeight - window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

    // Progress from 0 (at page top) to 1 (when fully docked)
    let progress = 0;
    if (scrollTop > 2) {
      progress = Math.min(Math.max(-rect.top / Math.max(scrollDistance, 1), 0), 1);
    }
    heroScrollProgress = progress;
    const mobile = isMobile();

    // Fast, ultra-responsive pacing with silky cubic ease-out curve
    const rawProgress = Math.min(progress / 0.70, 1);
    const animProgress = 1 - Math.pow(1 - rawProgress, 2.5); // Silky smooth cubic ease-out

    // Container remains solid and 100% visible throughout
    const heroStickyContainer = document.getElementById('heroStickyContainer');
    if (heroStickyContainer) {
      heroStickyContainer.style.opacity = '1';
    }

    // 1. Initial Intro Prompt Badge (fades out as user scrolls)
    if (introBadge) {
      const badgeOpacity = Math.max(1 - animProgress * 3.2, 0);
      introBadge.style.opacity = badgeOpacity;
      introBadge.style.transform = `translateY(${Math.round(animProgress * 18)}px)`;
      introBadge.style.pointerEvents = badgeOpacity <= 0.05 ? 'none' : 'auto';
    }

    // 1b. Mobile 4 Feature Callouts (100% opaque at load, vanishes smoothly as user scrolls)
    if (heroFeatureCallouts) {
      const calloutsOpacity = Math.max(1 - animProgress * 5.0, 0);
      heroFeatureCallouts.style.opacity = calloutsOpacity;
      heroFeatureCallouts.style.transform = `translateY(${animProgress * 25}px)`;
      heroFeatureCallouts.style.visibility = calloutsOpacity <= 0.01 ? 'hidden' : 'visible';
      heroFeatureCallouts.style.pointerEvents = 'none';
    }

    // 2. Background Distressed Headline ("YOUR SAFETY OUR PRIORITY") — BEHIND ARROWS & TEXT
    if (heroBgTextLayer) {
      if (mobile) {
        // In mobile: soft blurred background presence behind arrows & syringe, reveals more on scroll
        const mobileBgOpacity = 0.20 + animProgress * 0.80;
        const mobileScale = 0.94 + animProgress * 0.08;
        const mobileY = (1 - animProgress) * 10;
        heroBgTextLayer.style.opacity = mobileBgOpacity;
        heroBgTextLayer.style.transform = `translate(-50%, calc(-50% + ${mobileY}px)) scale(${mobileScale})`;
      } else {
        // Desktop: reveals cleanly as user scrolls down so it doesn't collide with desktop title
        const bgOpacity = animProgress <= 0.05 ? 0 : Math.min((animProgress - 0.05) / 0.95, 1);
        const bgScale = 0.78 + animProgress * 0.22;
        const bgY = (1 - animProgress) * 40;
        heroBgTextLayer.style.opacity = bgOpacity;
        heroBgTextLayer.style.transform = `translate(-50%, calc(-50% + ${bgY}px)) scale(${bgScale})`;
      }
    }

    // 3. Hero Organic Ink Splash — 0 Opacity on Load (Reveals strictly on scroll)
    if (heroInkSplash) {
      const splashOpacity = animProgress <= 0.08 ? 0 : Math.min((animProgress - 0.08) * 0.25, 0.18);
      const splashScale = 0.5 + animProgress * 0.5;
      heroInkSplash.style.opacity = splashOpacity;
      heroInkSplash.style.transform = `translate(-50%, -50%) scale(${splashScale}) rotate(${animProgress * 15}deg)`;
    }

    // 4. Hero Syringe Scaling, Rotation & Docking
    if (heroProductWrapper) {
      if (animProgress <= 0.001) {
        // At initial rest position: preserve 100% native unscaled razor-sharp resolution
        heroProductWrapper.style.transform = 'none';
      } else {
        const startScale = 1.0;
        const endScale = mobile ? 0.90 : 0.84;
        const currentScale = startScale - animProgress * (startScale - endScale);

        const currentRotation = -(animProgress * 10);
        const currentTransY = (1 - animProgress) * (mobile ? 4 : 8);

        heroProductWrapper.style.transform = `translate3d(0, ${currentTransY}px, 0) rotate(${currentRotation}deg) scale(${currentScale.toFixed(3)})`;
      }
    }

    // 5. Laser Calibration Target Lock-in
    if (heroLaserTarget && !mobile) {
      const targetOpacity = Math.min(Math.max((animProgress - 0.55) / 0.45, 0), 0.85);
      heroLaserTarget.style.opacity = targetOpacity;
    }

    // 6. Bottom Bar (Eyebrow + Specs)
    if (heroBottomBar) {
      const bottomOpacity = Math.min(Math.max((animProgress - 0.20) / 0.65, 0), 1);
      const bottomY = (1 - bottomOpacity) * (mobile ? 12 : 20);
      heroBottomBar.style.opacity = bottomOpacity;
      heroBottomBar.style.transform = `translateY(${bottomY}px)`;
      heroBottomBar.style.visibility = bottomOpacity <= 0.01 ? 'hidden' : 'visible';
      heroBottomBar.style.pointerEvents = bottomOpacity >= 0.5 ? 'auto' : 'none';
    }
  }

  // Mousemove Parallax Tilt on Hero Syringe
  if (heroVisualStage) {
    heroVisualStage.style.pointerEvents = 'auto';
    heroVisualStage.addEventListener('mousemove', (e) => {
      if (isMobile()) return;
      const rect = heroVisualStage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      mouseTiltX = ((y - centerY) / centerY) * -10;
      mouseTiltY = ((x - centerX) / centerX) * 14;

      if (heroScrollProgress > 0.4) {
        requestAnimationFrame(updateHeroScroll);
      }
    });

    heroVisualStage.addEventListener('mouseleave', () => {
      mouseTiltX = 0;
      mouseTiltY = 0;
      requestAnimationFrame(updateHeroScroll);
    });
  }

  // =========================================================================
  // 3. SECTION 3: NEEDLE MACRO SCROLL ZOOM & PARALLAX ANIMATION
  // =========================================================================
  const statementSection = document.getElementById('statement');
  const needleStickyContainer = document.getElementById('needleStickyContainer');
  const needleMacroWrapper = document.getElementById('needleMacroWrapper');
  const needleMacroStage = document.getElementById('needleMacroStage');
  const statementBgWord = document.getElementById('statementBgWord');
  const needleTipHotspot = document.getElementById('needleTipHotspot');
  const needleHubHotspot = document.getElementById('needleHubHotspot');

  let needleMouseX = 0;
  let needleMouseY = 0;

  function updateNeedleScroll() {
    if (!statementSection || !needleMacroWrapper) return;
    const rect = statementSection.getBoundingClientRect();
    const windowH = window.innerHeight;
    const scrollDistance = statementSection.offsetHeight - windowH;
    const mobile = isMobile();

    // Progress from 0 (when track top reaches 0) to 1 (when scrolled past runway)
    const progress = Math.min(Math.max(-rect.top / Math.max(scrollDistance, 1), 0), 1);

    // Container remains solid and 100% visible throughout
    if (needleStickyContainer) {
      needleStickyContainer.style.opacity = '1';
    }

    // Pacing:
    // 0.00 to 0.15: Needle overview (scale: 1.0)
    // 0.15 to 0.60: Microscopic zoom into bevel tip (scale 1.0 -> 1.78 desktop, 1.38 mobile)
    // 0.60 to 0.88: Stable inspection hold at peak zoom
    let zoomT = 0;
    if (progress <= 0.15) {
      zoomT = 0;
    } else if (progress <= 0.60) {
      zoomT = (progress - 0.15) / 0.45;
    } else if (progress <= 0.88) {
      zoomT = 1.0;
    } else {
      zoomT = 1.0 - (progress - 0.88) / 0.12;
    }
    // Cubic smooth ease
    const smoothZoom = zoomT * zoomT * (3 - 2 * zoomT);

    const baseScale = mobile ? 0.94 : 0.98;
    const maxZoomAddition = mobile ? 0.12 : 0.16;
    const needleScale = baseScale + smoothZoom * maxZoomAddition;

    // Shift left during zoom so the hub never bleeds into the right section
    const needleSlideX = -smoothZoom * (mobile ? 14 : 32) + (progress - 0.5) * (mobile ? 6 : 12);
    const needleRot = (progress - 0.5) * (mobile ? -1 : -2.5);

    const totalTiltX = mobile ? 0 : (needleMouseY * 5);
    const totalTiltY = mobile ? 0 : (needleMouseX * 7);

    needleMacroWrapper.style.transform = `perspective(1000px) translateX(${needleSlideX}px) rotateX(${totalTiltX}deg) rotateY(${totalTiltY}deg) rotateZ(${needleRot}deg) scale(${needleScale})`;

    if (statementBgWord) {
      const textOffset = (progress - 0.5) * (mobile ? -80 : -180);
      statementBgWord.style.transform = `translate(calc(-50% + ${textOffset}px), -50%)`;
    }

    if (needleTipHotspot && needleHubHotspot) {
      const hotspotOpacity = Math.min(Math.max((progress - 0.08) / 0.25, 0), 1);
      needleTipHotspot.style.opacity = hotspotOpacity;
      needleHubHotspot.style.opacity = hotspotOpacity;
      const tipY = mobile ? -smoothZoom * 2 : -smoothZoom * 6;
      const hubY = mobile ? smoothZoom * 2 : smoothZoom * 4;
      needleTipHotspot.style.transform = `translateY(${tipY}px)`;
      needleHubHotspot.style.transform = `translateY(${hubY}px)`;
    }
  }

  // Interactive 3D Inspection on Needle Stage Mouse Move
  if (needleMacroStage) {
    needleMacroStage.addEventListener('mousemove', (e) => {
      if (isMobile()) return;
      const rect = needleMacroStage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      needleMouseX = (x - centerX) / centerX;
      needleMouseY = (y - centerY) / centerY;

      requestAnimationFrame(updateNeedleScroll);
    });

    needleMacroStage.addEventListener('mouseleave', () => {
      needleMouseX = 0;
      needleMouseY = 0;
      requestAnimationFrame(updateNeedleScroll);
    });
  }

  // =========================================================================
  // 4. SECTION 4: THREE PILLARS OF PRECISION STICKY DOCKING & CARDS FLY-IN
  // =========================================================================
  const featuresTrack = document.getElementById('featuresTrack');
  const featuresHeaderWrap = document.getElementById('featuresHeaderWrap');
  const featureCenterSyringeWrap = document.getElementById('featureCenterSyringeWrap');
  const splashCard1 = document.getElementById('splashCard1');
  const splashCard2 = document.getElementById('splashCard2');
  const splashCard3 = document.getElementById('splashCard3');

  function updateFeaturesScroll() {
    if (!featuresTrack || !featureCenterSyringeWrap) return;
    const rect = featuresTrack.getBoundingClientRect();
    const scrollDistance = featuresTrack.offsetHeight - window.innerHeight;

    // Progress from 0 (when featuresTrack top reaches 0) to 1 (when fully docked)
    let progress = Math.min(Math.max(-rect.top / Math.max(scrollDistance, 1), 0), 1);
    const mobile = isMobile();

    // Slower, cinema-grade pacing: cards and syringe animate gradually from 0.0 to 0.52,
    // and stay firmly docked, readable and interactive from 0.52 to 0.88 before gently exiting
    const animProgress = Math.min(progress / 0.52, 1);

    // Container remains solid and 100% visible throughout
    const featuresStickyContainer = document.getElementById('featuresStickyContainer');
    if (featuresStickyContainer) {
      featuresStickyContainer.style.opacity = '1';
    }

    // 1. Center Horizontal Syringe Scales Down into background
    const startScale = mobile ? 1.30 : 1.50;
    const endScale = mobile ? 0.90 : 1.0;
    const currentScale = startScale - animProgress * (startScale - endScale);
    featureCenterSyringeWrap.style.transform = `scale(${currentScale})`;

    // 2. Three Organic Ink-Splash Cards Fly In and Emerge Over Syringe
    const cardsProgress = Math.min(Math.max((animProgress - 0.10) / 0.85, 0), 1);

    // Card 1: Top-Left (Needle Cannula)
    if (splashCard1) {
      const offX = (1 - cardsProgress) * (mobile ? -30 : -130);
      const offY = (1 - cardsProgress) * (mobile ? -25 : -50);
      const cardScale = 0.82 + cardsProgress * 0.18;
      splashCard1.style.opacity = cardsProgress;
      splashCard1.style.transform = `translate(${offX}px, ${offY}px) scale(${cardScale})`;
      splashCard1.style.pointerEvents = cardsProgress >= 0.5 ? 'auto' : 'none';
    }

    // Card 2: Bottom-Center Wide Rectangle (Barrel Fluidics)
    if (splashCard2) {
      const offX = 0;
      const offY = (1 - cardsProgress) * (mobile ? 30 : 50);
      const cardScale = 0.82 + cardsProgress * 0.18;
      splashCard2.style.opacity = cardsProgress;
      splashCard2.style.transform = `translate(calc(-50% + ${offX}px), ${offY}px) scale(${cardScale})`;
      splashCard2.style.pointerEvents = cardsProgress >= 0.5 ? 'auto' : 'none';
    }

    // Card 3: Top-Right on Mobile, Right on Desktop (Anti-Reflux Gasket)
    if (splashCard3) {
      const offX = (1 - cardsProgress) * (mobile ? 30 : 140);
      const offY = (1 - cardsProgress) * (mobile ? -25 : -20);
      const cardScale = 0.82 + cardsProgress * 0.18;
      splashCard3.style.opacity = cardsProgress;
      splashCard3.style.transform = `translate(${offX}px, ${offY}px) scale(${cardScale})`;
      splashCard3.style.pointerEvents = cardsProgress >= 0.5 ? 'auto' : 'none';
    }
  }

  // Unified Scroll & Resize Handler
  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      updateHeroScroll();
      updateNeedleScroll();
      updateFeaturesScroll();
    });
  }, { passive: true });

  window.addEventListener('resize', () => {
    requestAnimationFrame(() => {
      updateHeroScroll();
      updateNeedleScroll();
      updateFeaturesScroll();
    });
  }, { passive: true });

  // Initial calculation
  updateHeroScroll();
  updateNeedleScroll();
  updateFeaturesScroll();

  // 5. Scroll Reveal Animations with IntersectionObserver for subsequent sections
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // 6. Interactive Dosage & Waste Savings Calculator
  const injectionsSlider = document.getElementById('injectionsSlider');
  const costSlider = document.getElementById('costSlider');
  const injectionsValDisplay = document.getElementById('injectionsValDisplay');
  const costValDisplay = document.getElementById('costValDisplay');
  const calcSavingsMoney = document.getElementById('calcSavingsMoney');
  const calcVolumeSaved = document.getElementById('calcVolumeSaved');
  const calcExtraDoses = document.getElementById('calcExtraDoses');

  function updateCalculator() {
    if (!injectionsSlider || !costSlider) return;

    const monthlyInjections = parseInt(injectionsSlider.value, 10);
    const costPerMl = parseFloat(costSlider.value);

    injectionsValDisplay.textContent = `${monthlyInjections.toLocaleString()} doses`;
    costValDisplay.textContent = `$${costPerMl.toFixed(0)} / mL`;

    const mlSavedPerMonth = monthlyInjections * 0.08;
    const mlSavedPerYear = mlSavedPerMonth * 12;
    const annualMoneySaved = mlSavedPerYear * costPerMl;
    const extraDoses = Math.round(mlSavedPerYear / 0.5);

    if (calcSavingsMoney) {
      calcSavingsMoney.textContent = `$${Math.round(annualMoneySaved).toLocaleString()}`;
    }
    if (calcVolumeSaved) {
      calcVolumeSaved.textContent = `${mlSavedPerYear.toFixed(1)} mL / yr`;
    }
    if (calcExtraDoses) {
      calcExtraDoses.textContent = `+${extraDoses.toLocaleString()} Doses`;
    }
  }

  if (injectionsSlider && costSlider) {
    injectionsSlider.addEventListener('input', updateCalculator);
    costSlider.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  // 7. Off-Canvas Order / Sample Drawer Interactions
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const craftDrawer = document.getElementById('craftDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerHeading = document.getElementById('drawerHeading');
  const formatSelect = document.getElementById('formatSelect');
  const cartItemsList = document.getElementById('cartItemsList');
  const menuToggle = document.getElementById('menuToggle');

  function openDrawer(mode = 'order', productName = '') {
    if (!drawerBackdrop) return;
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (mode === 'sample') {
      drawerHeading.textContent = 'REQUEST CLINICAL EVALUATION SAMPLES';
      if (formatSelect) formatSelect.value = 'sample_kit';
      cartItemsList.innerHTML = `
        <div style="background: var(--bg-cream-light); border: var(--border-thin); padding: 12px; border-left: 3px solid var(--accent-red); font-size: 13px;">
          <strong>CLINICAL EVALUATION KIT:</strong> Includes 1mL, 3mL, 5mL, 10mL sterile blisters + compliance dossier (Complimentary for certified medical facilities).
        </div>
      `;
    } else {
      drawerHeading.textContent = 'DIRECT CLINICAL PROCUREMENT';
      if (productName) {
        cartItemsList.innerHTML = `
          <div style="background: var(--bg-cream-light); border: var(--border-thin); padding: 12px; border-left: 3px solid var(--accent-red); font-size: 13px;">
            <strong>SELECTED:</strong> ${productName}
          </div>
        `;
      } else {
        cartItemsList.innerHTML = `
          <div style="background: var(--bg-cream-light); border: var(--border-thin); padding: 12px; border-left: 3px solid var(--accent-red); font-size: 13px;">
            <strong>EXPEDITED DISPATCH:</strong> Select your format below.
          </div>
        `;
      }
    }
    playClinicalClick('click');
  }

  function closeDrawer() {
    if (!drawerBackdrop) return;
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-drawer-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.getAttribute('data-tab') || 'order';
      openDrawer(tab);
    });
  });

  document.querySelectorAll('.btn-add-format').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prod = e.currentTarget.getAttribute('data-product');
      openDrawer('order', prod);
    });
  });

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeDrawer();
    });
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      openDrawer('order', 'Quick Navigation Index');
    });
  }

  // 8. Toast Notification Helper
  const craftToast = document.getElementById('craftToast');
  function showToast(message) {
    if (!craftToast) return;
    craftToast.textContent = message;
    craftToast.classList.add('show');
    playClinicalClick('success');
    setTimeout(() => {
      craftToast.classList.remove('show');
    }, 4500);
  }

  // 9. Order / Sample Form Handler
  const orderSampleForm = document.getElementById('orderSampleForm');
  if (orderSampleForm) {
    orderSampleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeDrawer();
      showToast('✓ Request Registered. Dispatch reference #UF-2026-' + Math.floor(1000 + Math.random() * 9000));
      orderSampleForm.reset();
    });
  }

  // 10. Newsletter Form Handler
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('✓ Subscribed to AI-DISPO Clinical Technical Dispatch.');
      newsletterForm.reset();
    });
  }

  // 11. Read More Spec Modals / Inline Alerts
  document.querySelectorAll('.spec-read-more-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const info = e.currentTarget.getAttribute('data-spec-info');
      showToast('SPEC NOTE: ' + info);
    });
  });

  // 12. Interactive Hotspot / Splash Hover on Feature Stage
  const featureCenterImg = document.getElementById('featureCenterImg');
  const splashCards = document.querySelectorAll('.splash-feature-card');

  splashCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      const feat = card.getAttribute('data-feature');
      if (featureCenterImg) {
        if (feat === 'needle') {
          featureCenterImg.style.transform = 'scale(1.06) translateX(15px)';
        } else if (feat === 'deadspace') {
          featureCenterImg.style.transform = 'scale(1.06) translateX(-10px)';
        } else if (feat === 'reflux') {
          featureCenterImg.style.transform = 'scale(1.06) translateX(-25px)';
        }
      }
    });

    card.addEventListener('mouseleave', () => {
      if (featureCenterImg) {
        featureCenterImg.style.transform = 'scale(1) translateX(0)';
      }
    });
  });

  // 13. SECTION: BALLISTIC IMPACT LAB (FLYING & STICKING SYRINGE)
  const impactLabSection = document.getElementById('impactLab');
  const fireNeedleBtn = document.getElementById('fireNeedleBtn');
  const flyingSyringeChassis = document.getElementById('flyingSyringeChassis');
  const impactShockwave = document.getElementById('impactShockwave');
  const impactFlash = document.getElementById('impactFlash');
  const impactPunctureMark = document.getElementById('impactPunctureMark');
  const targetHudBadge = document.getElementById('targetHudBadge');
  const hudStatusText = document.getElementById('hudStatusText');
  const consoleLog = document.getElementById('consoleLog');

  const metricForce = document.getElementById('metricForce');
  const barForce = document.getElementById('barForce');
  const metricDeflection = document.getElementById('metricDeflection');
  const barDeflection = document.getElementById('barDeflection');
  const metricSpeed = document.getElementById('metricSpeed');
  const barSpeed = document.getElementById('barSpeed');
  const metricIntegrity = document.getElementById('metricIntegrity');
  const barIntegrity = document.getElementById('barIntegrity');

  const gaugePills = document.querySelectorAll('.gauge-pill');

  let currentGauge = '25G';
  let isFiring = false;
  let hasAutoFired = false;

  const gaugeConfigs = {
    '25G': { force: '0.82', forcePct: 28, speed: '4.8', speedPct: 82, defl: '0.00', desc: 'Standard Clinical' },
    '27G': { force: '0.54', forcePct: 18, speed: '5.4', speedPct: 90, defl: '0.01', desc: 'Micro-Dispense' },
    '30G': { force: '0.32', forcePct: 11, speed: '6.1', speedPct: 98, defl: '0.02', desc: 'Pediatric Ultra-Fine' }
  };

  function playImpactSound() {
    if (!audioEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      // 1. Kinetic thud
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(34, now + 0.18);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.22);

      // 2. Needle tip puncture click
      const snapOsc = audioCtx.createOscillator();
      const snapGain = audioCtx.createGain();
      snapOsc.type = 'sine';
      snapOsc.frequency.setValueAtTime(1100, now);
      snapOsc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
      snapGain.gain.setValueAtTime(0.3, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      snapOsc.connect(snapGain);
      snapGain.connect(audioCtx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.07);

      // 3. Elastic metallic quiver resonance
      const twangOsc = audioCtx.createOscillator();
      const twangGain = audioCtx.createGain();
      twangOsc.type = 'sawtooth';
      twangOsc.frequency.setValueAtTime(640, now + 0.02);
      twangOsc.frequency.exponentialRampToValueAtTime(320, now + 0.35);
      twangGain.gain.setValueAtTime(0.12, now + 0.02);
      twangGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      twangOsc.connect(twangGain);
      twangGain.connect(audioCtx.destination);
      twangOsc.start(now + 0.02);
      twangOsc.stop(now + 0.38);
    } catch (e) { }
  }

  function appendConsoleLog(text, type = '') {
    if (!consoleLog) return;
    const entry = document.createElement('div');
    entry.className = 'console-entry' + (type ? ' ' + type : '');
    entry.textContent = text;
    consoleLog.appendChild(entry);
    if (consoleLog.children.length > 5) {
      consoleLog.removeChild(consoleLog.children[0]);
    }
  }

  function launchBallisticNeedle() {
    if (isFiring || !flyingSyringeChassis) return;
    isFiring = true;

    // Reset visual elements
    flyingSyringeChassis.className = 'flying-syringe-chassis';
    if (impactShockwave) impactShockwave.className = 'impact-shockwave';
    if (impactFlash) impactFlash.className = 'impact-flash';
    if (impactPunctureMark) impactPunctureMark.classList.remove('visible');
    if (targetHudBadge) {
      targetHudBadge.classList.remove('locked');
      if (hudStatusText) hudStatusText.textContent = 'IN FLIGHT // VELOCITY LOCK...';
    }

    const cfg = gaugeConfigs[currentGauge] || gaugeConfigs['25G'];
    appendConsoleLog(`[LAUNCH] Firing ${currentGauge} Tri-Bevel cannula into target matrix...`, 'highlight');

    // Force reflow
    void flyingSyringeChassis.offsetWidth;

    // Trigger 3D flying in animation
    flyingSyringeChassis.classList.add('state-flying');

    // Time until needle tip hits the bullseye (360ms)
    setTimeout(() => {
      // 1. Switch to stuck & quivering state
      flyingSyringeChassis.classList.remove('state-flying');
      void flyingSyringeChassis.offsetWidth;
      flyingSyringeChassis.classList.add('state-stuck');

      // 2. Play impact sound
      playImpactSound();

      // 3. Shockwave & flash
      if (impactShockwave) impactShockwave.classList.add('fire');
      if (impactFlash) impactFlash.classList.add('fire');
      if (impactPunctureMark) impactPunctureMark.classList.add('visible');

      // 4. Update HUD
      if (targetHudBadge) {
        targetHudBadge.classList.add('locked');
        if (hudStatusText) hudStatusText.textContent = `TARGET LOCKED // ${currentGauge} PIERCED`;
      }

      // 5. Update Telemetry metrics
      if (metricForce) metricForce.innerHTML = `${cfg.force} <span class="unit">N</span>`;
      if (barForce) barForce.style.width = `${cfg.forcePct}%`;
      if (metricSpeed) metricSpeed.innerHTML = `${cfg.speed} <span class="unit">M/S</span>`;
      if (barSpeed) barSpeed.style.width = `${cfg.speedPct}%`;
      if (metricDeflection) metricDeflection.innerHTML = `${cfg.defl} <span class="unit">DEG</span>`;

      appendConsoleLog(`[IMPACT] Normal hit. Force: ${cfg.force} N. Deflection: ${cfg.defl}°.`, 'success');
      appendConsoleLog(`[SECURE] Elastic needle resonance absorbed. Hermetic seal verified.`, 'success');

      setTimeout(() => {
        isFiring = false;
      }, 750);
    }, 360);
  }

  if (fireNeedleBtn) {
    fireNeedleBtn.addEventListener('click', () => {
      launchBallisticNeedle();
    });
  }

  gaugePills.forEach(pill => {
    pill.addEventListener('click', () => {
      gaugePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentGauge = pill.getAttribute('data-gauge') || '25G';
      launchBallisticNeedle();
    });
  });

  // Automatically trigger the flying & sticking animation once when scrolled into view
  if (impactLabSection) {
    const impactObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAutoFired) {
          hasAutoFired = true;
          setTimeout(() => {
            launchBallisticNeedle();
          }, 350);
        }
      });
    }, { threshold: 0.35 });

    impactObserver.observe(impactLabSection);
  }

  // =========================================================================
  // 14. PRECISION CLINICAL RETICLE CURSOR
  // =========================================================================
  const clinicalCursor = document.getElementById('clinicalCursor');
  const cursorCoords = document.getElementById('cursorCoords');

  if (clinicalCursor && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      clinicalCursor.style.opacity = '1';
      clinicalCursor.style.left = e.clientX + 'px';
      clinicalCursor.style.top = e.clientY + 'px';
      if (cursorCoords) {
        cursorCoords.textContent = `${e.clientX.toString().padStart(4, '0')} // ${e.clientY.toString().padStart(4, '0')}`;
      }
    });

    document.addEventListener('mousedown', () => {
      clinicalCursor.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
      clinicalCursor.classList.remove('clicking');
    });

    // Add hovering effect on interactive targets
    const interactiveTargets = document.querySelectorAll('button, a, input, select, .splash-feature-card, .format-card, .spec-row, .impact-target-board, .gauge-pill');
    interactiveTargets.forEach(elem => {
      elem.addEventListener('mouseenter', () => clinicalCursor.classList.add('hovering'));
      elem.addEventListener('mouseleave', () => clinicalCursor.classList.remove('hovering'));
    });
  }

  // =========================================================================
  // 15. HERO AMBIENT DUST PARTICLES & LASER SCAN SWEEP
  // =========================================================================
  const heroDustField = document.getElementById('heroDustField');
  if (heroDustField) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'dust-particle';
      const size = Math.random() * 5 + 3;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = (Math.random() * 5) + 's';
      p.style.animationDuration = (Math.random() * 4 + 4) + 's';
      heroDustField.appendChild(p);
    }
  }



  // =========================================================================
  // 16. HERO INTERACTIVE DOSE ASPIRATION / FILL SIMULATOR
  // =========================================================================
  const heroDrawBtn = document.getElementById('heroDrawBtn');
  const heroDrawBtnText = document.getElementById('heroDrawBtnText');
  const heroFluidCore = document.getElementById('heroFluidCore');
  const heroStatResidual = document.getElementById('heroStatResidual');
  let isFluidFilled = false;

  if (heroDrawBtn) {
    heroDrawBtn.addEventListener('click', () => {
      isFluidFilled = !isFluidFilled;
      if (isFluidFilled) {
        if (heroFluidCore) heroFluidCore.classList.add('filled');
        heroDrawBtn.classList.add('active');
        if (heroDrawBtnText) heroDrawBtnText.textContent = 'EXPEL / DISPENSE DOSE';
        if (heroStatResidual) heroStatResidual.textContent = '3.000 mL (DRAWN)';
        playClinicalClick('aspirate');
        showToast('✓ 3.0 mL clinical medication volume aspirated into zero-deadspace chamber.');
      } else {
        if (heroFluidCore) heroFluidCore.classList.remove('filled');
        heroDrawBtn.classList.remove('active');
        if (heroDrawBtnText) heroDrawBtnText.textContent = 'ASPIRATE 3.0 mL DOSE';
        if (heroStatResidual) heroStatResidual.textContent = '< 0.005 mL';
        playClinicalClick('inject');
        showToast('✓ Fluid dispensed. Zero residual waste detected in nozzle cone (<0.005 mL).');
      }
    });
  }

  // =========================================================================
  // 17. SECTION 3: NEEDLE MACRO MICRO-DROPLET DISPENSE SIMULATOR
  // =========================================================================
  const dispenseDropletBtn = document.getElementById('dispenseDropletBtn');
  const needleDroplet = document.getElementById('needleDroplet');
  const needleDropletSplash = document.getElementById('needleDropletSplash');
  let isDispensing = false;

  if (dispenseDropletBtn && needleDroplet) {
    dispenseDropletBtn.addEventListener('click', () => {
      if (isDispensing) return;
      isDispensing = true;
      dispenseDropletBtn.style.pointerEvents = 'none';

      playClinicalClick('droplet');

      // 1. Swell droplet at needle bevel tip
      needleDroplet.className = 'needle-fluid-droplet swelling';

      setTimeout(() => {
        // 2. Drop fluid bead
        needleDroplet.className = 'needle-fluid-droplet dropping';

        setTimeout(() => {
          // 3. Splash wave on impact
          if (needleDropletSplash) {
            needleDropletSplash.classList.remove('splash');
            void needleDropletSplash.offsetWidth;
            needleDropletSplash.classList.add('splash');
          }
          playClinicalClick('click');

          setTimeout(() => {
            needleDroplet.className = 'needle-fluid-droplet';
            isDispensing = false;
            dispenseDropletBtn.style.pointerEvents = 'auto';
          }, 300);
        }, 450);
      }, 700);
    });
  }

  // =========================================================================
  // 18. SECTION 5: TARGET BOARD INTERACTIVE CLICK-TO-AIM & SPARK PARTICLES
  // =========================================================================
  const impactTargetBoard = document.getElementById('impactTargetBoard');
  const targetLaserPointer = document.getElementById('targetLaserPointer');
  const impactSparksWrap = document.getElementById('impactSparksWrap');

  function triggerImpactSparks() {
    if (!impactSparksWrap) return;
    impactSparksWrap.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const spark = document.createElement('div');
      spark.className = 'impact-spark';
      const angle = (Math.random() * 360) + 'deg';
      const dist = (Math.random() * 40 + 25) + 'px';
      spark.style.setProperty('--angle', angle);
      spark.style.setProperty('--dist', dist);
      impactSparksWrap.appendChild(spark);
    }
  }

  if (impactTargetBoard) {
    impactTargetBoard.addEventListener('mousemove', (e) => {
      if (!targetLaserPointer) return;
      const rect = impactTargetBoard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      targetLaserPointer.style.opacity = '1';
      targetLaserPointer.style.left = x + 'px';
      targetLaserPointer.style.top = y + 'px';
    });

    impactTargetBoard.addEventListener('mouseleave', () => {
      if (targetLaserPointer) targetLaserPointer.style.opacity = '0';
    });

    // Clicking anywhere on the target matrix fires the syringe into the board!
    impactTargetBoard.addEventListener('click', () => {
      launchBallisticNeedle();
      setTimeout(triggerImpactSparks, 360);
    });
  }

  // =========================================================================
  // 19. 3D MAGNETIC HOVER TILTS ON CARDS
  // =========================================================================
  const tiltCards = document.querySelectorAll('.splash-feature-card, .format-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (isMobile()) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / cy) * -8;
      const tiltY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // =========================================================================
  // 20. SCROLL-DRIVEN COMPONENT ASSEMBLY ENGINE (SYRINGE & IV CANNULA)
  // =========================================================================
  function initAssemblyScrollEngine() {
    // Preload image assets
    const preloadList = [
      'assets/syringe/01-needle-tip.png',
      'assets/syringe/02-needle-shaft.png',
      'assets/syringe/03-needle-hub.png',
      'assets/syringe/04-luer-nozzle.png',
      'assets/syringe/05-barrel.png',
      'assets/syringe/06-graduation-marks.png',
      'assets/syringe/07-rubber-stopper.png',
      'assets/syringe/08-plunger-rod.png',
      'assets/syringe/09-flange.png',
      'assets/syringe/10-thumb-pad.png',
      'assets/syringe/full-syringe.png',
      'assets/cannula/01-introducer-needle.png',
      'assets/cannula/02-catheter-tube.png',
      'assets/cannula/03-catheter-hub.png',
      'assets/cannula/04-stabilising-wings.png',
      'assets/cannula/05-injection-port.png',
      'assets/cannula/06-port-cover-flap.png',
      'assets/cannula/07-flashback-chamber.png',
      'assets/cannula/08-luer-cap.png',
      'assets/cannula/full-cannula.png'
    ];
    preloadList.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Syringe Assembly Metadata (Calibrated for Green Plunger Syringe)
    const syringePartsData = [
      {
        name: 'Needle Bevel Tip',
        desc: 'Laser-honed tri-bevel point minimizing tissue trauma and penetration force.',
        spec: '25G Lancet Bevel • ISO 7864',
        dx: -280, dy: -30, rot: -12, scale: 0.8,
        anchorX: 9.2, anchorY: 50.0
      },
      {
        name: 'Stainless Needle Shaft',
        desc: 'Medical-grade 304 stainless steel cannula with electro-polished siliconized lumen.',
        spec: 'Wall Thickness: 0.08mm • Ultra-Smooth Polish',
        dx: -200, dy: 60, rot: 8, scale: 0.9,
        anchorX: 16.3, anchorY: 49.9
      },
      {
        name: 'Needle Hub',
        desc: 'Translucent polypropylene hub color-coded for instant clinical gauge recognition.',
        spec: '6% Luer Taper • Medical-Grade PP',
        dx: -50, dy: -180, rot: -15, scale: 1.1,
        anchorX: 25.6, anchorY: 49.8
      },
      {
        name: 'Luer Lock Nozzle',
        desc: 'Engineered concentric male Luer lock nozzle ensuring leak-tight zero dead-space dock.',
        spec: 'Pressure Rating: 4.5 bar • Zero Residual Volume',
        dx: 40, dy: -140, rot: 10, scale: 1.0,
        anchorX: 31.5, anchorY: 50.4
      },
      {
        name: 'Graduated Barrel',
        desc: 'High-clarity biocompatible polypropylene cylinder for complete bubble inspection.',
        spec: 'USP Class VI Plastic • High Optical Transparency',
        dx: 0, dy: 220, rot: 4, scale: 0.9,
        anchorX: 54.3, anchorY: 50.1
      },
      {
        name: 'Graduation Scale',
        desc: 'Indelible high-contrast calibrated print providing ±0.005 mL clinical dosing accuracy.',
        spec: 'ISO 7886-1 Metric Scale • Smudge-Proof Ink',
        dx: 0, dy: -60, rot: 0, scale: 1.08,
        anchorX: 54.1, anchorY: 46.5
      },
      {
        name: 'Rubber Stopper',
        desc: 'Latex-free double-contact elastomeric piston sealing the barrel with zero friction glide.',
        spec: 'Latex-Free Synthetic Polyisoprene • Silicone Lubricated',
        dx: 180, dy: -40, rot: -8, scale: 0.9,
        anchorX: 51.6, anchorY: 50.1
      },
      {
        name: 'Green Plunger Rod',
        desc: 'High-visibility green cruciform reinforced plunger shaft designed to resist deflection under high injection forces.',
        spec: 'High-Rigidity Polymer • Precision Green Plunger',
        dx: 320, dy: 30, rot: 6, scale: 0.95,
        anchorX: 72.1, anchorY: 50.1
      },
      {
        name: 'Finger Flange',
        desc: 'Ergonomic widened grip wings giving clinicians maximum tactile stability during aspiration.',
        spec: 'Dual-Sided Anti-Slip Ribbing • High-Load Wings',
        dx: 60, dy: -180, rot: -12, scale: 1.1,
        anchorX: 76.3, anchorY: 49.9
      },
      {
        name: 'Thumb Press Pad',
        desc: 'Concentric textured contact pad ensuring positive thumb engagement during single-handed dosing.',
        spec: 'Anti-Slip Concentric Ridge • Direct Force Vector',
        dx: 260, dy: -30, rot: 15, scale: 1.0,
        anchorX: 91.5, anchorY: 49.5
      }
    ];

    // Cannula Assembly Metadata
    const cannulaPartsData = [
      {
        name: 'Introducer Trocar Needle',
        desc: 'Siliconized 304 stainless steel needle ground with back-cut bevel geometry for smooth venipuncture.',
        spec: 'Back-Cut Lancet Bevel • Siliconized 304 SS',
        dx: -280, dy: -40, rot: -10, scale: 0.9,
        anchorX: 20.3, anchorY: 49.7
      },
      {
        name: 'PTFE Catheter Tube',
        desc: 'Thin-walled flexible fluoropolymer sheath with tapered tip for smooth intravenous advancement.',
        spec: 'Biocompatible PTFE / FEP • Radiopaque Stripes',
        dx: -120, dy: 80, rot: 8, scale: 0.95,
        anchorX: 37.4, anchorY: 50.1
      },
      {
        name: 'Catheter Hub',
        desc: 'Ergonomically molded 20G pink body with built-in internal blood channel and standard Luer connection.',
        spec: 'Standard Luer Lock Female Fitting • ISO 10555-5',
        dx: 40, dy: -160, rot: -8, scale: 1.05,
        anchorX: 44.3, anchorY: 50.5
      },
      {
        name: 'Stabilising Wings',
        desc: 'Flexible medical-grade wings conforming to patient anatomy for secure, movement-free fixation.',
        spec: 'Skin-Friendly Elastomer • Suture Hole Guides',
        dx: -30, dy: 180, rot: 15, scale: 0.85,
        anchorX: 50.9, anchorY: 59.9
      },
      {
        name: 'Injection Port & Pink Cap',
        desc: 'Self-sealing non-coring silicone valve allowing rapid intermittent needleless bolus drug delivery.',
        spec: 'Color-Coded 20G (Pink) • Zero Back-Flow Valve',
        dx: 0, dy: -200, rot: 5, scale: 1.15,
        anchorX: 53.0, anchorY: 40.4
      },
      {
        name: 'Port Cover Flap',
        desc: 'Hinged snap-lock protective cover guarding the injection port against airborne microbial contamination.',
        spec: 'Integrated Hinge Strap • Snap-Click Seal',
        dx: 90, dy: -120, rot: -20, scale: 1.0,
        anchorX: 59.6, anchorY: 41.7
      },
      {
        name: 'Flashback Chamber',
        desc: 'High-transparency visual chamber providing instantaneous venous blood return confirmation.',
        spec: 'High-Transparency Barrel • Instant Visual Confirmation',
        dx: 240, dy: 60, rot: 8, scale: 0.9,
        anchorX: 74.1, anchorY: 50.8
      },
      {
        name: 'Vented Luer Cap',
        desc: 'Hydrophobic membrane filter plug allowing air escape while preventing any blood leakage.',
        spec: '0.22µm Hydrophobic Filter • Luer Lock Plug',
        dx: 280, dy: -20, rot: 12, scale: 1.0,
        anchorX: 90.1, anchorY: 50.8
      }
    ];

    // DOM Elements - Syringe
    const sTrack = document.getElementById('syringeAssemblyTrack');
    const sDeviceFrame = document.getElementById('syringeDeviceFrame');
    const sPulse = document.getElementById('syringeJointPulse');
    const sLine = document.getElementById('syringeLeaderLine');
    const sAnchor = document.getElementById('syringeLeaderAnchor');
    const sTarget = document.getElementById('syringeLeaderTarget');
    const sBadge = document.getElementById('syringeCounterBadge');
    const sProgress = document.getElementById('syringeProgressBar');
    const sTitle = document.getElementById('syringePartTitle');
    const sDesc = document.getElementById('syringePartDesc');
    const sSpec = document.getElementById('syringePartSpec');
    const sTag = document.getElementById('syringePartTag');
    const sStatus = document.getElementById('syringeStatusPill');
    const sCompleteLayer = document.getElementById('syringeCompleteLayer');
    const sCompleteImg = document.getElementById('syringeCompleteImg');
    const sDroplet = document.getElementById('syringeDropletBead');
    const sBonusBanner = document.getElementById('syringeBonusBanner');
    const sDots = document.querySelectorAll('#syringeDots .assembly-dot');

    // DOM Elements - Cannula
    const cTrack = document.getElementById('cannulaAssemblyTrack');
    const cDeviceFrame = document.getElementById('cannulaDeviceFrame');
    const cPulse = document.getElementById('cannulaJointPulse');
    const cLine = document.getElementById('cannulaLeaderLine');
    const cAnchor = document.getElementById('cannulaLeaderAnchor');
    const cTarget = document.getElementById('cannulaLeaderTarget');
    const cBadge = document.getElementById('cannulaCounterBadge');
    const cProgress = document.getElementById('cannulaProgressBar');
    const cTitle = document.getElementById('cannulaPartTitle');
    const cDesc = document.getElementById('cannulaPartDesc');
    const cSpec = document.getElementById('cannulaPartSpec');
    const cTag = document.getElementById('cannulaPartTag');
    const cStatus = document.getElementById('cannulaStatusPill');
    const cCompleteLayer = document.getElementById('cannulaCompleteLayer');
    const cBonusBanner = document.getElementById('cannulaBonusBanner');
    const cDots = document.querySelectorAll('#cannulaDots .assembly-dot');

    let sLastAttached = -1;
    let cLastAttached = -1;

    // Pulse triggering helper
    function triggerPulse(pulseElem, pctX, pctY) {
      if (!pulseElem) return;
      pulseElem.style.left = pctX + '%';
      pulseElem.style.top = pctY + '%';
      pulseElem.classList.remove('pulse');
      void pulseElem.offsetWidth; // force reflow
      pulseElem.classList.add('pulse');
      playClinicalClick('click');
    }

    // Generic section animator
    function updateSectionAssembly(
      track,
      deviceFrame,
      partsData,
      partPrefix,
      pulseElem,
      lineElem,
      anchorElem,
      targetElem,
      badgeElem,
      progressElem,
      titleElem,
      descElem,
      specElem,
      tagElem,
      statusElem,
      dots,
      completeLayer,
      bonusBanner,
      isCannula
    ) {
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const scrollDistance = track.offsetHeight - window.innerHeight;
      if (scrollDistance <= 0) return;

      const progress = Math.min(Math.max(-rect.top / scrollDistance, 0), 1);
      const totalParts = partsData.length;

      // Map progress across assembly window [0.03 .. 0.86]
      const assemblyStart = 0.03;
      const assemblyEnd = 0.86;
      const normalizedP = Math.min(Math.max((progress - assemblyStart) / (assemblyEnd - assemblyStart), 0), 1);

      let activeIndex = Math.min(Math.floor(normalizedP * totalParts), totalParts - 1);
      if (progress < assemblyStart) activeIndex = 0;

      // Animate each part layer
      for (let i = 0; i < totalParts; i++) {
        const partElem = document.getElementById(partPrefix + i);
        if (!partElem) continue;
        const pData = partsData[i];

        // Part active arrival window
        const pStart = i / totalParts;
        const pEnd = (i + 0.82) / totalParts;

        if (normalizedP <= pStart) {
          // Unattached / outside
          partElem.style.transform = `translate3d(${pData.dx}px, ${pData.dy}px, 0) rotate(${pData.rot}deg) scale(${pData.scale})`;
          partElem.style.opacity = '0';
        } else if (normalizedP >= pEnd) {
          // Attached & locked in final position
          partElem.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
          partElem.style.opacity = '1';
        } else {
          // Currently flying in
          const localT = (normalizedP - pStart) / (pEnd - pStart);
          const ease = 1 - Math.pow(1 - localT, 3); // cubic ease-out
          const curDx = (1 - ease) * pData.dx;
          const curDy = (1 - ease) * pData.dy;
          const curRot = (1 - ease) * pData.rot;
          const curScale = pData.scale + ease * (1 - pData.scale);
          const curOpacity = Math.min(localT * 1.6, 1);

          partElem.style.transform = `translate3d(${curDx}px, ${curDy}px, 0) rotate(${curRot}deg) scale(${curScale})`;
          partElem.style.opacity = curOpacity;
        }
      }

      // Check snap attachment pulse
      const currentSnap = Math.floor(normalizedP * totalParts);
      if (isCannula) {
        if (currentSnap > cLastAttached && currentSnap < totalParts && normalizedP > 0.05) {
          cLastAttached = currentSnap;
          triggerPulse(pulseElem, partsData[currentSnap].anchorX, partsData[currentSnap].anchorY);
        } else if (currentSnap < cLastAttached) {
          cLastAttached = currentSnap;
        }
      } else {
        if (currentSnap > sLastAttached && currentSnap < totalParts && normalizedP > 0.05) {
          sLastAttached = currentSnap;
          triggerPulse(pulseElem, partsData[currentSnap].anchorX, partsData[currentSnap].anchorY);
        } else if (currentSnap < sLastAttached) {
          sLastAttached = currentSnap;
        }
      }

      // Update HUD Info Card
      const activeData = partsData[activeIndex];
      if (activeData) {
        if (titleElem && titleElem.textContent !== activeData.name) {
          titleElem.textContent = activeData.name;
        }
        if (descElem && descElem.textContent !== activeData.desc) {
          descElem.textContent = activeData.desc;
        }
        if (specElem && specElem.textContent !== activeData.spec) {
          specElem.textContent = activeData.spec;
        }
        if (tagElem) {
          const numStr = String(activeIndex + 1).padStart(2, '0');
          const totalStr = String(totalParts).padStart(2, '0');
          tagElem.textContent = `PART ${numStr} OF ${totalStr}`;
        }
        if (badgeElem) {
          badgeElem.textContent = `Part ${activeIndex + 1} / ${totalParts}`;
        }
        if (progressElem) {
          const pct = Math.min(Math.max(progress * 100, 6), 100);
          progressElem.style.width = pct + '%';
        }
        if (statusElem) {
          if (normalizedP <= 0.02) {
            statusElem.textContent = 'READY';
          } else if (progress > assemblyEnd) {
            statusElem.textContent = 'ATTACHED ✓';
          } else {
            statusElem.textContent = 'SNAP FIT';
          }
        }

        // Update Dots
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIndex);
        });

        // Update SVG Leader Line to Side Card
        const leaderSvg = deviceFrame ? deviceFrame.querySelector('.assembly-leader-svg') : null;
        if (leaderSvg) {
          leaderSvg.style.opacity = (normalizedP > 0.02 && progress < 0.86 && window.innerWidth > 990) ? '1' : '0';
        }

        if (deviceFrame && lineElem && anchorElem && targetElem && window.innerWidth > 990) {
          const fWidth = deviceFrame.offsetWidth;
          const fHeight = deviceFrame.offsetHeight;
          const ax = (activeData.anchorX / 100) * fWidth;
          const ay = (activeData.anchorY / 100) * fHeight;
          const tx = fWidth + 30; // Points straight toward right side card
          const ty = fHeight * 0.45;

          lineElem.setAttribute('x1', ax);
          lineElem.setAttribute('y1', ay);
          lineElem.setAttribute('x2', tx);
          lineElem.setAttribute('y2', ty);

          anchorElem.setAttribute('cx', ax);
          anchorElem.setAttribute('cy', ay);
          targetElem.setAttribute('cx', tx);
          targetElem.setAttribute('cy', ty);
        }
      }

      // Bonus Animations at end of scroll track [0.86 .. 1.0]
      const ghostElem = deviceFrame ? deviceFrame.querySelector('.assembly-ghost-silhouette') : null;
      const partsContainer = deviceFrame ? deviceFrame.querySelector('.assembly-parts-container') : null;

      if (progress >= 0.86) {
        if (completeLayer) completeLayer.classList.add('visible');
        if (bonusBanner) bonusBanner.classList.add('active');
        if (ghostElem) ghostElem.style.opacity = '0';
        if (partsContainer) partsContainer.style.opacity = '0';

        const bonusT = (progress - 0.86) / 0.14; // 0 to 1

        if (!isCannula) {
          // Syringe Plunger push/pull aspiration demonstration
          if (sCompleteImg) {
            const cycle = Math.sin(bonusT * Math.PI * 2);
            const shiftX = cycle * 42;
            sCompleteImg.style.transform = `translateX(${shiftX}px)`;
          }
          if (sDroplet) {
            sDroplet.classList.toggle('visible', bonusT > 0.35 && bonusT < 0.85);
          }
        }
      } else {
        if (completeLayer) completeLayer.classList.remove('visible');
        if (bonusBanner) bonusBanner.classList.remove('active');
        if (ghostElem) ghostElem.style.opacity = '';
        if (partsContainer) partsContainer.style.opacity = '1';

        if (!isCannula) {
          if (sCompleteImg) sCompleteImg.style.transform = '';
          if (sDroplet) sDroplet.classList.remove('visible');
        }
      }
    }

    // Assembly Render Loop
    function onAssemblyScroll() {
      updateSectionAssembly(
        sTrack,
        sDeviceFrame,
        syringePartsData,
        'sPart',
        sPulse,
        sLine,
        sAnchor,
        sTarget,
        sBadge,
        sProgress,
        sTitle,
        sDesc,
        sSpec,
        sTag,
        sStatus,
        sDots,
        sCompleteLayer,
        sBonusBanner,
        false
      );

      updateSectionAssembly(
        cTrack,
        cDeviceFrame,
        cannulaPartsData,
        'cPart',
        cPulse,
        cLine,
        cAnchor,
        cTarget,
        cBadge,
        cProgress,
        cTitle,
        cDesc,
        cSpec,
        cTag,
        cStatus,
        cDots,
        cCompleteLayer,
        cBonusBanner,
        true
      );
    }

    window.addEventListener('scroll', onAssemblyScroll, { passive: true });
    window.addEventListener('resize', onAssemblyScroll, { passive: true });
    onAssemblyScroll();
  }

  initAssemblyScrollEngine();

  // Product Mega Dropdown Click & Touch Handlers
  const productDropdown = document.getElementById('productDropdown');
  const productDropdownBtn = document.getElementById('productDropdownBtn');
  if (productDropdown && productDropdownBtn) {
    productDropdownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isActive = productDropdown.classList.toggle('active');
      productDropdownBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      playClinicalClick('hover');
    });

    document.addEventListener('click', (e) => {
      if (!productDropdown.contains(e.target)) {
        productDropdown.classList.remove('active');
        productDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        productDropdown.classList.remove('active');
        productDropdownBtn.setAttribute('aria-expanded', 'false');
        playClinicalClick('click');
      });
    });
  }

  // Ensure navigation clicks prevent intro modal from re-triggering
  document.querySelectorAll('a, .nav-link, .mobile-nav-link, .brand-logo-wrap').forEach(link => {
    link.addEventListener('click', () => {
      try {
        sessionStorage.setItem('ai_dispo_intro_shown', 'true');
      } catch (err) { }
    });
  });

  console.log('AI-DISPO® UltraFlow Full-Section Scroll-Docking Architecture Initialized.');
});

