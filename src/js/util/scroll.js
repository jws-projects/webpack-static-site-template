import SmoothScroll from 'smooth-scroll';

const scroll = () => {
  const options = {
    speed: 300,
    easing: 'easeInOutCubic',
    // offset: 50,
  };

  const scroll = new SmoothScroll('a[href*="#"]', options);
};

export default scroll;
