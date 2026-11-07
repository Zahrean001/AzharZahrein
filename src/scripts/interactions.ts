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
        '#sijagung img, #kemasan img, #tentang img, #pengalaman img, #pendidikan img'
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

    bracketHalf = w < 300 ? 5 : w < 450 ? 6.5 : w < 768 ? 7.5 : 9;

    // Resting badge position over portrait: center X
    restX = w * 0.5;

    // Viewport-anchored target Y:
    // Guarantees the badge always hangs visibly in the open air space (screen Y ~80-100px)
    // regardless of whether container.top is negative (desktop portrait overflow) or positive (mobile)
    const isMobile = window.innerWidth < 640;
    const targetScreenY = isMobile ? 80 : 98;
    restY = targetScreenY - (rect.top || 0);

    spreadX = Math.min(130, Math.max(45, w * 0.22));

    // Anchors spread out to the left and right above the viewport ceiling (always 120px above screen top)
    anchorY = -(rect.top || 0) - 120;
    anchorLeftX = restX - spreadX;
    anchorRightX = restX + spreadX;

    segLengthLeft = Math.hypot(restX - bracketHalf - anchorLeftX, restY - anchorY) / (NUM_ROPE_POINTS - 1);
    segLengthRight = Math.hypot(restX + bracketHalf - anchorRightX, restY - anchorY) / (NUM_ROPE_POINTS - 1);
  };

  updateMetrics();

  const portraitImg = document.querySelector<HTMLImageElement>('#hero-portrait-wrap img');
  if (portraitImg && !portraitImg.complete) {
    portraitImg.addEventListener('load', () => {
      updateMetrics();
      if (phase === 'settled') {
        badgeX = restX;
        badgeY = restY;
        resetRopes(badgeX, badgeY);
        renderRopeAndBadge();
      }
    });
  }

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

  // Starts completely above viewport ceiling (screen Y = -180px, invisible on page load)
  const initialOffscreenY = -(container.getBoundingClientRect().top || 0) - 180;
  resetRopes(restX, initialOffscreenY);

  // Simulation State
  let phase: 'waiting' | 'dropping' | 'settled' | 'dragging' | 'recoiling' = 'waiting';

  let badgeX = restX;
  let badgeY = initialOffscreenY; // Starts completely above viewport (not visible on page load)
  let badgeVx = 0;
  let badgeVy = 0;
  let badgeAngle = 0;
  let wobbleAngle = 0;
  let dropStartTime = 0;

  let targetScrollX = 0;
  let smoothScrollX = 0;

  let isPointerDown = false;
  let grabOffsetX = 0;
  let grabOffsetY = 0;
  let targetDragX = restX;
  let targetDragY = restY;
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

    // Immediate drop following first layout tick (starts completely off-screen, then falls into view)
    window.setTimeout(() => {
      phase = 'dropping';
      badgeVx = 0;
      badgeVy = 90;
      dropStartTime = performance.now();
      container.classList.add('is-ready');
    }, 70);
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
      const gravity = 2400;
      let fy = gravity;

      if (badgeY > restY) {
        // Continuous harmonic tension & damping (smooth C1 velocity)
        const dy = badgeY - restY;
        const tensionK = 270;
        const damping = 9.8;
        fy += -tensionK * dy - damping * badgeVy;
      }

      badgeVy += fy * dt;
      badgeY += badgeVy * dt;

      // Realistic subtle sway during the bounce that naturally fades
      const swayDecay = Math.max(0, 1 - elapsed / 1400);
      wobbleAngle = Math.sin(elapsed * 0.012) * swayDecay * 6;

      // Seamless settling gate: smoothly transitions when velocity and displacement are negligible
      const dy = Math.abs(badgeY - restY);
      const isSlow = Math.abs(badgeVy) < 8;
      if ((dy < 1.0 && isSlow && elapsed > 900) || elapsed > 2400) {
        phase = 'settled';
        badgeVy = 0;
        badgeVx = 0;
        badgeY = restY;
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
      // 1:1 fluid tracking with natural follow-through
      badgeX += (targetDragX - badgeX) * Math.min(1, dt * 50);
      badgeY += (targetDragY - badgeY) * Math.min(1, dt * 50);
    } else if (phase === 'recoiling') {
      // Elastic spring harmonic recoil
      const kX = 135;
      const dX = 8.5;
      const fx = -kX * (badgeX - restX) - dX * badgeVx;
      badgeVx += fx * dt;
      badgeX += badgeVx * dt;

      const kY = 150;
      const dY = 9.5;
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
    const targetBadgeAngle = Math.max(-28, Math.min(28, (badgeX - restX) * 0.16)) + wobbleAngle;
    wobbleAngle *= Math.pow(0.85, dt * 60);
    badgeAngle += (targetBadgeAngle - badgeAngle) * Math.min(1, dt * 18);

    // 4. Render Updates
    renderRopeAndBadge();

    window.requestAnimationFrame(physicsLoop);
  };

  window.requestAnimationFrame(physicsLoop);

  // Pointer Interaction Handlers - 100% Free, Fluid Dragging
  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    isPointerDown = true;
    hasMoved = false;

    const cRect = container.getBoundingClientRect();
    const ptrX = e.clientX - cRect.left;
    const ptrY = e.clientY - cRect.top;

    grabOffsetX = badgeX - ptrX;
    grabOffsetY = badgeY - ptrY;
    targetDragX = badgeX;
    targetDragY = badgeY;

    pointerSamples = [{ x: e.clientX, y: e.clientY, time: performance.now() }];

    phase = 'dragging';
    tagCard.classList.add('is-dragging');
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';

    try {
      tagCard.setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isPointerDown) return;
    const cRect = container.getBoundingClientRect();
    const ptrX = e.clientX - cRect.left;
    const ptrY = e.clientY - cRect.top;

    targetDragX = ptrX + grabOffsetX;
    targetDragY = ptrY + grabOffsetY;

    const now = performance.now();
    pointerSamples.push({ x: e.clientX, y: e.clientY, time: now });
    if (pointerSamples.length > 5) {
      pointerSamples.shift();
    }

    if (Math.hypot(targetDragX - restX, targetDragY - restY) > 5) {
      hasMoved = true;
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    tagCard.classList.remove('is-dragging');
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    try {
      tagCard.releasePointerCapture(e.pointerId);
    } catch {}

    const now = performance.now();
    const oldest = pointerSamples[0] || { x: e.clientX, y: e.clientY, time: now - 16 };
    const dtSample = Math.max(0.016, (now - oldest.time) / 1000);
    const releaseVx = (e.clientX - oldest.x) / dtSample;
    const releaseVy = (e.clientY - oldest.y) / dtSample;

    phase = 'recoiling';
    if (!hasMoved) {
      // Playful tap/click wobble flick!
      badgeVx = (Math.random() > 0.5 ? 1 : -1) * 70;
      badgeVy = -40;
      wobbleAngle = (Math.random() > 0.5 ? 1 : -1) * 25;
    } else {
      // Spring recoil with fluid momentum
      badgeVx = Math.max(-1000, Math.min(1000, releaseVx * 0.75));
      badgeVy = Math.max(-900, Math.min(900, releaseVy * 0.75));
      wobbleAngle = Math.max(-25, Math.min(25, releaseVx * 0.08));
    }
  };

  tagCard.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

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

