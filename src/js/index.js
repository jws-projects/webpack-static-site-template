import 'babel-polyfill';
import imagesLoaded from 'imagesloaded';
import component from './components/component';

const elm = document.querySelector('body');

const loadScript = async () => {
  console.log('loadScript');
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
