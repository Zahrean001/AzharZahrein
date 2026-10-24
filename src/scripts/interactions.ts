import {
  translations,
  detectUserLocale,
  type Locale,
  type TranslationDictionary,
} from '../data/translations';

interface ScreenMeta {
  title: string;
  caption: string;
}

interface PouchCardState {
  flipped: boolean;
  manualLock: boolean;
}

function getFanMeta(locale: Locale) {
  const t = translations[locale];
  return {
    screens: [
      { title: t['sijagung.screen0.title'], caption: t['sijagung.screen0.caption'] },
      { title: t['sijagung.screen1.title'], caption: t['sijagung.screen1.caption'] },
      { title: t['sijagung.screen2.title'], caption: t['sijagung.screen2.caption'] },
    ],
    defaultFan: {
      title: t['sijagung.defaultTitle'],
      caption: t['sijagung.defaultCaption'],
    },
  };
}

const POUCH_IDS = ['pouch-1', 'pouch-2', 'pouch-3'] as const;

function predecodeSectionImages(): void {
  const decodeAll = () => {
    document
      .querySelectorAll<HTMLImageElement>(
        '#sijagung img, #kemasan img, #pengalaman img, #pendidikan img'
      )
      .forEach((img) => {
        if (typeof img.decode === 'function') {
          img.decode().catch(() => {});
        }
      });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(decodeAll);
  } else {
    window.setTimeout(decodeAll, 100);
  }
}

function initPhoneFanInteraction(
  fanStage: HTMLElement | null,
  getLocale: () => Locale
): { refreshFanCaption: () => void } {
  const fanPhoneItems = Array.from(document.querySelectorAll<HTMLElement>('[data-fan-phone]'));
  let activeFanIndex = -1;

  const updateFanCaption = (index: number) => {
    activeFanIndex = index;
    const titleEl = document.getElementById('screen-title');
    const captionEl = document.getElementById('screen-caption');
    if (!titleEl || !captionEl) return;

    const fanMeta = getFanMeta(getLocale());
    const targetMeta =
      index >= 0 && fanMeta.screens[index] ? fanMeta.screens[index] : fanMeta.defaultFan;

    titleEl.textContent = targetMeta.title;
    captionEl.textContent = targetMeta.caption;
    titleEl.style.transition = 'none';
    captionEl.style.transition = 'none';
    titleEl.style.opacity = '0.45';
    captionEl.style.opacity = '0.45';
    titleEl.style.transform = 'translateY(4px)';
    captionEl.style.transform = 'translateY(4px)';

    window.requestAnimationFrame(() => {
      titleEl.style.transition = 'opacity 0.16s ease-out, transform 0.18s ease-out';
      captionEl.style.transition = 'opacity 0.16s ease-out, transform 0.18s ease-out';
      titleEl.style.opacity = '1';
      titleEl.style.transform = 'translateY(0)';
      captionEl.style.opacity = '1';
      captionEl.style.transform = 'translateY(0)';
    });
  };

  fanPhoneItems.forEach((phoneEl) => {
    const idx = Number.parseInt(phoneEl.getAttribute('data-fan-phone') || '0', 10);

    phoneEl.addEventListener('mouseenter', () => {
      fanPhoneItems.forEach((el) => el.classList.remove('is-active-fan'));
      phoneEl.classList.add('is-active-fan');
      updateFanCaption(idx);
    });

    phoneEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const alreadyActive = phoneEl.classList.contains('is-active-fan');
      fanPhoneItems.forEach((el) => el.classList.remove('is-active-fan'));
      if (alreadyActive) {
        updateFanCaption(-1);
      } else {
        phoneEl.classList.add('is-active-fan');
        updateFanCaption(idx);
      }
    });
  });

  if (fanStage) {
    fanStage.addEventListener('mouseleave', () => {
      fanPhoneItems.forEach((el) => el.classList.remove('is-active-fan'));
      updateFanCaption(-1);
    });
  }

  document.addEventListener('click', () => {
    if (activeFanIndex !== -1) {
      fanPhoneItems.forEach((el) => el.classList.remove('is-active-fan'));
      updateFanCaption(-1);
    }
  });

  return {
    refreshFanCaption: () => updateFanCaption(activeFanIndex),
  };
}

