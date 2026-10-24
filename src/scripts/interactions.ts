interface ScreenMeta {
  title: string;
  caption: string;
}

interface PouchCardState {
  flipped: boolean;
  manualLock: boolean;
}

const SCREEN_META: ScreenMeta[] = [
  {
    title: 'Dashboard',
    caption: '“Ringkasan data lapangan dalam satu tampilan.”',
  },
  {
    title: 'Data Petani',
    caption: '“Data petani yang dapat dicatat dan diperbarui di lapangan.”',
  },
  {
    title: 'Data Panen',
    caption: '“Catatan panen untuk melengkapi data pertanian.”',
  },
];

const DEFAULT_FAN_META: ScreenMeta = {
  title: 'Dashboard · Data Petani · Data Panen',
  caption: '“Ringkasan data lapangan, pencatatan petani, dan hasil panen dalam satu alur aplikasi.”',
};

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

function initPhoneFanInteraction(fanStage: HTMLElement | null): void {
  const fanPhoneItems = Array.from(document.querySelectorAll<HTMLElement>('[data-fan-phone]'));
  let activeFanIndex = -1;

  const updateFanCaption = (index: number) => {
    if (index === activeFanIndex) return;
    activeFanIndex = index;

    const titleEl = document.getElementById('screen-title');
    const captionEl = document.getElementById('screen-caption');
    if (!titleEl || !captionEl) return;

    const targetMeta = index >= 0 && SCREEN_META[index] ? SCREEN_META[index] : DEFAULT_FAN_META;
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
    if (!cardInner || !cardInner.parentElement) return;
    const cardContainer = cardInner.parentElement;
    const state = pouchState.get(elementId);
    if (!state) return;

    if (isManual) {
      state.manualLock = true;
    }
    state.flipped = shouldFlip;

    cardInner.style.transform = '';
    cardContainer.classList.toggle('flipped', shouldFlip);
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

function initPortfolioInteractions(): void {
  predecodeSectionImages();

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

  initPhoneFanInteraction(fanStage);
  const { pouchState, setCardFlip } = initPouchCards();

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
                isoScene.classList.add('iso-ready');
              }, 320);
            } else {
              if (isoReadyTimer !== null) window.clearTimeout(isoReadyTimer);
              isoScene.classList.remove('is-visible', 'iso-ready');
            }
          });
        },
        { threshold: 0.05, rootMargin: '70px 0px 70px 0px' }
      );
      isoObserver.observe(isoScene);
    }

    if (contactSectionEl) {
      const contactObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              contactSectionEl.classList.add('contact-entered');
              contactObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18 }
      );
      contactObserver.observe(contactSectionEl);
    }
  } else {
    motionEls.forEach((el) => el.classList.add('is-inview', 'motion-ready'));
    watermarkEls.forEach((el) => el.classList.add('is-inview'));
    if (fanStage) fanStage.classList.add('is-fanned', 'fan-ready');
    if (isoScene) isoScene.classList.add('is-visible', 'iso-ready');
    if (contactSectionEl) contactSectionEl.classList.add('contact-entered');
  }

  if (contactSectionEl && emailCtaEl) {
    emailCtaEl.addEventListener('mouseenter', () =>
      contactSectionEl.classList.add('email-hovered')
    );
    emailCtaEl.addEventListener('mouseleave', () =>
      contactSectionEl.classList.remove('email-hovered')
    );
    emailCtaEl.addEventListener('focus', () =>
      contactSectionEl.classList.add('email-hovered')
    );
    emailCtaEl.addEventListener('blur', () =>
      contactSectionEl.classList.remove('email-hovered')
    );
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastScrollY = window.scrollY || 0;
  let smoothVelocity = 0;
  let rafId: number | null = null;

  const readNumber = (el: Element, attr: string, fallback = 0) =>
    Number.parseFloat(el.getAttribute(attr) ?? '') || fallback;

  const motionConfig = motionEls.map((el) => ({
    el,
    speedY: readNumber(el, 'data-scroll-speed'),
    speedX: readNumber(el, 'data-scroll-x'),
    speedRot: readNumber(el, 'data-scroll-rot'),
  }));

  const watermarkConfig = watermarkEls.map((el) => ({
    el,
    speed: readNumber(el, 'data-watermark-speed', 0.16),
    isRail: el.classList.contains('bg-watermark-rail'),
  }));

  const pouchCards = POUCH_IDS.flatMap((id) => {
    const card = document.getElementById(id)?.parentElement;
    return card ? [{ id, card }] : [];
  });

  type StyleWrite = [HTMLElement, string, string];

  // Every frame measures first and writes afterwards. Mixing the two forces the
  // browser to recalculate layout once per element, which is what causes jank.
  const updateOnScrollFrame = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const currentY = window.scrollY || 0;
    const rawDelta = currentY - lastScrollY;
    lastScrollY = currentY;

    smoothVelocity += (rawDelta - smoothVelocity) * 0.38;
    if (Math.abs(smoothVelocity) < 0.08) {
      smoothVelocity = 0;
    }
    const vel = Math.max(-38, Math.min(38, smoothVelocity));

    const writes: StyleWrite[] = [];
    const flips: Array<[string, boolean]> = [];

    if (fanStage && !prefersReducedMotion) {
      const rect = fanStage.getBoundingClientRect();
      if (rect.bottom > -120 && rect.top < vh + 120) {
        const progress = Math.max(0, Math.min(1, (vh - rect.top) / Math.max(1, vh + rect.height)));
        const arc = Math.sin(progress * Math.PI);
        const turn = progress * Math.PI * 2;

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
