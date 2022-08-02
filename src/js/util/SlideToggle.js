import gsap from 'gsap';

/**
 * SlideToggleに関するClass
 */
export default class SlideToggle {
  /**
   * @param {String} trigger トリガーとなるclass
   * @param {String} target ターゲットとなるclass
   */
  constructor(trigger = '.js-toggle-trigger', target = '.js-toggle-target') {
    this.trigger = document.querySelectorAll(trigger);
    this.target = target;
    gsap.set(document.querySelectorAll(target), {
      height: 0,
      overflow: 'hidden',
    });
  }

  open(target) {
    target.classList.add('is-open');
    gsap.to(target, {
      height: 'auto',
      duration: 0.5,
      ease: 'power3.out',
    });
  }

  close(target) {
    target.classList.remove('is-open');
    gsap.to(target, {
      height: 0,
      duration: 0.5,
      ease: 'power3.out',
    });
  }

  toggle() {
    for (let i = 0; i < this.trigger.length; i++) {
      this.trigger[i].addEventListener('click', () => {
        const tg = this.trigger[i].nextElementSibling;
        const result = tg.classList.contains('is-open');
        if (result) {
          this.close(tg);
        } else {
          this.open(tg);
        }
      });
    }
  }
}