function initPouchCards(): {
  pouchState: Map<string, PouchCardState>;
  setCardFlip: (elementId: string, shouldFlip: boolean, isManual?: boolean) => void;
} {
  const pouchState = new Map<string, PouchCardState>();

  POUCH_IDS.forEach((id) => {
    pouchState.set(id, {
      flipped: false,
      manualLock: false,
    });
  });

  const setCardFlip = (elementId: string, shouldFlip: boolean, isManual = false) => {
    const cardInner = document.getElementById(elementId);
    if (!cardInner) return;
    const cardContainer = (cardInner.closest('.flip-card') || cardInner.parentElement) as HTMLElement | null;
    const state = pouchState.get(elementId);
    if (!state) return;

    if (isManual) {
      state.manualLock = true;
    }
    state.flipped = shouldFlip;

    cardInner.style.transform = '';
    cardInner.classList.toggle('flipped', shouldFlip);
    cardInner.classList.toggle('is-flipped', shouldFlip);
    if (cardContainer) {
      cardContainer.classList.toggle('flipped', shouldFlip);
      cardContainer.classList.toggle('is-flipped', shouldFlip);
      cardContainer.setAttribute('aria-expanded', shouldFlip ? 'true' : 'false');
    }
  };

  const toggleCardFlip = (elementId: string, isManual = true) => {
    const state = pouchState.get(elementId);
    if (!state) return;
    setCardFlip(elementId, !state.flipped, isManual);
  };

  document.querySelectorAll<HTMLElement>('[data-flip-card]').forEach((cardEl) => {
    const targetId = cardEl.getAttribute('data-flip-card');
    const cardInner = targetId ? document.getElementById(targetId) : null;
    if (!targetId || !cardInner) return;

    cardEl.setAttribute('role', 'button');
    cardEl.setAttribute('tabindex', '0');
    cardEl.setAttribute('aria-label', `Balik kemasan kartu ${targetId}`);
    cardEl.setAttribute('aria-expanded', 'false');

    cardEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCardFlip(targetId, true);
      }
    });

    let startX = 0;
    let startY = 0;
    let isPointerActive = false;
    let isDraggingHoriz = false;
    let holdTriggered = false;
    let holdTimer: number | null = null;
    let baseAngle = 0;

    const clearHoldTimer = () => {
      if (holdTimer !== null) {
        window.clearTimeout(holdTimer);
        holdTimer = null;
      }
      cardEl.classList.remove('is-holding');
    };

    cardEl.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      isPointerActive = true;
      isDraggingHoriz = false;
      holdTriggered = false;
      startX = e.clientX;
      startY = e.clientY;

      const state = pouchState.get(targetId);
      baseAngle = state && state.flipped ? 180 : 0;
      cardEl.style.setProperty('--card-angle', `${baseAngle}deg`);

      clearHoldTimer();
      holdTimer = window.setTimeout(() => {
        if (isPointerActive && !isDraggingHoriz) {
          holdTriggered = true;
          cardEl.classList.add('is-holding');
          toggleCardFlip(targetId, true);
          const nextState = pouchState.get(targetId);
          const nextAngle = nextState && nextState.flipped ? 180 : 0;
          cardEl.style.setProperty('--card-angle', `${nextAngle}deg`);
          window.setTimeout(() => {
            cardEl.classList.remove('is-holding');
          }, 200);
        }
      }, 200);
    });

    cardEl.addEventListener('pointermove', (e) => {
      if (!isPointerActive) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        clearHoldTimer();
      }

      if (!holdTriggered && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.1) {
        isDraggingHoriz = true;
        cardEl.classList.add('is-dragging');
        const width = cardEl.clientWidth || 320;
        const deltaDeg = (dx / width) * 180;
        const clampedDeg = Math.max(-180, Math.min(180, deltaDeg));
        cardInner.style.transform = `rotateY(${baseAngle + clampedDeg}deg)`;
      }
    });

    const finishPointer = (e: PointerEvent) => {
      if (!isPointerActive) return;
      isPointerActive = false;
      clearHoldTimer();
      cardEl.classList.remove('is-dragging');

      const dx = (e.clientX ?? startX) - startX;
      const dy = (e.clientY ?? startY) - startY;

      if (isDraggingHoriz) {
        cardInner.style.transform = '';
        if (Math.abs(dx) > 28) {
          toggleCardFlip(targetId, true);
        } else {
          const state = pouchState.get(targetId);
          setCardFlip(targetId, Boolean(state && state.flipped), false);
        }
        isDraggingHoriz = false;
        return;
      }

      if (!holdTriggered && Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        toggleCardFlip(targetId, true);
      }
    };

    cardEl.addEventListener('pointerup', finishPointer);
    cardEl.addEventListener('pointercancel', () => {
      isPointerActive = false;
      isDraggingHoriz = false;
      clearHoldTimer();
      cardEl.classList.remove('is-dragging');
      cardInner.style.transform = '';
    });
  });

  return { pouchState, setCardFlip };
}

