export default element => {
  const accordions = document.querySelectorAll(element)
  Array.prototype.forEach.call(accordions, el => {
    const accordionLabels = el.querySelectorAll('.accordion__label')
    Array.prototype.forEach.call(accordionLabels, label => {
      const toggleNextSiblingBody = (target, action) => {
        if (action === 'slideUp') {
          target.slideUp(400)
        } else {
          target.slideDown(400)
        }
      }
      label.addEventListener(
        'click',
        function() {
          const action = this.classList.contains('active') ? 'slideUp' : 'slideDown'
          const nextSiblingBody = this.nextElementSibling

          this.classList.toggle('active')
          toggleNextSiblingBody(nextSiblingBody, action)
        },
        false
      )
    })
  })
}
