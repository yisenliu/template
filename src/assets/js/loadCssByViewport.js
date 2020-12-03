// import addToWindowOnResize from './addToWindowOnResize.js';

const isCssLoaded = {
  mobile: false,
  tablet: false,
  desktop: false
}
const checkViewport = () => {
  let device = app.getDevice()
  if (!isCssLoaded[device]) {
    importCss({
      path: '/css/',
      pageName: app.pageName,
      device: app.getDevice()
    })
    isCssLoaded[device] = true
  }
}
const importCss = file => {
  const links = document.querySelectorAll('link')
  const head = document.querySelector('head')
  const link = document.createElement('link')
  const { path, pageName, device } = file
  let contenthash = ''
  let hrefStr = ''

  for (let i = 0, len = links.length; i < len; i++) {
    hrefStr = links[i].href
    if (hrefStr.indexOf(pageName) !== -1) {
      contenthash = hrefStr.split('css?')[1]
      // console.log(`pageName = ${pageName}, contenthash = ${contenthash}`);
      link.href = `${path}${pageName}-${device}.css?${contenthash}`
      link.rel = 'preload'
      link.as = 'style'
      link.setAttribute('onload', 'this.onload=null;this.rel="stylesheet"')

      head.appendChild(link)
      return
    }
  }
}
const init = pageName => {
  app.addToWindowOnResize(checkViewport)
  checkViewport(pageName)
}

export default { init }