function initHangingTag(): {
  hangingAssembly: HTMLElement | null;
  onScrollTick: (vel: number) => void;
} {
  const container = document.getElementById('hero-hanging-container');
  const tagCard = document.getElementById('hero-tag-card');
  const ropeLeftCore = document.getElementById('rope-left-core');
  const ropeLeftGlow = document.getElementById('rope-left-glow');
  const ropeLeftShadow = document.getElementById('rope-left-shadow');
  const ropeRightCore = document.getElementById('rope-right-core');
  const ropeRightGlow = document.getElementById('rope-right-glow');
  const ropeRightShadow = document.getElementById('rope-right-shadow');
  const ropeLeftRing = document.getElementById('rope-left-ring');
  const ropeRightRing = document.getElementById('rope-right-ring');
  const ropeApexRing = document.getElementById('rope-apex-ring');
  const ropeApexPin = document.getElementById('rope-apex-pin');

  if (
    !container ||
    !tagCard ||
    !ropeLeftCore ||
    !ropeLeftGlow ||
    !ropeLeftShadow ||
    !ropeRightCore ||
    !ropeRightGlow ||
    !ropeRightShadow ||
    !ropeLeftRing ||
    !ropeRightRing ||
    !ropeApexRing ||
    !ropeApexPin
  ) {
    return { hangingAssembly: null, onScrollTick: () => {} };
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Geometric Layout Coordinates
  let restX = 270;
  let restY = 115;
  let spreadX = 120;
  let bracketHalf = 9;
  let anchorY = -550;
  let anchorLeftX = 150;
  let anchorRightX = 390;
  let segLengthLeft = 60;
  let segLengthRight = 60;

  const NUM_ROPE_POINTS = 8;
  interface RopeParticle {
    x: number;
    y: number;
    oldX: number;
    oldY: number;
  }
  const leftParticles: RopeParticle[] = [];
  const rightParticles: RopeParticle[] = [];

  const updateMetrics = () => {
    const rect = container.getBoundingClientRect();
    const w = rect.width || 540;
    const h = rect.height || 720;

    bracketHalf = w < 300 ? 5 : w < 450 ? 6.5 : w < 768 ? 7.5 : 9;

    // Resting badge position over hair: center X
    restX = w * 0.5;
    // Responsive Y placement directly over the hair line
    restY = w < 320 ? h * 0.15 : w < 480 ? h * 0.155 : h * 0.165;
    spreadX = Math.min(130, Math.max(45, w * 0.22));

    // Anchors spread out to the left and right above the viewport ceiling
    anchorY = -Math.max(550, (rect.top || 0) + 350);
    anchorLeftX = restX - spreadX;
    anchorRightX = restX + spreadX;

    segLengthLeft = Math.hypot(restX - bracketHalf - anchorLeftX, restY - anchorY) / (NUM_ROPE_POINTS - 1);
    segLengthRight = Math.hypot(restX + bracketHalf - anchorRightX, restY - anchorY) / (NUM_ROPE_POINTS - 1);
  };

  updateMetrics();

  const resetRopes = (bx = restX, by = restY) => {
    leftParticles.length = 0;
    rightParticles.length = 0;
    for (let i = 0; i < NUM_ROPE_POINTS; i++) {
      const ratio = i / (NUM_ROPE_POINTS - 1);
      const lx = anchorLeftX + (bx - bracketHalf - anchorLeftX) * ratio;
      const ly = anchorY + (by - anchorY) * ratio;
      leftParticles.push({ x: lx, y: ly, oldX: lx, oldY: ly });

      const rx = anchorRightX + (bx + bracketHalf - anchorRightX) * ratio;
      const ry = anchorY + (by - anchorY) * ratio;
      rightParticles.push({ x: rx, y: ry, oldX: rx, oldY: ry });
    }
  };

  resetRopes(restX, restY - 260);

  // Simulation State
  let phase: 'waiting' | 'dropping' | 'settled' | 'dragging' | 'recoiling' = 'waiting';

  let badgeX = restX;
  let badgeY = restY - 260; // Starts neatly above viewport
  let badgeVx = 0;
  let badgeVy = 0;
  let badgeAngle = 0;
  let wobbleAngle = 0;
  let dropStartTime = 0;

  let targetScrollX = 0;
  let smoothScrollX = 0;

  let isPointerDown = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let hasMoved = false;
  let pointerSamples: { x: number; y: number; time: number }[] = [];

  let lastFrameTime = performance.now();

  const getPathString = (rope: RopeParticle[]) => {
    let d = `M ${rope[0].x.toFixed(1)} ${rope[0].y.toFixed(1)}`;
    for (let i = 1; i < rope.length - 1; i++) {
      const xc = (rope[i].x + rope[i + 1].x) * 0.5;
      const yc = (rope[i].y + rope[i + 1].y) * 0.5;
      d += ` Q ${rope[i].x.toFixed(1)} ${rope[i].y.toFixed(1)} ${xc.toFixed(1)} ${yc.toFixed(1)}`;
    }
    d += ` L ${rope[rope.length - 1].x.toFixed(1)} ${rope[rope.length - 1].y.toFixed(1)}`;
    return d;
  };

  const renderRopeAndBadge = () => {
    const leftPath = getPathString(leftParticles);
    const rightPath = getPathString(rightParticles);

    ropeLeftCore.setAttribute('d', leftPath);
    ropeLeftGlow.setAttribute('d', leftPath);
    ropeLeftShadow.setAttribute('d', leftPath);

    ropeRightCore.setAttribute('d', rightPath);
    ropeRightGlow.setAttribute('d', rightPath);
    ropeRightShadow.setAttribute('d', rightPath);

    // Responsive ring radius
    const rect = container.getBoundingClientRect();
    const w = rect.width || 540;
    const ringRadius = w < 400 ? 3.5 : 4.5;
    const apexRadius = w < 400 ? 4.5 : 6;
    const pinRadius = w < 400 ? 1.8 : 2.2;

    ropeLeftRing.setAttribute('r', ringRadius.toFixed(1));
    ropeRightRing.setAttribute('r', ringRadius.toFixed(1));
    ropeApexRing.setAttribute('r', apexRadius.toFixed(1));
    ropeApexPin.setAttribute('r', pinRadius.toFixed(1));

    // Position junction rings where left and right cords meet at the tag
    ropeLeftRing.setAttribute('cx', (badgeX - bracketHalf).toFixed(1));
    ropeLeftRing.setAttribute('cy', badgeY.toFixed(1));

    ropeRightRing.setAttribute('cx', (badgeX + bracketHalf).toFixed(1));
    ropeRightRing.setAttribute('cy', badgeY.toFixed(1));

    ropeApexRing.setAttribute('cx', badgeX.toFixed(1));
    ropeApexRing.setAttribute('cy', badgeY.toFixed(1));
    ropeApexPin.setAttribute('cx', badgeX.toFixed(1));
    ropeApexPin.setAttribute('cy', badgeY.toFixed(1));

    // Transform badge card (origin is top bracket apex at badgeX, badgeY)
    tagCard.style.transform = `translate3d(calc(${badgeX.toFixed(1)}px - 50%), ${badgeY.toFixed(1)}px, 0) rotate(${badgeAngle.toFixed(2)}deg)`;
  };

  if (prefersReducedMotion) {
    phase = 'settled';
    badgeX = restX;
    badgeY = restY;
    container.classList.add('is-ready');
    resetRopes(restX, restY);
    renderRopeAndBadge();
  } else {
    renderRopeAndBadge();

    // 1.5s delay before drop
    window.setTimeout(() => {
      phase = 'dropping';
      badgeVx = 0;
      badgeVy = 0;
      dropStartTime = performance.now();
      container.classList.add('is-ready');
    }, 1500);
  }

  const simulateRopeChain = (
    rope: RopeParticle[],
    anchorXPos: number,
    targetEndX: number,
    targetEndY: number,
    segLen: number,
    dt: number
  ) => {
    // Verlet motion update for intermediate particles
    for (let i = 1; i < NUM_ROPE_POINTS - 1; i++) {
      const p = rope[i];
      const vx = (p.x - p.oldX) * 0.94;
      const vy = (p.y - p.oldY) * 0.94;
      p.oldX = p.x;
      p.oldY = p.y;
      p.x += vx;
      // Gentle gravity creates natural rope sag / catenary curve
      p.y += vy + 360 * dt * dt;
    }

    // Constraint relaxation passes
    const passes = 6;
    for (let iter = 0; iter < passes; iter++) {
      rope[0].x = anchorXPos;
      rope[0].y = anchorY;

      rope[NUM_ROPE_POINTS - 1].x = targetEndX;
      rope[NUM_ROPE_POINTS - 1].y = targetEndY;

      for (let i = 0; i < NUM_ROPE_POINTS - 1; i++) {
        const pA = rope[i];
        const pB = rope[i + 1];
        const dx = pB.x - pA.x;
        const dy = pB.y - pA.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        const diff = (dist - segLen) / dist;

        // One-way tension: cables only resist stretching, never push upon compression
        if (diff > 0) {
          const factor = 0.5 * 0.92;
          const offX = dx * diff * factor;
          const offY = dy * diff * factor;

          if (i !== 0) {
            pA.x += offX;
            pA.y += offY;
          }
          if (i + 1 !== NUM_ROPE_POINTS - 1) {
            pB.x -= offX;
            pB.y -= offY;
          }
        }
      }
    }
  };

  // 60FPS Physics Loop
  const physicsLoop = (now: number) => {
    const rawDt = (now - lastFrameTime) / 1000;
    const dt = Math.min(0.035, Math.max(0.006, rawDt));
    lastFrameTime = now;

    // 1. Update Badge Target Position
    if (phase === 'dropping') {
      const elapsed = now - dropStartTime;
      const gravity = 1750;
      let fy = gravity;

      if (badgeY > restY) {
        // Continuous harmonic tension & damping (smooth C1 velocity)
        const dy = badgeY - restY;
        const tensionK = 185;
        const damping = 7.8;
        fy += -tensionK * dy - damping * badgeVy;
      }

      badgeVy += fy * dt;
      badgeY += badgeVy * dt;

      // Realistic subtle sway during the bounce that naturally fades
      const swayDecay = Math.max(0, 1 - elapsed / 1400);
      wobbleAngle = Math.sin(elapsed * 0.011) * swayDecay * 5;

      // Seamless settling gate: smoothly transitions when velocity and displacement are negligible
      const dy = Math.abs(badgeY - restY);
      const isSlow = Math.abs(badgeVy) < 6;
      if ((dy < 0.8 && isSlow && elapsed > 1200) || elapsed > 2200) {
        phase = 'settled';
        badgeVy = 0;
        badgeVx = 0;
      }
    } else if (phase === 'settled') {
      // Gentle ambient floating breeze (zero jitter, smooth slow drift)
      const t = now * 0.001;
      const targetAmbientX = restX + Math.sin(t * 1.3) * 1.0 + smoothScrollX;
      const targetAmbientY = restY + Math.cos(t * 1.3) * 0.5;

      // Scroll inertia integration
      smoothScrollX += (targetScrollX - smoothScrollX) * Math.min(1, dt * 8);
      targetScrollX *= Math.pow(0.88, dt * 60);

      // C-infinity continuous lerp: eliminates any coordinate snap/jump
      badgeX += (targetAmbientX - badgeX) * Math.min(1, dt * 10);
      badgeY += (targetAmbientY - badgeY) * Math.min(1, dt * 10);
    } else if (phase === 'dragging') {
      const rawDx = lastPointerX - dragStartX;
      const rawDy = lastPointerY - dragStartY;

      // Elastic rubber-band resistance
      const targetBx = restX + Math.sign(rawDx) * Math.min(230, Math.pow(Math.abs(rawDx), 0.9) * 1.5);
      const targetBy = restY + (rawDy > 0 ? Math.min(200, Math.pow(rawDy, 0.88) * 1.8) : Math.max(-70, rawDy * 0.45));

      // Fluid follow-through
      badgeX += (targetBx - badgeX) * Math.min(1, dt * 28);
      badgeY += (targetBy - badgeY) * Math.min(1, dt * 28);
    } else if (phase === 'recoiling') {
      // Elastic spring harmonic recoil
      const kX = 145;
      const dX = 9.5;
      const fx = -kX * (badgeX - restX) - dX * badgeVx;
      badgeVx += fx * dt;
      badgeX += badgeVx * dt;

      const kY = 165;
      const dY = 10.5;
      const fy = -kY * (badgeY - restY) - dY * badgeVy;
      badgeVy += fy * dt;
      badgeY += badgeVy * dt;

      if (
        Math.abs(badgeX - restX) < 0.4 &&
        Math.abs(badgeY - restY) < 0.4 &&
        Math.abs(badgeVx) < 3 &&
        Math.abs(badgeVy) < 3
      ) {
        phase = 'settled';
        badgeVx = 0;
        badgeVy = 0;
      }
    }

    // 2. Simulate Left and Right Ropes (Verlet Chain forming Triangle)
    simulateRopeChain(leftParticles, anchorLeftX, badgeX - bracketHalf, badgeY, segLengthLeft, dt);
    simulateRopeChain(rightParticles, anchorRightX, badgeX + bracketHalf, badgeY, segLengthRight, dt);

    // 3. Compute Badge Rotation Angle (Stabilized by Dual Triangular Suspension)
    const targetBadgeAngle = Math.max(-18, Math.min(18, (badgeX - restX) * 0.12)) + wobbleAngle;
    wobbleAngle *= Math.pow(0.85, dt * 60);
    badgeAngle += (targetBadgeAngle - badgeAngle) * Math.min(1, dt * 18);

    // 4. Render Updates
    renderRopeAndBadge();

    window.requestAnimationFrame(physicsLoop);
  };

  window.requestAnimationFrame(physicsLoop);

  // Pointer Interaction Handlers
  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isPointerDown = true;
    hasMoved = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    pointerSamples = [{ x: e.clientX, y: e.clientY, time: performance.now() }];

    phase = 'dragging';
    tagCard.classList.add('is-dragging');

    try {
      tagCard.setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isPointerDown) return;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;

    const now = performance.now();
    pointerSamples.push({ x: e.clientX, y: e.clientY, time: now });
    if (pointerSamples.length > 5) {
      pointerSamples.shift();
    }

    if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) > 5) {
      hasMoved = true;
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    tagCard.classList.remove('is-dragging');

    try {
      tagCard.releasePointerCapture(e.pointerId);
    } catch {}

    const now = performance.now();
    const oldest = pointerSamples[0] || { x: e.clientX, y: e.clientY, time: now - 16 };
    const dtSample = Math.max(0.016, (now - oldest.time) / 1000);
    const releaseVx = (e.clientX - oldest.x) / dtSample;
    const releaseVy = (e.clientY - oldest.y) / dtSample;

    if (!hasMoved) {
      // Playful tap/click wobble flick!
      phase = 'recoiling';
      badgeVx = 0;
      badgeVy = -35;
      wobbleAngle = (Math.random() > 0.5 ? 1 : -1) * 25;
    } else {
      // Spring recoil with drag momentum
      phase = 'recoiling';
      badgeVx = Math.max(-700, Math.min(700, releaseVx * 0.5));
      badgeVy = Math.max(-600, Math.min(600, releaseVy * 0.5));
      wobbleAngle = Math.max(-20, Math.min(20, releaseVx * 0.08));
    }
  };

  tagCard.addEventListener('pointerdown', onPointerDown);
  tagCard.addEventListener('pointermove', onPointerMove);
  tagCard.addEventListener('pointerup', onPointerUp);
  tagCard.addEventListener('pointercancel', onPointerUp);

  tagCard.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      phase = 'recoiling';
      badgeVx = 0;
      badgeVy = -35;
      wobbleAngle = 25;
    }
  });

  window.addEventListener('resize', () => {
    updateMetrics();
    if (phase === 'settled') {
      badgeX = restX;
      badgeY = restY;
      resetRopes(badgeX, badgeY);
      renderRopeAndBadge();
    }
  });

  return {
    hangingAssembly: container,
    onScrollTick: (vel: number) => {
      if (phase === 'settled') {
        targetScrollX = Math.max(-25, Math.min(25, vel * 0.35));
      }
    },
  };
}

