import { fadeIn, fadeOut } from '../util/fade';

/**
 * Youtubeモーダル
 * a(data-yt="xxxxxxx").js-ytmodalbtnをクリックして起動
 */
const ytmodal = () => {
  const movBtns = document.querySelectorAll('.js-ytmodalbtn');
  const modal = document.querySelector('.bl_modal');
  const iframeYt = document.querySelector('.bl_modal_yt iframe');
  const modalMask = document.querySelector('.bl_modal_mask');

  movBtns.forEach((movBtn) => {
    movBtn.addEventListener('click', () => {
      const yt = movBtn.getAttribute('data-yt');
      iframeYt.setAttribute('src', `https://www.youtube.com/embed/${yt}`);
      fadeIn(modal);
    });
  });

  modalMask.addEventListener('click', () => {
    iframeYt.setAttribute('src', ``);
    fadeOut(modal);
  });
};

export default ytmodal;