function initI18n(onLocaleChange?: (loc: Locale) => void): { getLocale: () => Locale; setLocale: (loc: Locale) => void } {
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

    // 4. Update bilingual category titles in skill matrix
    document.querySelectorAll<HTMLElement>('.cat-title-id').forEach((el) => {
      el.style.display = loc === 'id' ? 'inline' : 'none';
    });
    document.querySelectorAll<HTMLElement>('.cat-title-en').forEach((el) => {
      el.style.display = loc === 'en' ? 'inline' : 'none';
    });

    // 5. Update html lang
    document.documentElement.lang = loc;

    // 6. Update language switcher UI state
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
      try {
        onLocaleChange(loc);
      } catch (err) {
        console.error('Error in onLocaleChange:', err);
      }
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

function initSkillFilterTabs(): void {
  const filterBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-skill-filter]'));
  const categoryBlocks = Array.from(document.querySelectorAll<HTMLElement>('.skill-category-block'));
  const isoItems = Array.from(document.querySelectorAll<HTMLElement>('.iso-item'));

  if (!filterBtns.length) return;

  const setFilter = (filter: string) => {
    // 1. Update tab button states
    filterBtns.forEach((btn) => {
      const active = btn.getAttribute('data-skill-filter') === filter;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      if (active) {
        btn.classList.add('border-ink', 'bg-ink', 'text-paper', 'font-semibold');
        btn.classList.remove('border-paper-line', 'bg-white/60', 'text-zinc-700');
      } else {
        btn.classList.remove('border-ink', 'bg-ink', 'text-paper', 'font-semibold');
        btn.classList.add('border-paper-line', 'bg-white/60', 'text-zinc-700');
      }
    });

    // 2. Filter categorized skill ledger blocks below
    categoryBlocks.forEach((block) => {
      const group = block.getAttribute('data-category-group') || '';
      let isMatch = false;

      if (filter === 'all') {
        isMatch = true;
      } else if (filter === 'mobile-web') {
        isMatch = group === 'mobile' || group === 'web';
      } else if (filter === 'backend') {
        isMatch = group === 'backend' || group === 'database';
      } else if (filter === 'design') {
        isMatch = group === 'design';
      } else if (filter === 'tools') {
        isMatch = group === 'tools' || group === 'languages';
      }

      if (isMatch) {
        block.classList.remove('is-filtered-out');
        block.style.opacity = '0';
        block.style.transform = 'translateY(6px)';
        window.requestAnimationFrame(() => {
          block.style.transition = 'opacity 0.22s ease-out, transform 0.24s ease-out';
          block.style.opacity = '1';
          block.style.transform = 'translateY(0)';
        });
      } else {
        block.classList.add('is-filtered-out');
      }
    });

    // 3. Highlight corresponding 3D isometric cubes above
    isoItems.forEach((item) => {
      const cat = item.getAttribute('data-category') || '';
      let matchesIso = false;

      if (filter === 'all') {
        matchesIso = true;
      } else if (filter === 'mobile-web') {
        matchesIso = cat === 'mobile' || cat === 'web';
      } else if (filter === 'backend') {
        matchesIso = cat === 'backend' || cat === 'database';
      } else if (filter === 'design') {
        matchesIso = cat === 'design';
      } else if (filter === 'tools') {
        matchesIso = cat === 'tools' || cat === 'cloud' || cat === 'languages';
      }

      if (filter === 'all') {
        item.classList.remove('is-dimmed', 'is-highlighted');
      } else if (matchesIso) {
        item.classList.remove('is-dimmed');
        item.classList.add('is-highlighted');
      } else {
        item.classList.remove('is-highlighted');
        item.classList.add('is-dimmed');
      }
    });
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const filter = btn.getAttribute('data-skill-filter') || 'all';
      setFilter(filter);
    });
  });
}

/**
 * Interactive 3-Lane 3D Isometric Conveyor Controller (Ultra-Optimized, Solid 60/120fps)
 * Features:
 * - Direction: Continuous slow automatic roll to the right ("lanjut ke kanan, slow")
 * - Mouse wheel horizontal panning with silky momentum damping
 * - Pointer click-and-drag and touch swipe
 * - Modulo wrapping for infinite seamless looping (2 duplicated sets)
 * - Viewport-aware IntersectionObserver: Zero CPU/GPU usage when out of view
 * - Direct GPU compositor transforms (no CSS custom variable cascades)
 */
