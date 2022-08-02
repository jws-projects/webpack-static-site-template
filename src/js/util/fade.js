import gsap from 'gsap';

export default class Fade {
  /**
   * Fadeに関するClass
   * @param {{
   *  element: HTMLElementn,
   *  duration: number,
   *  ease: String,
   *  display: String
   * }}
   */
  constructor({
    element = document.querySelector('.js-fade'),
    duration = 0.4,
    ease = 'power3.Out',
    display = 'block',
  }) {
    this.element = element;
    this.duration = duration;
    this.ease = ease;
    this.display = display;
  }

  /**
   * fadeOutを行うための関数。
   */
  fadeOut() {
    gsap.set(this.element, { opacity: 1, display: this.display });
    gsap.to(this.element, {
      opacity: 0,
      ease: this.ease,
      duration: this.duration,
      onComplete: () => {
        this.element.style.display = 'none';
      },
    });
  }

  /**
   * fadeInを行うための関数。
   */
  fadeIn() {
    gsap.set(this.element, { opacity: 0, display: this.display });
    gsap.to(this.element, {
      opacity: 1,
      ease: this.ease,
      duration: this.duration,
      onComplete: () => {
        this.element.style.display = this.display;
      },
    });
  }
}
