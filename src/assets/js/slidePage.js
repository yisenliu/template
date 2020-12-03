let slidePage = null;
let slidePageBack = null;
const html = document.documentElement;

const open = containerId => {
  console.log('open slide page');
  slidePage = document.querySelector(containerId);
  slidePageBack = slidePage.querySelector('.slidePage__headLeft');
  slidePage.classList.add('active');
  html.classList.add('slidePage--open');
  slidePageBack.addEventListener('click', close, false);
};
const close = () => {
  console.log('close slide page');
  slidePage.classList.remove('active');
  html.classList.remove('slidePage--open');
};

export default { open, close };