function initIsoConveyorLanes(): void {
  const container = document.getElementById('iso-tools-container');
  const track1 = document.getElementById('iso-lane-track-1');
  const track2 = document.getElementById('iso-lane-track-2');
  const track3 = document.getElementById('iso-lane-track-3');

  if (!container || !track1 || !track2 || !track3) return;

  const SINGLE_SET_COUNT = 14;
  let panOffset = 0;
  let panVelocity = 0;
  let isInteracting = false;
  let isPointerDown = false;
  let isItemHovered = false;
  let lastX = 0;
  let lastTime = 0;
  let singleSetWidth = 14 * 136;
  let isVisibleInViewport = false;
  let rafId: number | null = null;

  // Track cursor inspection on any item: pause auto-roll and elevate lane z-index
  const allIsoItems = Array.from(container.querySelectorAll<HTMLElement>('.iso-item'));
  allIsoItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      isItemHovered = true;
      const parentLane = item.closest<HTMLElement>('.iso-lane');
      if (parentLane) parentLane.classList.add('has-hover');
    });
    item.addEventListener('mouseleave', () => {
      isItemHovered = false;
      const parentLane = item.closest<HTMLElement>('.iso-lane');
      if (parentLane) parentLane.classList.remove('has-hover');
    });
  });

  const measureSetWidth = () => {
    const firstItem = track1.children[0] as HTMLElement | undefined;
    const setEndItem = track1.children[SINGLE_SET_COUNT] as HTMLElement | undefined;
    if (firstItem && setEndItem) {
      const w = setEndItem.offsetLeft - firstItem.offsetLeft;
      if (w > 200) singleSetWidth = w;
    }
  };

  measureSetWidth();
  window.addEventListener('resize', measureSetWidth, { passive: true });

  const wrapModulo = (val: number, max: number): number => {
    if (max <= 0) return 0;
    return ((val % max) + max) % max;
  };

  // 1. Mouse wheel horizontal scrolling (smooth redirect of wheel delta to roll left)
  container.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      e.preventDefault();
      isInteracting = true;
      const rawDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      // Scroll wheel rolls towards the left ("kan kiri")
      panVelocity += rawDelta * 0.65;
      panVelocity = Math.max(-42, Math.min(42, panVelocity));
    },
    { passive: false }
  );

  // 2. Touch swipe & Mouse pointer dragging
  container.addEventListener('pointerdown', (e: PointerEvent) => {
    if (e.button !== 0) return;
    isPointerDown = true;
    isInteracting = true;
    lastX = e.clientX;
    lastTime = performance.now();
    panVelocity = 0;
    container.classList.add('is-dragging');
    try {
      container.setPointerCapture(e.pointerId);
    } catch (_) {}
  });

  window.addEventListener('pointermove', (e: PointerEvent) => {
    if (!isPointerDown) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastTime);
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    lastTime = now;

    // 1:1 direct manipulation: dragging left advances left, dragging right moves right
    panOffset -= dx;
    panVelocity = (-dx / dt) * 16;
    panVelocity = Math.max(-45, Math.min(45, panVelocity));
  });

  const endDrag = (e: PointerEvent) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    container.classList.remove('is-dragging');
    try {
      if (container.hasPointerCapture(e.pointerId)) {
        container.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
    window.setTimeout(() => {
      isInteracting = false;
    }, 800);
  };

  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  container.addEventListener('pointerenter', () => {
    isInteracting = true;
  });
  container.addEventListener('pointerleave', () => {
    if (!isPointerDown) isInteracting = false;
  });

  // 3. Continuous slow automatic roll to the left following natural current flow ("mengikuti arusnya dong, kan kiri")
  const autoRollSpeed = 0.32; // gentle, steady, slow leftward flow
  let startTime = performance.now();

  const renderFrame = (now: number) => {
    if (!isVisibleInViewport) {
      rafId = null;
      return;
    }

    // Apply velocity with smooth momentum damping
    panOffset += panVelocity;
    panVelocity *= 0.92;

    // Automatic slow roll to the left when not dragging and not inspecting an item
    if (!isPointerDown && !isItemHovered && Math.abs(panVelocity) < 0.05) {
      panOffset += autoRollSpeed;
    }

    if (singleSetWidth > 0) {
      // Calculate seamless modulo shift for 3 duplicated sets (middle set Set 1 centered in viewport)
      const s1 = -singleSetWidth - wrapModulo(panOffset * 1.0, singleSetWidth);
      const s2 = -singleSetWidth - wrapModulo(panOffset * 0.88 + singleSetWidth * 0.33, singleSetWidth);
      const s3 = -singleSetWidth - wrapModulo(panOffset * 1.05 + singleSetWidth * 0.22, singleSetWidth);

      // Ultra-lightweight track-level floating wave (replaces 126 independent CSS animations)
      const elapsed = (now - startTime) * 0.001;
      const floatY1 = Math.sin(elapsed * 1.4) * 4.5;
      const floatY2 = Math.cos(elapsed * 1.2 + 0.6) * 4.0;
      const floatY3 = Math.sin(elapsed * 1.5 + 1.4) * 3.8;

      // Direct GPU compositor transform: 0 style recalculations, pure 60/120fps hardware acceleration
      track1.style.transform = `translate3d(${s1.toFixed(1)}px, ${floatY1.toFixed(1)}px, 0)`;
      track2.style.transform = `translate3d(${s2.toFixed(1)}px, ${floatY2.toFixed(1)}px, 0)`;
      track3.style.transform = `translate3d(${s3.toFixed(1)}px, ${floatY3.toFixed(1)}px, 0)`;
    }

    rafId = requestAnimationFrame(renderFrame);
  };

  // 4. Viewport Observer: Sleep completely when out of view to save 100% CPU/GPU
  if ('IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleInViewport = entry.isIntersecting;
          if (isVisibleInViewport) {
            startTime = performance.now();
            if (rafId === null) {
              rafId = requestAnimationFrame(renderFrame);
            }
          } else {
            if (rafId !== null) {
              cancelAnimationFrame(rafId);
              rafId = null;
            }
          }
        });
      },
      { threshold: 0.01, rootMargin: '120px 0px 120px 0px' }
    );
    visibilityObserver.observe(container);
  } else {
    isVisibleInViewport = true;
    rafId = requestAnimationFrame(renderFrame);
  }
}

function initFloatingSidebarNav(): { onScrollTick: () => void } {
  const sidebarNav = document.getElementById('floating-sidebar-nav');
  if (!sidebarNav) return { onScrollTick: () => {} };

  const links = Array.from(sidebarNav.querySelectorAll<HTMLAnchorElement>('[data-sidebar-link]'));
  if (links.length === 0) return { onScrollTick: () => {} };

  interface TrackedSection {
    id: string;
    el: HTMLElement | null;
    isDark: boolean;
  }

  const sections: TrackedSection[] = [
    { id: 'cover', el: document.getElementById('cover'), isDark: true },
    { id: 'tentang', el: document.getElementById('tentang'), isDark: false },
    { id: 'pengalaman', el: document.getElementById('pengalaman'), isDark: false },
    { id: 'karya', el: document.getElementById('karya'), isDark: false },
    { id: 'sijagung', el: document.getElementById('sijagung'), isDark: false },
    { id: 'kemasan', el: document.getElementById('kemasan'), isDark: false },
    { id: 'pendidikan', el: document.getElementById('pendidikan'), isDark: false },
    { id: 'tools', el: document.getElementById('tools'), isDark: false },
    { id: 'kontak', el: document.getElementById('kontak'), isDark: true },
  ];

  // Smooth click navigation
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-sidebar-link');
      const targetEl = targetId ? document.getElementById(targetId) : null;
      if (targetEl) {
        e.preventDefault();
        const rect = targetEl.getBoundingClientRect();
        const targetTop = rect.top + window.pageYOffset - 24;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
        try {
          history.pushState(null, '', `#${targetId}`);
        } catch (_) {}
      }
    });
  });

  let currentActiveId = '';
  let isCurrentlyDark = true;
  let isCurrentlyHidden = false;

  const onScrollTick = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;

    // 1. Check if sidebar should be hidden (e.g. Technical Skills & Tooling full-width content)
    const toolsSec = document.getElementById('tools');
    const kontakSec = document.getElementById('kontak');
    let shouldHide = false;
    if (toolsSec) {
      const tRect = toolsSec.getBoundingClientRect();
      const kRect = kontakSec ? kontakSec.getBoundingClientRect() : null;
      // We consider the user "inside tools" when tools covers probe height (120px)
      // and contact has not yet reached the probe height
      const enteredTools = tRect.top <= 120 && tRect.bottom > 120;
      const reachedKontak = kRect ? kRect.top <= 120 : false;
      if (enteredTools && !reachedKontak) {
        shouldHide = true;
      }
    }

    if (shouldHide !== isCurrentlyHidden) {
      isCurrentlyHidden = shouldHide;
      if (shouldHide) {
        sidebarNav.classList.add('sidebar-hidden');
      } else {
        sidebarNav.classList.remove('sidebar-hidden');
      }
    }

    // 2. Determine background theme (Light vs Dark) at sidebar probe height (~120px)
    const probeY = 120;
    let themeIsDark = true; // default dark for cover
    for (const sec of sections) {
      if (!sec.el) continue;
      const r = sec.el.getBoundingClientRect();
      if (r.top <= probeY && r.bottom > probeY) {
        themeIsDark = sec.isDark;
        break;
      }
    }

    if (themeIsDark !== isCurrentlyDark) {
      isCurrentlyDark = themeIsDark;
      sidebarNav.classList.add('is-morphing');
      if (themeIsDark) {
        sidebarNav.classList.add('theme-dark');
        sidebarNav.classList.remove('theme-light');
      } else {
        sidebarNav.classList.add('theme-light');
        sidebarNav.classList.remove('theme-dark');
      }
      window.setTimeout(() => {
        sidebarNav.classList.remove('is-morphing');
      }, 750);
    }

    // 3. Highlight the active link based on current reading position
    const readY = vh * 0.38;
    let newActiveId = '';

    // If near the very bottom of page, activate 'kontak'
    if (scrollY + vh >= docHeight - 80) {
      newActiveId = 'kontak';
    } else {
      for (const sec of sections) {
        if (!sec.el || sec.id === 'cover') continue;
        const r = sec.el.getBoundingClientRect();
        if (r.top <= readY && r.bottom > readY) {
          newActiveId = sec.id;
          break;
        }
      }
    }

    if (newActiveId !== currentActiveId) {
      currentActiveId = newActiveId;
      const effectiveTarget =
        newActiveId === 'sijagung' || newActiveId === 'kemasan' ? 'karya' : newActiveId;
      links.forEach((link) => {
        const linkTarget = link.getAttribute('data-sidebar-link');
        if (linkTarget === effectiveTarget) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    }
  };

  onScrollTick();
  return { onScrollTick };
}

