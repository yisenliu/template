export default (container, options = {}) => {
  const tabs = document.querySelector(container)
  const { initialIndex = 0, callback = null } = options
  const contents = tabs.querySelectorAll('.tabs__content')
  const items = tabs.querySelectorAll('.tabs__item')
  const activeTab = index => {
    items.forEach((item, i) => {
      if (i !== index) {
        item.classList.remove('active')
      } else {
        item.classList.add('active')
        if (item.dataset.ajaxUrl) {
          fetch(item.dataset.ajaxUrl)
            .then(function (response) {
              return response.text()
            })
            .then(function (data) {
              document.getElementById(item.dataset.id).innerHTML = data
            })
        }
      }
    })
    if (contents.length > 1) {
      activeContent(items[index].dataset.id)
    } else {
      contents[0].classList.add('active')
    }
  }
  const activeContent = contentId => {
    contents.forEach(content => {
      if (content.id === contentId) {
        content.classList.add('active')
      } else {
        content.classList.remove('active')
      }
    })
  }

  items.forEach((item, index) => {
    item.addEventListener('click', function () {
      activeTab(index)

      if (callback) {
        callback(item, index)
      }
    })
  })

  items[initialIndex].click()
}
