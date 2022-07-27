import imagesLoaded from 'imagesloaded';
import component from './components/component';
import ytmodal from './components/ytmodal';
import './util/lazyLoad';
// import ua from './util/userAgent';d

const elm = document.querySelector('body');

const loadScript = async () => {
  // ua.init();
};

const afterLoadScript = async () => {
  component();
  ytmodal();
  const body = $('.ly_main');
  console.log(body);
};

const mainScript = async () => {
  loadScript().then(afterLoadScript());
};

const callback = (instance) => {
  mainScript();
};

imagesLoaded(elm, { background: true }, callback);

// window.onbeforeunload = function () {
//   window.scrollTo(0, 0);
// };
