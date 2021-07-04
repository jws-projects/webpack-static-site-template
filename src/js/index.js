import component from './components/component';

const elm = document.querySelector('body');

const loadScript = async () => {};

const afterLoadScript = async () => {
  component();
};

const mainScript = async () => {
  loadScript.then(afterLoadScript());
};

const callback = (instance) => {
  mainScript();
};

imagesLoaded(elm, { background: true }, callback);

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
