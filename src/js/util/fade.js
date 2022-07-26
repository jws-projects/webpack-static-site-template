/**
 * jQuery fadeOutのVanillaJS実装
 * @param {selector} el
 */
export function fadeOut(el) {
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= 0.05) < 0) {
      el.style.display = 'none';
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

/**
 * jQuery fadeInのVanillaJS実装
 * @param {selector} el
 * @param {display} display
 */
export function fadeIn(el, display) {
  el.style.opacity = 0;
  el.style.display = display || 'block';

  (function fade() {
    let val = parseFloat(el.style.opacity);
    if (!((val += 0.05) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}
