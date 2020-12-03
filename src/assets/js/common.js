import Pace from 'pace-js'
import 'lazysizes'

app.debug(false)

// -------- Wrap the string with a specific tag -------- //
// const wrapStringWithTag = (selector, str, tag) => {
//   const target = document.querySelector(selector)

//   const findChildNodes = el => {
//     if (el.nodeType === 3 && el.parentNode.tagName.toLowerCase() !== tag.toLowerCase()) {
//       replacingStr(el)
//     } else {
//       for (let i = 0, children = el.childNodes; i < children.length; i++) {
//         findChildNodes(children[i])
//       }
//     }
//   }
//   const replacingStr = el => {
//     if (el.textContent.includes(str)) {
//       const re = new RegExp(str, 'g')
//       el.parentNode.innerHTML = el.parentNode.innerHTML.replace(re, `<${tag}>${str}</${tag}>`)
//     }
//   }

//   findChildNodes(target)
// }
// Pace.on('start', function () {
//   wrapStringWithTag('#main', '®', 'sup')
//   wrapStringWithTag('#main', '&reg;', 'sup')
// })

// -------- Pace progress -------- //
Pace.on('done', function () {
  import(/* webpackPreload: true, webpackChunkName: "anime" */ 'animejs').then(
    ({ default: anime }) => {
      window.anime = anime
      const paceAnime = anime({
        targets: '.pace-activity',
        scaleY: 0,
        duration: 600,
        easing: 'easeInQuart'
      })
      paceAnime.finished.then(() => {
        if (Object.prototype.toString.call(app.paceDone) === '[object Function]') {
          app.paceDone()
        }
      })
    }
  )
})
Pace.start()

// before leaving the page
let targetUrl = ''
const links = document.querySelectorAll('a')
links.forEach(link => {
  link.addEventListener('click', event => {
    const lastUrl = targetUrl
    const element = event.currentTarget

    targetUrl = element.href
    if (
      ['_self', '_top', '_parent', ''].includes(element.target) &&
      targetUrl.indexOf('http') !== -1 &&
      lastUrl !== targetUrl
    ) {
      event.preventDefault()
      anime.set('.pace-activity', { transformOrigin: 'left bottom' })
      anime.set('.pace', { display: 'block' })
      anime({
        targets: '.pace-activity',
        scaleY: 1,
        duration: 600,
        easing: 'easeInQuart',
        complete() {
          document.location.href = targetUrl
        }
      })
    }
  })
})

//  -------- navigation -------- //
const header = document.querySelector('#header')
const nav = document.querySelector('.nav')
const navSubContainers = document.querySelectorAll('.nav__subContainer')
const navToggle = document.querySelector('.nav__toggle')
const navItems = document.querySelectorAll('.nav__item')

navItems.forEach(item => {
  item.addEventListener('mouseenter', function () {
    const target = this.querySelector('.nav__subContainer')
    if (app.isDesktop() && target) {
      anime({
        targets: target,
        opacity: [0, 1],
        duration: 200,
        easing: 'linear',
        begin() {
          target.style.display = 'block'
        }
      })
    }
  })
  item.addEventListener('mouseleave', function () {
    const target = this.querySelector('.nav__subContainer')
    if (app.isDesktop() && target) {
      anime({
        targets: target,
        opacity: [1, 0],
        duration: 200,
        easing: 'linear',
        complete() {
          target.removeAttribute('style')
        }
      })
    }
  })
})
navToggle.addEventListener('click', function () {
  nav.slideToggle(200)
  header.toggleClass('nav--opened')
})

// only for tablet and mobile devices
navSubContainers.forEach(navSubContainer => {
  navSubContainer.addEventListener('click', function () {
    if (!app.isDesktop()) {
      this.querySelector('.nav__subList').slideToggle()
      navSubContainers.forEach(item => {
        if (item !== this) {
          item.querySelector('.nav__subList').slideUp()
        }
      })
    }
  })
})

document.querySelector('.optionalMenu__toggle').addEventListener('click', function () {
  header.toggleClass('optionalMenu--opened')
})
let winWidth = window.innerWidth
app.addToWindowOnResize(() => {
  // fix address bar of mobile chrome triggers resize event on scrolling
  if (window.innerWidth !== winWidth) {
    header.removeClass('nav--opened optionalMenu--opened')
    nav.removeAttribute('style')
    navSubContainers.forEach(navSubContainer => {
      navSubContainer.firstElementChild.removeAttribute('style')
    })
    winWidth = window.innerWidth
  }
})

//  -------- header -------- //
app.header = null
const hr = app.headroom('#header', {
  offset: 100,
  classes: {
    // when element is initialised
    initial: 'header',
    // when scrolling up
    pinned: 'header__pinned',
    // when scrolling down
    unpinned: 'header__unpinned',
    // when above offset
    top: 'header__top',
    // when below offset
    notTop: 'header__not-top',
    // when at bottom of scoll area
    bottom: 'header__bottom',
    // when not at bottom of scroll area
    notBottom: 'header__not-bottom',
    // when frozen method has been called
    frozen: 'header__frozen'
  }
})
const handleHeaderPinState = () => {
  if (window.scrollY > 100) {
    app.header.unpin()
  }
}
hr.then(instance => {
  app.header = instance
}).then(() => {
  handleHeaderPinState()
})

//  -------- go to top -------- //
const gotoTop = document.querySelector('.gotoTop')
app.rootScrollElement =
  window.document.scrollingElement || window.document.body || window.document.documentElement

if (gotoTop) {
  gotoTop.addEventListener('click', function () {
    anime({
      targets: app.rootScrollElement,
      scrollTop: 0,
      duration: 800,
      easing: 'easeInOutSine'
    })
  })

  app.headroom('.gotoTop', {
    offset: window.innerHeight / 2,
    classes: {
      // when element is initialised
      initial: 'gotoTop',
      // when scrolling up
      pinned: 'gotoTop__pinned',
      // when scrolling down
      unpinned: 'gotoTop__unpinned',
      // when above offset
      top: 'gotoTop__top',
      // when below offset
      notTop: 'gotoTop__not-top',
      // when at bottom of scoll area
      bottom: 'gotoTop__bottom',
      // when not at bottom of scroll area
      notBottom: 'gotoTop__not-bottom',
      // when frozen method has been called
      frozen: 'gotoTop__frozen'
    }
  })
}
