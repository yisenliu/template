export default (message, options = {}) => {
  const toast = document.createElement('div')
  const toastBody = document.createElement('div')
  const { type = 'success', callback = null } = options

  toast.className = 'toast ' + type
  toast.id = `toast-${Math.floor(Math.random() * 1000000).toString()}`
  toast.setAttribute('role', 'alert')
  toastBody.className = 'toast__body'

  // toastBody.textContent = message
  toastBody.innerHTML = message

  toast.appendChild(toastBody)
  document.body.appendChild(toast)
  document.activeElement.blur()

  import(/* webpackPreload: true, webpackChunkName: "anime" */ 'animejs')
    .then(({ default: anime }) => {
      const tl = anime.timeline({
        targets: toast,
        duration: 400,
        easing: 'easeInQuart'
      })
      tl.add({
        endDelay: 1500,
        opacity: 1,
        begin() {
          toast.style.display = 'flex'
        }
      }).add({
        opacity: 0,
        complete: () => {
          toast.parentNode.removeChild(toast)
          if (Object.prototype.toString.call(callback) === '[object Function]') {
            callback()
          }
        }
      })
    })
    .catch(error => `An error occurred while loading the component: ${error}`)
}
