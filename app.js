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
    heroVisualStage.style.pointerEvents = 'none';
  }
  if (heroStickyContainer) {
    heroStickyContainer.addEventListener('mousemove', (e) => {
      if (isMobile()) return;
      const rect = heroStickyContainer.getBoundingClientRect();
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

    heroStickyContainer.addEventListener('mouseleave', () => {
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
    const startScale = mobile ? 1.0 : 1.40;
    const endScale = mobile ? 0.82 : 0.95;
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
      splashCard2.style.transform = `translate(${offX}px, ${offY}px) scale(${cardScale})`;
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
        const safeName = String(productName).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        cartItemsList.innerHTML = `
          <div style="background: var(--bg-cream-light); border: var(--border-thin); padding: 12px; border-left: 3px solid var(--accent-red); font-size: 13px;">
            <strong>SELECTED:</strong> ${safeName}
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
  const dispenseBtnText = document.getElementById('dispenseBtnText');
  const needleDroplet = document.getElementById('needleDroplet');
  const needleDropletSplash = document.getElementById('needleDropletSplash');
  const needleTelemetryText = document.getElementById('needleTelemetryText');
  const needleLiveDot = document.getElementById('needleLiveDot');
  let isDispensing = false;

  if (dispenseDropletBtn && needleDroplet) {
    dispenseDropletBtn.addEventListener('click', () => {
      if (isDispensing) return;
      isDispensing = true;
      dispenseDropletBtn.style.pointerEvents = 'none';

      if (dispenseBtnText) dispenseBtnText.textContent = 'DISPENSING BEAD...';
      if (needleTelemetryText) needleTelemetryText.innerHTML = 'EXPULSION IN PROGRESS &bull; 0.005 mL BEAD';
      if (needleLiveDot) {
        needleLiveDot.style.background = '#00A8FF';
        needleLiveDot.style.boxShadow = '0 0 10px #00A8FF';
      }

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

          if (dispenseBtnText) dispenseBtnText.textContent = 'DISPENSED (< 0.005 mL)';
          if (needleTelemetryText) needleTelemetryText.innerHTML = 'Micro-Dose Dispensed &bull; Minimal Dead Space';
          if (needleLiveDot) {
            needleLiveDot.style.background = '#059669';
            needleLiveDot.style.boxShadow = 'none';
          }
          if (typeof showToast === 'function') {
            showToast('Micro-droplet dispensed with < 0.005 mL residual volume.');
          }

          setTimeout(() => {
            needleDroplet.className = 'needle-fluid-droplet';
            if (dispenseBtnText) dispenseBtnText.textContent = 'TAP TO DISPENSE DROPLET';
            if (needleTelemetryText) needleTelemetryText.innerHTML = 'Siliconized Barrel &bull; Air-Tight Plunger Seal';
            isDispensing = false;
            dispenseDropletBtn.style.pointerEvents = 'auto';
          }, 1400);
        }, 450);
      }, 750);
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
      'assets/syringe/part-01-needle.png?v=clean_20261022_v4',
      'assets/syringe/part-02-barrel.png?v=clean_20261022_v4',
      'assets/syringe/part-03-graduations.png?v=clean_20261022_v4',
      'assets/syringe/part-04-gasket.png?v=clean_20261022_v4',
      'assets/syringe/part-05-plunger.png?v=clean_20261022_v4',
      'assets/syringe/part-06-thumbpad.png?v=clean_20261022_v4',
      'assets/syringe/full-syringe.png?v=clean_20261022_v4',
      'assets/cannula/v2/needle.png?v=v2_20261026',
      'assets/cannula/v2/luer-cap.png?v=v2_20261026',
      'assets/cannula/v2/flashback.png?v=v2_20261026',
      'assets/cannula/v2/catheter-hub.png?v=v2_20261026',
      'assets/cannula/v2/port-cap.png?v=v2_20261026'
    ];
    preloadList.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Syringe Exploded Deconstruction Metadata (6 Core Components - Assembled to Separated Portions)
    const syringePartsData = [
      {
        name: 'Hypodermic Needle Assembly',
        desc: 'Laser-honed tri-bevel cannula crafted from 304 medical stainless steel with an electro-polished lumen for smooth, painless penetration.',
        spec: '304 Medical Stainless • 25G Lancet Bevel',
        explodeX: -95, explodeY: 0,
        anchorX: 18.7, anchorY: 50.0
      },
      {
        name: 'Transparent Medical Barrel',
        desc: 'High-optical-clarity polypropylene cylinder engineered with precision luer nozzle and dual ergonomic finger flanges for complete volume inspection.',
        spec: 'USP Class VI Polypropylene • Integrated Luer Cone',
        explodeX: -20, explodeY: 0,
        anchorX: 53.8, anchorY: 50.0
      },
      {
        name: 'Precision Graduation Scale',
        desc: 'Indelible high-contrast metric markings calibrated to ISO 7886-1 providing instant bubble detection and verified micro-dosing accuracy.',
        spec: 'ISO 7886-1 Metric Scale • Solvent-Resistant Ink',
        explodeX: -20, explodeY: 0,
        anchorX: 54.1, anchorY: 50.0
      },
      {
        name: 'Elastomeric Piston Gasket',
        desc: 'Latex-free double-contact elastomeric stopper providing a hermetic barrel seal with frictionless, smooth aspiration glide.',
        spec: 'Latex-Free Synthetic Elastomer • Dual-Ring Hermetic Seal',
        explodeX: 40, explodeY: 0,
        anchorX: 52.0, anchorY: 50.0
      },
      {
        name: 'Cruciform Plunger Rod',
        desc: 'High-visibility green plunger shaft with reinforced cruciform geometry engineered to eliminate lateral deflection under injection force.',
        spec: 'Cruciform Beam Geometry • Deflection-Free Drive',
        explodeX: 95, explodeY: 0,
        anchorX: 72.1, anchorY: 50.1
      },
      {
        name: 'Ergonomic Thumb Press Pad',
        desc: 'Concentric textured contact surface providing maximum tactile control and positive single-handed administration.',
        spec: 'Anti-Slip Concentric Ribs • Positive Actuation Grip',
        explodeX: 150, explodeY: 0,
        anchorX: 91.5, anchorY: 49.6
      }
    ];

    // IV Cannula: five complete parts placed in one world (units = catheter-hub image px,
    // generated by extract_cannula_parts_v2.py). x/y/w/h is each part's assembled box and
    // explodeX/Y its separated offset; a part with `parent` rides along with that part.
    const cannulaWorldParts = {
      needle: { id: 'cvNeedle', x: -55, y: 248.3, w: 2834, h: 162, explodeX: 300, explodeY: 580, path: 'withdraw' },
      luer: { id: 'cvLuer', x: 3516.4, y: 160, w: 685.5, h: 340, explodeX: 650, explodeY: 0, parent: 'flashback', wobble: 6 },
      flashback: { id: 'cvFlashback', x: 2458, y: -20.4, w: 1437.1, h: 507.2, explodeX: 450, explodeY: 0 },
      hub: { id: 'cvHub', x: 0, y: 0, w: 2561, h: 700, explodeX: 0, explodeY: 0 },
      port: { id: 'cvPort', x: 1535.2, y: -226.4, w: 1098.5, h: 431.9, explodeX: 0, explodeY: -380, arcX: 70, tilt: -8 }
    };

    // Steps run outside-in, the way a cannula comes apart. anchor = where the leader line
    // touches the part (assembled world px); callout = blueprint label (exploded world px).
    // On phones labels are laid out in a row above or below the device (side) instead.
    const cannulaSteps = [
      {
        part: 'luer', name: 'Vented Luer Cap', short: 'Vented Luer Cap',
        desc: 'Hydrophobic membrane filter plug allowing air escape while preventing any blood leakage.',
        spec: '0.22µm Hydrophobic Filter • Luer Lock Plug',
        anchor: { x: 4010, y: 330 }, callout: { x: 4960, y: 40 }, side: 'above'
      },
      {
        part: 'port', name: 'Injection Port & Cover Flap', short: 'Injection Port',
        desc: 'Self-sealing non-coring valve under a hinged snap-lock cover for rapid, contamination-free bolus drug delivery.',
        spec: 'Color-Coded 20G (Pink) • Zero Back-Flow Valve',
        anchor: { x: 1745, y: -120 }, callout: { x: 980, y: -520 }, side: 'above'
      },
      {
        part: 'flashback', name: 'Flashback Chamber', short: 'Flashback Chamber',
        desc: 'High-transparency visual chamber providing instantaneous venous blood return confirmation.',
        spec: 'High-Transparency Barrel • Instant Visual Confirmation',
        anchor: { x: 3230, y: 330 }, callout: { x: 3700, y: -210 }, side: 'above'
      },
      {
        part: 'needle', name: 'Introducer Trocar Needle', short: 'Introducer Needle',
        desc: 'Siliconized 304 stainless steel needle with back-cut bevel geometry, withdrawn through the catheter once the vein is reached.',
        spec: 'Back-Cut Lancet Bevel • Siliconized 304 SS',
        anchor: { x: 2000, y: 330 }, callout: { x: 2000, y: 1120 }, side: 'below'
      },
      {
        part: 'hub', name: 'PTFE Catheter & Hub', short: 'Catheter & Hub',
        desc: 'Thin-walled radiopaque fluoropolymer catheter bonded to an ergonomic 20G pink hub with a standard Luer connection.',
        spec: 'Biocompatible PTFE / FEP • ISO 10555-5 Luer Hub',
        anchor: { x: 600, y: 330 }, callout: { x: 520, y: 110 }, side: 'below'
      },
      {
        part: 'hub', name: 'Stabilising Wings', short: 'Stabilising Wings',
        desc: 'Flexible medical-grade wings conforming to patient anatomy for secure, movement-free fixation on the skin.',
        spec: 'Skin-Friendly Elastomer • Suture Hole Guides',
        anchor: { x: 1620, y: 560 }, callout: { x: 2300, y: 640 }, side: 'below'
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

      const isExplodedMode = partsData.length > 0 && partsData[0].explodeX !== undefined;

      if (isExplodedMode) {
        // =====================================================================
        // EXPLODED DECONSTRUCTION MODE (Assembled -> Pulled Apart Portions)
        // =====================================================================
        const explodeStart = 0.05;
        const explodeEnd = 0.82;
        let activeIndex = 0;
        let ease = 0;

        if (progress < explodeStart) {
          // Assembled reference state (complete syringe sitting in center stage)
          ease = 0;
          activeIndex = 0;
        } else if (progress <= explodeEnd) {
          // Smooth collinear axial deconstruction
          const normP = (progress - explodeStart) / (explodeEnd - explodeStart);
          ease = 1 - Math.pow(1 - normP, 3);
          activeIndex = Math.min(Math.floor(normP * totalParts), totalParts - 1);
        } else {
          // Re-docking into fully assembled active demonstration
          const reDockT = (progress - explodeEnd) / (1 - explodeEnd);
          ease = Math.pow(1 - reDockT, 3);
          activeIndex = totalParts - 1;
        }

        // Precise rendered image geometry inside deviceFrame (accounting for object-fit: contain)
        const fWidth = deviceFrame ? deviceFrame.offsetWidth : 850;
        const fHeight = deviceFrame ? deviceFrame.offsetHeight : 500;
        const containerRatio = fWidth / (fHeight || 1);
        const imageRatio = 1376 / 768;
        let rWidth, rHeight, offX, offY;
        if (containerRatio > imageRatio) {
          rHeight = fHeight;
          rWidth = fHeight * imageRatio;
          offX = (fWidth - rWidth) / 2;
          offY = 0;
        } else {
          rWidth = fWidth;
          rHeight = fWidth / imageRatio;
          offX = 0;
          offY = (fHeight - rHeight) / 2;
        }
        const renderScale = rWidth / 1376;

        // Animate each component layer along its mechanical axis
        for (let i = 0; i < totalParts; i++) {
          const partElem = document.getElementById(partPrefix + i);
          if (!partElem) continue;
          const pData = partsData[i];
          const curX = ease * pData.explodeX * renderScale;
          const curY = ease * (pData.explodeY || 0) * renderScale;

          partElem.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
          partElem.style.opacity = '1';
          partElem.classList.toggle('active-part', i === activeIndex && progress >= explodeStart && progress <= explodeEnd);
        }

        // Check pulse on portion change
        if (progress >= explodeStart && progress <= explodeEnd) {
          if (activeIndex !== sLastAttached) {
            sLastAttached = activeIndex;
            const curAnchorX = offX + ((partsData[activeIndex].anchorX / 100) * rWidth) + (ease * partsData[activeIndex].explodeX * renderScale);
            const curAnchorY = offY + ((partsData[activeIndex].anchorY / 100) * rHeight) + (ease * (partsData[activeIndex].explodeY || 0) * renderScale);
            const pctX = (curAnchorX / fWidth) * 100;
            const pctY = (curAnchorY / fHeight) * 100;
            triggerPulse(pulseElem, pctX, pctY);
          }
        }

        // Update Info Card
        const activeData = partsData[activeIndex];
        if (activeData) {
          if (titleElem) {
            titleElem.textContent = (progress < explodeStart) ? 'Fully Assembled Syringe' : activeData.name;
          }
          if (descElem) {
            descElem.textContent = (progress < explodeStart) ?
              'Complete single-use medical disposable featuring zero dead-space geometry and flawless glide dynamics. Scroll down to deconstruct components.' :
              activeData.desc;
          }
          if (specElem) {
            specElem.textContent = (progress < explodeStart) ? 'ISO 7886-1 • USP Class VI Medical Standard' : activeData.spec;
          }
          if (tagElem) {
            const numStr = String(activeIndex + 1).padStart(2, '0');
            const totalStr = String(totalParts).padStart(2, '0');
            tagElem.textContent = (progress < explodeStart) ? 'COMPLETE DEVICE' : `PORTION ${numStr} OF ${totalStr}`;
          }
          if (badgeElem) {
            badgeElem.textContent = (progress < explodeStart) ? 'Assembled' : `Portion ${activeIndex + 1} / ${totalParts}`;
          }
          if (progressElem) {
            const pct = Math.min(Math.max(progress * 100, 100 / totalParts), 100);
            progressElem.style.width = pct + '%';
          }
          if (statusElem) {
            if (progress < explodeStart) {
              statusElem.textContent = 'ASSEMBLED';
            } else if (progress > explodeEnd) {
              statusElem.textContent = 'ASSEMBLED ✓';
            } else {
              statusElem.textContent = 'EXPLODED VIEW';
            }
          }

          // Update Dots
          dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeIndex);
          });

          // SVG Leader Line to moving anchor
          const leaderSvg = deviceFrame ? deviceFrame.querySelector('.assembly-leader-svg') : null;
          if (leaderSvg) {
            leaderSvg.style.opacity = (progress >= explodeStart && progress <= explodeEnd && window.innerWidth > 990) ? '1' : '0';
          }

          if (deviceFrame && lineElem && anchorElem && targetElem && window.innerWidth > 990) {
            const curAnchorX = offX + ((activeData.anchorX / 100) * rWidth) + (ease * activeData.explodeX * renderScale);
            const curAnchorY = offY + ((activeData.anchorY / 100) * rHeight) + (ease * (activeData.explodeY || 0) * renderScale);

            const cardElem = titleElem ? titleElem.closest('.assembly-info-card') : null;
            let tx = fWidth + 30;
            let ty = fHeight * 0.45;
            if (cardElem && deviceFrame) {
              const frameRect = deviceFrame.getBoundingClientRect();
              const cardRect = cardElem.getBoundingClientRect();
              tx = (cardRect.left - frameRect.left) - 8;
              ty = (cardRect.top - frameRect.top) + 36;
            }

            lineElem.setAttribute('x1', curAnchorX);
            lineElem.setAttribute('y1', curAnchorY);
            lineElem.setAttribute('x2', tx);
            lineElem.setAttribute('y2', ty);

            anchorElem.setAttribute('cx', curAnchorX);
            anchorElem.setAttribute('cy', curAnchorY);
            targetElem.setAttribute('cx', tx);
            targetElem.setAttribute('cy', ty);
          }
        }

        // Completion bonus (fluid push/pull) past explodeEnd
        if (progress >= 0.84) {
          if (bonusBanner) bonusBanner.classList.add('active');
          const bonusT = (progress - 0.84) / 0.16;
          if (sCompleteImg) {
            const cycle = Math.sin(bonusT * Math.PI * 2);
            sCompleteImg.style.transform = `translateX(${cycle * 42}px)`;
          }
          if (sDroplet) {
            sDroplet.classList.toggle('visible', bonusT > 0.35 && bonusT < 0.85);
          }
        } else {
          if (bonusBanner) bonusBanner.classList.remove('active');
          if (sCompleteImg) sCompleteImg.style.transform = '';
          if (sDroplet) sDroplet.classList.remove('visible');
        }
        return;
      }

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

        const cScale = Math.min(Math.max(window.innerWidth / 900, 0.40), 1.0);

        if (normalizedP <= pStart) {
          // Unattached / outside
          partElem.style.transform = `translate3d(${pData.dx * cScale}px, ${pData.dy * cScale}px, 0) rotate(${pData.rot}deg) scale(${pData.scale})`;
          partElem.style.opacity = '0';
        } else if (normalizedP >= pEnd) {
          // Attached & locked in final position
          partElem.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
          partElem.style.opacity = '1';
        } else {
          // Currently flying in
          const localT = (normalizedP - pStart) / (pEnd - pStart);
          const ease = 1 - Math.pow(1 - localT, 3); // cubic ease-out
          const curDx = (1 - ease) * pData.dx * cScale;
          const curDy = (1 - ease) * pData.dy * cScale;
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

    // =====================================================================
    // IV CANNULA SHOWCASE (dedicated choreography on smoothed scroll)
    // assembled -> one part per step (outside-in) with spotlight & camera ->
    // blueprint overview with numbered callouts -> snap-back -> blood return
    // =====================================================================
    const C_STEPS_START = 0.05;
    const C_STEPS_END = 0.64;
    const C_OVERVIEW_END = 0.79;
    const C_SNAP_END = 0.9;
    const C_SNAP_ORDER = ['needle', 'flashback', 'port', 'luer'];
    const C_HUB_AXIS_Y = 330;
    // Flashback chamber interior (world px) that fills with blood at the end
    const C_FILL_RECT = { x0: 3040, y0: 214, x1: 3415, y1: 446 };

    const clamp01 = t => Math.min(Math.max(t, 0), 1);
    const smoothstep = t => t * t * (3 - 2 * t);
    const easeOutBack = t => 1 + 2.6 * Math.pow(t - 1, 3) + 1.6 * Math.pow(t - 1, 2);

    const cWorld = document.getElementById('cannulaWorld');
    const cGuide = document.getElementById('cannulaGuideText');
    const cLeaderSvg = cDeviceFrame ? cDeviceFrame.querySelector('.assembly-leader-svg') : null;
    const cPartNames = Object.keys(cannulaWorldParts);
    const cPartElems = {};
    cPartNames.forEach(name => {
      const pData = cannulaWorldParts[name];
      const elem = document.getElementById(pData.id);
      if (!elem) return;
      elem.style.left = pData.x + 'px';
      elem.style.top = pData.y + 'px';
      elem.style.width = pData.w + 'px';
      elem.style.height = pData.h + 'px';
      elem.style.transformOrigin = `${pData.w / 2}px ${pData.h / 2}px`;
      cPartElems[name] = elem;
    });
    const cLanded = {};

    const cannulaPhaseCopy = {
      assembled: {
        tag: 'COMPLETE DEVICE', status: 'ASSEMBLED', badge: 'Assembled',
        title: 'Fully Assembled IV Cannula',
        desc: 'Complete 20G ported and winged IV catheter, ready for venipuncture. Scroll down to deconstruct components.',
        spec: 'ISO 10555-5 • Color-Coded 20G Pink',
        guide: 'Scroll down to deconstruct the cannula'
      },
      overview: {
        tag: 'FULL BREAKDOWN', status: 'BLUEPRINT', badge: 'Overview',
        title: 'Exploded Blueprint',
        desc: 'Every component of the 20G IV cannula, engineered to work as one, from the back-cut introducer needle to the vented Luer cap.',
        spec: '5 Precision Components • ISO 10555-1 / 10555-5',
        guide: 'Keep scrolling to reassemble'
      },
      snap: {
        tag: 'REASSEMBLY', status: 'ASSEMBLING…', badge: 'Assembling',
        title: 'Precision Snap-Fit Assembly',
        desc: 'Every component locks back into place with tight, leak-free tolerances.',
        spec: 'Snap-Fit Joints • Leak-Free Luer Interfaces',
        guide: 'Locking components into place'
      },
      complete: {
        tag: 'COMPLETE DEVICE', status: 'ASSEMBLED ✓', badge: 'Assembled',
        title: 'Ready for Venipuncture',
        desc: 'Fully assembled 20G IV cannula. The flashback chamber confirms venous access with instant blood return.',
        spec: 'Instant Flashback Confirmation • ISO 10555-5',
        guide: 'Assembly complete'
      }
    };

    // Blueprint callouts: numbered labels with leader lines
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const cCalloutSvg = document.createElementNS(SVG_NS, 'svg');
    cCalloutSvg.setAttribute('class', 'blueprint-callout-svg');
    cCalloutSvg.setAttribute('aria-hidden', 'true');
    const cCallouts = cannulaSteps.map((step, i) => {
      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('class', 'callout-line');
      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('class', 'callout-dot');
      dot.setAttribute('r', '3.5');
      cCalloutSvg.append(line, dot);
      const label = document.createElement('div');
      label.className = 'blueprint-callout';
      label.innerHTML = `<span class="callout-num">${String(i + 1).padStart(2, '0')}</span><span class="callout-name">${step.short}</span>`;
      return { line, dot, label };
    });
    const cFill = document.createElement('div');
    cFill.className = 'flashback-fill';
    cFill.style.left = C_FILL_RECT.x0 + 'px';
    cFill.style.top = C_FILL_RECT.y0 + 'px';
    cFill.style.width = (C_FILL_RECT.x1 - C_FILL_RECT.x0) + 'px';
    cFill.style.height = (C_FILL_RECT.y1 - C_FILL_RECT.y0) + 'px';
    if (cDeviceFrame && cPartElems.flashback) {
      cDeviceFrame.appendChild(cCalloutSvg);
      cCallouts.forEach(c => cDeviceFrame.appendChild(c.label));
      cPartElems.flashback.after(cFill);
    }

    // Phone label layout: one row above and one below the device, each label as close to
    // its part as it can get without overlapping a neighbour or leaving the screen
    function layoutPhoneLabels(anchors, deviceTop, deviceBottom, fWidth) {
      const margin = 6;
      const gap = 6;
      const points = [];
      ['above', 'below'].forEach(side => {
        const row = cannulaSteps
          .map((step, i) => ({ i, x: anchors[i].x, w: cCallouts[i].label.offsetWidth, h: cCallouts[i].label.offsetHeight }))
          .filter(item => cannulaSteps[item.i].side === side)
          .sort((p, q) => p.x - q.x);
        row.forEach((item, k) => {
          item.x = Math.max(item.x, margin + item.w / 2);
          if (k > 0) item.x = Math.max(item.x, row[k - 1].x + (row[k - 1].w + item.w) / 2 + gap);
        });
        for (let k = row.length - 1; k >= 0; k--) {
          const item = row[k];
          item.x = Math.min(item.x, fWidth - margin - item.w / 2);
          if (k < row.length - 1) item.x = Math.min(item.x, row[k + 1].x - (row[k + 1].w + item.w) / 2 - gap);
        }
        row.forEach(item => {
          const y = side === 'above' ? deviceTop - 14 - item.h / 2 : deviceBottom + 14 + item.h / 2;
          points[item.i] = { x: item.x, y };
        });
      });
      return points;
    }

    function setText(elem, text) {
      if (elem && elem.textContent !== text) elem.textContent = text;
    }

    function renderCannula(progress) {
      if (!cTrack || !cDeviceFrame || !cWorld) return;
      const total = cannulaSteps.length;
      const fWidth = cDeviceFrame.offsetWidth;
      const fHeight = cDeviceFrame.offsetHeight;

      const stepPos = clamp01((progress - C_STEPS_START) / (C_STEPS_END - C_STEPS_START)) * total;
      const inSteps = progress >= C_STEPS_START && progress < C_STEPS_END;
      const inOverview = progress >= C_STEPS_END && progress < C_OVERVIEW_END;
      const inSnap = progress >= C_OVERVIEW_END && progress < C_SNAP_END;
      const complete = progress >= C_SNAP_END;
      const activeIndex = Math.min(Math.floor(stepPos), total - 1);
      const activePart = cannulaSteps[activeIndex].part;
      const snapSlot = (C_SNAP_END - C_OVERVIEW_END) / (C_SNAP_ORDER.length + 1);

      // Separation of a part: 0 assembled .. 1 exploded. It leaves on its own step,
      // holds through the overview and snaps back in C_SNAP_ORDER (overshooting home)
      const separation = (name) => {
        const stepIndex = cannulaSteps.findIndex(st => st.part === name);
        if (progress < C_STEPS_START) return { t: 0, back: false };
        if (progress < C_STEPS_END) return { t: clamp01((stepPos - stepIndex) / 0.7), back: false };
        if (progress < C_OVERVIEW_END) return { t: 1, back: false };
        const k = C_SNAP_ORDER.indexOf(name);
        if (k < 0) return { t: 0, back: true };
        return { t: 1 - clamp01((progress - C_OVERVIEW_END - k * snapSlot) / (snapSlot * 2)), back: true };
      };

      const offsets = {};
      const offsetOf = (name) => {
        if (offsets[name]) return offsets[name];
        const pData = cannulaWorldParts[name];
        const { t, back } = separation(name);
        const e = back ? 1 - easeOutBack(1 - t) : easeOutBack(t);
        let x = 0;
        let y = 0;
        let rot = 0;
        if (pData.path === 'withdraw') {
          // Slide back along the catheter, then drop to its own row
          x = smoothstep(clamp01(t / 0.5)) * pData.explodeX;
          const ty = clamp01((t - 0.35) / 0.65);
          y = (back ? 1 - easeOutBack(1 - ty) : easeOutBack(ty)) * pData.explodeY;
        } else {
          x = e * pData.explodeX;
          y = e * pData.explodeY;
        }
        const travel = Math.sin(Math.PI * clamp01(e));
        if (pData.arcX) x += travel * pData.arcX;
        if (pData.tilt) rot += travel * pData.tilt;
        if (pData.wobble) rot += Math.sin(Math.PI * 4 * clamp01(e)) * travel * pData.wobble;
        if (pData.parent) {
          const host = offsetOf(pData.parent);
          x += host.x;
          y += host.y;
        }
        offsets[name] = { x, y, rot };
        return offsets[name];
      };
      const worldPoint = (step, which) => {
        const off = offsetOf(step.part);
        return which === 'callout' ? step.callout : { x: step.anchor.x + off.x, y: step.anchor.y + off.y };
      };

      // Envelopes: spotlight during the steps, callouts during the overview
      const spot = inSteps ? smoothstep(clamp01(stepPos / 0.5)) * smoothstep(clamp01((total - stepPos) / 0.4)) : 0;
      const overviewShow = inOverview ?
        smoothstep(clamp01((progress - C_STEPS_END) / 0.03)) * smoothstep(clamp01((C_OVERVIEW_END - progress) / 0.03)) : 0;

      // Camera: keep the whole device framed as it spreads, lean in on the active part
      let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
      cPartNames.forEach(name => {
        const pData = cannulaWorldParts[name];
        const off = offsetOf(name);
        bx0 = Math.min(bx0, pData.x + off.x);
        by0 = Math.min(by0, pData.y + off.y);
        bx1 = Math.max(bx1, pData.x + off.x + pData.w);
        by1 = Math.max(by1, pData.y + off.y + pData.h);
      });
      const phone = window.innerWidth <= 768;
      if (overviewShow > 0 && !phone) {
        cannulaSteps.forEach(step => {
          bx0 = Math.min(bx0, step.callout.x - 380 * overviewShow);
          bx1 = Math.max(bx1, step.callout.x + 380 * overviewShow);
          by0 = Math.min(by0, step.callout.y - 120 * overviewShow);
          by1 = Math.max(by1, step.callout.y + 120 * overviewShow);
        });
      }
      const marginX = fWidth * 0.04;
      const marginY = fHeight * 0.06;
      const fitZoom = Math.min((fWidth - 2 * marginX) / (bx1 - bx0), (fHeight - 2 * marginY) / (by1 - by0));
      const zoom = fitZoom * (1 + 0.06 * spot);
      let cx = (bx0 + bx1) / 2;
      let cy = (by0 + by1) / 2;
      if (spot > 0) {
        const sp = Math.min(Math.max(stepPos - 0.5, 0), total - 1);
        const i0 = Math.floor(sp);
        const i1 = Math.min(i0 + 1, total - 1);
        const f = smoothstep(sp - i0);
        const a0 = worldPoint(cannulaSteps[i0], 'anchor');
        const a1 = worldPoint(cannulaSteps[i1], 'anchor');
        cx += (a0.x + (a1.x - a0.x) * f - cx) * 0.35 * spot;
        cy += (a0.y + (a1.y - a0.y) * f - cy) * 0.35 * spot;
      }
      const clampAxis = (t, lo, hi) => (lo <= hi ? Math.min(Math.max(t, lo), hi) : (lo + hi) / 2);
      const tx = clampAxis(fWidth / 2 - cx * zoom, fWidth - marginX - bx1 * zoom, marginX - bx0 * zoom);
      const ty = clampAxis(fHeight / 2 - cy * zoom, fHeight - marginY - by1 * zoom, marginY - by0 * zoom);
      cWorld.style.transform = `translate(${tx}px, ${ty}px) scale(${zoom})`;
      const cam = p => ({ x: p.x * zoom + tx, y: p.y * zoom + ty });

      // Part layers: motion, lift shadow and spotlight
      cPartNames.forEach(name => {
        const elem = cPartElems[name];
        if (!elem) return;
        const off = offsetOf(name);
        const isActive = inSteps && name === activePart;
        const lift = Math.max(0, -off.y / 380);
        const shadow = `drop-shadow(0 ${(18 + lift * 90).toFixed(0)}px ${(40 + lift * 60).toFixed(0)}px rgba(1, 53, 114, ${(0.1 + lift * 0.06).toFixed(3)}))`;
        elem.style.transform = `translate(${off.x}px, ${off.y}px) rotate(${off.rot.toFixed(2)}deg)`;
        elem.style.opacity = String(isActive ? 1 : 1 - 0.5 * spot);
        elem.style.filter = isActive ?
          `drop-shadow(0 0 45px rgba(0, 113, 227, 0.5)) ${shadow}` :
          (spot > 0.01 ? `${shadow} grayscale(${(0.6 * spot).toFixed(2)})` : shadow);
      });

      // Pulse on each new step, and on every joint as it snaps home
      if (inSteps && activeIndex !== cLastAttached) {
        cLastAttached = activeIndex;
        const p = cam(worldPoint(cannulaSteps[activeIndex], 'anchor'));
        triggerPulse(cPulse, p.x / fWidth * 100, p.y / fHeight * 100);
      } else if (!inSteps) {
        cLastAttached = -1;
      }
      C_SNAP_ORDER.forEach((name, k) => {
        const home = progress >= C_OVERVIEW_END + k * snapSlot + snapSlot * 2;
        if (home && !cLanded[name] && progress < C_SNAP_END + 0.02) {
          const step = cannulaSteps.find(st => st.part === name);
          const p = cam(worldPoint(step, 'anchor'));
          triggerPulse(cPulse, p.x / fWidth * 100, p.y / fHeight * 100);
        }
        cLanded[name] = home;
      });

      // Leader line from the active part to the info card
      const desktop = window.innerWidth > 990;
      if (cLeaderSvg) cLeaderSvg.style.opacity = (inSteps && desktop) ? '1' : '0';
      if (inSteps && desktop && cLine && cAnchor && cTarget && cTitle) {
        const a = cam(worldPoint(cannulaSteps[activeIndex], 'anchor'));
        const frameRect = cDeviceFrame.getBoundingClientRect();
        const cardRect = cTitle.closest('.assembly-info-card').getBoundingClientRect();
        const tX = cardRect.left - frameRect.left - 8;
        const tY = cardRect.top - frameRect.top + 36;
        cLine.setAttribute('x1', a.x);
        cLine.setAttribute('y1', a.y);
        cLine.setAttribute('x2', tX);
        cLine.setAttribute('y2', tY);
        cAnchor.setAttribute('cx', a.x);
        cAnchor.setAttribute('cy', a.y);
        cTarget.setAttribute('cx', tX);
        cTarget.setAttribute('cy', tY);
      }

      // Blueprint callouts, drawn out one after another during the overview. Desktop uses
      // the designed positions; phones pack the labels into a row above and below the device
      const anchors = cannulaSteps.map(step => cam(worldPoint(step, 'anchor')));
      const labelPoints = phone ? layoutPhoneLabels(anchors, by0 * zoom + ty, by1 * zoom + ty, fWidth) :
        cannulaSteps.map(step => cam(worldPoint(step, 'callout')));
      cCallouts.forEach((c, i) => {
        const show = inOverview ?
          smoothstep(clamp01((progress - C_STEPS_END - i * 0.006) / 0.025)) * smoothstep(clamp01((C_OVERVIEW_END - progress) / 0.02)) : 0;
        const a = anchors[i];
        const l = labelPoints[i];
        c.line.setAttribute('x1', a.x);
        c.line.setAttribute('y1', a.y);
        c.line.setAttribute('x2', a.x + (l.x - a.x) * show);
        c.line.setAttribute('y2', a.y + (l.y - a.y) * show);
        c.line.style.opacity = show;
        c.dot.setAttribute('cx', a.x);
        c.dot.setAttribute('cy', a.y);
        c.dot.style.opacity = show;
        c.label.style.opacity = show;
        c.label.style.transform = `translate(${l.x}px, ${l.y}px) translate(-50%, -50%) scale(${(0.85 + 0.15 * show).toFixed(3)})`;
      });

      // Finale: blood return fills the flashback chamber
      const fillT = complete ? smoothstep(clamp01((progress - C_SNAP_END) / 0.06)) : 0;
      const flashOff = offsetOf('flashback');
      cFill.style.transform = `translate(${flashOff.x}px, ${flashOff.y}px) scaleX(${fillT.toFixed(3)})`;
      cFill.style.opacity = fillT > 0 ? '1' : '0';
      if (cBonusBanner) cBonusBanner.classList.toggle('active', fillT > 0.5);

      // Info card, HUD and dots
      let copy;
      if (inSteps) {
        const st = cannulaSteps[activeIndex];
        copy = {
          tag: `PORTION ${String(activeIndex + 1).padStart(2, '0')} OF ${String(total).padStart(2, '0')}`,
          status: 'EXPLODED VIEW', badge: `Portion ${activeIndex + 1} / ${total}`,
          title: st.name, desc: st.desc, spec: st.spec,
          guide: 'Scroll down to inspect next exploded portion'
        };
      } else if (inOverview) {
        copy = cannulaPhaseCopy.overview;
      } else if (inSnap) {
        copy = cannulaPhaseCopy.snap;
      } else if (complete) {
        copy = cannulaPhaseCopy.complete;
      } else {
        copy = cannulaPhaseCopy.assembled;
      }
      setText(cTag, copy.tag);
      setText(cStatus, copy.status);
      setText(cBadge, copy.badge);
      setText(cTitle, copy.title);
      setText(cDesc, copy.desc);
      setText(cSpec, copy.spec);
      setText(cGuide, copy.guide);
      if (cProgress) cProgress.style.width = Math.max(progress * 100, 4) + '%';
      cDots.forEach((dot, idx) => {
        dot.classList.toggle('active', inSteps ? idx === activeIndex : (inOverview || inSnap || complete));
      });
    }

    // Smoothed scroll: the cannula glides toward the scroll position instead of
    // jumping with every wheel tick
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cTargetProgress = 0;
    let cCurrentProgress = -1;
    let cRaf = null;

    function cannulaTick() {
      cRaf = null;
      const diff = cTargetProgress - cCurrentProgress;
      cCurrentProgress = (reduceMotion || Math.abs(diff) < 0.0004) ? cTargetProgress : cCurrentProgress + diff * 0.12;
      renderCannula(cCurrentProgress);
      if (cCurrentProgress !== cTargetProgress) cRaf = requestAnimationFrame(cannulaTick);
    }

    function scheduleCannula() {
      if (!cTrack) return;
      const scrollDistance = cTrack.offsetHeight - window.innerHeight;
      if (scrollDistance <= 0) return;
      cTargetProgress = clamp01(-cTrack.getBoundingClientRect().top / scrollDistance);
      if (cCurrentProgress < 0) cCurrentProgress = cTargetProgress;
      if (!cRaf) cRaf = requestAnimationFrame(cannulaTick);
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

      scheduleCannula();
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

  // Clinical Syringe "Go to Top" Button with Rotating Dashed Ring
  function initScrollToTopButton() {
    if (document.getElementById('clinicalScrollToTop')) return;

    const btn = document.createElement('button');
    btn.id = 'clinicalScrollToTop';
    btn.className = 'clinical-scroll-to-top';
    btn.setAttribute('aria-label', 'Scroll to top of page');
    btn.setAttribute('title', 'Go to top');
    btn.innerHTML = `
      <div class="scroll-top-dashed-ring"></div>
      <div class="scroll-top-core">
        <img src="assets/real_syringe_upright.png" onerror="this.onerror=null; this.src='../assets/real_syringe_upright.png'" alt="Real Clinical Syringe Up" class="scroll-top-syringe-icon">
      </div>
    `;

    document.body.appendChild(btn);

    function checkScroll() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (scrollY > 280) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      if (typeof playClinicalClick === 'function') {
        playClinicalClick('click');
      }
    });
  }

  initScrollToTopButton();

  console.log('AI-DISPO® UltraFlow Full-Section Scroll-Docking Architecture Initialized.');
});

