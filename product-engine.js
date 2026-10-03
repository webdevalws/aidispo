/**
 * AI-DISPO® Product Interactive Customizers & Engine
 * Supports: Syringe Engine, IV Cannula Simulator, IV Sets Drip Chamber Engine
 */

(function () {
  'use strict';

  // -------------------------------------------------------------
  // 1. SYRINGE INTERACTIVE CUSTOMIZER & ENGINE
  // -------------------------------------------------------------
  function initSyringeCustomizer() {
    const root = document.getElementById('syringeSimulator');
    if (!root) return;

    const state = {
      capacity: '5ML',
      capNum: 5.0,
      nozzle: 'LL', // LL: Luer Lock, LS: Luer Slip
      withNeedle: true,
      gauge: '21G',
      gaugeColor: '#10B981',
      length: '1.50"',
      lengthDesc: '38mm',
      pack: 'BLISTER', // BLISTER or RIBBON
      strokeDraw: 5.0, // 0 to capNum
    };

    const gaugeColors = {
      '16G': '#FFFFFF',
      '18G': '#EC4899',
      '20G': '#EAB308',
      '21G': '#10B981',
      '22G': '#6B7280',
      '23G': '#0284C7',
      '24G': '#8B5CF6',
      '26G': '#92400E'
    };

    const syringeDescriptions = {
      '1ML': 'Precision 1.0 mL micro-dosing syringe with ultra-clear barrel and zero dead-space geometry. Designed for high-accuracy insulin, tuberculin, and specialized clinical medication delivery.',
      '2ML': 'Standard 2.0 mL 3-piece clinical injection syringe with ultra-smooth silicone glide. Optimized for effortless subcutaneous, intramuscular, and intravenous drug administration.',
      '3ML': 'High-precision 3.0 mL clinical syringe featuring high-contrast graduation marks and tight hydraulic seal. Delivers consistent low breakaway force and certified leak-proof medication delivery.',
      '5ML': 'Precision 5.0 mL 3-piece clinical syringe engineered with zero dead-space barrel geometry. Features medical-grade silicone lubrication ensuring smooth breakaway force and leak-proof ISO 7886-1 delivery.',
      '10ML': 'High-capacity 10.0 mL procedural syringe with reinforced barrel wall and clear volumetric scale. Engineered for diagnostic aspiration, medication reconstitution, and intravenous flushing.',
      '20ML': 'Heavy-duty 20.0 mL clinical syringe designed for high-volume compounding and irrigation. Provides reliable piston control with certified ISO 7886-1 hydraulic seal integrity.',
      '50ML': 'Large-capacity 50.0 mL clinical syringe with reinforced barrel and ergonomic thumb ring. Ideal for enteral feeding, catheter irrigation, and controlled high-volume fluid aspiration.'
    };

    const skuElem = root.querySelector('#sEngineSku');
    const chipCap = root.querySelector('#sChipCap');
    const chipNozzle = root.querySelector('#sChipNozzle');
    const chipNeedle = root.querySelector('#sChipNeedle');
    const chipNeedleDot = root.querySelector('#sChipNeedleDot');
    const chipPack = root.querySelector('#sChipPack');
    const packOverlayText = root.querySelector('#sPackOverlayText');
    const sterilityVal = root.querySelector('#sSterilityVal');
    const descTextElem = root.querySelector('#sProductDescText');
    const strokeInput = root.querySelector('#sStrokeSlider');
    const strokeValBadge = root.querySelector('#sStrokeValBadge');
    const strokeScaleMax = root.querySelector('#sStrokeScaleMax');
    const deadSpaceVal = root.querySelector('#sDeadSpaceVal');
    const breakawayVal = root.querySelector('#sBreakawayVal');
    const enquireBtn = root.querySelector('#sEnquireBtn');

    const SYRINGE_IMG_WITH_NEEDLE = 'assets/ChatGPT Image Sep 30, 2026, 06_20_51 PM.png';
    const SYRINGE_IMG_WITHOUT_NEEDLE = 'assets/ChatGPT Image Sep 30, 2026, 06_38_35 PM.png';

    // Preload both images for instantaneous zero-latency switching
    const preImg1 = new Image();
    preImg1.src = SYRINGE_IMG_WITH_NEEDLE;
    const preImg2 = new Image();
    preImg2.src = SYRINGE_IMG_WITHOUT_NEEDLE;

    // SVG elements (fallback if present)
    const svgNeedle = root.querySelector('#sSvgNeedleCannula');
    const svgHub = root.querySelector('#sSvgNeedleHub');
    const svgNozzle = root.querySelector('#sSvgNozzle');
    const svgPlungerGroup = root.querySelector('#sSvgPlungerGroup');
    const svgFluidGroup = root.querySelector('#sSvgFluid');

    function updateSKU() {
      const lenCode = state.length.replace(/[^0-9]/g, '');
      const needlePart = state.withNeedle ? `-N${state.gauge}-${lenCode}` : '-NO-NEEDLE';
      const packCode = state.pack || 'BLISTER';
      const sku = `AD-${state.capacity}-${state.nozzle}${needlePart}-${packCode}-STERILE`;
      if (skuElem) skuElem.textContent = sku;
      if (enquireBtn) {
        enquireBtn.href = `contact.html?product=Syringe&sku=${encodeURIComponent(sku)}`;
      }
    }

    function updateVisuals() {
      // Chips
      if (chipCap) chipCap.textContent = `CAPACITY: ${state.capacity.replace('ML', '.0 mL')}`;
      if (chipNozzle) {
        let nozzleLabel = 'LUER LOCK';
        if (state.nozzle === 'LS') nozzleLabel = 'LUER SLIP';
        if (state.nozzle === 'AD') nozzleLabel = 'AUTO DISABLE';
        chipNozzle.textContent = `NOZZLE: ${nozzleLabel}`;
      }
      if (chipNeedle) {
        chipNeedle.textContent = state.withNeedle ? `NEEDLE: ${state.gauge} × ${state.length}` : 'WITHOUT NEEDLE';
      }
      if (chipNeedleDot) {
        chipNeedleDot.style.background = state.withNeedle ? state.gaugeColor : '#94A3B8';
      }
      if (chipPack) chipPack.textContent = `PACK: ${state.pack === 'RIBBON' ? 'RIBBON PACK' : 'BLISTER PACK'}`;

      if (packOverlayText) {
        packOverlayText.textContent = state.pack === 'RIBBON' ? 'STERILE RIBBON STRIP' : 'STERILE BLISTER PACK';
      }
      if (sterilityVal) {
        sterilityVal.textContent = state.pack === 'RIBBON' ? 'ETO • Ribbon' : 'ETO • Blister';
      }

      // Dynamic 2-line Product Description
      if (descTextElem) {
        let nozzleName = 'Luer Lock';
        if (state.nozzle === 'LS') nozzleName = 'Luer Slip';
        if (state.nozzle === 'AD') nozzleName = 'Auto-Disable (AD)';
        const packDesc = state.pack === 'RIBBON' ? 'sterile tear-strip Ribbon Pack' : 'sterile peelable Blister Pack';
        let desc = syringeDescriptions[state.capacity] || syringeDescriptions['5ML'];
        if (!state.withNeedle) {
          desc = desc.replace('syringe', `syringe with ${nozzleName} nozzle (without needle, ${packDesc})`);
        } else {
          desc = desc.replace('syringe', `syringe with ${state.gauge} × ${state.length} needle (${nozzleName}, ${packDesc})`);
        }
        descTextElem.textContent = desc;
      }

      // Slider readout (if present)
      if (strokeValBadge) {
        strokeValBadge.textContent = `${state.strokeDraw.toFixed(1)} / ${state.capNum.toFixed(1)} mL`;
      }
      if (strokeScaleMax) {
        strokeScaleMax.textContent = `100% Max (${state.capNum.toFixed(1)} mL)`;
      }

      // Specs
      if (deadSpaceVal) {
        if (state.capNum <= 1) deadSpaceVal.textContent = '< 0.003 mL';
        else if (state.capNum <= 5) deadSpaceVal.textContent = '< 0.04 mL';
        else deadSpaceVal.textContent = '< 0.07 mL';
      }
      if (breakawayVal) {
        breakawayVal.textContent = state.capNum <= 3 ? '< 1.8 N' : '< 2.5 N';
      }

      // Real Syringe Needle Image Toggle (With needle vs Without needle)
      const realSyringeImg = root.querySelector('#sRealSyringeImg');
      if (realSyringeImg) {
        const targetSrc = state.withNeedle ? SYRINGE_IMG_WITH_NEEDLE : SYRINGE_IMG_WITHOUT_NEEDLE;
        const targetMode = state.withNeedle ? 'with' : 'without';
        if (realSyringeImg.dataset.mode !== targetMode) {
          realSyringeImg.dataset.mode = targetMode;
          realSyringeImg.style.transition = 'opacity 0.12s ease, transform 0.12s ease';
          realSyringeImg.style.opacity = '0.2';
          realSyringeImg.style.transform = 'scale(0.98)';
          setTimeout(() => {
            realSyringeImg.setAttribute('src', targetSrc);
            realSyringeImg.src = targetSrc;
            realSyringeImg.alt = state.withNeedle
              ? 'AI-DISPO UltraFlow Precision Syringe with Needle'
              : 'AI-DISPO UltraFlow Precision Syringe without Needle';
            realSyringeImg.style.opacity = '1';
            realSyringeImg.style.transform = 'scale(1)';
          }, 80);
        }
      }

      // SVG Updates (if present)
      if (svgHub) {
        svgHub.setAttribute('fill', state.gaugeColor);
        svgHub.style.display = state.withNeedle ? 'block' : 'none';
      }
      if (svgNeedle) {
        svgNeedle.style.display = state.withNeedle ? 'block' : 'none';
        let needleLenX = -65;
        if (state.length.includes('1.0')) needleLenX = -45;
        if (state.length.includes('1.50')) needleLenX = -85;
        svgNeedle.setAttribute('x1', needleLenX);
      }
      if (svgNozzle) {
        svgNozzle.setAttribute('stroke', state.nozzle === 'LL' ? '#00A8FF' : (state.nozzle === 'AD' ? '#10B981' : '#94A3B8'));
      }

      const ratio = state.capNum > 0 ? (state.strokeDraw / state.capNum) : 0;
      const shiftX = ratio * 110;
      if (svgPlungerGroup) {
        svgPlungerGroup.setAttribute('transform', `translate(${shiftX}, 0)`);
      }
      if (svgFluidGroup) {
        svgFluidGroup.setAttribute('width', Math.max(shiftX, 2));
      }

      updateSKU();
    }

    // Capacity buttons
    root.querySelectorAll('.sim-btn-cap').forEach(btn => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('.sim-btn-cap').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.capacity = btn.getAttribute('data-cap');
        state.capNum = parseFloat(state.capacity.replace('ML', ''));
        if (strokeInput) {
          strokeInput.value = 100;
          state.strokeDraw = state.capNum;
        }
        updateVisuals();
      });
    });

    // Nozzle cards
    root.querySelectorAll('.sim-nozzle-opt').forEach(card => {
      card.addEventListener('click', () => {
        root.querySelectorAll('.sim-nozzle-opt').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.nozzle = card.getAttribute('data-nozzle');
        updateVisuals();
      });
    });

    // Needle configuration
    root.querySelectorAll('.sim-needle-config').forEach(card => {
      card.addEventListener('click', () => {
        root.querySelectorAll('.sim-needle-config').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.withNeedle = card.getAttribute('data-needle') === 'with';
        const gaugeBox = root.querySelector('#sGaugeSelectBox');
        if (gaugeBox) gaugeBox.style.opacity = state.withNeedle ? '1' : '0.4';
        updateVisuals();
      });
    });

    // Needle gauge pills
    root.querySelectorAll('.sim-gauge-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        if (!state.withNeedle) return;
        root.querySelectorAll('.sim-gauge-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.gauge = pill.getAttribute('data-gauge');
        state.gaugeColor = gaugeColors[state.gauge] || '#10B981';
        updateVisuals();
      });
    });

    // Length pills
    root.querySelectorAll('.sim-length-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        if (!state.withNeedle) return;
        root.querySelectorAll('.sim-length-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.length = pill.getAttribute('data-len');
        updateVisuals();
      });
    });

    // Packaging cards (Blister vs Ribbon)
    root.querySelectorAll('.sim-pack-opt').forEach(card => {
      card.addEventListener('click', () => {
        root.querySelectorAll('.sim-pack-opt').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.pack = card.getAttribute('data-pack');
        updateVisuals();
      });
    });

    // Enquire button direct redirection
    if (enquireBtn) {
      enquireBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const lenCode = state.length.replace(/[^0-9]/g, '');
        const needlePart = state.withNeedle ? `-N${state.gauge}-${lenCode}` : '-NO-NEEDLE';
        const packCode = state.pack || 'BLISTER';
        const sku = `AD-${state.capacity}-${state.nozzle}${needlePart}-${packCode}-STERILE`;
        window.location.href = `contact.html?product=Syringe&sku=${encodeURIComponent(sku)}`;
      });
    }

    updateVisuals();
  }

  // -------------------------------------------------------------
  // 2. IV CANNULA VARIATIONS & ISO FLOW SIMULATOR
  // -------------------------------------------------------------
  function initCannulaSimulator() {
    const root = document.getElementById('cannulaSimulator');
    if (!root) return;

    const gauges = {
      '14G': { color: '#FF7800', img: 'assets/cannula_14g.png?v=4', flow: 385, extDia: '2.1 mm', length: '45 mm', use: 'Rapid trauma resuscitation, major emergency surgery, high-viscosity fluid infusion.' },
      '16G': { color: '#808080', img: 'assets/cannula_16g.png?v=4', flow: 210, extDia: '1.7 mm', length: '45 mm', use: 'Major trauma, surgical intervention, rapid whole blood transfusion.' },
      '18G': { color: '#10B981', img: 'assets/cannula_18g.png?v=4', flow: 105, extDia: '1.3 mm', length: '45 mm', use: 'Blood administration, surgical fluid management, viscous parenteral medication.' },
      '20G': { color: '#EC4899', img: 'assets/cannula_20g.png?v=4', flow: 61, extDia: '1.1 mm', length: '32 mm', use: 'General adult IV infusion, routine intravenous antibiotics, crystalloids.' },
      '22G': { color: '#0284C7', img: 'assets/cannula_22g.png?v=4', flow: 36, extDia: '0.9 mm', length: '25 mm', use: 'Standard adult infusions, pediatric chemotherapy, fragile or sclerosed veins.' },
      '24G': { color: '#EAB308', img: 'assets/cannula_24g.png?v=4', flow: 22, extDia: '0.7 mm', length: '19 mm', use: 'Pediatrics, neonatology, geriatrics with delicate friable veins.' },
      '26G': { color: '#8B5CF6', img: 'assets/cannula_26g.png?v=4', flow: 10, extDia: '0.6 mm', length: '19 mm', use: 'Micro-vascular neonate access, extremely fragile geriatric vascular lines.' }
    };

    // Preload cannula images for instant zero-lag switching
    Object.values(gauges).forEach(g => {
      if (g.img) {
        const im = new Image();
        im.src = g.img;
      }
    });

    let activeType = 'Port & Wings';
    let activeGauge = '20G';

    const cannulaImgElem = root.querySelector('#cRealCannulaImg');
    const flowValElem = root.querySelector('#cFlowVal');
    const flowFillElem = root.querySelector('#cFlowFill');
    const clinicalUseElem = root.querySelector('#cClinicalUseText');
    const extDiaElem = root.querySelector('#cExtDiaVal');
    const catheterLenElem = root.querySelector('#cCatheterLenVal');
    const svgColoredParts = root.querySelectorAll('.c-svg-gauge-colored');
    const svgPortPart = root.querySelector('#cSvgPortValve');
    const enquireBtn = root.querySelector('#cEnquireBtn');

    function updateCannula() {
      const data = gauges[activeGauge] || gauges['20G'];

      // Update real photo with smooth subtle crossfade
      if (cannulaImgElem) {
        cannulaImgElem.style.opacity = '0.75';
        cannulaImgElem.style.transform = 'scale(0.99)';

        setTimeout(() => {
          if (data.img && !cannulaImgElem.src.endsWith(data.img)) {
            cannulaImgElem.src = data.img;
          }
          cannulaImgElem.style.opacity = '1';
          cannulaImgElem.style.transform = 'scale(1)';
        }, 50);
      }

      if (flowValElem) flowValElem.textContent = `${data.flow} ml / min`;
      if (flowFillElem) {
        const pct = Math.min((data.flow / 385) * 100, 100);
        flowFillElem.style.width = `${pct}%`;
      }
      if (clinicalUseElem) {
        clinicalUseElem.innerHTML = `<strong>${activeGauge} Clinical Use:</strong> ${data.use}`;
      }
      if (extDiaElem) extDiaElem.textContent = data.extDia;
      if (catheterLenElem) catheterLenElem.textContent = data.length;

      // Update SVG coloring (if present)
      svgColoredParts.forEach(part => {
        part.setAttribute('fill', data.color);
      });

      if (svgPortPart) {
        svgPortPart.style.display = activeType === 'Plain' ? 'none' : 'block';
      }

      if (enquireBtn) {
        enquireBtn.textContent = `ENQUIRE ${activeGauge} with ${activeType} →`;
        enquireBtn.href = `contact.html?product=IV-Cannula&gauge=${activeGauge}&type=${encodeURIComponent(activeType)}`;
      }
    }

    // Architecture Tabs
    root.querySelectorAll('.c-type-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        root.querySelectorAll('.c-type-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeType = tab.getAttribute('data-type');
        updateCannula();
      });
    });

    // Gauge Buttons
    root.querySelectorAll('.c-gauge-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('.c-gauge-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeGauge = btn.getAttribute('data-gauge');
        updateCannula();
      });
    });

    updateCannula();
  }

  // -------------------------------------------------------------
  // 3. MEDICAL IV SETS & BLOOD TRANSFUSION SIMULATOR
  // -------------------------------------------------------------
  function initIVSetsSimulator() {
    const root = document.getElementById('ivsetSimulator');
    if (!root) return;

    const setConfigs = [
      {
        typeTitle: 'Vented IV Infusion Set (Economy Grade)',
        badge: 'MACRO-DRIP (20 DROPS/ML) • VENTED ECONOMY',
        desc: 'Standard gravity infusion set with integrated air vent and 15 µm particle filter for routine intravenous fluid administration from glass and semi-rigid plastic bottles.',
        tubing: '150 cm Medical-Grade Kink-Resistant PVC',
        filter: '15 µm Fluid Particle Filter & Hydrophobic Air Vent Filter',
        connector: 'Luer Slip / Lock with Self-Sealing Latex Injection Bulb',
        indication: 'Routine intravenous hydration, electrolyte maintenance, and standard ward medication administration.',
        dropsPerMl: 'Macro-drip (20 drops/ml)',
        sku: 'AD-IVSET-VENTED-ECONOMY-STERILE'
      },
      {
        typeTitle: 'Vented IV Infusion Set (Premium DEHP-Free)',
        badge: 'MACRO-DRIP (20 DROPS/ML) • VENTED PREMIUM',
        desc: 'Premium high-performance IV infusion set engineered with ultra-clear DEHP-Free medical tubing, 0.22 µm hydrophobic bacteria-retentive air vent, precision roller clamp, and rotating Luer lock.',
        tubing: '180 cm Ultra-Clear Kink-Proof DEHP-Free Medical PVC',
        filter: '15 µm Precision Fluid Mesh & 0.22 µm Hydrophobic Antibacterial Air Vent',
        connector: 'Universal Rotating Male Luer Lock with Latex-Free Y-Site Injection Port',
        indication: 'Surgical theaters, ICU critical care, chemotherapy infusion, and high-precision fluid delivery.',
        dropsPerMl: 'Macro-drip (20 drops/ml)',
        sku: 'AD-IVSET-VENTED-PREMIUM-STERILE'
      },
      {
        typeTitle: 'Non-Vented IV Set (Economy Grade)',
        badge: 'MACRO-DRIP (20 DROPS/ML) • NON-VENTED ECONOMY',
        desc: 'Closed-system IV administration set designed specifically for fully collapsible IV fluid bags and soft containers without requiring an ambient air vent.',
        tubing: '150 cm Standard Medical-Grade Flexible PVC',
        filter: '15 µm Fluid Particulate Trap',
        connector: 'Male Luer Slip / Lock with Self-Sealing Flashball Port',
        indication: 'Closed-system routine intravenous infusions minimizing airborne contamination risk.',
        dropsPerMl: 'Macro-drip (20 drops/ml)',
        sku: 'AD-IVSET-NONVENTED-ECONOMY-STERILE'
      },
      {
        typeTitle: 'Non-Vented IV Set (Premium DEHP-Free)',
        badge: 'MACRO-DRIP (20 DROPS/ML) • NON-VENTED PREMIUM',
        desc: 'High-specification closed-system IV infusion set with 180 cm DEHP-Free tubing, smooth-glide micro-roller clamp for precise flow titration, and latex-free Y-site port.',
        tubing: '180 cm High-Flexibility DEHP-Free Medical PVC',
        filter: '15 µm High-Retention Fluid Particulate Filter',
        connector: 'Rotating Safety Luer Lock with Needle-Free / Latex-Free Y-Port',
        indication: 'Closed-system critical care, blood volume expanders, and targeted pharmacotherapy.',
        dropsPerMl: 'Macro-drip (20 drops/ml)',
        sku: 'AD-IVSET-NONVENTED-PREMIUM-STERILE'
      }
    ];

    let currentSetIndex = 0;
    let flowRate = 50; // 0% to 100%

    const badgeElem = root.querySelector('#ivSetBadge');
    const titleElem = root.querySelector('#ivSetDetailTitle');
    const descElem = root.querySelector('#ivSetDetailDesc');
    const descBoxTextElem = root.querySelector('#ivSetDescText');
    const tubingElem = root.querySelector('#ivSetTubingVal');
    const filterElem = root.querySelector('#ivSetFilterVal');
    const connElem = root.querySelector('#ivSetConnVal');
    const indicElem = root.querySelector('#ivSetIndicVal');
    const calibLabelElem = root.querySelector('#ivSetCalibLabel');
    const sliderInput = root.querySelector('#ivFlowSlider');
    const flowPctElem = root.querySelector('#ivFlowPctReadout');
    const dropletElem = root.querySelector('#ivDropletAnim');
    const enquireBtn = root.querySelector('#ivSetEnquireBtn');

    function updateIVSet() {
      const cfg = setConfigs[currentSetIndex];
      if (badgeElem) badgeElem.textContent = cfg.badge;
      if (titleElem) titleElem.textContent = cfg.typeTitle;
      if (descElem) descElem.textContent = cfg.desc;
      if (descBoxTextElem) descBoxTextElem.textContent = cfg.desc;
      if (tubingElem) tubingElem.textContent = cfg.tubing;
      if (filterElem) filterElem.textContent = cfg.filter;
      if (connElem) connElem.textContent = cfg.connector;
      if (indicElem) indicElem.textContent = cfg.indication;
      if (calibLabelElem) calibLabelElem.textContent = `Dynamic Droplet Calibration: ${cfg.dropsPerMl}`;
      if (enquireBtn && cfg.sku) {
        enquireBtn.href = `contact.html?product=IV-Set&sku=${encodeURIComponent(cfg.sku)}`;
      }

      // Droplet animation speed based on flowRate
      if (flowPctElem) flowPctElem.textContent = `${flowRate}% Flow Rate`;
      if (dropletElem) {
        if (flowRate === 0) {
          dropletElem.style.animationPlayState = 'paused';
          dropletElem.style.opacity = '0';
        } else {
          dropletElem.style.animationPlayState = 'running';
          dropletElem.style.opacity = '0.9';
          // Faster dripping as flow rate increases
          const duration = (2.2 - (flowRate / 100) * 1.8).toFixed(2);
          dropletElem.style.animationDuration = `${duration}s`;
        }
      }

      if (enquireBtn) {
        enquireBtn.href = `contact.html?product=IV-Set&type=${encodeURIComponent(cfg.typeTitle)}`;
      }
    }

    // Tab buttons
    root.querySelectorAll('.ivset-type-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        root.querySelectorAll('.ivset-type-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentSetIndex = parseInt(tab.getAttribute('data-idx') || '0', 10);
        updateIVSet();
      });
    });

    // Slider
    if (sliderInput) {
      sliderInput.addEventListener('input', (e) => {
        flowRate = parseInt(e.target.value, 10);
        updateIVSet();
      });
    }

    updateIVSet();
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSyringeCustomizer();
      initCannulaSimulator();
      initIVSetsSimulator();
    });
  } else {
    initSyringeCustomizer();
    initCannulaSimulator();
    initIVSetsSimulator();
  }
})();