function initAboutCgiPortrait(): void {
  const cardStage = document.getElementById('about-portrait-stage');
  if (!cardStage) return;

  // 1. Scroll-triggered entrance reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cardStage.classList.add('is-revealed');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );
  observer.observe(cardStage);

  // 2. Interactive 3D Cursor Parallax
  const chassis = cardStage.querySelector('.about-portrait-chassis') as HTMLElement | null;
  if (!chassis) return;

  const onMouseMove = (e: MouseEvent) => {
    const rect = cardStage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    const tiltX = Math.max(-10, Math.min(10, -deltaY * 8));
    const tiltY = Math.max(-10, Math.min(10, deltaX * 8));

    chassis.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
  };

  const onMouseLeave = () => {
    chassis.style.transform = '';
  };

  cardStage.addEventListener('mousemove', onMouseMove, { passive: true });
  cardStage.addEventListener('mouseleave', onMouseLeave);
}

function initPortfolioInteractions(): void {
  try {
    predecodeSectionImages();

    let refreshFan: (() => void) | null = null;
    const caseStudyBtn = document.getElementById('sijagung-case-study-btn');
    const caseStudyPanel = document.getElementById('sijagung-case-study-panel');
    const caseStudyLabel = document.getElementById('sijagung-btn-label');
    const caseStudyChevron = document.getElementById('sijagung-chevron');

    // SIJAGUNG Interactive Case Study Accordion & Live Architecture Simulator
    const simOfflineBtn = document.getElementById('sijagung-sim-offline');
    const simOnlineBtn = document.getElementById('sijagung-sim-online');
    const triggerHarvestBtn = document.getElementById('sijagung-trigger-harvest');
    const triggerLabel = document.getElementById('sijagung-trigger-label');
    const telemetryText = document.getElementById('sijagung-telemetry-text');
    const node1 = document.getElementById('arch-node-1');
    const node2 = document.getElementById('arch-node-2');
    const node3 = document.getElementById('arch-node-3');
    const node4 = document.getElementById('arch-node-4');
    const node5 = document.getElementById('arch-node-5');
    const inspectTitle = document.getElementById('sijagung-inspect-title');
    const inspectBody = document.getElementById('sijagung-inspect-body');
    const inspectHint = document.getElementById('sijagung-inspect-hint');
    let currentSimMode: 'offline' | 'online' = 'offline';
    let selectedNodeId = '2';
    let harvestCount = 12;

    const inspectDetails: Record<'id' | 'en', Record<string, { title: string; body: string }>> = {
      id: {
        '1': {
          title: 'INSPEKTOR MODUL: 01 / FLUTTER CLIENT (MOBILE UI)',
          body: '<span class="text-emerald-400">STATE ARCHITECTURE:</span> Provider / ChangeNotifier dengan validasi input offline.<br /><span class="text-zinc-500">KONTRAK:</span> Data panen divalidasi di UI thread &lt;16ms (tonase, varietas, koordinat lahan), langsung disimpan ke SQLite lokal tanpa menunggu sinyal.',
        },
        '2': {
          title: 'INSPEKTOR MODUL: 02 / SQLITE LOCAL PERSISTENCE',
          body: '<span class="text-emerald-400">SCHEMA:</span> <code class="text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded">CREATE TABLE tbl_harvest (id UUID PRIMARY KEY, farmer_id INT, yield_kg REAL, is_synced INT DEFAULT 0);</code><br /><span class="text-zinc-500">WAL PRAGMA:</span> Synchronous=NORMAL, Journal_Mode=WAL. Transaksi instan &lt;1.2ms tanpa memblokir sinkronisasi latar belakang.',
        },
        '3': {
          title: 'INSPEKTOR MODUL: 03 / TRANSPORT DAEMON & QUEUE',
          body: '<span class="text-sky-400">PAYLOAD CONTRACT:</span> <code class="text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded">{ "device_id": "KB-ANDR-01", "records": [...], "idempotency_key": "UUIDv4" }</code><br /><span class="text-zinc-500">CONNECTIVITY LISTENER:</span> Memantau pemulihan sinyal 4G/Wi-Fi dan memicu pengiriman batch otomatis dengan exponential-backoff.',
        },
        '4': {
          title: 'INSPEKTOR MODUL: 04 / LARAVEL 10 BACKEND ENGINE',
          body: '<span class="text-sky-400">CONTROLLER:</span> <code class="text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded">DB::transaction(fn() => Harvest::upsert($validated, [\'uuid\'], [\'yield_kg\', \'synced_at\']));</code><br /><span class="text-zinc-500">IDEMPOTENSI:</span> Menjamin nol duplikasi data apabila koneksi terputus di tengah transmisi HTTP POST.',
        },
        '5': {
          title: 'INSPEKTOR MODUL: 05 / CENTRAL MYSQL CLUSTER',
          body: '<span class="text-emerald-400">STORAGE ENGINE:</span> InnoDB berstandar ACID dengan integritas relasional penuh.<br /><span class="text-zinc-500">INDEXING:</span> Composite index <code class="text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded">(farmer_id, harvest_date)</code> untuk agregasi cepat laporan hasil panen tingkat desa.',
        },
      },
      en: {
        '1': {
          title: 'MODULE INSPECTOR: 01 / FLUTTER CLIENT (MOBILE UI)',
          body: '<span class="text-emerald-400">STATE ARCHITECTURE:</span> Provider / ChangeNotifier with offline-first form validation.<br /><span class="text-zinc-500">CONTRACT:</span> Harvest inputs validated on the UI thread in &lt;16ms (tonnage, crop grade, plot GPS) and dispatched directly to local SQLite.',
        },
        '2': {
          title: 'MODULE INSPECTOR: 02 / SQLITE LOCAL PERSISTENCE',
          body: '<span class="text-emerald-400">SCHEMA:</span> <code class="text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded">CREATE TABLE tbl_harvest (id UUID PRIMARY KEY, farmer_id INT, yield_kg REAL, is_synced INT DEFAULT 0);</code><br /><span class="text-zinc-500">WAL PRAGMA:</span> Synchronous=NORMAL, Journal_Mode=WAL. Instant &lt;1.2ms local write without blocking background sync.',
        },
        '3': {
          title: 'MODULE INSPECTOR: 03 / TRANSPORT DAEMON & QUEUE',
          body: '<span class="text-sky-400">PAYLOAD CONTRACT:</span> <code class="text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded">{ "device_id": "KB-ANDR-01", "records": [...], "idempotency_key": "UUIDv4" }</code><br /><span class="text-zinc-500">CONNECTIVITY LISTENER:</span> Detects 4G/Wi-Fi restoration and dispatches queued batches automatically with exponential-backoff retry.',
        },
        '4': {
          title: 'MODULE INSPECTOR: 04 / LARAVEL 10 BACKEND ENGINE',
          body: '<span class="text-sky-400">CONTROLLER:</span> <code class="text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded">DB::transaction(fn() => Harvest::upsert($validated, [\'uuid\'], [\'yield_kg\', \'synced_at\']));</code><br /><span class="text-zinc-500">IDEMPOTENCY:</span> Guarantees zero duplicate records if cellular packet drops occur mid-transmission.',
        },
        '5': {
          title: 'MODULE INSPECTOR: 05 / CENTRAL MYSQL CLUSTER',
          body: '<span class="text-emerald-400">STORAGE ENGINE:</span> ACID-compliant InnoDB cluster with strict foreign-key integrity.<br /><span class="text-zinc-500">INDEXING:</span> Composite index <code class="text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded">(farmer_id, harvest_date)</code> accelerating village-wide harvest aggregation queries.',
        },
      },
    };

    let currentActiveLocale = detectUserLocale();

    const updateInspectorView = (loc: 'id' | 'en') => {
      const detail = inspectDetails[loc]?.[selectedNodeId];
      if (detail && inspectTitle && inspectBody) {
        inspectTitle.textContent = detail.title;
        inspectBody.innerHTML = detail.body;
      }
      if (inspectHint) {
        inspectHint.textContent =
          loc === 'id'
            ? 'Klik node di atas untuk inspeksi arsitektur'
            : 'Click any node above to inspect architecture';
      }
      if (triggerLabel) {
        triggerLabel.textContent = loc === 'id' ? 'Catat Panen Baru' : 'Simulate Harvest';
      }
    };

    const i18n = initI18n((loc) => {
      currentActiveLocale = loc;
      if (refreshFan) {
        refreshFan();
      }
      if (caseStudyBtn && caseStudyLabel) {
        const isExpanded = caseStudyBtn.getAttribute('aria-expanded') === 'true';
        caseStudyLabel.textContent = isExpanded
          ? translations[loc]['sijagung.caseStudyCloseBtn']
          : translations[loc]['sijagung.caseStudyBtn'];
      }
      updateInspectorView(loc);
      const latencyEl = document.getElementById('sijagung-telemetry-latency');
      const gateCounter = document.getElementById('sijagung-gate-counter');
      if (currentSimMode === 'offline') {
        if (latencyEl) {
          latencyEl.textContent = loc === 'id' ? 'LATENSI LOKAL: <1.8ms' : 'LOCAL LATENCY: <1.8ms';
        }
        if (gateCounter) {
          gateCounter.textContent = loc === 'id' ? `(${harvestCount} TERTUNDA)` : `(${harvestCount} QUEUED)`;
        }
        if (telemetryText) {
          telemetryText.textContent =
            loc === 'id'
              ? `[STATUS: OFFLINE] ${harvestCount} transaksi panen diamankan di SQLite perangkat. Flag is_synced=0 siap dikirim saat sinyal terdeteksi.`
              : `[STATUS: OFFLINE] ${harvestCount} harvest records committed to local SQLite storage. Flag is_synced=0 queued for batch transmission.`;
        }
      } else {
        if (latencyEl) {
          latencyEl.textContent = loc === 'id' ? 'LATENSI SINKRON: 118ms' : 'SYNC LATENCY: 118ms';
        }
        if (gateCounter) {
          gateCounter.textContent = '(SYNCED 100%)';
        }
        if (telemetryText) {
          telemetryText.textContent =
            loc === 'id'
              ? `[STATUS: SYNCED] Jaringan seluler terhubung. Background daemon mengirim batch payload ke Laravel API. ${harvestCount} transaksi berhasil direkonsiliasi di MySQL.`
              : `[STATUS: SYNCED] Network socket connected. Background daemon dispatched batch payload to Laravel API. ${harvestCount} records reconciled in MySQL.`;
        }
      }
    });

    [node1, node2, node3, node4, node5].forEach((node) => {
      if (!node) return;
      node.addEventListener('click', () => {
        const id = node.getAttribute('data-node-id');
        if (!id) return;
        selectedNodeId = id;
        [node1, node2, node3, node4, node5].forEach((n) => n?.classList.remove('is-inspected'));
        node.classList.add('is-inspected');
        updateInspectorView(currentActiveLocale);
      });
    });

    let typeWriterTimer: number | null = null;
    const typeTelemetry = (text: string) => {
      if (!telemetryText) return;
      if (typeWriterTimer !== null) {
        window.clearTimeout(typeWriterTimer);
        typeWriterTimer = null;
      }
      telemetryText.textContent = '';
      let charIdx = 0;
      const step = () => {
        if (charIdx < text.length) {
          telemetryText.textContent += text.charAt(charIdx);
          charIdx++;
          typeWriterTimer = window.setTimeout(step, 9);
        } else {
          typeWriterTimer = null;
        }
      };
      step();
    };

    const setSimMode = (mode: 'offline' | 'online') => {
      currentSimMode = mode;
      const isId = currentActiveLocale === 'id';
      const onlineLed = document.getElementById('sijagung-online-led');
      const latencyEl = document.getElementById('sijagung-telemetry-latency');
      const syncFlag = document.getElementById('sijagung-sync-flag');
      const dbFlag = document.getElementById('sijagung-db-flag');
      const daemonStatus = document.getElementById('sijagung-daemon-status');
      const daemonTag = document.getElementById('sijagung-daemon-tag');
      const backendStatus = document.getElementById('sijagung-backend-status');
      const backendTag = document.getElementById('sijagung-backend-tag');
      const repoTag = document.getElementById('sijagung-repo-tag');
      const flowStep2 = document.getElementById('sijagung-flow-step-2');
      const flowStep3 = document.getElementById('sijagung-flow-step-3');
      const flowDot2 = document.getElementById('sijagung-flow-dot-2');
      const flowDot3 = document.getElementById('sijagung-flow-dot-3');
      const ambientGlow = document.getElementById('sijagung-ambient-glow');
      const pingRing = document.getElementById('sijagung-ping-ring');
      const pingDot = document.getElementById('sijagung-ping-dot');
      const consoleLed = document.getElementById('sijagung-console-status-led');

      // Circuit Elements
      const gateLed = document.getElementById('sijagung-gate-led');
      const gateLine = document.getElementById('sijagung-gate-line');
      const gatePhoton1 = document.getElementById('sijagung-gate-photon-1');
      const gatePhoton2 = document.getElementById('sijagung-gate-photon-2');
      const gateStatusPill = document.getElementById('sijagung-gate-status-pill');
      const gateCounter = document.getElementById('sijagung-gate-counter');
      const httpLine = document.getElementById('sijagung-http-line');
      const httpPhoton = document.getElementById('sijagung-http-photon');
      const httpLabel = document.getElementById('sijagung-http-label');
      const dbLine = document.getElementById('sijagung-db-line');
      const dbPhoton = document.getElementById('sijagung-db-photon');
      const dbLabel = document.getElementById('sijagung-db-label');
      const via3 = document.getElementById('sijagung-via-3');
      const via4 = document.getElementById('sijagung-via-4');
      const via5 = document.getElementById('sijagung-via-5');
      const sqliteDot = document.getElementById('sijagung-sqlite-dot');
      const apiDot = document.getElementById('sijagung-api-dot');
      const backendDot = document.getElementById('sijagung-backend-dot');
      const dbDot = document.getElementById('sijagung-db-dot');

      if (mode === 'offline') {
        if (simOfflineBtn) {
          simOfflineBtn.className = 'sim-mode-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide transition-all duration-200 cursor-pointer bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-xs whitespace-nowrap';
          simOfflineBtn.setAttribute('aria-pressed', 'true');
        }
        if (simOnlineBtn) {
          simOnlineBtn.className = 'sim-mode-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide transition-all duration-200 cursor-pointer text-zinc-400 hover:text-zinc-200 whitespace-nowrap';
          simOnlineBtn.setAttribute('aria-pressed', 'false');
        }
        if (onlineLed) onlineLed.className = 'w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0';
        if (ambientGlow) ambientGlow.className = 'absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none transition-colors duration-500';
        if (pingRing) pingRing.className = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75';
        if (pingDot) pingDot.className = 'relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500';
        if (consoleLed) consoleLed.className = 'w-2 h-2 rounded-full bg-emerald-500 shrink-0';

        // Gateway in Offline mode: locked, amber
        if (gateLed) gateLed.className = 'w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse';
        if (gateLine) gateLine.className = 'w-full h-[2px] bg-zinc-800 transition-colors duration-300';
        if (gatePhoton1) gatePhoton1.classList.add('hidden');
        if (gatePhoton2) gatePhoton2.classList.add('hidden');
        if (gateStatusPill) {
          gateStatusPill.textContent = 'GATEWAY: OFFLINE';
          gateStatusPill.className = 'text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-900 text-amber-400 border border-amber-500/40 shadow-xs';
        }
        if (gateCounter) gateCounter.textContent = isId ? `(${harvestCount} TERTUNDA)` : `(${harvestCount} QUEUED)`;

        if (httpLine) httpLine.className = 'w-full h-[2px] bg-zinc-800 transition-colors duration-300';
        if (httpPhoton) httpPhoton.classList.add('hidden');
        if (httpLabel) httpLabel.className = 'absolute left-[60%] -translate-x-1/2 top-0 text-[9px] font-mono text-zinc-500 whitespace-nowrap';
        if (dbLine) dbLine.className = 'w-full h-[2px] bg-zinc-800 transition-colors duration-300';
        if (dbPhoton) dbPhoton.classList.add('hidden');
        if (dbLabel) dbLabel.className = 'absolute left-[80%] -translate-x-1/2 top-0 text-[9px] font-mono text-zinc-500 whitespace-nowrap';

        if (via3) via3.className = 'absolute left-[50%] -translate-x-1/2 top-6 w-[2px] h-5 bg-zinc-700 transition-colors duration-300';
        if (via4) via4.className = 'absolute left-[70%] -translate-x-1/2 top-6 w-[2px] h-5 bg-zinc-700 transition-colors duration-300';
        if (via5) via5.className = 'absolute left-[90%] -translate-x-1/2 top-6 w-[2px] h-5 bg-zinc-700 transition-colors duration-300';

        if (sqliteDot) sqliteDot.className = 'w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0';
        if (apiDot) apiDot.className = 'w-2 h-2 rounded-full bg-zinc-700 shrink-0';
        if (backendDot) backendDot.className = 'w-2 h-2 rounded-full bg-zinc-700 shrink-0';
        if (dbDot) dbDot.className = 'w-2 h-2 rounded-full bg-zinc-700 shrink-0';

        if (node1) node1.className = `arch-node p-3.5 border border-zinc-700/80 bg-zinc-900/90 rounded-lg flex flex-col justify-between transition-all duration-300 is-active-offline cursor-pointer select-none group${selectedNodeId === '1' ? ' is-inspected' : ''}`;
        if (node2) node2.className = `arch-node p-3.5 border border-zinc-700/80 bg-zinc-900/90 rounded-lg flex flex-col justify-between transition-all duration-300 is-active-offline cursor-pointer select-none group${selectedNodeId === '2' ? ' is-inspected' : ''}`;
        if (node3) node3.className = `arch-node p-3.5 border border-zinc-800/80 bg-zinc-950/80 rounded-lg flex flex-col justify-between transition-all duration-300 opacity-60 cursor-pointer select-none group${selectedNodeId === '3' ? ' is-inspected' : ''}`;
        if (node4) node4.className = `arch-node p-3.5 border border-zinc-800/80 bg-zinc-950/80 rounded-lg flex flex-col justify-between transition-all duration-300 opacity-60 cursor-pointer select-none group${selectedNodeId === '4' ? ' is-inspected' : ''}`;
        if (node5) node5.className = `arch-node p-3.5 border border-zinc-800/80 bg-zinc-950/80 rounded-lg flex flex-col justify-between transition-all duration-300 opacity-60 cursor-pointer select-none group sm:col-span-2 lg:col-span-1${selectedNodeId === '5' ? ' is-inspected' : ''}`;

        if (syncFlag) {
          syncFlag.textContent = 'is_synced: 0';
          syncFlag.className = 'text-amber-300 font-semibold px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/50 text-[9px]';
        }
        if (daemonStatus) {
          daemonStatus.textContent = 'Standby';
          daemonStatus.className = 'text-zinc-400 font-semibold';
        }
        if (daemonTag) daemonTag.className = 'text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px]';
        if (backendStatus) {
          backendStatus.textContent = 'Awaiting';
          backendStatus.className = 'text-zinc-400 font-semibold';
        }
        if (backendTag) backendTag.className = 'text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px]';
        if (dbFlag) {
          dbFlag.textContent = 'Master Store';
          dbFlag.className = 'text-zinc-500 font-semibold';
        }
        if (repoTag) repoTag.className = 'text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px]';
        if (latencyEl) latencyEl.textContent = isId ? 'LATENSI LOKAL: <1.8ms' : 'LOCAL LATENCY: <1.8ms';

        if (flowStep2) flowStep2.className = 'flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-950/70 border border-zinc-800/80 text-zinc-500 transition-colors';
        if (flowStep3) flowStep3.className = 'flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-950/70 border border-zinc-800/80 text-zinc-500 transition-colors';
        if (flowDot2) flowDot2.className = 'w-1.5 h-1.5 rounded-full bg-zinc-600 transition-colors shrink-0';
        if (flowDot3) flowDot3.className = 'w-1.5 h-1.5 rounded-full bg-zinc-600 transition-colors shrink-0';

        typeTelemetry(
          isId
            ? `[STATUS: OFFLINE] ${harvestCount} transaksi panen diamankan di SQLite perangkat. Flag is_synced=0 siap dikirim saat sinyal terdeteksi.`
            : `[STATUS: OFFLINE] ${harvestCount} harvest records committed to local SQLite storage. Flag is_synced=0 queued for batch transmission.`
        );
      } else {
        if (simOnlineBtn) {
          simOnlineBtn.className = 'sim-mode-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide transition-all duration-200 cursor-pointer bg-zinc-800 text-sky-400 border border-sky-500/30 shadow-xs whitespace-nowrap';
          simOnlineBtn.setAttribute('aria-pressed', 'true');
        }
        if (simOfflineBtn) {
          simOfflineBtn.className = 'sim-mode-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide transition-all duration-200 cursor-pointer text-zinc-400 hover:text-zinc-200 whitespace-nowrap';
          simOfflineBtn.setAttribute('aria-pressed', 'false');
        }
        if (onlineLed) onlineLed.className = 'w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] shrink-0';
        if (ambientGlow) ambientGlow.className = 'absolute -top-24 -left-24 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl pointer-events-none transition-colors duration-500';
        if (pingRing) pingRing.className = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75';
        if (pingDot) pingDot.className = 'relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400';
        if (consoleLed) consoleLed.className = 'w-2 h-2 rounded-full bg-sky-400 shrink-0';

        // Gateway in Online mode: open, cyan
        if (gateLed) gateLed.className = 'w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]';
        if (gateLine) gateLine.className = 'w-full h-[2px] bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] transition-colors duration-300';
        if (gatePhoton1) gatePhoton1.classList.remove('hidden');
        if (gatePhoton2) gatePhoton2.classList.remove('hidden');
        if (gateStatusPill) {
          gateStatusPill.textContent = '4G AUTO-SYNC';
          gateStatusPill.className = 'text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-500/40 shadow-xs';
        }
        if (gateCounter) gateCounter.textContent = '(SYNCED 100%)';

        if (httpLine) httpLine.className = 'w-full h-[2px] bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.7)] transition-colors duration-300';
        if (httpPhoton) httpPhoton.classList.remove('hidden');
        if (httpLabel) httpLabel.className = 'absolute left-[60%] -translate-x-1/2 top-0 text-[9px] font-mono text-sky-400 font-semibold whitespace-nowrap';
        if (dbLine) dbLine.className = 'w-full h-[2px] bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)] transition-colors duration-300';
        if (dbPhoton) dbPhoton.classList.remove('hidden');
        if (dbLabel) dbLabel.className = 'absolute left-[80%] -translate-x-1/2 top-0 text-[9px] font-mono text-emerald-400 font-semibold whitespace-nowrap';

        if (via3) via3.className = 'absolute left-[50%] -translate-x-1/2 top-6 w-[2px] h-5 bg-sky-400/80 transition-colors duration-300';
        if (via4) via4.className = 'absolute left-[70%] -translate-x-1/2 top-6 w-[2px] h-5 bg-sky-400/80 transition-colors duration-300';
        if (via5) via5.className = 'absolute left-[90%] -translate-x-1/2 top-6 w-[2px] h-5 bg-emerald-400/80 transition-colors duration-300';

        if (sqliteDot) sqliteDot.className = 'w-2 h-2 rounded-full bg-emerald-400 shrink-0';
        if (apiDot) apiDot.className = 'w-2 h-2 rounded-full bg-sky-400 animate-pulse shrink-0';
        if (backendDot) backendDot.className = 'w-2 h-2 rounded-full bg-sky-400 animate-pulse shrink-0';
        if (dbDot) dbDot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0';

        if (node1) node1.className = `arch-node p-3.5 border border-zinc-800/80 bg-zinc-950/80 rounded-lg flex flex-col justify-between transition-all duration-300 opacity-85 cursor-pointer select-none group${selectedNodeId === '1' ? ' is-inspected' : ''}`;
        if (node2) node2.className = `arch-node p-3.5 border border-zinc-800/80 bg-zinc-950/80 rounded-lg flex flex-col justify-between transition-all duration-300 opacity-85 cursor-pointer select-none group${selectedNodeId === '2' ? ' is-inspected' : ''}`;
        if (node3) node3.className = `arch-node p-3.5 border border-sky-500/40 bg-zinc-900/90 rounded-lg flex flex-col justify-between transition-all duration-300 is-active-online cursor-pointer select-none group${selectedNodeId === '3' ? ' is-inspected' : ''}`;
        if (node4) node4.className = `arch-node p-3.5 border border-sky-500/40 bg-zinc-900/90 rounded-lg flex flex-col justify-between transition-all duration-300 is-active-online cursor-pointer select-none group${selectedNodeId === '4' ? ' is-inspected' : ''}`;
        if (node5) node5.className = `arch-node p-3.5 border border-sky-500/40 bg-zinc-900/90 rounded-lg flex flex-col justify-between transition-all duration-300 is-active-online cursor-pointer select-none group sm:col-span-2 lg:col-span-1${selectedNodeId === '5' ? ' is-inspected' : ''}`;

        if (syncFlag) {
          syncFlag.textContent = 'is_synced: 1';
          syncFlag.className = 'text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50 text-[9px]';
        }
        if (daemonStatus) {
          daemonStatus.textContent = 'Streaming';
          daemonStatus.className = 'text-sky-300 font-semibold';
        }
        if (daemonTag) daemonTag.className = 'text-sky-300 px-1.5 py-0.5 rounded bg-sky-950/60 border border-sky-800/50 text-[9px]';
        if (backendStatus) {
          backendStatus.textContent = '200 OK';
          backendStatus.className = 'text-emerald-400 font-semibold';
        }
        if (backendTag) backendTag.className = 'text-sky-300 px-1.5 py-0.5 rounded bg-sky-950/60 border border-sky-800/50 text-[9px]';
        if (dbFlag) {
          dbFlag.textContent = `${harvestCount} Committed`;
          dbFlag.className = 'text-sky-300 font-semibold';
        }
        if (repoTag) repoTag.className = 'text-sky-300 px-1.5 py-0.5 rounded bg-sky-950/60 border border-sky-800/50 text-[9px]';
        if (latencyEl) latencyEl.textContent = isId ? 'LATENSI SINKRON: 118ms' : 'SYNC LATENCY: 118ms';

        if (flowStep2) flowStep2.className = 'flex items-center gap-2 px-3 py-2 rounded-md bg-sky-950/30 border border-sky-500/30 text-sky-400 transition-colors';
        if (flowStep3) flowStep3.className = 'flex items-center gap-2 px-3 py-2 rounded-md bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 transition-colors';
        if (flowDot2) flowDot2.className = 'w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)] transition-colors shrink-0';
        if (flowDot3) flowDot3.className = 'w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(103,232,249,0.8)] transition-colors shrink-0';

        typeTelemetry(
          isId
            ? `[STATUS: SYNCED] Jaringan seluler terhubung. Background daemon mengirim batch payload ke Laravel API. ${harvestCount} transaksi berhasil direkonsiliasi di MySQL.`
            : `[STATUS: SYNCED] Network socket connected. Background daemon dispatched batch payload to Laravel API. ${harvestCount} records reconciled in MySQL.`
        );
      }
    };

    if (triggerHarvestBtn) {
      triggerHarvestBtn.addEventListener('click', () => {
        harvestCount++;
        const isId = currentActiveLocale === 'id';
        const farmers = ['Bpk. Suwardi', 'Ibu Nurhayati', 'Bpk. Ahmad Junaidi', 'Bpk. Hendra'];
        const randomFarmer = farmers[Math.floor(Math.random() * farmers.length)];
        const randomTons = (Math.random() * 2 + 1.2).toFixed(1);

        if (currentSimMode === 'offline') {
          const gateCounter = document.getElementById('sijagung-gate-counter');
          if (gateCounter) {
            gateCounter.textContent = isId ? `(${harvestCount} TERTUNDA)` : `(${harvestCount} QUEUED)`;
          }
          node1?.classList.add('scale-[1.02]');
          node2?.classList.add('scale-[1.02]');
          setTimeout(() => {
            node1?.classList.remove('scale-[1.02]');
            node2?.classList.remove('scale-[1.02]');
          }, 200);

          typeTelemetry(
            isId
              ? `[INPUT PANEN] ${randomFarmer} (${randomTons} Ton Jagung Hibrida). Tersimpan lokal di SQLite. Antrean offline: ${harvestCount} transaksi.`
              : `[HARVEST LOGGED] ${randomFarmer} (${randomTons} Tons Hybrid Corn). Committed to local SQLite. Offline queue: ${harvestCount} records.`
          );
        } else {
          const dbFlag = document.getElementById('sijagung-db-flag');
          if (dbFlag) dbFlag.textContent = `${harvestCount} Committed`;
          node1?.classList.add('scale-[1.02]');
          node5?.classList.add('scale-[1.02]');
          setTimeout(() => {
            node1?.classList.remove('scale-[1.02]');
            node5?.classList.remove('scale-[1.02]');
          }, 200);

          typeTelemetry(
            isId
              ? `[LIVE TRANSMIT] ${randomFarmer} (${randomTons} Ton) disinkronkan ke Laravel API -> HTTP 200 OK -> MySQL Transaksi #${41820 + harvestCount} terkomit.`
              : `[LIVE TRANSMIT] ${randomFarmer} (${randomTons} Tons) synced to Laravel API -> HTTP 200 OK -> MySQL Transaction #${41820 + harvestCount} committed.`
          );
        }
      });
    }

    if (simOfflineBtn) {
      simOfflineBtn.addEventListener('click', () => setSimMode('offline'));
    }
    if (simOnlineBtn) {
      simOnlineBtn.addEventListener('click', () => setSimMode('online'));
    }

    if (caseStudyBtn && caseStudyPanel) {
      caseStudyBtn.addEventListener('click', () => {
        const isExpanded = caseStudyBtn.getAttribute('aria-expanded') === 'true';
        const willExpand = !isExpanded;

        caseStudyBtn.setAttribute('aria-expanded', willExpand ? 'true' : 'false');
        caseStudyPanel.setAttribute('aria-hidden', willExpand ? 'false' : 'true');
        caseStudyPanel.classList.toggle('is-open', willExpand);

        if (caseStudyChevron) {
          caseStudyChevron.style.transform = willExpand ? 'rotate(180deg)' : 'rotate(0deg)';
        }

        if (caseStudyLabel) {
          caseStudyLabel.textContent = willExpand
            ? translations[currentActiveLocale]['sijagung.caseStudyCloseBtn']
            : translations[currentActiveLocale]['sijagung.caseStudyBtn'];
        }

        if (willExpand) {
          setTimeout(() => {
            caseStudyPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 80);
        }
      });
    }

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
  const { onScrollTick: sidebarOnScrollTick } = initFloatingSidebarNav();
  initSkillFilterTabs();
  initIsoConveyorLanes();
  initAboutCgiPortrait();

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
    const vh = window.innerHeight || document.documentElement.clientHeight;

    const motionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add('is-inview');
            el.classList.remove('motion-prepare');
            window.setTimeout(() => {
              if (el.classList.contains('is-inview')) {
                el.classList.add('motion-ready');
              }
            }, 240);
            motionObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.02, rootMargin: '120px 0px 120px 0px' }
    );

    motionEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Only add motion-prepare if element is well below initial viewport
      if (rect.top > vh + 40) {
        el.classList.add('motion-prepare');
      } else {
        el.classList.add('is-inview', 'motion-ready');
      }
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

    // Floating Sidebar Navigation Tracker
    if (sidebarOnScrollTick) {
      sidebarOnScrollTick();
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
            [isoPlane, '--iso-tilt-x', `${(-offset * 3.2 + vel * 0.05).toFixed(2)}deg`],
            [isoPlane, '--iso-tilt-z', `${(offset * 2.0 - vel * 0.03).toFixed(2)}deg`]
          );
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

  // Handle initial hash navigation immediately and synchronously
  if (window.location.hash) {
    const targetHash = window.location.hash;
    const scrollToTarget = () => {
      try {
        const target = document.querySelector(targetHash);
        if (target) {
          const top = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top, behavior: 'auto' });
        }
      } catch {}
    };
    scrollToTarget();
    window.setTimeout(scrollToTarget, 60);
    window.setTimeout(scrollToTarget, 250);
  }
  } catch (err) {
    console.error('Fatal initialization error in interactions.ts:', err);
    document.querySelectorAll<HTMLElement>('[data-motion]').forEach((el) => {
      el.classList.add('is-inview');
      el.style.opacity = '1';
    });
  }
}

initPortfolioInteractions();
