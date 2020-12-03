export default (selector, options = { placement: 'top' }) => {
  const elements = document.querySelectorAll(selector)

  Array.prototype.forEach.call(elements, el => {
    const tooltip = document.createElement('div')

    tooltip.constructor.prototype.setStyles = function(refRect, placement) {
      const self = this
      const thisRect = this.getBoundingClientRect()
      const arrowDimension = (() => {
        const pseudo = window.getComputedStyle(self, ':before')

        return {
          topWidth: parseInt(pseudo.getPropertyValue('border-top-width')),
          rightWidth: parseInt(pseudo.getPropertyValue('border-right-width')),
          bottomWidth: parseInt(pseudo.getPropertyValue('border-bottom-width')),
          leftWidth: parseInt(pseudo.getPropertyValue('border-left-width'))
        }
      })()
      const setStyles = {
        top: () => {
          this.style.top = `${refRect.offsetTop - thisRect.height - arrowDimension.topWidth}px`
          this.style.left = `${refRect.offsetLeft + Math.abs(refRect.width - thisRect.width) / 2}px`
        },
        right: () => {
          this.style.top = `${refRect.offsetTop + Math.abs(refRect.height - thisRect.height) / 2}px`
          this.style.left = `${refRect.offsetLeft + refRect.width + arrowDimension.rightWidth}px`
        },
        bottom: () => {
          this.style.top = `${refRect.offsetTop + refRect.height + arrowDimension.bottomWidth}px`
          this.style.left = `${refRect.offsetLeft + Math.abs(refRect.width - thisRect.width) / 2}px`
        },
        left: () => {
          this.style.top = `${refRect.offsetTop + Math.abs(refRect.height - thisRect.height) / 2}px`
          this.style.left = `${refRect.offsetLeft - thisRect.width - arrowDimension.leftWidth}px`
        }
      }

      return setStyles[placement]()
    }

    el.addEventListener('mouseenter', function() {
      const refRect = app.domRect(this)
      const placement = this.dataset.placement || options.placement
      tooltip.textContent = this.dataset.message

      document.body.appendChild(tooltip)
      tooltip.className = `tooltip tooltip--${placement}`
      tooltip.setStyles(refRect, placement)
      setTimeout(function() {
        tooltip.classList.add('fadeIn')
      }, 0)
    })

    el.addEventListener('mouseleave', function() {
      tooltip.classList.remove('fadeIn')
      tooltip.classList.add('fadeOut')
    })

    tooltip.addEventListener(
      'transitionend',
      function() {
        if (this.classList.contains('fadeOut')) {
          this.parentNode.removeChild(this)
        }
      },
      false
    )
  })
}
