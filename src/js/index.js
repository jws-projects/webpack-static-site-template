import 'babel-polyfill';
import imagesLoaded from 'imagesloaded';
import 'lazysizes';
import 'lazysizes/plugins/aspectratio/ls.aspectratio';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks';
import component from './components/component';
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
