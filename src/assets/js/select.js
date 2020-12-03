export default (container, options = { keepLabel: false }) => {
  const isKeepLabel = options.keepLabel
  const selects = document.querySelectorAll(container)

  selects.forEach(select => {
    const selectText = select.querySelector('.select__text')
    const selectOption = select.querySelector('.select__options')
    const selectRadios = select.querySelectorAll('.select__radio')
    const originalSelectText = selectText.textContent
    let isOpen = false
    const toggleOption = () => {
      select.toggleClass('active')
      selectOption.slideToggle()
      isOpen = !isOpen
    }
    const closeOption = () => {
      event.stopPropagation()
      select.removeClass('active')
      selectOption.slideUp()
      isOpen = false
    }

    // 未設 value 的 radio 強制給空值
    for (let i = 0, len = selectRadios.length; i < len; i++) {
      let radio = selectRadios[i]
      if (!radio.hasAttribute('value')) {
        radio.setAttribute('value', '')
      }
    }

    selectText.addEventListener('click', toggleOption, false)
    document.addEventListener(
      'click',
      event => {
        if (event.target !== selectText && isOpen) {
          closeOption()
        }
      },
      false
    )

    selectRadios.forEach(radio => {
      radio.addEventListener(
        'change',
        function () {
          const labelText = radio.nextElementSibling.textContent
          let newSelectText = originalSelectText
          if (radio.value) {
            newSelectText = isKeepLabel ? `${originalSelectText} (${labelText})` : labelText
          }
          selectText.textContent = newSelectText
        },
        false
      )
    })
  })
}
