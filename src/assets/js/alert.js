export const open = (message, options) => {
  const alert = document.createElement('div');
  const alertBody = document.createElement('div');
  const alertContext = document.createElement('div');
  const alertDismiss = document.createElement('button');
  const dismissText = options.dismissText ? options.dismissText : 'close';
  const dismissClassName = options.dismissClassName
    ? `alert__dismiss ${options.dismissClassName}`
    : 'alert__dismiss';

  alert.id = `alert-${Math.floor(Math.random() * 1000000).toString()}`;
  alert.setAttribute('role', 'alert');
  alertContext.innerHTML = message;
  alertDismiss.textContent = dismissText;
  alert.className = 'alert active';
  alertBody.className = 'alert__body';
  alertContext.className = 'alert__context';
  alertDismiss.className = dismissClassName;

  alertBody.appendChild(alertContext);
  alertBody.appendChild(alertDismiss);
  alert.appendChild(alertBody);

  document.body.appendChild(alert);
  document.documentElement.classList.add('alert--open');
  alertDismiss.focus();
  alertDismiss.addEventListener(
    'click',
    () => {
      close(alert);
    },
    false
  );
};

export const close = element => {
  element.classList.remove('active');
  element.addEventListener('animationend', () => {
    element.parentNode.removeChild(element);
    document.documentElement.classList.remove('alert--open');
  });
};

export default { open, close };
