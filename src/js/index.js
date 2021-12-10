import 'babel-polyfill';
import imagesLoaded from 'imagesloaded';
import component from './components/component';
import './util/lazyLoad';
import ua from './util/userAgent';

const elm = document.querySelector('body');

const loadScript = async () => {
  ua.init();
};

const afterLoadScript = async () => {
  component();
};

const mainScript = async () => {
  loadScript().then(afterLoadScript());
};

const callback = (instance) => {
  mainScript();
};

imagesLoaded(elm, { background: true }, callback);

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