function initI18n(onLocaleChange?: () => void): { getLocale: () => Locale; setLocale: (loc: Locale) => void } {
  let currentLocale: Locale = detectUserLocale();

  const applyLocale = (loc: Locale) => {
    currentLocale = loc;
    const dict = translations[loc];

    // 1. Text elements
    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n') as keyof TranslationDictionary;
      if (key && dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // 2. HTML elements
    document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html') as keyof TranslationDictionary;
      if (key && dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // 3. Attribute elements (format: 'attr:key')
    document.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach((el) => {
      const spec = el.getAttribute('data-i18n-attr');
      if (spec) {
        const [attr, key] = spec.split(':');
        if (attr && key && (dict as any)[key] !== undefined) {
          el.setAttribute(attr, (dict as any)[key]);
        }
      }
    });

    // 4. Update html lang
    document.documentElement.lang = loc;

    // 5. Update language switcher UI state
    document.querySelectorAll<HTMLButtonElement>('[data-lang-btn]').forEach((btn) => {
      const btnLang = btn.getAttribute('data-lang-btn');
      const isActive = btnLang === loc;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      if (isActive) {
        btn.classList.add('bg-zinc-100', 'text-zinc-950', 'font-bold', 'shadow-sm');
        btn.classList.remove('text-zinc-400');
      } else {
        btn.classList.remove('bg-zinc-100', 'text-zinc-950', 'font-bold', 'shadow-sm');
        btn.classList.add('text-zinc-400');
      }
    });

    if (onLocaleChange) {
      onLocaleChange();
    }
  };

  // Wire buttons in language switcher
  document.querySelectorAll<HTMLButtonElement>('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const selected = btn.getAttribute('data-lang-btn') as Locale;
      if (selected === 'id' || selected === 'en') {
        try {
          localStorage.setItem('portfolio_lang', selected);
        } catch {}
        applyLocale(selected);
      }
    });
  });

  applyLocale(currentLocale);

  return {
    getLocale: () => currentLocale,
    setLocale: (loc: Locale) => applyLocale(loc),
  };
}

