const html = document.documentElement;
const one = function(dom, event, callback) {
  function handler(e) {
    callback.call(this, e);
    this.removeEventListener(event, handler);
  }
  dom.addEventListener(event, handler);
};
let options = {
  onOpen: null,
  onClose: null
};
let modal = null;
let dialog = null;
let closeElements = null;

const open = (modalId, customOptions, callback = customOptions.onOpen) => {
  options = Object.assign(options, customOptions);
  modal = document.querySelector(modalId);
  dialog = modal.querySelector('.modal__dialog');
  closeElements = modal.querySelectorAll('.modal__close, .modal__dismiss');

  modal.style.display = 'block';
  setTimeout(function() {
    modal.classList.add('active');
    html.classList.add('modal--open');

    one(dialog, 'transitionend', function() {
      if (Object.prototype.toString.call(callback) === '[object Function]') {
        callback();
      }
    });

    modal.onclick = () => {
      close();
    };

    Array.prototype.forEach.call(closeElements, el => {
      el.onclick = () => {
        close();
      };
    });
  }, 50);
};

const close = (calllback = options.onClose) => {
  event.stopPropagation();
  if (event.target === event.currentTarget) {
    modal.classList.remove('active');
    one(dialog, 'transitionend', function() {
      html.classList.remove('modal--open');
      modal.style.display = 'none';
      if (Object.prototype.toString.call(calllback) === '[object Function]') {
        calllback();
      }
    });
  }
};

export default { open, close };