function initPortfolioInteractions(): void {
  predecodeSectionImages();

  let refreshFan: (() => void) | null = null;
  const i18n = initI18n(() => {
    if (refreshFan) {
      refreshFan();
    }
  });

  const fanStage = document.getElementById('sijagung-fan-stage');
  const isoScene = document.getElementById('iso-tools-scene');
  const isoPlane = document.getElementById('iso-tools-plane');
  const isoItems = Array.from(document.querySelectorAll<HTMLElement>('.iso-item'));
  const motionEls = Array.from(document.querySelectorAll<HTMLElement>('[data-motion]'));
  const watermarkEls = Array.from(document.querySelectorAll<HTMLElement>('[data-watermark]'));
  const phoneSideStacks = Array.from(document.querySelectorAll<HTMLElement>('[data-phone-stack]'));
  const pengalamanSection = document.getElementById('pengalaman');
  const contactSectionEl = document.getElementById('kontak');
  const emailCtaEl = document.getElementById('contact-email-cta');

  const { refreshFanCaption } = initPhoneFanInteraction(fanStage, i18n.getLocale);
  refreshFan = refreshFanCaption;

  const { pouchState, setCardFlip } = initPouchCards();
  const { hangingAssembly, onScrollTick: hangingOnScrollTick } = initHangingTag();

  isoItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const alreadyTapped = item.classList.contains('is-tapped');
      isoItems.forEach((other) => other.classList.remove('is-tapped'));
      if (!alreadyTapped) {
        item.classList.add('is-tapped');
      }
    });
  });

  document.addEventListener('click', () => {
    isoItems.forEach((item) => item.classList.remove('is-tapped'));
  });

  if ('IntersectionObserver' in window) {
    const motionObserver = new IntersectionObserver(
      (entries) => {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add('is-inview');
            el.classList.remove('exit-top', 'exit-bottom');
            const settleMs = el.getAttribute('data-motion') === 'slide-right-3d' ? 580 : 220;
            window.setTimeout(() => {
              if (el.classList.contains('is-inview')) {
                el.classList.add('motion-ready');
              }
            }, settleMs);
          } else {
            el.classList.remove('is-inview', 'motion-ready');
            if (entry.boundingClientRect.top < vh * 0.4) {
              el.classList.add('exit-top');
              el.classList.remove('exit-bottom');
            } else {
              el.classList.add('exit-bottom');
              el.classList.remove('exit-top');
            }
          }
        });
      },
      { threshold: 0.01, rootMargin: '85px 0px 85px 0px' }
    );

    motionEls.forEach((el) => {
      el.classList.add('exit-bottom');
      motionObserver.observe(el);
    });

    const watermarkObserver = new IntersectionObserver(
      (entries) => {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add('is-inview');
          } else {
            el.classList.remove('is-inview');
            if (entry.boundingClientRect.top < vh * 0.35) {
              el.classList.add('from-above');
            } else {
              el.classList.remove('from-above');
            }
          }
        });
      },
      { threshold: 0.01, rootMargin: '90px 0px 90px 0px' }
    );

    watermarkEls.forEach((el) => watermarkObserver.observe(el));

    if (fanStage) {
      let fanReadyTimer: number | null = null;
      const fanObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              fanStage.classList.add('is-fanned');
              if (fanReadyTimer !== null) window.clearTimeout(fanReadyTimer);
              fanReadyTimer = window.setTimeout(() => {
                if (fanStage.classList.contains('is-fanned')) {
                  fanStage.classList.add('fan-ready');
                }
              }, 640);
            } else {
              if (fanReadyTimer !== null) window.clearTimeout(fanReadyTimer);
              fanStage.classList.remove('is-fanned', 'fan-ready');
            }
          });
        },
        { threshold: 0.06, rootMargin: '65px 0px 65px 0px' }
      );
      fanObserver.observe(fanStage);
    }

    if (isoScene) {
      let isoReadyTimer: number | null = null;
      const isoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isoScene.classList.add('is-visible');
              if (isoReadyTimer !== null) window.clearTimeout(isoReadyTimer);
              isoReadyTimer = window.setTimeout(() => {
                if (isoScene.classList.contains('is-visible')) {
                  isoScene.classList.add('iso-ready');
                }
              }, 400);
            } else {
              if (isoReadyTimer !== null) window.clearTimeout(isoReadyTimer);
              isoScene.classList.remove('is-visible', 'iso-ready');
            }
          });
        },
        { threshold: 0.05, rootMargin: '80px 0px 80px 0px' }
      );
      isoObserver.observe(isoScene);

      const vh = window.innerHeight || document.documentElement.clientHeight;
      const rect = isoScene.getBoundingClientRect();
      if (rect.top < vh + 80 && rect.bottom > -80) {
        isoScene.classList.add('is-visible');
      }
    }

    if (contactSectionEl) {
      const contactObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              contactSectionEl.classList.add('contact-entered');
            } else {
              contactSectionEl.classList.remove('contact-entered');
            }
          });
        },
        { threshold: 0.25 }
      );
      contactObserver.observe(contactSectionEl);

      if (emailCtaEl) {
        emailCtaEl.addEventListener('mouseenter', () => {
          contactSectionEl.classList.add('email-hovered');
        });
        emailCtaEl.addEventListener('mouseleave', () => {
          contactSectionEl.classList.remove('email-hovered');
        });
      }
    }
  } else {
    motionEls.forEach((el) => el.classList.add('is-inview', 'motion-ready'));
    watermarkEls.forEach((el) => el.classList.add('is-inview'));
    if (fanStage) fanStage.classList.add('is-fanned', 'fan-ready');
    if (isoScene) isoScene.classList.add('is-visible', 'iso-ready');
    if (contactSectionEl) contactSectionEl.classList.add('contact-entered');
  }

  const watermarkConfig = watermarkEls.map((el) => ({
    el,
    speed: Number.parseFloat(el.getAttribute('data-watermark-speed') || '0.15'),
    isRail: el.classList.contains('bg-watermark-rail'),
  }));

  const motionConfig = motionEls.map((el) => ({
    el,
    speedY: Number.parseFloat(el.getAttribute('data-scroll-speed') || '0'),
    speedX: Number.parseFloat(el.getAttribute('data-scroll-x') || '0'),
    speedRot: Number.parseFloat(el.getAttribute('data-scroll-rot') || '0'),
  }));

  const pouchCards = POUCH_IDS.flatMap((id) => {
    const inner = document.getElementById(id);
    const card = inner ? ((inner.closest('.flip-card') || inner.parentElement) as HTMLElement | null) : null;
    return card ? [{ id, card }] : [];
  });

  let lastScrollY = window.scrollY;
  let smoothVelocity = 0;
  let rafId: number | null = null;
  let lastFrameTime = performance.now();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateOnScrollFrame = () => {
    const now = performance.now();
    const dt = Math.max(8, Math.min(64, now - lastFrameTime));
    lastFrameTime = now;

    const currentScrollY = window.scrollY;
    const instantVelocity = ((currentScrollY - lastScrollY) / dt) * 16.67;
    lastScrollY = currentScrollY;

    smoothVelocity += (instantVelocity - smoothVelocity) * 0.18;
    const vel = Math.max(-60, Math.min(60, smoothVelocity));
    const vh = window.innerHeight || document.documentElement.clientHeight;

    const writes: [HTMLElement, string, string][] = [];
    const flips: [string, boolean][] = [];

    // Hanging Tag Scroll Physics
    if (hangingOnScrollTick) {
      hangingOnScrollTick(vel);
    }

    if (fanStage && !prefersReducedMotion) {
      const rect = fanStage.getBoundingClientRect();
      if (rect.bottom > -100 && rect.top < vh + 100) {
        const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        const turn = progress * Math.PI * 2;
        const arc = Math.sin(progress * Math.PI);

        writes.push(
          [fanStage, '--fan-float-c', `${(Math.sin(turn) * -8 - vel * 0.16).toFixed(1)}px`],
          [fanStage, '--fan-float-l', `${(Math.cos(turn) * 10 - vel * 0.22).toFixed(1)}px`],
          [fanStage, '--fan-float-r', `${(Math.sin(turn + 1.1) * 10 - vel * 0.22).toFixed(1)}px`],
          [fanStage, '--fan-spread-x', `${(arc * 14 + Math.abs(vel) * 0.18).toFixed(1)}px`],
          [fanStage, '--fan-spread-rot', `${(arc * 1.8).toFixed(2)}deg`]
        );

        phoneSideStacks.forEach((stackEl, idx) => {
          const side = idx < 2 ? -1 : 1;
          const phase = turn + idx * 1.25;
          const moveX = Math.cos(phase) * 7 * side + arc * 12 * side;
          const moveY = Math.sin(phase) * 15 - vel * (0.26 + idx * 0.04);
          const rot = Math.sin(phase) * 6.5 * side + vel * 0.11 * side;
          const scale = 1 + Math.sin(progress * Math.PI + idx * 0.5) * 0.05;

          writes.push(
            [stackEl, '--side-x', `${moveX.toFixed(1)}px`],
            [stackEl, '--side-y', `${moveY.toFixed(1)}px`],
            [stackEl, '--side-rot', `${rot.toFixed(2)}deg`],
            [stackEl, '--side-scale', scale.toFixed(3)]
          );
        });
      }
    }

    pouchCards.forEach(({ id, card }) => {
      const state = pouchState.get(id);
      if (!state) return;

      const rect = card.getBoundingClientRect();
      if (rect.bottom < -30 || rect.top > vh + 30) {
        state.manualLock = false;
        return;
      }
      if (state.manualLock || card.classList.contains('is-dragging')) return;

      const center = rect.top + rect.height * 0.5;
      if (!state.flipped && center <= vh * 0.44) flips.push([id, true]);
      else if (state.flipped && center >= vh * 0.5) flips.push([id, false]);
    });

    if (!prefersReducedMotion) {
      const nextTop = pengalamanSection?.getBoundingClientRect().top ?? Infinity;

      watermarkConfig.forEach(({ el, speed, isRail }) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom <= -120 || rect.top >= vh + 120) return;

        const offsetFromCenter = rect.top + rect.height * 0.5 - vh * 0.5;
        writes.push([el, '--wm-parallax', `${(-offsetFromCenter * speed - vel * 0.22).toFixed(1)}px`]);

        if (isRail) {
          const fade =
            nextTop < vh * 0.85
              ? Math.max(0, Math.min(1, (nextTop - vh * 0.35) / (vh * 0.5)))
              : 1;
          writes.push([el, '--wm-fade', fade.toFixed(2)]);
        }
      });

      motionConfig.forEach(({ el, speedY, speedX, speedRot }) => {
        if (!el.classList.contains('is-inview')) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -80 || rect.top > vh + 80) return;

        const ratio = Math.max(
          -1.2,
          Math.min(1.2, (rect.top + rect.height * 0.5 - vh * 0.5) / (vh * 0.5))
        );

        if (speedY) writes.push([el, '--m-scroll-y', `${(ratio * speedY * 95).toFixed(1)}px`]);
        if (speedX) writes.push([el, '--m-live-x', `${(ratio * speedX * 120).toFixed(1)}px`]);
        if (speedRot) {
          writes.push([el, '--m-live-rot', `${(-ratio * speedRot + vel * 0.04).toFixed(2)}deg`]);
        }
        writes.push([el, '--m-vel-y', `${(-vel * 0.14).toFixed(1)}px`]);
      });

      if (isoScene && isoPlane) {
        const rect = isoScene.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < vh) {
          const offset = Math.max(
            -1,
            Math.min(1, (rect.top + rect.height * 0.5 - vh * 0.5) / (vh * 0.6))
          );

          writes.push(
            [isoPlane, '--iso-tilt-x', `${(-offset * 3.8 + vel * 0.07).toFixed(2)}deg`],
            [isoPlane, '--iso-tilt-z', `${(offset * 2.2 - vel * 0.04).toFixed(2)}deg`]
          );

          isoItems.forEach((item, idx) => {
            const diagonal = Math.floor(idx / 6) + (idx % 6);
            const wave = Math.sin(offset * Math.PI + diagonal * 0.45) * 4.5 - vel * 0.12;
            writes.push([item, '--scroll-shift-y', `${wave.toFixed(1)}px`]);
          });
        }
      }
    }

    for (const [el, prop, value] of writes) {
      el.style.setProperty(prop, value);
    }
    for (const [id, flipped] of flips) {
      setCardFlip(id, flipped, false);
    }

    rafId = Math.abs(smoothVelocity) >= 0.08 ? window.requestAnimationFrame(updateOnScrollFrame) : null;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateOnScrollFrame);
      }
    },
    { passive: true }
  );

  updateOnScrollFrame();
}

initPortfolioInteractions();
